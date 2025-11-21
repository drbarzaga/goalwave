import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  Info,
  Calendar,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ModeToggle from "@/components/shared/mode-toggle";
import { actions } from "@/actions";
import type { Goal } from "@/types/goals";

export async function SettingsPageContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  const user = session.user;

  // Get user stats
  const goalsResult = await actions.goals.get();
  const goals: Goal[] =
    goalsResult.success &&
    goalsResult.data &&
    typeof goalsResult.data === "object" &&
    "goals" in goalsResult.data &&
    Array.isArray(goalsResult.data.goals)
      ? goalsResult.data.goals
      : [];

  const activeGoals = goals.filter((g) => g.status === "active").length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona tu cuenta y personaliza tu experiencia
        </p>
      </div>

      {/* Account Overview - Hero Section */}
      <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 shrink-0">
                  <AvatarImage
                    src={user.image || undefined}
                    alt={user.name || "Usuario"}
                    onError={(e) => {
                      // Si la imagen falla al cargar, ocultarla para mostrar el fallback
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    {user.name || "Usuario"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Metas activas:
                  </span>
                  <span className="font-semibold">{activeGoals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Completadas:
                  </span>
                  <span className="font-semibold">{completedGoals}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Miembro desde{" "}
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMMM yyyy", {
                          locale: es,
                        })
                      : "recientemente"}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="h-fit">
              <Sparkles className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Perfil</CardTitle>
                <CardDescription className="text-xs">
                  Información personal
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nombre
              </Label>
              <Input
                id="name"
                defaultValue={user.name || ""}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                No disponible para edición
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                type="email"
                defaultValue={user.email || ""}
                disabled
                className="bg-muted/50"
              />
              <p className="text-xs text-muted-foreground">
                No disponible para edición
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-500/10 p-2">
                <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Preferencias</CardTitle>
                <CardDescription className="text-xs">
                  Personaliza tu experiencia
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium">Tema</Label>
                <p className="text-xs text-muted-foreground">
                  Claro, oscuro o automático
                </p>
              </div>
              <ModeToggle />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium">Notificaciones</Label>
                <p className="text-xs text-muted-foreground">
                  Alertas por email
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Próximamente
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium">Recordatorios</Label>
                <p className="text-xs text-muted-foreground">
                  Fechas límite próximas
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Próximamente
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Security */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-red-500/10 p-2">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Seguridad</CardTitle>
              <CardDescription className="text-xs">
                Protege tu cuenta
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium">Cambiar Contraseña</Label>
              <p className="text-xs text-muted-foreground">
                Actualiza tu contraseña de forma segura
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Cambiar
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium">Autenticación 2FA</Label>
              <p className="text-xs text-muted-foreground">
                Añade una capa extra de seguridad
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium">Sesiones Activas</Label>
              <p className="text-xs text-muted-foreground">
                Gestiona tus dispositivos conectados
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              Próximamente
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="border-destructive/50">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-destructive/10 p-2">
              <Info className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">Zona de Peligro</CardTitle>
              <CardDescription className="text-xs">
                Acciones irreversibles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5 flex-1">
              <Label className="text-sm font-medium">Eliminar Cuenta</Label>
              <p className="text-xs text-muted-foreground">
                Elimina permanentemente tu cuenta y todos tus datos. Esta acción
                no se puede deshacer.
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Eliminar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-lg">Acerca de</CardTitle>
              <CardDescription className="text-xs">
                Información de la aplicación
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium">Versión</Label>
            <Badge variant="secondary" className="text-xs">
              1.0.0
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium">Términos de Servicio</Label>
            <Button variant="ghost" size="sm" disabled>
              Ver
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <Label className="text-sm font-medium">
              Política de Privacidad
            </Label>
            <Button variant="ghost" size="sm" disabled>
              Ver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
