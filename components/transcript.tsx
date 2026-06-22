"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  useTranscriptions,
  useChat,
  useLocalParticipant,
} from "@livekit/components-react";

interface Line {
  id: string;
  text: string;
  isAgent: boolean;
  timestamp: number;
}

export function Transcript() {
  const transcriptions = useTranscriptions();
  const { chatMessages } = useChat();
  const { localParticipant } = useLocalParticipant();
  const bottomRef = useRef<HTMLDivElement>(null);

  const localIdentity = localParticipant?.identity;

  const lines = useMemo<Line[]>(() => {
    const fromSpeech: Line[] = transcriptions.map((seg) => ({
      id: seg.streamInfo.id,
      text: seg.text,
      isAgent: seg.participantInfo?.identity !== localIdentity,
      timestamp: seg.streamInfo.timestamp,
    }));
    const fromChat: Line[] = chatMessages.map((msg) => ({
      id: msg.id,
      text: msg.message,
      isAgent: !!msg.from?.identity && msg.from.identity !== localIdentity,
      timestamp: msg.timestamp,
    }));
    const seen = new Set<string>();
    return [...fromSpeech, ...fromChat]
      .filter((l) => (seen.has(l.id) ? false : seen.add(l.id)))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chatMessages, localIdentity]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  if (lines.length === 0) {
    return (
      <div className="text-center text-slate-500 text-sm py-8">
        Conversation will appear here...
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
      {lines.map((line) => (
        <div
          key={line.id}
          className={`flex gap-2 ${line.isAgent ? "justify-start" : "justify-end"}`}
        >
          {line.isAgent && (
            <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">
              P
            </div>
          )}
          <div
            className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
              line.isAgent
                ? "bg-slate-700 text-slate-200 rounded-tl-sm"
                : "bg-brand-600 text-white rounded-tr-sm"
            }`}
          >
            {line.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
