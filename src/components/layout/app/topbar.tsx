"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { actions } from "@/actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Plus,
  Bell,
  CheckCheck,
  Trash2,
  TrendingUp,
  Target,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import ModeToggle from "@/components/shared/mode-toggle";

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Meta Completada",
    message: "Has alcanzado tu meta de 'Nuevo Laptop'. ¡Felicitaciones!",
    type: "success",
    time: "Hace 2 horas",
    read: false,
  },
  {
    id: "2",
    title: "Recordatorio de Meta",
    message: "Tu meta 'Vacaciones Europa' vence en 15 días. Faltan $1,800.",
    type: "warning",
    time: "Hace 5 horas",
    read: false,
  },
  {
    id: "3",
    title: "Nuevo Consejo Financiero",
    message: "Descubre cómo optimizar tus ahorros con el método 50/30/20.",
    type: "info",
    time: "Hace 1 día",
    read: true,
  },
];

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Target className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Extract goal ID from pathname
  const goalId = useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    const goalIdIndex = paths.findIndex(
      (p, i) =>
        paths[i - 1] === "goals" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          p
        )
    );
    return goalIdIndex !== -1 ? paths[goalIdIndex] : null;
  }, [pathname]);

  // Get goal title from localStorage (synchronously)
  const storedGoalTitle = useMemo(() => {
    if (!goalId || typeof globalThis.window === "undefined") {
      return null;
    }
    return globalThis.window.localStorage.getItem(`goal-title-${goalId}`);
  }, [goalId]);

  const [fetchedGoalTitle, setFetchedGoalTitle] = useState<string | null>(null);

  // Fetch goal title from API if not in localStorage
  useEffect(() => {
    if (!goalId || storedGoalTitle) {
      return;
    }

    actions.goals.getTitle(goalId).then((result) => {
      if (
        result.success &&
        result.data &&
        typeof result.data === "object" &&
        "title" in result.data
      ) {
        const title = result.data.title as string;
        setFetchedGoalTitle(title);
        if (typeof globalThis.window !== "undefined") {
          globalThis.window.localStorage.setItem(`goal-title-${goalId}`, title);
        }
      }
    });
  }, [goalId, storedGoalTitle]);

  // Use stored title if available, otherwise use fetched title
  const goalTitle = storedGoalTitle || fetchedGoalTitle;

  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: Array<{ label: string; href: string }> = [];

    if (pathname === "/" || pathname === "/dashboard") {
      return breadcrumbs;
    }

    if (paths.length > 0) {
      breadcrumbs.push({ label: "Dashboard", href: "/dashboard" });
    }

    const pathMap: Record<string, string> = {
      goals: "Metas",
      new: "Nueva Meta",
      reports: "Reportes",
      budgets: "Presupuestos",
      savings: "Ahorros",
      activity: "Actividad",
      tips: "Consejos",
      settings: "Configuración",
    };

    for (const [index, path] of paths.entries()) {
      const href = "/" + paths.slice(0, index + 1).join("/");
      let label = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);

      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          path
        );
      if (isUUID) {
        // Use goal title if available, otherwise show "Detalles"
        label = goalTitle || "Detalles";
      }

      breadcrumbs.push({ label, href });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  let sidebarLeft: string | number;
  if (isMobile) {
    sidebarLeft = 0;
  } else if (isCollapsed) {
    sidebarLeft = "var(--sidebar-width-icon)";
  } else {
    sidebarLeft = "var(--sidebar-width)";
  }

  return (
    <div
      className="fixed top-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-[left] duration-200 md:transition-[left]"
      style={{
        left: sidebarLeft,
      }}
    >
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />

          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 relative transition-all duration-300 hover:bg-accent/80"
              >
                <Bell
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    unreadCount > 0 && "animate-bell-gentle"
                  )}
                />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-white flex items-center justify-center z-10 shadow-lg animate-pulse">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">Notificaciones</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <div className="flex items-center justify-between mt-4">
                  <SheetTitle>Notificaciones</SheetTitle>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                      <CheckCheck className="mr-2 h-4 w-4" />
                      Marcar todas
                    </Button>
                  )}
                </div>
                <SheetDescription>
                  Tienes {unreadCount} notificaciones sin leer
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 mx-4 space-y-4 overflow-y-auto my-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No tienes notificaciones</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "rounded-lg border p-4 transition-colors hover:bg-accent",
                        !notification.read && "bg-accent/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-semibold">
                              {notification.title}
                            </h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {notification.time}
                            </span>
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCheck className="mr-1 h-3 w-3" />
                                Marcar leído
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>

          <ModeToggle />

          <Button
            onClick={() => router.push("/goals/new")}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Meta
          </Button>
        </div>
      </div>
    </div>
  );
}
