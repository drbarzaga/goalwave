"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface AnimatedCtaButtonProps {
  href: string;
  text: string;
  icon: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  iconOnly?: boolean;
}

export default function AnimatedCtaButton({
  href,
  text,
  icon,
  size = "lg",
  iconOnly = false,
}: AnimatedCtaButtonProps) {
  return (
    <Button size={size} asChild variant={iconOnly ? "ghost" : "default"}>
      <Link href={href} className="group/button" title={iconOnly ? text : undefined}>
        {icon}
        {!iconOnly && <span className="text-nowrap">{text}</span>}
        {!iconOnly && (
          <motion.div
            animate={{
              x: [0, 4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="ml-2"
          >
            <ArrowRight className="size-4" />
          </motion.div>
        )}
        {iconOnly && (
          <motion.div
            animate={{
              x: [0, 2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="ml-1"
          >
            <ArrowRight className="size-3" />
          </motion.div>
        )}
      </Link>
    </Button>
  );
}
