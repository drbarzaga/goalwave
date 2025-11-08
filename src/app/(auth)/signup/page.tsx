import SignUpForm from "@/components/features/auth/signup-form";
import AuthContainer from "@/components/layout/auth/auth-container";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata.signup();

export default function SignUpPage() {
  return (
    <AuthContainer>
      <SignUpForm />
    </AuthContainer>
  );
}
