"use client";

import { useState, useCallback } from "react";
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react";
import "@livekit/components-styles";
import { AnimatePresence, motion } from "motion/react";

import type { AppConfig } from "@/app-config";
import type { ConnectionDetails, CallEndedEvent } from "@/lib/types";
import { WelcomeView } from "./welcome-view";
import { SessionView } from "./session-view";
import { CallSummary } from "./call-summary";

export function App({ appConfig }: { appConfig: AppConfig }) {
  const [connection, setConnection] = useState<ConnectionDetails | null>(null);
  const [summary, setSummary] = useState<CallEndedEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onStart = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch("/api/token", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      setConnection((await res.json()) as ConnectionDetails);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to connect");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen">
      <AnimatePresence mode="wait">
        {!connection ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeView
              appConfig={appConfig}
              onStart={onStart}
              loading={loading}
              error={error}
            />
          </motion.div>
        ) : (
          <motion.div
            key="session"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LiveKitRoom
              serverUrl={connection.serverUrl}
              token={connection.participantToken}
              connect={true}
              audio={true}
              video={false}
              onDisconnected={() => setConnection(null)}
              className="min-h-screen flex items-center justify-center"
            >
              <SessionView appConfig={appConfig} onCallEnded={setSummary} />
              <RoomAudioRenderer />
            </LiveKitRoom>
          </motion.div>
        )}
      </AnimatePresence>

      {summary && (
        <CallSummary event={summary} onDismiss={() => setSummary(null)} />
      )}
    </main>
  );
}
