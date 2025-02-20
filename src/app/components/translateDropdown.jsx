"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const targetLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "pt", name: "Portuguese" },
  { code: "tr", name: "Turkish" },
  { code: "ru", name: "Russian" },
];

export default function Translate({ inputText, detectedLanguage }) {
  const [language, setLanguage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [translator, setTranslator] = useState(null);
  const [translatedText, setTranslatedText] = useState("");
  const [translatedLanguage, setTranslatedLanguage] = useState("");

  // function to change translation language choice
  const handleLanguageSelection = (e) => {
    setLanguage(e.target.value);
  };

  //function to translate inputText
  const handleTranslation = async () => {
    if (!inputText.trim()) {
      toast.error("No text to translate. Please input some text!", {
        duration: 3000,
      });
      return;
    }

    if (!detectedLanguage) {
      toast.error("No source language detected.");
      return;
    }
    if (!language) {
      toast.error("No target language detected. Please pick a language.");
      return;
    }
    if (detectedLanguage === language) {
      toast.error(
        "Source and target language cannot be the same. Please pick another language."
      );
      return;
    }

    try {
      const translatorCapabilities = await self.ai.translator.capabilities();
      const pairAvailable = translatorCapabilities.languagePairAvailable(
        detectedLanguage,
        language
      );

      if (pairAvailable === "no") {
        toast.error("Sorry. Translation is not supported.");
        return;
      }

      let translator;
      if (pairAvailable === "readily") {
        translator = await self.ai.translator.create({
          sourceLanguage: detectedLanguage,
          targetLanguage: language,
        });
      } else if (pairAvailable === "after-download") {
        const loadingToast = toast.loading("Downloading language pair", {
          duration: Infinity,
        });

        try {
          translator = await self.ai.translator.create({
            sourceLanguage: detectedLanguage,
            targetLanguage: language,
            monitor(m) {
              m.addEventListener("downloadprogress", (e) => {
                console.log(`Downloaded ${e.loaded} of ${e.total} bytes...`);
              });
            },
          });
          await translator.ready;
          toast.dismiss(loadingToast);
          toast.success("Download done!");
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error("Failed to download language pair.");
          return;
        }
      }

      setisLoading(true);
      setTranslator(translator);
      handleClose();
      const result = await translator.translate(inputText);
      setisLoading(false);
      setTranslatedLanguage(language);
      setTranslatedText(result);
    } catch (error) {
      console.log("Error translating text:", error, detectedLanguage, language);
      toast.error("Failed to translate. Try again.");
    }
  };

  const handleClose = async () => {
    setTranslatedText("");
  };

  return (
    <section className="w-full max-w-fit flex">
      <section className="flex flex-col gap-2">
        <select
          onChange={handleLanguageSelection}
          className="text-[0.8rem] w-full bg-[var(--dark)] cursor-pointer border-2 border-[var(--color-main)] p-1 rounded-lg bg-transparent"
          defaultValue="Translate Text"
        >
          <option className="text-black" hidden value="Translate Text">
            Pick a language
          </option>
          {targetLanguages.map((lang) => (
            <option className="text-black" key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleTranslation}
          className="text-[0.8rem] w-full whitespace-nowrap cursor-pointer text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]"
        >
          Translate text ({language})
        </button>

        {isLoading && (
          <p className="text-[10px] text-[var(--color-text-grey)] text-center">
            Translating...
          </p>
        )}
      </section>

      {translatedText && (
        <section className="mx-2 w-full">
          <p className="text-[10px] font-bold">
            Translation - {translatedLanguage}
          </p>
          <section className="text-[0.8rem] border border-[var(--color-main)] p-2 flex flex-col gap-1 rounded-lg">
            <button
              onClick={handleClose}
              className="text-[10px] font-bold text-right hover:underline text-[var(--color-text-grey)]"
            >
              Close Translation
            </button>
            {translatedText}
          </section>
        </section>
      )}
    </section>
  );
}
