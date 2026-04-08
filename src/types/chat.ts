export type ChatMode =
  | "Recruiter"
  | "HR"
  | "Hiring Manager"
  | "Technical Interviewer"
  | "Resume Reviewer";

export interface SourceFilter {
  id: string;
  label: string;
  enabled: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  name?: string;
}

export interface RetrievedDoc {
  id: string;
  source: string;
  content: string;
}

export interface ChatResponse {
  rewritten_query: string;
  documents: RetrievedDoc[];
  answer: string;
  filters?: Record<string, unknown>;
}