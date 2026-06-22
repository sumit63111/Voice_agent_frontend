"use client";

import type { ToolCallEvent } from "@/lib/types";

const TOOL_META: Record<string, { label: string; icon: string }> = {
  identify_user: { label: "Identifying patient", icon: "👤" },
  fetch_slots: { label: "Fetching available slots", icon: "📅" },
  book_appointment: { label: "Booking appointment", icon: "✅" },
  retrieve_appointments: { label: "Fetching appointments", icon: "📋" },
  cancel_appointment: { label: "Cancelling appointment", icon: "❌" },
  modify_appointment: { label: "Modifying appointment", icon: "✏️" },
  end_conversation: { label: "Ending call", icon: "📞" },
};

const STATUS_STYLES: Record<string, string> = {
  running: "border-yellow-500/50 bg-yellow-500/10 text-yellow-300",
  done: "border-green-500/50 bg-green-500/10 text-green-300",
  error: "border-red-500/50 bg-red-500/10 text-red-300",
  conflict: "border-orange-500/50 bg-orange-500/10 text-orange-300",
};

const STATUS_BADGE: Record<string, string> = {
  running: "Calling...",
  done: "Done ✓",
  error: "Error ✗",
  conflict: "Conflict ⚠",
};

export function ToolCallDisplay({ calls }: { calls: ToolCallEvent[] }) {
  if (calls.length === 0) return null;

  return (
    <div className="w-full space-y-2">
      <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
        Tool Activity
      </p>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {calls.map((call, i) => {
          const meta = TOOL_META[call.tool] || { label: call.tool, icon: "⚙️" };
          const style = STATUS_STYLES[call.status] || STATUS_STYLES.running;
          const badge = STATUS_BADGE[call.status] || call.status;
          const result =
            call.status !== "running" && typeof call.message === "string"
              ? call.message
              : null;
          return (
            <div
              key={i}
              className={`rounded-lg border px-3 py-2 text-sm transition-all ${style}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{meta.icon}</span>
                  <span className="font-medium">{meta.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {call.status === "running" && (
                    <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  )}
                  <span className="text-xs opacity-75">{badge}</span>
                </div>
              </div>
              {result && (
                <p className="mt-1 text-xs opacity-80 leading-snug">{result}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
