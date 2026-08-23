import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key) if api_key else None

LANGUAGE_MAP = {
    "hi": "Hindi",
    "mr": "Marathi",
    "en": "English"
}

async def analyze_with_ai(qr_payload: str, lang: str = "hi") -> str:
    if not client:
        return "AI Analysis Disabled: GEMINI_API_KEY Missing"

    target_lang = LANGUAGE_MAP.get(lang, "Hindi")

    prompt = f"""
    You are a Cybersecurity AI assistant for QRShield.
    Analyze this QR code payload/URL: '{qr_payload}'.
    Determine if it is a phishing scam, malicious URL, or safe link.
    Provide a concise 2-sentence explanation strictly in {target_lang} language.
    """

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print("Gemini API Error:", e)
        return "AI Threat Engine Analysis Unavailable."