import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Target,
  Zap,
  BarChart3,
  FileText,
  Download,
  LayoutDashboard,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Our Features
          </h2>
          <p className="mt-4">
            Everything you need to set, track, and achieve your financial goals
            in one powerful platform.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Target className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Multiple Goals</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Manage multiple financial goals simultaneously. Track savings,
                investments, and purchases all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Quick Add</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Add contributions to your goals in seconds. Fast and simple
                updates to keep your progress current.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <BarChart3 className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Visual Reports</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Beautiful charts and graphs to visualize your financial progress
                and see trends over time.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <FileText className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Goal Templates</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Start quickly with pre-made templates for common goals like
                vacation, emergency fund, or home purchase.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Download className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Export Data</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                Export your goals and progress data anytime. Download reports in
                CSV or PDF format.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-zinc-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <LayoutDashboard className="size-6" aria-hidden />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Dashboard</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">
                View all your goals, progress, and achievements in one
                centralized dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
