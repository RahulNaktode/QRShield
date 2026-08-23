import os
import base64
import io
import urllib.parse
from datetime import datetime
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from gtts import gTTS
from pydantic import BaseModel
from pymongo import MongoClient

# AI Module File Integration
from ai_analyzer import analyze_with_ai

# Load .env file variables
load_dotenv()

app = FastAPI(title="QRShield Security API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the .env file")

client = MongoClient(MONGO_URI)
db = client.get_database() 
history_collection = db["scan_history"]

# Multi-language voice audio text map
VOICE_MESSAGES = {
    "hi": {
        "danger": "सावधान! यह क्यूआर कोड संदिग्ध या धोखाधड़ी हो सकता है।",
        "safe": "सुरक्षित क्यूआर कोड।"
    },
    "mr": {
        "danger": "काळजी घ्या! हा क्यूआर कोड संशयास्पद किंवा फसवणूक असू शकतो.",
        "safe": "सुरक्षित क्यूआर कोड."
    },
    "en": {
        "danger": "Warning! This QR code may be danger or fraudulent.",
        "safe": "Safe QR code."
    }
}

class QRRequest(BaseModel):
    payload: str
    scan_type: Optional[str] = "url"
    file_name: Optional[str] = None
    lang: Optional[str] = "hi"  # Supports 'hi', 'mr', 'en'

def analyze_upi_payload(payload: str):
    parsed = urllib.parse.urlparse(payload)
    if parsed.scheme == "upi":
        params = urllib.parse.parse_qs(parsed.query)
        pa = params.get("pa", [""])[0]
        pn = params.get("pn", [""])[0]
        if pa and pn and not any(part.lower() in pa.lower() for part in pn.split()):
            return {"upi_risk": True, "reason": "UPI Payee Name mismatch detected!"}
    return {"upi_risk": False, "reason": ""}

@app.post("/api/analyze-qr")
async def analyze_qr(data: QRRequest):
    qr_payload = data.payload
    scan_type = data.scan_type
    file_name = data.file_name
    lang = data.lang if data.lang in ["hi", "mr", "en"] else "hi"

    is_threat = False
    risk_score = 15
    reasons = []

    # UPI Risk Check
    upi_res = analyze_upi_payload(qr_payload)
    if upi_res["upi_risk"]:
        is_threat = True
        risk_score += 65
        reasons.append(upi_res["reason"])

    # Basic Heuristic Phishing Check
    if "http" in qr_payload and any(kw in qr_payload for kw in ["login", "verify", "bank", "phish"]):
        is_threat = True
        risk_score += 50
        reasons.append("Suspicious Phishing URL Pattern Detected")

    # 1. Fetch AI Explanation in Selected Language
    ai_explanation = await analyze_with_ai(qr_payload, lang=lang)

    current_time = datetime.now().strftime("%Y-%m-%d %I:%M:%S %p")

    # 2. Generate Voice Audio via gTTS in Selected Language
    msg_key = "danger" if is_threat else "safe"
    alert_text = VOICE_MESSAGES.get(lang, VOICE_MESSAGES["hi"])[msg_key]

    tts = gTTS(text=alert_text, lang=lang)
    mp3_fp = io.BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    audio_b64 = base64.b64encode(mp3_fp.read()).decode("utf-8")

    # Document Payload for MongoDB
    scan_doc = {
        "payload": qr_payload,
        "scan_type": scan_type,
        "file_name": file_name,
        "is_threat": is_threat,
        "risk_score": min(risk_score, 100),
        "reasons": reasons,
        "ai_explanation": ai_explanation,
        "language": lang,
        "audio_base64": audio_b64,
        "timestamp": current_time,
        "created_at": datetime.utcnow()
    }

    # Save to MongoDB
    history_collection.insert_one(scan_doc)

    return JSONResponse(content={
        "status": "success",
        "payload": qr_payload,
        "scan_type": scan_type,
        "file_name": file_name,
        "is_threat": is_threat,
        "risk_score": min(risk_score, 100),
        "reasons": reasons,
        "ai_explanation": ai_explanation,
        "language": lang,
        "audio_base64": audio_b64,
        "timestamp": current_time
    })

@app.get("/api/history")
async def get_history():
    scans = list(history_collection.find({}, {"_id": 0}).sort("created_at", -1).limit(50))
    return {"status": "success", "history": scans}

@app.delete("/api/history")
async def clear_history():
    history_collection.delete_many({})
    return {"status": "success", "message": "MongoDB history cleared"}