export const I18N = {
  en: {
    lang: "en-US",
    htmlLang: "en",

    nav_how: "How it works",
    nav_demo: "Live demo",
    nav_features: "Features",
    header_cta: "Try the scanner",

    badge_tag: "QUISHING DEFENSE SYSTEM",

    h1_line1: "Scan the code.",
    h1_line2: "Not the trap.",

    hero_sub:
      "QRShield decodes a QR code, analyzes the hidden URL and checks the image for tampering — all before you ever open the link. Every verdict comes with a plain-language reason, not just a score.",

    btn_analyze: "Analyze a QR code",
    btn_seehow: "See how it works",

    legend_safe: "Safe",
    legend_suspicious: "Suspicious",
    legend_dangerous: "Dangerous",

    viewfinder_label:
      "AWAITING INPUT — DROP A QR IMAGE BELOW",

    how_eyebrow: "HOW IT WORKS",
    how_h2: "Two independent checks, one verdict",

    flow_upload_title: "User uploads QR",
    flow_upload_sub: "image or camera scan",

    flow_decode_title: "QR decoder",
    flow_decode_sub: "extracts hidden URL",

    flow_url_title: "URL analysis",
    flow_url_sub: "ML risk model",

    flow_image_title: "Image analysis",
    flow_image_sub: "tamper detection CNN",

    flow_engine_title: "AI decision engine",
    flow_engine_sub: "combines both scores",

    pill_safe: "Safe",
    pill_suspicious: "Suspicious",
    pill_dangerous: "Dangerous",

    demo_eyebrow: "LIVE DEMO",
    demo_h2: "Paste a decoded URL and run the analysis",

    demo_sub_pre:
      "This demo runs the URL heuristics client-side to illustrate the flow. Point it at the Python backend's",

    demo_sub_post:
      "endpoint for real ML + image analysis.",

    label_url: "DECODED URL",
    label_image: "QR IMAGE (OPTIONAL)",

    dropzone_text:
      "Drop an image or click to upload",

    camera_scan_btn: "Scan with camera",
    camera_scan_btn_stop: "Stop camera",

    camera_starting: "Starting camera…",
    camera_prompt: "Point your camera at a QR code",

    camera_decoded:
      "QR decoded — running analysis",

    camera_error:
      "Camera error: permission denied or no camera found",

    btn_run: "Run analysis",
    btn_analyzing: "Analyzing…",

    idle_text: "Results will appear here",

    loading_text:
      "Checking domain, HTTPS and registration age…",

    result_replay: "Replay",
    result_voice_on: "Voice on",
    result_voice_off: "Voice off",

    voice_lang_label: "Voice language",

    result_risk_label: "RISK / 100",
    result_tamper_label: "Tamper score",
    result_why: "WHY THIS VERDICT",

    features_eyebrow: "CAPABILITIES",
    features_h2:
      "Built for how QR scams actually work",

    f1t: "Real-time scanner",
    f1b:
      "Point your camera at any QR code and get a verdict before the link ever opens.",

    f2t: "Phishing detection",
    f2b:
      "Flags fake login pages and cloned banking or UPI portals hiding behind the code.",

    f3t: "UPI fraud detection",
    f3b:
      "Warns you before a payment QR routes money to an unfamiliar or spoofed handle.",

    f4t: "Explainable AI",
    f4b:
      "Every verdict comes with plain-language reasons — not just a score.",

    f5t: "Offline analysis",
    f5b:
      "Structural and pattern checks still run when there's no signal.",

    f6t: "Tamper detection",
    f6b:
      "Deep-learning image checks catch sticker overlays and swapped QR codes.",

    strip_label:
      "Cross-checked against live threat-intelligence feeds",

    footer_line1:
      "QRShield — scan the code, not the trap.",

    footer_line2:
      "Works on the QR scanner already on your phone",

    verdict_safe: "Safe",
    verdict_suspicious: "Suspicious",
    verdict_dangerous: "Dangerous",

    reasons: {
      no_url:
        "No destination URL found — showing sample analysis",

      no_https:
        "Connection is not secured with HTTPS",

      keyword: (w) =>
        `Path contains a high-risk keyword ("${w}")`,

      shortener:
        "Destination is hidden behind a link shortener",

      whois_new:
        "WHOIS lookup shows the domain was registered within the last 30 days",

      subdomain:
        "Unusual subdomain structure often used to mimic trusted brands",

      pass_no_pattern:
        "No known phishing patterns found in the URL structure",

      pass_https_valid:
        "HTTPS certificate is valid and correctly configured",

      pass_domain_established:
        "Domain has an established registration history",
    },

    voice: {
      safe: (s) =>
        `Scan complete. This QR code is safe. Risk score ${s} out of 100.`,

      suspicious: (s) =>
        `Warning. This QR code is suspicious. Risk score ${s} out of 100. Proceed with caution.`,

      dangerous: (s) =>
        `Danger. This QR code is dangerous. Risk score ${s} out of 100. Do not open this link.`,
    },
  },

  // Keep your existing hi, mr, te and ta objects here.
};