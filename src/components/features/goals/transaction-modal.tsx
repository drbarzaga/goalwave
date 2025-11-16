"use client";

import {
  useState,
  useEffect,
  startTransition,
  useActionState,
  useCallback,
  useRef,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Minus } from "lucide-react";
import { actions } from "@/actions";
import { transactionFormSchema } from "@/lib/validations/goals";
import { toast } from "sonner";
import type { z } from "zod";
import type { ActionResult } from "@/types/core";

type TransactionFormData = z.infer<typeof transactionFormSchema>;

const INITIAL_STATE: ActionResult<{ transactionId: string }> = {
  success: false,
  data: { transactionId: "" },
};

interface TransactionModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly goalId: string;
  readonly currentAmount: number;
  readonly onSuccess?: () => void;
}

export function TransactionModal({
  open,
  onOpenChange,
  goalId,
  currentAmount,
  onSuccess,
}: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<
    "deposit" | "withdrawal"
  >("deposit");

  // Check if withdrawal is allowed (must have funds available)
  const canWithdraw = currentAmount > 0;

  const [formState, formAction, isPending] = useActionState(
    actions.goals.createTransactionForm,
    INITIAL_STATE
  );

  // Track if modal is in a "clean" state (just opened, no actions taken yet)
  const [isCleanState, setIsCleanState] = useState(true);
  // Track last processed message to avoid showing duplicate toasts
  const lastProcessedMessageRef = useRef<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
    reset,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    mode: "onBlur",
    defaultValues: {
      type: "deposit",
      amount: "",
      description: "",
    },
  });

  // Reset form state when modal opens
  useEffect(() => {
    if (open) {
      // Reset form to initial state
      reset({
        type: "deposit",
        amount: "",
        description: "",
      });
      startTransition(() => {
        setTransactionType("deposit");
        setIsCleanState(true);
      });
      // Reset the last processed message ref to avoid showing stale messages
      lastProcessedMessageRef.current = undefined;
    } else {
      // When modal closes, mark as clean for next open
      startTransition(() => {
        setIsCleanState(true);
      });
    }
  }, [open, reset]);

  // Ensure transaction type is "deposit" if no funds available when modal opens
  useEffect(() => {
    if (open && !canWithdraw && transactionType === "withdrawal") {
      startTransition(() => {
        setTransactionType("deposit");
        setValue("type", "deposit");
      });
    }
  }, [open, canWithdraw, transactionType, setValue]);

  // Reset form when modal closes
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        reset({
          type: "deposit",
          amount: "",
          description: "",
        });
        setTransactionType("deposit");
      }
      onOpenChange(newOpen);
    },
    [reset, onOpenChange]
  );

  // Sync transactionType state with form value
  useEffect(() => {
    setValue("type", transactionType);
  }, [transactionType, setValue]);

  // Handle server errors (only show if modal is open, not in clean state, and message changed)
  useEffect(() => {
    if (
      open &&
      !isCleanState &&
      formState.message &&
      !formState.success &&
      formState.message !== lastProcessedMessageRef.current
    ) {
      toast.error(formState.message);
      lastProcessedMessageRef.current = formState.message;
    }
  }, [open, isCleanState, formState]);

  // Handle success (only show if not in clean state and this is a new success state)
  useEffect(() => {
    if (
      !isCleanState &&
      formState.success &&
      formState.message &&
      formState.message !== lastProcessedMessageRef.current
    ) {
      const successMessage =
        transactionType === "deposit"
          ? "Fondos agregados exitosamente"
          : "Fondos retirados exitosamente";
      toast.success(successMessage);
      lastProcessedMessageRef.current = formState.message;
      // Close modal (handleOpenChange will reset form and transaction type)
      startTransition(() => {
        handleOpenChange(false);
        onSuccess?.();
      });
    }
  }, [isCleanState, formState, transactionType, handleOpenChange, onSuccess]);

  const onSubmit = useCallback(
    (data: TransactionFormData) => {
      // Mark modal as no longer in clean state (action is being taken)
      setIsCleanState(false);

      const formData = new FormData();
      formData.append("goalId", goalId);
      formData.append("type", data.type);
      formData.append("amount", data.amount);
      if (data.description) {
        formData.append("description", data.description);
      }

      startTransition(() => {
        formAction(formData);
      });
    },
    [goalId, formAction]
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {transactionType === "deposit"
              ? "Agregar Fondos"
              : "Retirar Fondos"}
          </DialogTitle>
          <DialogDescription>
            {transactionType === "deposit"
              ? "Agrega fondos a esta meta de ahorro"
              : "Retira fondos de esta meta de ahorro"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4 py-4">
            <Tabs
              value={transactionType}
              onValueChange={(value) => {
                const newType = value as "deposit" | "withdrawal";
                // Prevent switching to withdrawal if no funds available
                if (newType === "withdrawal" && !canWithdraw) {
                  return;
                }
                setTransactionType(newType);
                setValue("type", newType);
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="deposit" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Depósito
                </TabsTrigger>
                <TabsTrigger
                  value="withdrawal"
                  className="gap-2"
                  disabled={!canWithdraw}
                  title={
                    canWithdraw
                      ? undefined
                      : "No hay fondos disponibles para retirar"
                  }
                >
                  <Minus className="w-4 h-4" />
                  Retiro
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {!canWithdraw && transactionType === "withdrawal" && (
              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                No puedes retirar fondos porque no hay monto ahorrado en esta
                meta. Primero debes agregar fondos.
              </div>
            )}

            <input type="hidden" {...register("type")} />

            <Field>
              <FieldLabel htmlFor="amount">
                Monto{" "}
                {transactionType === "deposit" ? "a agregar" : "a retirar"}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    disabled={isPending}
                    {...register("amount")}
                    aria-invalid={!!clientErrors.amount}
                  />
                </div>
                <FieldError>
                  {clientErrors.amount?.message ||
                    formState.fieldErrors?.amount?.[0]?.toString()}
                </FieldError>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">
                Descripción (opcional)
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id="description"
                  placeholder="Ej: Aporte mensual, Pago de factura, etc."
                  rows={3}
                  disabled={isPending}
                  {...register("description")}
                  aria-invalid={!!clientErrors.description}
                />
                <FieldError>
                  {clientErrors.description?.message ||
                    formState.fieldErrors?.description?.[0]?.toString()}
                </FieldError>
              </FieldContent>
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isPending || (transactionType === "withdrawal" && !canWithdraw)
              }
            >
              {(() => {
                if (isPending) return "Procesando...";
                return transactionType === "deposit"
                  ? "Agregar Fondos"
                  : "Retirar Fondos";
              })()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
