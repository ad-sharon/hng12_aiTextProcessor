"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Summarize({ inputText, detectedLanguage }) {
  const [summarizer, setSummarizer] = useState(null);
  const [summaryText, setSummaryText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  //to handle summarize
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast.error("No text to summarize.");
      return;
    }

    setIsLoading(true);

    try {
      const options = {
        sharedContext: "This is a long text that provides key-points and a conclusion for a summary.",
        type: "key-points",
        format: "markdown",
        length: "medium",
      };

      const summarizeCapabilities = await self.ai.summarizer.capabilities();
      const canSummarize = summarizeCapabilities.available;

      if (canSummarize === "no") {
        setIsLoading(false)
        setShowSummary(false)
          toast.error(
          "Sorry. You don't have the device requirements needed to summarize text!"
        );
        return;
      }

      let summarizer;
      if (canSummarize === "readily") {
        summarizer = await self.ai.summarizer.create(options);
      } else if (canSummarize === "after-download") {
        const loadingToast = toast.loading(
          "Downloading the summarizer model. This might take a while...",
          {
            duration: Infinity,
          }
        );

        try{
        summarizer = await self.ai.summarizer.create({
        monitor(m){
          m.addEventListener("downloadprogress", (e) => {
          console.log(
            `Downloading AI summarizer Model: ${e.loaded} / ${e.total} bytes.`);
          });
        }        
        });
        await summarizer.ready;
        toast.dismiss(loadingToast);
        toast.success("Download done!");
        } catch (error) {
          toast.dismiss(loadingToast);
        console.error("Error downloading AI summarizer:", error);
        toast.error("An error occurred while downloading the model.");
        return;
        }
      }

      setIsLoading(true);
      setSummarizer(summarizer);
      const result = await summarizer.summarize(inputText, {
        context: "Just make it short.",
      });
      setShowSummary(true);
      console.log(result);
      setSummaryText(result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error summarizing text:", error);
      toast.error("Failed to sumarize. Try again.");
    }
  };

  return (
    <>
      <button
        onClick={handleSummarize}
        className="text-[0.7rem] w-full max-w-fit text-center border button-bg p-1 rounded-lg hover:border-[var(--color-main)]"
      >
        Summarize
        <p className="text-[0.6rem] font-bold text-[var(--dark)]">
          {`Current Character Count: ${inputText.trim().length}`}
        </p>
      </button>

      {isLoading && (
        <p className="text-[0.6rem] text-[var(--color-text-grey)]">
          Summarizing...
        </p>
      )}
      
      {showSummary && (
        <section className="w-full min-w-full">
          <p className="text-[10px] font-bold">Summary</p>
          <section className="text-[0.7rem] border border-[var(--color-main)] p-2 flex flex-col gap-1 rounded-lg">
            <button onClick={() => setSummaryText("")} className="text-[0.5rem] font-bold ms-auto hover:underline hover:text-[var(--light)] text-[var(--color-text-grey)]">
              Close       
            </button>
            {summaryText !== "" ? summaryText : <p className="text-red-500 text-[0.5rem]">Sorry, your summary is not available.</p>}
            <p className="text-[9px] ms-auto font-bold text-center text-[var(--light)]">
              Summary Character Count = {`${summaryText.trim().length}`}
            </p>
          </section>
        </section>
      )}      
    </>
  );
}
