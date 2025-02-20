"use client";
import Summarize from "./summarizeButton";
import Translate from "./translateDropdown";
import ClearChat from "./clearChatButton";

export default function ChatBox({
  messages,
  clearMessages,
  inputText,
  translatedText,
  detectedLanguage,
  setTranslatedText,
}) {
  return (
    <section className="flex flex-col w-full flex-grow min-h-0 p-2 overflow-y-auto border border-4 border-color">
      <section className="flex items-end mb-2 mx-1">
        <ClearChat messages={messages} clearMessages={clearMessages} />
      </section>
      {messages.map((message, index) => (
        <section key={index} className="mb-3">
          <section className="text-[0.8rem] rounded-xl border border-[var(--color-main)] mb-1 w-full max-w-fit flex flex-col gap-2 p-2">
            {message.text}

            {message.text.trim().length > 150 &&
              message.language === "Language Detected: English" && 
                <Summarize
                  inputText={message.text}
                  detectedLanguage={detectedLanguage}
                />
              }
          </section>

          {message.language && (
            <p className="text-[0.6rem] font-semibold text-[var(--color-text-grey)]">
              {message.language} {message.confidence}
            </p>
          )}
        </section>
      ))}
      <section className="flex gap-2 ">
        <Translate
          inputText={inputText}
          detectedLanguage={detectedLanguage}
          translatedText={translatedText}
          setTranslatedText={setTranslatedText}
        />
      </section>
    </section>
  );
}
