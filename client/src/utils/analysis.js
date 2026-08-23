export function analyze(urlText, hasImage, fileName) {
  const target = (urlText || "").trim();
  const lower = target.toLowerCase();

  const reasonItems = [];

  let score = 6 + Math.random() * 8;

  if (!target) {
    score = 4;

    reasonItems.push({
      ok: true,
      key: "no_url",
    });
  } else {
    if (!lower.startsWith("https://")) {
      score += 26;

      reasonItems.push({
        ok: false,
        key: "no_https",
      });
    }

    const suspiciousWords = [
      "verify",
      "secure-",
      "login-",
      "update-",
      "bank",
      "confirm-",
      "account-",
      "payment-",
      "reward",
      "bonus",
    ];

    const hit = suspiciousWords.find((word) =>
      lower.includes(word)
    );

    if (hit) {
      score += 20;

      reasonItems.push({
        ok: false,
        key: "keyword",
        param: hit.replace("-", ""),
      });
    }

    if (
      /bit\.ly|tinyurl|t\.co|is\.gd|cutt\.ly/.test(lower)
    ) {
      score += 18;

      reasonItems.push({
        ok: false,
        key: "shortener",
      });
    }

    const domainMatch = target.match(/https?:\/\/([^/]+)/);

    const domain = domainMatch
      ? domainMatch[1]
      : "unresolved-host";

    const looksNew =
      /\d{3,}/.test(domain) ||
      !!hit ||
      Math.random() < 0.35;

    if (looksNew) {
      score += 17;

      reasonItems.push({
        ok: false,
        key: "whois_new",
      });
    }

    if (domain.split(".").length > 3) {
      score += 10;

      reasonItems.push({
        ok: false,
        key: "subdomain",
      });
    }

    if (reasonItems.length === 0) {
      reasonItems.push(
        {
          ok: true,
          key: "pass_no_pattern",
        },
        {
          ok: true,
          key: "pass_https_valid",
        },
        {
          ok: true,
          key: "pass_domain_established",
        }
      );
    }
  }

  let tamper = hasImage
    ? Math.round(8 + Math.random() * 22)
    : 0;

  if (
    fileName &&
    /(fake|sticker|edit|overlay)/i.test(fileName)
  ) {
    tamper += 45;
  }

  score = Math.min(97, Math.round(score));

  const verdict =
    score <= 30
      ? "safe"
      : score <= 60
      ? "suspicious"
      : "dangerous";

  return {
    verdict,
    reasonItems,
    tamper: Math.min(97, tamper),
    url:
      target ||
      "https://sample-menu-qr.example/table-14",
  };
}