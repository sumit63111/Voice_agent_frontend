import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG_DEFAULTS } from "@/app-config";

export const metadata: Metadata = {
  title: APP_CONFIG_DEFAULTS.pageTitle,
  description: APP_CONFIG_DEFAULTS.pageDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
