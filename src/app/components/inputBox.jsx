"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import send from "../../../public/send.svg";
import { toast } from "react-hot-toast";

export default function InputBox({ setMessages, setDetectedLanguage }) {
  const [inputText, setInputText] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [detector, setDetector] = useState(null);

  // built-in JS function to change language code to full name
  const getFullLanguageName = (languageCode) => {
    try {
      return (
        new Intl.DisplayNames(["en"], { type: "language" }).of(languageCode) ||
        languageCode
      );
    } catch (error) {
      console.error("Error converting language code to full:", error);
      return languageCode;
    }
  };

  //check if chrome ai api is available/supported on browser
  useEffect(() => {
    const checkSupport = async () => {
      if (
        "ai" in self &&
        "translator" in self.ai &&
        "languageDetector" in self.ai &&
        "summarizer" in self.ai
      ) {
        toast.success("Hurray! Chrome AI support was detected.", {
          duration: 3000,
        });
        await initializeDetector();
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        toast.error(
          "Browser does not support Chrome AI APIs. Some features may not work."
        ),
          { duration: 2000 };
      }
    };
    checkSupport();
  }, []);

  // initialize AI language detector if chrome AI is available/supported
  const initializeDetector = async () => {
    try {
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;

      if (canDetect !== "no") {
        const newDetector =
          canDetect === "readily"
            ? await self.ai.languageDetector.create()
            : await self.ai.languageDetector.create({
                monitor(m) {
                  m.addEventListener("downloadprogress", (e) => {
                    console.log(
                      `Translator: Downloaded ${e.loaded} of ${e.total} bytes.`
                    );
                  });
                },
              });

        if (canDetect !== "readily") await newDetector.ready;
        setDetector(newDetector);
      } else {
        toast.error("Language detection is not supported.");
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error starting language detector: ", error);
      toast.error("Error starting language detector. Try again.");
      setIsAvailable(false);
    }
  };

  //handle user input text change
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  //handle language detection of user input in form
  const detectLanguage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      toast.error("No text inputted. Please enter some text.", {
        duration: 2000,
      });
      return;
    }

    try {
      if (isAvailable && detector) {
        // will run if browser AI detection is supported
        const result = await detector.detect(inputText);
        const detectedLanguage = result[0].detectedLanguage;
        const detectedLanguageFull = getFullLanguageName(detectedLanguage);
        setDetectedLanguage(detectedLanguage);

        setMessages((prev) => [
          ...prev,
          {
            text: inputText,
            language: `Language Detected: ${detectedLanguageFull}`,
            confidence: `(${parseInt(result[0].confidence * 100)}% sure)`,
          },
        ]);
      } else {
        // will run if browser AI is unavailable

        setMessages((prev) => [
          ...prev,
          {
            text: inputText,
            language: "AI not supported. Could not detect language.",
            confidence: null,
          },
        ]);
      }
    } catch (error) {
      console.error("Error detecting language.", error);
      toast.error("Error detecting language.");
    } finally {
      setInputText("");
    }
  };

  return (
    <form
      onSubmit={detectLanguage}
      className="w-full max-w-[90%] flex my-2 fixed bottom-0 items-center gap-2"
    >
      <textarea
        value={inputText}
        onChange={handleInputChange}
        className="w-full border-2 border-[var(--color-text-grey)] rounded-xl bg-transparent text-sm p-2  rounded-md "
        placeholder="Let's go..."
        rows={3}
      ></textarea>
      <button
        type="submit"
        className="w-fit h-fit p-2 border bg-[var(--color-main)] hover:bg-[var(--color-lighter-main)] rounded-[50%] p-2"
      >
        <Image src={send} alt="send icon" className="w-5 h-5"></Image>
      </button>
    </form>
  );
}
