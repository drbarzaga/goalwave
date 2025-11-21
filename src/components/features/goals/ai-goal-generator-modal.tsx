"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Lightbulb, Zap } from "lucide-react";
import { actions } from "@/actions";
import { toast } from "sonner";
import type { GeneratedGoal } from "@/actions/goals";

// Sugerencias de prompts para el usuario
const PROMPT_SUGGESTIONS = [
  "Ahorrar $5,000 para un viaje a Europa en 12 meses",
  "Crear un fondo de emergencia de $10,000 en 6 meses",
  "Ahorrar $2,000 para comprar una nueva laptop en 3 meses",
  "Ahorrar $15,000 para el enganche de una casa en 2 años",
  "Ahorrar $1,500 para renovar el guardarropa en 4 meses",
  "Ahorrar $8,000 para un curso de especialización en 8 meses",
  "Ahorrar $3,000 para celebrar mi cumpleaños en 6 meses",
  "Ahorrar $20,000 para iniciar un negocio en 18 meses",
];

interface AIGoalGeneratorModalProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function AIGoalGeneratorModal({
  open,
  onOpenChange,
}: AIGoalGeneratorModalProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{
    count: number;
    limit: number;
    canGenerate: boolean;
    remaining: number;
  } | null>(null);

  useEffect(() => {
    if (open) {
      // Cargar información del límite cuando se abre el modal
      const loadLimitInfo = async () => {
        const result = await actions.goals.getGoalGenerationLimit();
        if (
          result.success &&
          result.data &&
          typeof result.data === "object" &&
          "count" in result.data &&
          "limit" in result.data &&
          "canGenerate" in result.data &&
          "remaining" in result.data
        ) {
          setLimitInfo(
            result.data as {
              count: number;
              limit: number;
              canGenerate: boolean;
              remaining: number;
            }
          );
        }
      };
      loadLimitInfo();
      setPrompt(""); // Limpiar el prompt al abrir
    }
  }, [open]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Por favor, escribe un prompt para generar la meta");
      return;
    }

    if (!limitInfo?.canGenerate) {
      toast.error(
        `Has alcanzado el límite de ${limitInfo?.limit} metas generadas con IA por día. Intenta mañana.`
      );
      return;
    }

    setIsGenerating(true);
    try {
      const result = await actions.goals.generateGoalFromPrompt(prompt.trim());

      if (
        result.success &&
        result.data &&
        typeof result.data === "object" &&
        "goal" in result.data
      ) {
        const goal = (result.data as { goal: GeneratedGoal }).goal;

        // Crear FormData con los datos generados
        const formData = new FormData();
        formData.append("title", goal.title);
        formData.append("description", goal.description);
        formData.append("category", goal.category);
        formData.append("targetAmount", goal.targetAmount.toString());
        formData.append("currentAmount", goal.currentAmount.toString());
        if (goal.targetDate) {
          formData.append("date", goal.targetDate.toISOString());
        }
        if (goal.priority) {
          formData.append("priority", goal.priority);
        }
        formData.append("savingFrequency", goal.savingFrequency);
        formData.append("reminderEnabled", goal.reminderEnabled ? "on" : "off");

        // Crear la meta usando la acción de crear meta
        const createResult = await actions.goals.create(null, formData);

        if (createResult.success) {
          toast.success("¡Meta creada exitosamente con IA!");
          onOpenChange(false); // Cerrar el modal
          router.push("/goals"); // Redirigir a la página de metas
        } else {
          toast.error(
            createResult.message ||
              "No se pudo crear la meta. Por favor, intenta de nuevo."
          );
        }
      } else {
        toast.error(
          result.message ||
            "No se pudo generar la meta. Intenta con un prompt más específico."
        );
      }
    } catch (error) {
      console.error("Error generando meta:", error);
      toast.error("Error al generar la meta. Por favor, intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Crear Meta con IA</DialogTitle>
                <DialogDescription>
                  Genera una meta completa desde un simple prompt
                </DialogDescription>
              </div>
            </div>
            {limitInfo && (
              <Badge
                variant={limitInfo.canGenerate ? "default" : "secondary"}
                className="text-xs"
              >
                {limitInfo.count}/{limitInfo.limit} hoy
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {limitInfo && limitInfo.remaining > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              <span>
                Te quedan{" "}
                <strong className="text-foreground">
                  {limitInfo.remaining}
                </strong>{" "}
                {limitInfo.remaining === 1 ? "generación" : "generaciones"}{" "}
                gratuitas hoy
              </span>
            </div>
          )}

          {limitInfo && !limitInfo.canGenerate && (
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              Has alcanzado el límite diario de generaciones con IA. Puedes
              crear metas manualmente o esperar hasta mañana.
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              placeholder="Ejemplo: Ahorrar $5,000 para un viaje a Europa en 12 meses"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating || !limitInfo?.canGenerate}
              className="min-h-[100px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Presiona Cmd/Ctrl + Enter para generar
            </p>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || !limitInfo?.canGenerate}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando y creando meta...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar y Crear Meta
              </>
            )}
          </Button>

          {PROMPT_SUGGESTIONS.length > 0 && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Lightbulb className="h-4 w-4" />
                <span>Sugerencias:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.slice(0, 4).map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs h-auto py-1.5 px-3 whitespace-normal text-left"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isGenerating || !limitInfo?.canGenerate}
                    type="button"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
