"use client";
import { useState, useEffect } from "react";

const targetLanguages = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
];

export default function Translate({ inputText, detectedLanguage }) {
  const [language, setLanguage] = useState("es"); // set spanish as default
  const [translator, setTranslator] = useState(null);
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    if (!detectedLanguage) {
      console.error("⚠️ No detected language.");
      return;
    }

    if (!language) {
      console.error("⚠️ No target language selected.");
      return;
    }

    const initializeTranslator = async () => {
      try {
        console.log(
          `🟡 Initializing translator from ${detectedLanguage} to ${language}`
        );

        const translatorCapabilities = await self.ai.translator.capabilities();
        const canTranslate = translatorCapabilities.available;

        if (canTranslate === "no") {
          console.error("❌ Translation is NOT supported.");
          return;
        }

        let translatorInstance;
        if (canTranslate === "readily") {
          translatorInstance = await self.ai.translator.create({
            sourceLanguage: detectedLanguage,
            targetLanguage: language,
          });
        } else {
          translatorInstance = await self.ai.translator.create({
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(
                  `Downloading AI Model: ${e.loaded} / ${e.total} bytes.`
                );
              });
            },
          });

          await translatorInstance.ready;
        }

        console.log("✅ Translator initialized.");
        setTranslator(translatorInstance);
      } catch (error) {
        console.error("❌ Error initializing translator:", error);
      }
    };

    initializeTranslator();
  }, [language, detectedLanguage]);

  const handleLanguageSelection = (e) => {
    setLanguage(e.target.value);
  };

  const handleTranslation = async () => {
    if (!inputText.trim()) {
      console.error("⚠️ No text to translate.");
      return;
    }

    if (!translator) {
      console.error("⚠️ Translator is not initialized.");
      return;
    }

    try {
      const result = await translator.translate(inputText);
      console.log("✅ Translated Text:", result);
      setTranslatedText(result);
    } catch (error) {
      console.error("❌ Error translating text:", error);
    }
  };

  return (
    <section className="flex ">
      <section className="flex-col flex gap-2">
        <select
          onChange={handleLanguageSelection}
          className="text-[0.8rem] bg-[var(--dark)] cursor-pointer border-2 border-[var(--color-main)] p-1 rounded-lg bg-transparent"
          defaultValue="Translate Text"
        >
          <option className="text-black" hidden value="Translate Text">
            Pick a language to translate text
          </option>
          {targetLanguages.map((lang) => (
            <option className="text-black" key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleTranslation}
          className="text-[0.8rem] whitespace-nowrap cursor-pointer text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]"
        >
          Translate text ({language})
        </button>
      </section>

      {translatedText && (
        <section className="mx-2 w-full max-w-[60%]">
          <p className="text-[10px] font-bold">Translation - {language}</p>
          <section className="text-[0.8rem] border border-[var(--color-main)] p-2  rounded-lg">
            {translatedText}
          </section>
        </section>
      )}
    </section>
  );
}
