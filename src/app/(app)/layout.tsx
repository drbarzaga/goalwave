import React from "react";
import PageContainer from "@/components/layout/app/page-container";

export default function layout({ children }: { children: React.ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}
