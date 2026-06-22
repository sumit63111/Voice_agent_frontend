"use client";

import type { CallEndedEvent } from "@/lib/types";

interface Props {
  event: CallEndedEvent;
  onDismiss: () => void;
}

export function CallSummary({ event, onDismiss }: Props) {
  const timestamp = new Date(event.timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white font-bold text-xl">Call Summary</h2>
            <p className="text-slate-400 text-sm mt-0.5">{timestamp}</p>
          </div>
          <button onClick={onDismiss} className="text-slate-400 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        {event.summary && (
          <div className="bg-slate-700/50 rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-2">Summary</p>
            <p className="text-slate-200 text-sm leading-relaxed">{event.summary}</p>
          </div>
        )}

        {event.appointments && event.appointments.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">
              Appointments ({event.appointments.length})
            </p>
            <div className="space-y-2">
              {event.appointments.map((appt) => {
                const displayDate = new Date(appt.date + "T00:00:00").toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                const [h, m] = appt.time.split(":");
                const dt = new Date();
                dt.setHours(parseInt(h), parseInt(m));
                const displayTime = dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

                return (
                  <div key={appt.id} className="flex items-center gap-3 bg-slate-700/40 rounded-lg px-3 py-2.5">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 text-sm">
                      📅
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">
                        {displayDate} at {displayTime}
                      </p>
                      <p className="text-slate-400 text-xs">{appt.reason || "General consultation"}</p>
                    </div>
                    <span className="ml-auto text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button
          onClick={onDismiss}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl py-2.5 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
