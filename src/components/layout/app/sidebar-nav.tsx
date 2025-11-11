import { cn, getCompanyName } from "@/lib/utils";
import Link from "next/link";
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

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

export default function SidebarNav() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <div
          className={cn(
            "flex h-14 items-center gap-2",
            isCollapsed ? "justify-center px-0" : "px-6"
          )}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-semibold text-sidebar-foreground">
              {getCompanyName()}
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className={cn("p-4", isCollapsed && "p-2")}>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "rounded-lg",
                        !isCollapsed && "px-3 py-2.5 !h-auto min-h-[2.5rem]",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary hover:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2",
                          isCollapsed && "justify-center"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-0">
        <div className={cn("flex flex-col gap-2", isCollapsed ? "p-2" : "p-4")}>
          {!isCollapsed && <NotificationsPanel />}
          <UserMenu isCollapsed={isCollapsed} />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
