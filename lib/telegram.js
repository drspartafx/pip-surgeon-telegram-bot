// Minimal Telegram Bot API helpers. No external dependencies — uses Node 18+ native fetch/FormData/Blob.

export async function sendTelegramMessage(text, parseMode = "Markdown") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: true,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram sendMessage failed: ${JSON.stringify(data)}`);
  }
  return data;
}

// Send a photo by URL (used for the Pollinations fallback).
export async function sendTelegramPhoto(photoUrl, caption, parseMode = "Markdown") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      photo: photoUrl,
      caption,
      parse_mode: parseMode,
    }),
  });

  const data = await res.json();
  if (!data.ok) {
    console.error("sendPhoto (URL) failed, falling back to text:", JSON.stringify(data));
    return sendTelegramMessage(caption, parseMode);
  }
  return data;
}

// Send a photo from raw base64 bytes (used for Gemini-generated images).
export async function sendTelegramPhotoBuffer(base64Data, mimeType, caption, parseMode = "Markdown") {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const buffer = Buffer.from(base64Data, "base64");
  const blob = new Blob([buffer], { type: mimeType });

  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("caption", caption);
  form.append("parse_mode", parseMode);
  form.append("photo", blob, "post.png");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram sendPhoto (buffer) failed: ${JSON.stringify(data)}`);
  }
  return data;
}
