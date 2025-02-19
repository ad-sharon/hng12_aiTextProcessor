"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import send from "../../../public/send.svg";
import axios from "axios";
import toast from "react-hot-toast";

export default function InputBox({ setMessages, setDetectedLanguage }) {
  const [inputText, setInputText] = useState("");
  const [isAvailable, setIsAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    const checkDetectionSupport = async () => {
      if ("ai" in self && "languageDetector" in self.ai) {
        console.log("Chrome Language Detection APIs were detected.");
        await initializeDetector();
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
        console.error(
          "Browser does not support Chrome AI Language Detection APIs"
        );
      }
    };
    checkDetectionSupport();
  }, []);

  // initialize AI language detector if chrome AI is available/supported
  const initializeDetector = async () => {
    try {
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;

      if (canDetect !== "no") {
        console.log("Chrome AI Language Detection is available.");
        const newDetector =
          canDetect === "readily"
            ? await self.ai.languageDetector.create()
            : await self.ai.languageDetector.create({
                monitor(m) {
                  m.addEventListener("downloadprogress", (e) => {
                    console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
                  });
                },
              });

        if (canDetect !== "readily") await newDetector.ready;
        setDetector(newDetector);
      } else {
        console.log("Language detection is not supported.");
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error starting language detector: ", error);
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
      console.error("No text inputted");
      // toast.error("Please enter some text.");
      return;
    }

    try {
      setIsLoading(true);

      if (isAvailable && detector) {
        // will run if browser AI detection is supported
        console.log("Chrome AI detecting language...");
        const result = await detector.detect(inputText);
        console.log("result: ", result);
        const detectedLanguage = result[0].detectedLanguage;
        const detectedLanguageFull = getFullLanguageName(detectedLanguage);
        console.log("here it is", detectedLanguageFull);
        setDetectedLanguage(detectedLanguage);

        setMessages((prev) => [
          ...prev,
          {
            text: inputText,
            language: detectedLanguageFull,
            confidence: parseInt(result[0].confidence * 100),
          },
        ]);
      } else {
        // will run if browser AI is unavailable
        const response = await axios.post("/api/languageDetection", {
          text: inputText,
        });
        console.log(response.data);
        setMessages((prev) => [
          ...prev,
          {
            text: inputText,
            language: response.data.language,
            confidence: null,
          },
        ]);
      }
    } catch (error) {
      console.error("Error detecting language.", error);
    } finally {
      setIsLoading(false);
      setInputText("");
    }
  };

  return (
    <form
      onSubmit={detectLanguage}
      className="w-full max-w-[90%] mx-auto bottom-5 left-0 right-0 flex gap-2"
    >
      <textarea
        value={inputText}
        onChange={handleInputChange}
        className="w-full border rounded-md text-sm p-2 bg-transparent rounded-md "
        placeholder="Input your text here..."
        rows={3}
      ></textarea>
      <button
        type="submit"
        disabled={isLoading}
        className="w-fit border rounded-md p-2"
      >
        {isLoading ? (
          "..."
        ) : (
          <Image src={send} alt="send icon" className="w-5 h-5"></Image>
        )}
      </button>
    </form>
  );
}
