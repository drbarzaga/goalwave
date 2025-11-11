import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";
import {
  Target,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Lightbulb,
  BarChart3,
  Wallet,
  PiggyBank,
} from "lucide-react";
import NotificationsPanel from "./notifications-panel";
import { UserMenu } from "./user-menu";

interface SidebarNavProps {
  isCollapsed: boolean;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Metas",
    href: "/goals",
    icon: Target,
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Presupuestos",
    href: "/budgets",
    icon: Wallet,
  },
  {
    title: "Ahorros",
    href: "/savings",
    icon: PiggyBank,
  },
  {
    title: "Actividad",
    href: "/activity",
    icon: TrendingUp,
  },
  {
    title: "Consejos",
    href: "/tips",
    icon: Lightbulb,
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
  },
];

export default function SidebarNav({ isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary flex-shrink-0">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold text-sidebar-foreground">
              Goalwave
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const linkContent = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!isCollapsed && item.title}
                </Link>
              );

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </TooltipProvider>
        </nav>

        {!isCollapsed && (
          <div className="border-t border-sidebar-border p-4">
            <NotificationsPanel />
          </div>
        )}

        <div className="border-t border-sidebar-border p-4">
          <UserMenu isCollapsed={isCollapsed} />
        </div>
      </div>
    </aside>
  );
}
