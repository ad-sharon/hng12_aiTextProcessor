"use client";
import Summarize from "./summarizeButton";
import Translate from "./translateDropdown";

export default function ChatBox({ messages, inputText, detectedLanguage }) {
  return (
    <section className="w-full h-full min-h-[25rem] my-auto p-2 my-2 border border-4 border-color">
      {messages.map((message, index) => (
        <div key={index} className="mb-3">
          <p className="text-[0.9rem] mb-1 border w-fit p-2 rounded-xl border-[var(--color-main)] shadow-inner ">
            {message.text}
          </p>
          {message.language && (
            <p className="text-[0.6rem] font-semibold text-[var(--color-text-grey)]">
              Language Detected : {message.language} ({message.confidence}%
              sure)
            </p>
          )}
        </div>
      ))}
      <section className="flex mt-2 gap-3 items-center">
        <Summarize />
        <Translate inputText={inputText} detectedLanguage={detectedLanguage} />
      </section>
    </section>
  );
}
