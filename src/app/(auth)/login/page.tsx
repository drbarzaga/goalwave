import { pageMetadata } from "@/lib/metadata";
import AuthContainer from "@/components/layout/auth/auth-container";
import LoginForm from "@/components/features/auth/login-form";

export const metadata = pageMetadata.login();

export default function LoginPage() {
  return (
    <AuthContainer>
      <LoginForm />
    </AuthContainer>
  );
}
