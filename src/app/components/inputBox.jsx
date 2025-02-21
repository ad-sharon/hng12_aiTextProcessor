"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import send from "../../../public/send.svg";
import { toast } from "react-hot-toast";

export default function InputBox({
  messages,
  setMessages,
  setDetectedLanguage,
  setTranslatedText,
}) {
  const [inputText, setInputText] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [detector, setDetector] = useState(null);

  //check if chrome ai is available/supported on client
  useEffect(() => {
    const checkSupport = async () => {
      if ("ai" in self) {
        let isSupported = [];

        if ("languageDetector" in self.ai) {
          isSupported.push("Language Detection");
          await initializeDetector();
        }
        if ("translator" in self.ai) {
          isSupported.push("Translation");
        }
        if ("summarizer" in self.ai) {
          isSupported.push("Summarization");
        }
        if (isSupported.length > 0) {
          toast.success(
            `Your browser supports the following features: ${isSupported.join(
              ", "
            )}!`,
            {
              duration: 2000,
            }
          );
          setIsAvailable(true);
        } 
      }      else {
          toast.error(
            "Browser does not support Chrome AI APIs. Some features may not work. Try updating your Chrome to the latest version.",
            { duration: 3000 }
          );
        }
    };
    checkSupport();
  }, []);

  //handle user input text changes
  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  // built-in JS function to change language code to full language name
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
        toast.error("Sorry. Language detection is not supported.");
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error starting language detector: ", error);
      toast.error("Error starting language detector. Try again.");
      setIsAvailable(false);
    }
  };

  //handle language detection of user input
  const detectLanguage = async () => {
    //runs if there's no input
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
        setTranslatedText("");

        const newInput = {
          text: inputText,
          language: `Language Detected: ${detectedLanguageFull}`,
          confidence: `(${parseInt(result[0].confidence * 100)}% sure)`,
        };
        const updatedMessages = [...messages, newInput];
        setMessages(updatedMessages);
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      } else {
        // will run if browser AI or detector is unavailable"
        setTranslatedText("");
        const newMessage = {
          text: inputText,
          language: "AI not supported. Could not detect language.",
          confidence: null,
        };

        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        localStorage.setItem("messages", JSON.stringify(updatedMessages));
      }
    } catch (error) {
      console.error("Error detecting language.", error);
      toast.error("Error detecting language.");
    } finally {
      setInputText("");
    }
  };

  //handles form submission
  const onSubmit = (e) => {
    e.preventDefault();
    detectLanguage();
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[95%] mx-auto shrink-0 flex mt-2 items-center gap-2"
    >
      <textarea
        value={inputText}
        onChange={handleInputChange}
        className="w-full  resize-none border-2 border-[var(--color-text-grey)] rounded-xl bg-transparent text-sm p-2 rounded-md "
        placeholder="Your text goes here..."
        rows={3}
        aria-label="input text here"
      ></textarea>
      <button
        type="submit"
        aria-label="send button"
        className="w-fit h-fit border bg-[var(--color-main)] hover:bg-[var(--color-lighter-main)] rounded-[50%] p-2"
      >
        <Image
          src={send}
          alt="send icon"
          aria-label="send icon"
          className="w-7 h-7"
        ></Image>
      </button>
    </form>
  );
}
