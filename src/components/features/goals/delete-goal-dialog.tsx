"use client";

import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { actions } from "@/actions";
import { toast } from "sonner";

interface DeleteGoalDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly goalId: string;
  readonly goalTitle: string;
  readonly onSuccess?: () => void;
}

export function DeleteGoalDialog({
  open,
  onOpenChange,
  goalId,
  goalTitle,
  onSuccess,
}: DeleteGoalDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await actions.goals.delete(goalId);

      if (result.success) {
        toast.success(result.message || "Meta eliminada exitosamente");
        onOpenChange(false);
        onSuccess?.();
        // Navigate to goals page
        startTransition(() => {
          router.push("/goals");
        });
      } else {
        toast.error(result.message || "Error al eliminar la meta");
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Error al eliminar la meta. Por favor intenta de nuevo.");
      console.error("Error deleting goal:", error);
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Eliminar Meta</DialogTitle>
              <DialogDescription className="mt-1">
                Esta acción no se puede deshacer
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            ¿Estás seguro de que deseas eliminar la meta{" "}
            <span className="font-semibold text-foreground">
              &quot;{goalTitle}&quot;
            </span>{" "}
            ? Se eliminarán todos los datos asociados, incluyendo las
            transacciones.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Eliminando..." : "Eliminar Meta"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
