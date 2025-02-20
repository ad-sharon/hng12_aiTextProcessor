"use client";
import { toast } from "react-hot-toast";
export default function ClearChat({ messages, clearMessages }) {
  const handleClear = () => {
    if (messages.length === 0) {
      toast.error("No messages to clear");
      return;
    }
    clearMessages();
  };

  return (
    <button
      aria-label="clear chat button"
      onClick={handleClear}
      className={`ml-auto text-[0.8rem] text-center border-2 border-[var(--color-main)] bg-[var(--color-main)] p-1 rounded-lg hover:bg-[var(--color-lighter-main)]`}
    >
      Clear Chat
    </button>
  );
}
