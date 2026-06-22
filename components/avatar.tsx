"use client";

import {
  useVoiceAssistant,
  useTracks,
  VideoTrack,
  type TrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";

const STATE_COLORS: Record<string, string> = {
  idle: "#94a3b8",
  listening: "#22d3ee",
  thinking: "#f59e0b",
  speaking: "#10b981",
  disconnected: "#475569",
};

const STATE_LABELS: Record<string, string> = {
  idle: "Ready",
  listening: "Listening...",
  thinking: "Thinking...",
  speaking: "Speaking...",
  disconnected: "Disconnected",
};

const TAVUS_IDENTITY = "tavus-avatar";

export function Avatar() {
  const { state } = useVoiceAssistant();
  const agentState = (state as string) || "idle";
  const color = STATE_COLORS[agentState] || STATE_COLORS.idle;
  const isSpeaking = agentState === "speaking";
  const isListening = agentState === "listening";

  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: false }]);
  const tavusTrack = tracks.find(
    (t) => t.participant.identity === TAVUS_IDENTITY && t.publication !== undefined
  ) as TrackReference | undefined;

  return (
    <div className="flex flex-col items-center gap-4">
      {tavusTrack ? (
        <div className="relative w-52 h-52 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
          <VideoTrack trackRef={tavusTrack} className="w-full h-full object-cover" />
          {isSpeaking && (
            <div className="absolute inset-0 rounded-2xl ring-4 ring-green-400/60 animate-pulse pointer-events-none" />
          )}
          {isListening && (
            <div className="absolute inset-0 rounded-2xl ring-4 ring-cyan-400/60 animate-pulse pointer-events-none" />
          )}
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-40 h-40">
          {isSpeaking && (
            <>
              <div className="absolute w-40 h-40 rounded-full opacity-30 animate-speaking1" style={{ backgroundColor: color }} />
              <div className="absolute w-40 h-40 rounded-full opacity-20 animate-speaking2" style={{ backgroundColor: color }} />
              <div className="absolute w-40 h-40 rounded-full opacity-10 animate-speaking3" style={{ backgroundColor: color }} />
            </>
          )}
          {isListening && (
            <div className="absolute w-44 h-44 rounded-full border-2 animate-pulse" style={{ borderColor: color }} />
          )}
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
            style={{ backgroundColor: color }}
          >
            <svg viewBox="0 0 100 100" className="w-20 h-20">
              <circle cx="50" cy="45" r="35" fill="white" opacity="0.15" />
              <circle cx="38" cy="40" r="5" fill="white" />
              <circle cx="62" cy="40" r="5" fill="white" />
              <circle cx="39" cy="41" r="2.5" fill="#1e293b" />
              <circle cx="63" cy="41" r="2.5" fill="#1e293b" />
              {isSpeaking ? (
                <ellipse cx="50" cy="62" rx="12" ry="8" fill="white" />
              ) : isListening ? (
                <path d="M 38 62 Q 50 70 62 62" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
              ) : (
                <path d="M 38 62 Q 50 68 62 62" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
        <span className="text-sm font-medium text-slate-300">{STATE_LABELS[agentState] || agentState}</span>
      </div>

      <div className="text-center">
        <p className="text-white font-bold text-xl">AI Assistant</p>
        <p className="text-slate-400 text-xs mt-0.5">
          Healthcare Assistant{tavusTrack ? " · Tavus" : ""}
        </p>
      </div>
    </div>
  );
}
