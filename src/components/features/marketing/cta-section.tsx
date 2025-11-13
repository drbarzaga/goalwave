"use client";

import AnimatedCtaButton from "@/components/shared/animated-cta-button";
import { GoalIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function CallToAction() {
  const { data: session } = authClient.useSession();

  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Start Tracking Your Goals
          </h2>
          <p className="mt-4">
            Start building your goals today with our easy-to-use platform.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <AnimatedCtaButton
              href={session ? "/dashboard" : "/signup"}
              text={session ? "Go to Dashboard" : "Start Tracking Goals"}
              icon={<GoalIcon className="relative size-4 mr-2" />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
