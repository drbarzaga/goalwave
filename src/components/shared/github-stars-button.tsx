"use client";

import {
  GitHubStarsButton as GitHubStarsButtonComponent,
  type GitHubStarsButtonProps as GitHubStarsButtonComponentProps,
} from "@/components/animate-ui/components/buttons/github-stars";
import Link from "next/link";
interface GitHubStarsButtonProps {
  variant?: GitHubStarsButtonComponentProps["variant"];
  size?: GitHubStarsButtonComponentProps["size"];
  username?: string;
  repo?: string;
}

export default function GitHubStarsButton({
  variant = "default",
  size = "default",
  username = "drbarzaga",
  repo = "goalwave",
}: GitHubStarsButtonProps) {
  return (
    <Link href={`https://github.com/${username}/${repo}`} target="_blank">
      <GitHubStarsButtonComponent
        variant={variant}
        size={size}
        username={username}
        repo={repo}
        content="GitHub Stars"
        className="cursor-pointer"
      />
    </Link>
  );
}
