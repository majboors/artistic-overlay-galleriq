
export interface ImageUploadResponse {
  id: string;
}

export interface UnmarkedImage {
  id: string;
  datefield: string;
  timestamp: string;
}

export interface ImageRecord {
  id: string;
  timestamp: string;
  datefield: string;
  marking: boolean | null;
}

export interface SubmissionData {
  studentName: string;
  grade: string;
  title: string;
  type?: "ai" | "handdrawn";
  aiGenerator?: string;
  aiPrompt?: string;
}
