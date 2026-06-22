"use client";

import { useEffect, useRef } from "react";
import { useChat } from "@livekit/components-react";

export function Transcript() {
  const { chatMessages } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (chatMessages.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm py-8">
        Conversation will appear here...
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
      {chatMessages.map((msg, i) => {
        const isAgent = msg.from?.identity?.startsWith("agent") || !msg.from?.identity;
        return (
          <div key={i} className={`flex gap-2 ${isAgent ? "justify-start" : "justify-end"}`}>
            {isAgent && (
              <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">
                M
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                isAgent
                  ? "bg-slate-700 text-slate-200 rounded-tl-sm"
                  : "bg-brand-600 text-white rounded-tr-sm"
              }`}
            >
              {msg.message}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
