import { ReactElement } from "react";

// SEND EMAIL OPTIONS
export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  react: ReactElement;
  from?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Attachment[];
}

// ATTACHMENT TYPE
export interface Attachment {
  filename: string;
  content: string;
  contentType: string;
}

export interface EmailServiceResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
