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
}

export default function AnimatedCtaButton({
  href,
  text,
  icon,
}: AnimatedCtaButtonProps) {
  return (
    <Button size="lg" asChild>
      <Link href={href} className="group/button">
        {icon}
        <span className="text-nowrap">{text}</span>
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
      </Link>
    </Button>
  );
}
