export interface ToolCallEvent {
  type: "tool_call";
  tool: string;
  status: "running" | "done" | "error" | "conflict";
  message?: string;
  [key: string]: unknown;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  reason: string | null;
  status?: string;
}

export interface CallEndedEvent {
  type: "call_ended";
  summary: string;
  appointments: Appointment[];
  timestamp: string;
}

export interface ConnectionDetails {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
}
