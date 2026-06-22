"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@livekit/components-react";

export function ChatInput() {
  const { send, isSending } = useChat();
  const [text, setText] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const msg = text.trim();
    if (!msg || isSending) return;
    setText("");
    try {
      await send(msg);
    } catch {
      setText(msg);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex gap-2 mt-3">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message…"
        aria-label="Type a message"
        className="flex-1 bg-slate-700/60 border border-slate-600 rounded-xl px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-600"
      />
      <button
        type="submit"
        disabled={isSending || !text.trim()}
        className="bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
      >
        Send
      </button>
    </form>
  );
}
