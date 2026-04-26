export type ChatRole = "user" | "assistant";

export type ChatMode =
  | "Recruiter"
  | "HR"
  | "Hiring Manager"
  | "Technical Interviewer"
  | "Resume Reviewer";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  name?: string;
  content: string;
};

export type SourceFilter = {
  id: string;
  label: string;
  enabled: boolean;
};

export type RetrievedDoc = {
  id: string;
  content: string;
  source: string;
  metadata?: Record<string, unknown>;
};

export type ChatResponse = {
  rewritten_query: string;
  documents: RetrievedDoc[];
  answer: string;
  filters?: Record<string, unknown>;
};