"use client";

import ChatBox from "./components/chatBox";
import InputBox from "./components/inputBox";
import { useState, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [start, setStart] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  //function to get localstorage items if available and update messages and detectedLanguage state
  useEffect(() => {
    setStart(true);

    const storedMessages = localStorage.getItem("messages");
    const storedLanguage = localStorage.getItem("sourceLanguage");

    if (
      storedMessages &&
      storedMessages !== "[]" &&
      storedLanguage &&
      storedLanguage !== null
    ) {
      setMessages(JSON.parse(storedMessages));
      setDetectedLanguage(JSON.parse(storedLanguage));
    }

    return;
  }, []);

  //function to set messages and language in local storage whenever they change
  useEffect(() => {
    if (start) {
      localStorage.setItem("messages", JSON.stringify(messages));
      localStorage.setItem("sourceLanguage", JSON.stringify(detectedLanguage));
    }
  }, [messages, detectedLanguage, start]);

  //function to clear all messages
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem("messages");
    localStorage.removeItem("sourceLanguage");
  };

  return (
    <section className="w-full h-full flex flex-col justify-between w-full max-w-full mx-auto">
      {/* chat */}
      <ChatBox
        messages={messages}
        clearMessages={clearMessages}
        inputText={
          messages.length > 0 ? messages[messages.length - 1].text : ""
        }
        detectedLanguage={detectedLanguage}
        translatedText={translatedText}
        setTranslatedText={setTranslatedText}
      />

      {/* input */}
      <InputBox
        messages={messages}
        setMessages={setMessages}
        setDetectedLanguage={setDetectedLanguage}
        setTranslatedText={setTranslatedText}
      />
    </section>
  );
}
