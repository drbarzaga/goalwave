"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2, Settings2, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { actions } from "@/actions";
import { toast } from "sonner";

interface GoalActionsCardProps {
  readonly goalId: string;
  readonly status: string;
  readonly currentAmount: number;
  readonly targetAmount: number;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export function GoalActionsCard({
  goalId,
  status,
  currentAmount,
  targetAmount,
  onEdit,
  onDelete,
}: GoalActionsCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const canComplete =
    status === "active" && currentAmount >= targetAmount && targetAmount > 0;

  const handleMarkAsCompleted = () => {
    startTransition(async () => {
      const result = await actions.goals.markAsCompleted(goalId);

      if (result.success) {
        toast.success("🎉 ¡Increíble! Has alcanzado tu meta", {
          description: "Tu dedicación y esfuerzo han dado frutos. ¡Sigue así!",
          duration: 5000,
        });
        router.refresh();
      } else {
        toast.error(result.message || "Error al completar la meta");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
            <Settings2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold leading-tight">
              Acciones
            </CardTitle>
            <CardDescription className="text-xs mt-0.5 leading-tight">
              Gestiona tu meta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        {canComplete && (
          <>
            <Button
              onClick={handleMarkAsCompleted}
              disabled={isPending}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2.5 h-auto py-2.5 px-3",
                "hover:bg-emerald-50 dark:hover:bg-emerald-950/20",
                "transition-all duration-200",
                "group border border-transparent hover:border-emerald-200 dark:hover:border-emerald-900/50",
                "hover:shadow-sm"
              )}
            >
              <div className="shrink-0 w-8 h-8 rounded-md bg-linear-to-br from-emerald-500/15 to-emerald-500/5 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/30 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                  Marcar como Completada
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  Confirma que alcanzaste tu meta
                </div>
              </div>
            </Button>

            <Separator className="my-1" />
          </>
        )}

        <Button
          onClick={onEdit}
          variant="ghost"
          disabled={status === "completed"}
          title={
            status === "completed"
              ? "Esta meta está completada y no se puede editar"
              : undefined
          }
          className={cn(
            "w-full justify-start gap-2.5 h-auto py-2.5 px-3",
            "hover:bg-blue-50 dark:hover:bg-blue-950/20",
            "transition-all duration-200",
            "group border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50",
            "hover:shadow-sm",
            status === "completed" && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="shrink-0 w-8 h-8 rounded-md bg-linear-to-br from-blue-500/15 to-blue-500/5 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30 group-hover:scale-105 transition-transform">
            <Pencil className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              Editar Meta
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              Modifica los detalles
            </div>
          </div>
        </Button>

        <Separator className="my-1" />

        <Button
          onClick={onDelete}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2.5 h-auto py-2.5 px-3",
            "hover:bg-red-50 dark:hover:bg-red-950/20",
            "transition-all duration-200",
            "group border border-transparent hover:border-red-200 dark:hover:border-red-900/50",
            "hover:shadow-sm"
          )}
        >
          <div className="shrink-0 w-8 h-8 rounded-md bg-linear-to-br from-red-500/15 to-red-500/5 flex items-center justify-center border border-red-200/50 dark:border-red-800/30 group-hover:scale-105 transition-transform">
            <Trash2 className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold text-destructive group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
              Eliminar Meta
            </div>
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              Esta acción no se puede deshacer
            </div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );
}
