"use client";
import { useState, useEffect } from "react";

export default function ClearChat({ messages, clearMessages }) {
  const handleClear = () => {
    if (messages.length === 0) {
      console.log("No messages to clear");
      return;
    }
    clearMessages();
  };

  return (
    <button
      onClick={handleClear}
      className={`ml-auto text-[0.8rem] text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]`}
    >
      Clear Chat
    </button>
  );
}
