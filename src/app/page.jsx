"use client";

import ChatBox from "./components/chatBox";
import InputBox from "./components/inputBox";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [detectedLanguage, setDetectedLanguage] = useState("");

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <section className="w-full max-w-[95%] mx-auto p-2 ">
      {/* chat */}
      <ChatBox
        messages={messages}
        clearMessages={clearMessages}
        inputText={
          messages.length > 0 ? messages[messages.length - 1].text : ""
        }
        detectedLanguage={detectedLanguage}
      />

      {/* input */}
      <InputBox
        setMessages={setMessages}
        setDetectedLanguage={setDetectedLanguage}
      />
    </section>
  );
}
