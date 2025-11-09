"use client";

import React from "react";
import Image from "next/image";
import { TextEffect } from "@/components/ui/text-effect";
import { AnimatedGroup } from "@/components/ui/animated-group";
import Header from "./header";
import AnimatedCtaButton from "@/components/shared/animated-cta-button";
import AnimatedAvatarGroup from "@/components/shared/animated-avatar-group";
import { GoalIcon } from "lucide-react";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <section>
          <div className="relative pt-24">
            <div className="mx-auto max-w-7xl px-6">
              <div className="max-w-3xl text-center sm:mx-auto lg:mr-auto lg:mt-0 lg:w-4/5">
                <div className="flex flex-col items-center justify-center">
                  <AnimatedGroup>
                    <AnimatedAvatarGroup className="mt-8" />
                    <small className="text-sm text-muted-foreground mt-2">
                      Built by the Community for the Community
                    </small>
                  </AnimatedGroup>
                </div>

                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mx-auto mt-8 max-w-4xl text-balance text-6xl max-md:font-medium md:text-7xl lg:mt-16 xl:text-[5.25rem]"
                >
                  Modern Financial Goal Management
                </TextEffect>

                <TextEffect
                  per="word"
                  as="h3"
                  preset="blur"
                  className="mx-auto mt-8 hidden max-w-2xl text-wrap text-lg sm:block"
                >
                  Transform your financial aspirations into achievable
                  milestones with intelligent tracking and seamless planning.
                </TextEffect>

                <TextEffect
                  per="word"
                  as="h3"
                  preset="blur"
                  className="mx-auto mt-6 max-w-2xl text-wrap sm:hidden"
                >
                  Transform your financial aspirations into achievable
                  milestones with intelligent tracking and seamless planning.
                </TextEffect>

                <div className="mt-8 flex flex-col items-center justify-center gap-2">
                  <AnimatedGroup
                    variants={transitionVariants}
                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
                  >
                    <div
                      key={1}
                      className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
                    >
                      <AnimatedCtaButton
                        href="/signup"
                        text="Start Tracking Goals"
                        icon={<GoalIcon className="relative size-4 mr-2" />}
                      />
                    </div>
                  </AnimatedGroup>
                </div>
              </div>
            </div>

            <div className="mask-b-from-55% relative mx-auto mt-16 max-w-6xl overflow-hidden px-4">
              <Image
                className="z-2 border-border/25 relative hidden rounded-2xl border dark:block"
                src="/music.png"
                alt="app screen"
                width={2796}
                height={2008}
              />
              <Image
                className="z-2 border-border/25 relative rounded-2xl border dark:hidden"
                src="/music-light.png"
                alt="app screen"
                width={2796}
                height={2008}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
