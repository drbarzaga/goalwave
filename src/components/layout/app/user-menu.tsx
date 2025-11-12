"use client";

import {
  User,
  LogOut,
  Settings,
  CreditCard,
  Moon,
  Sun,
  Monitor,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserMenuProps {
  isCollapsed?: boolean;
}

// Función helper para obtener iniciales del nombre
function getInitials(name: string | null | undefined): string {
  if (!name) return "U";

  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const { setTheme } = useTheme();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userName = user?.name || "Usuario";
  const userEmail = user?.email || "";
  const userImage = user?.image || null;
  const initials = getInitials(userName);

  // Debug: verificar qué datos tenemos
  if (user && process.env.NODE_ENV === "development") {
    console.log("User data:", {
      name: userName,
      email: userEmail,
      image: userImage,
    });
  }

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.success("Sesión cerrada correctamente");
      router.push("/");
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("Sign out error:", error);
    }
  };

  if (isPending) {
    return (
      <div
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5",
          isCollapsed && "justify-center"
        )}
      >
        <div className="h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-1 flex-col items-start text-left">
            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-32 bg-muted rounded animate-pulse mt-1" />
          </div>
        )}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isCollapsed && "justify-center"
        )}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage
            src={userImage || undefined}
            alt={userName}
            onError={(e) => {
              // Si la imagen falla al cargar, ocultarla para mostrar el fallback
              e.currentTarget.style.display = "none";
            }}
          />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex flex-1 flex-col items-start text-left min-w-0">
            <span className="text-sm font-medium truncate w-full">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {userEmail}
            </span>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="right">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            Suscripción
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 h-4 w-4" />
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              Claro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              Oscuro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Monitor className="mr-2 h-4 w-4" />
              Sistema
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
