import { getCompanyName } from "@/lib/utils";
import { EmailServiceResponse, SendEmailOptions } from "@/types/email";
import { Resend } from "resend";

let resendInstance: Resend | null = null;

function getResendInstance(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY!;
    if (!apiKey) {
      throw new Error(
        "RESEND_API_KEY is not defined in the environment variables"
      );
    }
    resendInstance = new Resend(apiKey);
  }

  return resendInstance;
}

const defaultFromEmail = `${getCompanyName()} <${
  process.env.RESEND_FROM_EMAIL || "noreply@goalwave.com"
}>`;

class EmailService {
  private static instance: EmailService | null = null;

  private constructor() {}

  public static getInstance(): EmailService {
    EmailService.instance ??= new EmailService();
    return EmailService.instance;
  }

  public async sendEmail(
    options: SendEmailOptions
  ): Promise<EmailServiceResponse> {
    try {
      const resend = getResendInstance();
      const result = await resend.emails.send({
        from: options.from || defaultFromEmail,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        react: options.react,
        ...(options.replyTo && { reply_to: options.replyTo }),
        ...(options.cc && {
          cc: Array.isArray(options.cc) ? options.cc : [options.cc],
        }),
        ...(options.bcc && {
          bcc: Array.isArray(options.bcc) ? options.bcc : [options.bcc],
        }),
      });

      console.log("Email sent successfully:", result);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

export const emailService = EmailService.getInstance();
