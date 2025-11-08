import ResetFormPassword from "@/components/features/auth/reset-password-form";
import AuthContainer from "@/components/layout/auth/auth-container";

export default function ResetPasswordPage() {
  return (
    <AuthContainer>
      <ResetFormPassword />
    </AuthContainer>
  );
}
