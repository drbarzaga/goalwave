"use client";

import React, { useState } from "react";
import {
  Target,
  AlertCircle,
  TrendingUp,
  Bell,
  CheckCheck,
  Trash2,
  BellOff,
} from "lucide-react";
import { Notification } from "@/types/notification";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  {
    id: "4",
    title: "Nuevo Consejo Financiero",
    message: "Descubre cómo optimizar tus ahorros con el método 50/30/20.",
    type: "info",
    time: "Hace 1 día",
    read: true,
  },
  {
    id: "5",
    title: "Nuevo Consejo Financiero",
    message: "Descubre cómo optimizar tus ahorros con el método 50/30/20.",
    type: "info",
    time: "Hace 1 día",
    read: true,
  },
  {
    id: "6",
    title: "Nuevo Consejo Financiero",
    message: "Descubre cómo optimizar tus ahorros con el método 50/30/20.",
    type: "info",
    time: "Hace 1 día",
    read: true,
  },
  {
    id: "7",
    title: "Nuevo Consejo Financiero",
    message: "Descubre cómo optimizar tus ahorros con el método 50/30/20.",
    type: "info",
    time: "Hace 1 día",
    read: true,
  },
  {
    id: "8",
    title: "Nuevo Consejo Financiero",
    message: "Descubre cómo optimizar tus ahorros con el método 50/30/20.",
    type: "info",
    time: "Hace 1 día",
    read: true,
  },
];

export default function NotificationsPanel() {
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          {unreadCount > 0 ? (
            <Bell className="h-5 w-5" />
          ) : (
            <BellOff className="h-5 w-5" />
          )}
          Notificaciones
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadCount}
            </Badge>
          )}
        </button>
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

        <div className="mx-4 space-y-4 overflow-y-auto my-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                  <div className="mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold">
                        {notification.title}
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => deleteNotification(notification.id)}
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
  );
}
