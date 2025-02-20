"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Summarize({ inputText, detectedLanguage }) {
  const [summarizer, setSummarizer] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // function for word count
  useEffect(() => {
    if (
      !inputText ||
      inputText.trim().length === 0 ||
      detectedLanguage !== "en"
    ) {
      setWordCount(0);
      setShowButton(false);
      return;
    }

    const count = inputText.trim().split(/\s+/).length;
    setWordCount(count);
    setShowButton(count >= 150);
  }, [inputText, detectedLanguage]);

  //to handle summarize
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error("No text to summarize.");
      return;
    }

    try {
      const options = {
        sharedContext: "This is a scientific article",
        type: "key-points",
        format: "markdown",
        length: "medium",
      };

      const summarizeCapabilities = await self.ai.summarizer.capabilities();
      const canSummarize = summarizeCapabilities.available;

      if (canSummarize === "no") {
        toast.error(
          "Sorry. You don't have sufficient space to download the summarizer model!"
        );
        return;
      }

      let summarizer;
      if (canSummarize === "readily") {
        summarizer = await self.ai.summarizer.create(options);
      } else if (canSummarize === "after-download") {
        summarizer = await self.ai.summarizer.create(options);
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(
            `Downloading AI summarizer Model: ${e.loaded} / ${e.total} bytes.`
          );
        });

        await summarizer.ready;
      }

      toast.success("Summarizer initialized.");
      setSummarizer(summarizer);
      const longText =
        "With non-streaming summarization, the model processes the input as a whole and then produces the output. To get a non-streaming summary, call the summarizer's asynchronous summarize() function. The first argument for the function is the text that you want to summarize. The second, optional argument is an object with a context field. This field lets you add background details that might improve the summarization.";
      const result = await summarizer.summarize(longText, {
        context: "Just make it short.",
      });
      console.log(result);
      setSummaryText(result);
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  };

  return (
    <>
      {showButton && (
        <button
          onClick={handleSummarize}
          className={`text-[0.8rem] text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]`}
        >
          Click to Summarize Text
          <p className="text-[10px] font-bold text-[var(--dark)]">{`Current Word Count: ${wordCount}`}</p>
        </button>
      )}
      <p>{summaryText}</p>
    </>
  );
}
