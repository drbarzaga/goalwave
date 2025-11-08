import { pageMetadata } from "@/lib/metadata";
import AuthContainer from "@/components/layout/auth/auth-container";
import ForgotPasswordForm from "@/components/features/auth/forgot-password-form";

export const metadata = pageMetadata.forgotPassword();

export default function ForgotPasswordPage() {
  return (
    <AuthContainer>
      <ForgotPasswordForm />
    </AuthContainer>
  );
}
