import Groq from "groq-sdk";
import { GOAL_CATEGORIES, GOAL_SAVING_FREQUENCIES_VALUES } from "./constants";

// Cache para límite de metas generadas por día por usuario
const dailyGoalGenerationCache = new Map<
  string,
  { date: string; count: number }
>();

// Función para obtener la instancia de Groq (lazy initialization)
function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Groq({
    apiKey,
  });
}

/**
 * Verifica si el usuario puede generar más metas hoy (límite de 5 por día)
 */
export function canGenerateGoalToday(userId: string): boolean {
  const today = new Date().toISOString().split("T")[0];
  const userCache = dailyGoalGenerationCache.get(userId);

  if (!userCache || userCache.date !== today) {
    return true; // Puede generar, es un nuevo día o primera vez
  }

  return userCache.count < 5;
}

/**
 * Incrementa el contador de metas generadas para el usuario hoy
 */
export function incrementGoalGenerationCount(userId: string): void {
  const today = new Date().toISOString().split("T")[0];
  const userCache = dailyGoalGenerationCache.get(userId);

  if (!userCache || userCache.date !== today) {
    dailyGoalGenerationCache.set(userId, { date: today, count: 1 });
  } else {
    dailyGoalGenerationCache.set(userId, {
      date: today,
      count: userCache.count + 1,
    });
  }
}

/**
 * Obtiene el número de metas generadas hoy por el usuario
 */
export function getTodayGoalGenerationCount(userId: string): number {
  const today = new Date().toISOString().split("T")[0];
  const userCache = dailyGoalGenerationCache.get(userId);

  if (!userCache || userCache.date !== today) {
    return 0;
  }

  return userCache.count;
}

/**
 * Genera una meta financiera desde un prompt usando Groq AI
 */
export async function generateGoalFromPrompt(
  prompt: string,
  userId: string
): Promise<{
  title: string;
  description: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  priority?: "high" | "medium" | "low";
  savingFrequency: "daily" | "weekly" | "biweekly" | "monthly" | "custom";
  reminderEnabled: boolean;
}> {
  // Verificar límite diario
  if (!canGenerateGoalToday(userId)) {
    throw new Error(
      "Has alcanzado el límite de 5 metas generadas con IA por día. Intenta mañana o crea la meta manualmente."
    );
  }

  const groqClient = getGroqClient();

  if (!groqClient) {
    throw new Error(
      "El servicio de IA no está disponible. Por favor, crea la meta manualmente."
    );
  }

  try {
    console.log(`Generando meta desde prompt: "${prompt}"`);
    
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en finanzas personales. Ayudas a las personas a crear metas financieras realistas y alcanzables. Responde siempre en español y en formato JSON válido.",
        },
        {
          role: "user",
          content: `Basándote en este prompt del usuario: "${prompt}"

Genera una meta financiera completa y realista. Responde SOLO con un objeto JSON válido con esta estructura exacta:
{
  "title": "título corto y descriptivo de la meta (máximo 100 caracteres)",
  "description": "descripción detallada de la meta (máximo 500 caracteres)",
  "category": "una de estas categorías: ${GOAL_CATEGORIES.map((c) => c.value).join(", ")}",
  "targetAmount": número positivo sin decimales (ejemplo: 5000),
  "currentAmount": número positivo sin decimales, generalmente 0 (ejemplo: 0),
  "targetDate": "fecha en formato YYYY-MM-DD o null si no hay fecha límite",
  "priority": "high" | "medium" | "low" o null,
  "savingFrequency": "daily" | "weekly" | "biweekly" | "monthly" | "custom",
  "reminderEnabled": true o false
}

IMPORTANTE:
- El targetAmount debe ser un número realista basado en el prompt
- Si el prompt menciona una fecha específica, úsala; si no, calcula una fecha razonable o usa null
- La categoría debe ser una de las opciones proporcionadas
- El savingFrequency debe ser apropiado para la meta (mensual es común)
- Responde SOLO con el JSON, sin texto adicional.`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 600,
      response_format: {
        type: "json_object",
      },
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error("No se recibió respuesta de la IA");
    }

    try {
      const parsed = JSON.parse(response) as {
        title?: string;
        description?: string;
        category?: string;
        targetAmount?: number;
        currentAmount?: number;
        targetDate?: string | null;
        priority?: "high" | "medium" | "low" | null;
        savingFrequency?: "daily" | "weekly" | "biweekly" | "monthly" | "custom";
        reminderEnabled?: boolean;
      };

      // Validar campos requeridos
      if (!parsed.title || !parsed.category || !parsed.targetAmount) {
        throw new Error("La respuesta de la IA no contiene todos los campos requeridos");
      }

      // Validar categoría
      const validCategories = GOAL_CATEGORIES.map((c) => c.value);
      if (!validCategories.includes(parsed.category)) {
        parsed.category = "other"; // Fallback a "other"
      }

      // Validar savingFrequency
      const validFrequencies = GOAL_SAVING_FREQUENCIES_VALUES as readonly string[];
      if (!parsed.savingFrequency || !validFrequencies.includes(parsed.savingFrequency)) {
        parsed.savingFrequency = "monthly";
      }

      // Procesar fecha
      let targetDate: Date | undefined = undefined;
      if (parsed.targetDate) {
        const date = new Date(parsed.targetDate);
        if (!Number.isNaN(date.getTime())) {
          targetDate = date;
        }
      }

      // Validar montos
      const targetAmount = Math.max(1, Math.round(parsed.targetAmount || 0));
      const currentAmount = Math.max(0, Math.round(parsed.currentAmount || 0));

      // Incrementar contador
      incrementGoalGenerationCount(userId);

      const result = {
        title: parsed.title.trim(),
        description: (parsed.description || "").trim(),
        category: parsed.category,
        targetAmount,
        currentAmount: Math.min(currentAmount, targetAmount), // No puede exceder el objetivo
        targetDate,
        priority: parsed.priority || undefined,
        savingFrequency: parsed.savingFrequency,
        reminderEnabled: parsed.reminderEnabled ?? true,
      };

      console.log("Meta generada exitosamente:", result);
      return result;
    } catch (parseError) {
      console.error("Error parseando respuesta de IA:", parseError);
      console.error("Respuesta recibida:", response);
      throw new Error("Error al procesar la respuesta de la IA. Intenta con un prompt más específico.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("límite")) {
      throw error; // Re-lanzar errores de límite
    }
    console.error("Error generando meta con IA:", error);
    throw new Error(
      "No se pudo generar la meta con IA. Por favor, intenta con un prompt más específico o crea la meta manualmente."
    );
  }
}

/**
 * Genera sugerencias de prompts para el usuario
 */
export function getPromptSuggestions(): string[] {
  return [
    "Ahorrar $5,000 para un viaje a Europa en 12 meses",
    "Crear un fondo de emergencia de $10,000 en 6 meses",
    "Ahorrar $2,000 para comprar una nueva laptop en 3 meses",
    "Ahorrar $15,000 para el enganche de una casa en 2 años",
    "Ahorrar $1,500 para renovar el guardarropa en 4 meses",
    "Ahorrar $8,000 para un curso de especialización en 8 meses",
    "Ahorrar $3,000 para celebrar mi cumpleaños en 6 meses",
    "Ahorrar $20,000 para iniciar un negocio en 18 meses",
  ];
}

