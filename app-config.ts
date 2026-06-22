export interface AppConfig {
  companyName: string;
  pageTitle: string;
  pageDescription: string;
  startButtonText: string;
  accent: string;
  agentName?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: "Voice AI",
  pageTitle: "Voice AI Assistant",
  pageDescription: "Your intelligent front-desk healthcare assistant.",
  startButtonText: "Start Conversation",
  accent: "#0284c7",
  agentName: process.env.AGENT_NAME || "agent-test",
};
