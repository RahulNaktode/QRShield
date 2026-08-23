export function pickVoiceFor(langCode) {
  if (!window.speechSynthesis) return null;

  const voices =
    window.speechSynthesis.getVoices();

  if (!voices || !voices.length) return null;

  const prefix = langCode.split("-")[0];

  return (
    voices.find(
      (voice) =>
        voice.lang &&
        voice.lang.toLowerCase() ===
          langCode.toLowerCase()
    ) ||
    voices.find(
      (voice) =>
        voice.lang &&
        voice.lang
          .toLowerCase()
          .startsWith(prefix)
    ) ||
    null
  );
}

export function speakVerdict(result, voiceLang, I18N) {
  if (!result || !window.speechSynthesis) return;

  const d = I18N[voiceLang];

  const text = d.voice[result.verdict]
    ? d.voice[result.verdict](result.score)
    : `${result.score}`;

  window.speechSynthesis.cancel();

  const utter =
    new SpeechSynthesisUtterance(text);

  utter.lang = d.lang;

  const matchedVoice = pickVoiceFor(d.lang);

  if (matchedVoice) {
    utter.voice = matchedVoice;
  }

  utter.rate = 1;

  utter.pitch =
    result.verdict === "dangerous"
      ? 0.85
      : 1;

  utter.volume = 1;

  window.speechSynthesis.speak(utter);
}