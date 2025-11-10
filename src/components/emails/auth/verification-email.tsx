import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";
import { getCompanyName, getYear } from "@/lib/utils";

interface VerificationEmailProps {
  name: string;
  verificationUrl: string;
}

const VerificationEmail = ({
  name,
  verificationUrl,
}: VerificationEmailProps) => {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-gray-100 font-sans py-[40px]">
          <Container className="bg-white rounded-[8px] max-w-[600px] mx-auto px-[40px] py-[40px]">
            <Section>
              <Text className="text-[28px] font-bold text-gray-900 mb-[24px] mt-0">
                Welcome to {getCompanyName()}!
              </Text>

              <Text className="text-[18px] text-gray-700 mb-[16px] mt-0 leading-[26px]">
                Hi {name},
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[24px] mt-0 leading-[24px]">
                Thank you for your interest in using Goalwave to achieve your
                financial goals! We&apos;re thrilled to have you join our
                community of people who are taking control of their financial
                future.
              </Text>

              <Text className="text-[16px] text-gray-700 mb-[32px] mt-0 leading-[24px]">
                You&apos;re just one step away from accessing powerful tools
                that will help you track, plan, and accomplish your financial
                objectives. To get started, please verify your email address by
                clicking the button below.
              </Text>

              <Section className="text-center mb-[32px]">
                <Button
                  href={verificationUrl}
                  className="bg-black text-white px-[32px] py-[12px] rounded-[6px] text-[16px] font-medium no-underline box-border"
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text className="text-[14px] text-gray-600 mb-[16px] mt-0 leading-[20px]">
                If the button above doesn&apos;t work, copy and paste this link
                into your browser:
              </Text>

              <Text className="text-[14px] text-blue-600 mb-[32px] mt-0 leading-[20px] break-all bg-gray-50 p-[12px] rounded-[4px] border border-solid border-gray-200">
                {verificationUrl}
              </Text>

              <Text className="text-[14px] text-gray-600 mb-[32px] mt-0 leading-[20px]">
                If you didn&apos;t create a Goalwave account, you can safely
                ignore this email and no account will be created.
              </Text>

              <Hr className="border-gray-200 my-[32px]" />

              <Text className="text-[12px] text-gray-500 m-0 text-center">
                © {getYear()} {getCompanyName()}. All rights reserved.
              </Text>

              <Text className="text-[12px] text-gray-500 m-0 mt-[8px] text-center">
                Made with ❤️ by the {getCompanyName()} community.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default VerificationEmail;
