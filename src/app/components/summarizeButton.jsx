"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Summarize({ inputText, detectedLanguage }) {
  const [wordCount, setWordCount] = useState(0);
  const [summarizer, setSummarizer] = useState(null);
  const [summaryText, setSummaryText] = useState("");

  // function for word count
  useEffect(() => {
    console.log("Counting words...", inputText);
    console.log("Detected:", detectedLanguage);

    if (!inputText || inputText.trim().length === 0) {
      setWordCount(0);
      console.log("No text inputted for word count.");
      return;
    } else if (detectedLanguage !== "en") {
      console.log("Text is not in English. Can't be summarized");
    }
    if (inputText && detectedLanguage === "en") {
      const wordCount = inputText.trim().split(/\s+/).length;
      console.log(`${inputText} with a word count of ${wordCount}`);

      setWordCount(wordCount);
    }
  }, [inputText]);

  useEffect(() => {
    const checkSummarizerSupport = async () => {
      if ("ai" in self && "summarizer" in self.ai) {
        console.log("Chrome Summarizer APIs were detected.");
        await initializeSummarizer();
      } else {
        console.error("Browser does not support Chrome AI Summarizer APIs");
      }
    };
    checkSummarizerSupport();
  }, []);

  const initializeSummarizer = async () => {
    try {
      console.log(`🟡 Initializing summarizer`);

      const options = {
        sharedContext: "This is a scientific article",
        type: "key-points",
        format: "markdown",
        length: "medium",
      };

      const summarizeCapabilities = await ai.summarizer.capabilities();
      const canSummarize = summarizeCapabilities.available;
      console.log(canSummarize);

      if (canSummarize === "no") {
        console.error(
          "Sorry. You don't have sufficient space to download the summarizer model!"
        );
        return;
      }

      let summarizer;
      if (canSummarize === "readily") {
        summarizer = await ai.summarizer.create(options);
      } else {
        summarizer = await ai.summarizer.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(
                `Downloading AI summarizer Model: ${e.loaded} / ${e.total} bytes.`
              );
            });
          },
        });

        await summarizer.ready;
      }

      console.log("✅ Summarizer initialized.");
      setSummarizer(summarizer);
    } catch (error) {
      console.error("❌ Error initializing summarizer:", error);
    }
  };

  initializeSummarizer();

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      console.error("No text to summarize.");
      return;
    }

    if (!summarizer) {
      console.error("Summarizer is not initialized.");
      return;
    }

    try {
      const result = await summarizer.summarize(inputText, {
        context: "Just make it short.",
      });
      console.log("Summarized Text:", result);
      setSummaryText(result);
    } catch (error) {
      console.error("❌ Error summarizing text:", error);
    }
  };

  return (
    <button
      onClick={handleSummarize}
      className={`${
        wordCount >= 150 && detectedLanguage === "en" ? "block" : "hidden"
      } text-[0.8rem] text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]`}
    >
      Click to Summarize Text
      <p className="text-[10px] font-bold text-[var(--dark)]">{`Current Word Count: ${wordCount}`}</p>
    </button>
  );
}
