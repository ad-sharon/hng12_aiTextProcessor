import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // Fallback language detection (for unsupported browsers)
    const detectedLanguage = fallbackLanguageDetection(text);

    return NextResponse.json({ language: detectedLanguage });
  } catch (error) {
    console.error("Language detection error:", error);
    return NextResponse.json(
      { error: "Failed to detect language" },
      { status: 500 }
    );
  }
}

// Basic fallback logic (replace with real API if needed)
// function fallbackLanguageDetection(text) {
//   if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) return "Japanese";
//   if (/[а-яА-ЯЁё]/.test(text)) return "Russian";
//   if (/[a-zA-Z]/.test(text)) return "English";
//   return "Unknown";
// }
