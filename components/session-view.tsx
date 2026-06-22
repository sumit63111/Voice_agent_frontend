"use client";

import { useEffect, useState, useCallback } from "react";
import {
  useVoiceAssistant,
  VoiceAssistantControlBar,
  BarVisualizer,
  useDataChannel,
} from "@livekit/components-react";

import type { AppConfig } from "@/app-config";
import type { ToolCallEvent, CallEndedEvent } from "@/lib/types";
import { Avatar } from "./avatar";
import { ToolCallDisplay } from "./tool-call-display";
import { CallSummary } from "./call-summary";
import { Transcript } from "./transcript";

export function SessionView({ appConfig }: { appConfig: AppConfig }) {
  const { audioTrack } = useVoiceAssistant();
  const [toolCalls, setToolCalls] = useState<ToolCallEvent[]>([]);
  const [callSummary, setCallSummary] = useState<CallEndedEvent | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  const handleData = useCallback((raw: Uint8Array) => {
    try {
      const msg = JSON.parse(new TextDecoder().decode(raw));
      if (msg.type === "tool_call") {
        setToolCalls((prev) => {
          const idx = prev.findLastIndex(
            (t) => t.tool === msg.tool && t.status === "running"
          );
          if (idx !== -1 && msg.status !== "running") {
            const next = [...prev];
            next[idx] = msg as ToolCallEvent;
            return next;
          }
          return [...prev, msg as ToolCallEvent];
        });
      } else if (msg.type === "call_ended") {
        setCallSummary(msg as CallEndedEvent);
      }
    } catch {
      return;
    }
  }, []);

  useDataChannel((msg) => {
    if (msg.payload) handleData(msg.payload);
  });

  useEffect(() => {
    if (callSummary) setShowSummary(true);
  }, [callSummary]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-5xl mx-auto p-6">
      <div className="flex flex-col items-center gap-6 lg:w-80 flex-shrink-0">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 w-full flex flex-col items-center gap-6 shadow-xl backdrop-blur-sm">
          <Avatar />
          {audioTrack && (
            <div className="w-full h-12">
              <BarVisualizer trackRef={audioTrack} barCount={20} style={{ width: "100%", height: "100%" }} />
            </div>
          )}
          <VoiceAssistantControlBar />
        </div>
        <div className="text-center text-xs text-slate-500 space-y-0.5">
          <p>Connection secured · Powered by LiveKit</p>
          <p className="text-slate-600">
            Agent: <span className="font-mono text-slate-500">{appConfig.agentName}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 shadow-xl backdrop-blur-sm flex-1">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4">
            Conversation
          </p>
          <Transcript />
        </div>

        {toolCalls.length > 0 && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <ToolCallDisplay calls={toolCalls} />
          </div>
        )}
      </div>

      {showSummary && callSummary && (
        <CallSummary event={callSummary} onDismiss={() => setShowSummary(false)} />
      )}
    </div>
  );
}
