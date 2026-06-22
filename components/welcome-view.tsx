"use client";

import type { AppConfig } from "@/app-config";

interface Props {
  appConfig: AppConfig;
  onStart: () => void;
  loading: boolean;
  error: string | null;
}

export function WelcomeView({ appConfig, onStart, loading, error }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-6">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-brand-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
          <span className="text-4xl">🎙️</span>
        </div>
        <h1 className="text-4xl font-bold text-white">{appConfig.pageTitle}</h1>
        <p className="text-slate-400 text-lg max-w-md">{appConfig.pageDescription}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl w-full">
        {[
          { icon: "📅", title: "Book Appointments", desc: "Schedule with ease" },
          { icon: "🧠", title: "AI Understanding", desc: "Natural conversation" },
          { icon: "🔒", title: "Secure & Private", desc: "Your data protected" },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center"
          >
            <div className="text-2xl mb-2">{f.icon}</div>
            <p className="text-white font-semibold text-sm">{f.title}</p>
            <p className="text-slate-400 text-xs mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-5 py-3 text-sm max-w-md text-center">
          {error}
        </div>
      )}

      <button
        onClick={onStart}
        disabled={loading}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-lg px-10 py-4 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95"
      >
        {loading ? (
          <span className="flex items-center gap-3">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Connecting...
          </span>
        ) : (
          appConfig.startButtonText
        )}
      </button>
    </div>
  );
}
