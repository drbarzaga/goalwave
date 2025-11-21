import Groq from "groq-sdk";

// Cache simple en memoria para el consejo del día
let dailyTipCache: {
  date: string;
  tip: { title: string; description: string };
} | null = null;

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

const STATIC_TIPS = [
  {
    title: "Regla 50/30/20",
    description:
      "Destina el 50% de tus ingresos a necesidades básicas, 30% a deseos y gustos, y 20% a ahorros e inversiones. Esta estrategia te ayudará a mantener un balance financiero saludable.",
  },
  {
    title: "Automatiza tus ahorros",
    description:
      "Configura transferencias automáticas hacia tus metas. Pagarte a ti mismo primero es clave para el éxito financiero y elimina la tentación de gastar.",
  },
  {
    title: "Revisa tus gastos regularmente",
    description:
      "Analiza tus reportes mensuales para identificar patrones de gasto y oportunidades de ahorro. El conocimiento es poder cuando se trata de finanzas personales.",
  },
  {
    title: "Crea un fondo de emergencia",
    description:
      "Ahorra al menos 3-6 meses de gastos básicos. Este fondo te protegerá ante imprevistos sin afectar tus metas a largo plazo.",
  },
  {
    title: "Establece metas claras",
    description:
      "Define objetivos específicos con fechas límite y montos concretos. Las metas SMART (Específicas, Medibles, Alcanzables, Relevantes y con Tiempo) son más efectivas.",
  },
  {
    title: "Prioriza tus metas",
    description:
      "No todas las metas son igual de importantes. Enfócate primero en las que tienen mayor impacto en tu bienestar financiero, como el fondo de emergencia.",
  },
];

/**
 * Obtiene un consejo financiero dinámico usando Groq AI
 * Con caché diario para evitar múltiples llamadas
 */
export async function getDailyTip(): Promise<{
  title: string;
  description: string;
}> {
  // Verificar si tenemos un consejo en caché para hoy
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (dailyTipCache?.date === today) {
    console.log("Usando consejo en caché para hoy");
    return dailyTipCache.tip;
  }

  // Obtener cliente de Groq
  const apiKey = process.env.GROQ_API_KEY;
  console.log("API Key presente:", !!apiKey, "Longitud:", apiKey?.length || 0);

  const groqClient = getGroqClient();

  // Si no hay API key, usar consejo estático aleatorio
  if (!groqClient) {
    console.log(
      "No hay API key de Groq configurada, usando consejo estático aleatorio"
    );
    const randomTip =
      STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)];
    dailyTipCache = { date: today, tip: randomTip };
    return randomTip;
  }

  try {
    console.log("Llamando a la API de Groq para obtener consejo dinámico...");
    // Generar consejo con Groq AI
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en finanzas personales. Proporciona consejos prácticos, concisos y motivadores sobre ahorro, inversión y gestión financiera personal. Responde siempre en español.",
        },
        {
          role: "user",
          content:
            'Dame un consejo financiero práctico y motivador para hoy. Debe ser breve (máximo 2 oraciones), específico y accionable. Responde SOLO con un objeto JSON válido con exactamente estas propiedades: {"title": "título del consejo", "description": "descripción del consejo"}. No incluyas texto adicional, solo el JSON.',
        },
      ],
      model: "llama-3.1-8b-instant", // Modelo rápido y gratuito de Groq
      temperature: 0.7,
      max_tokens: 150,
      response_format: {
        type: "json_object",
      },
    });

    const response = completion.choices[0]?.message?.content;
    console.log("Respuesta de Groq recibida:", response);

    if (response) {
      try {
        const parsed = JSON.parse(response) as {
          title?: string;
          description?: string;
        };

        console.log("JSON parseado:", parsed);

        if (parsed.title && parsed.description) {
          console.log("Consejo obtenido exitosamente de Groq:", parsed);
          const tip = {
            title: parsed.title,
            description: parsed.description,
          };
          dailyTipCache = { date: today, tip };
          return tip;
        } else {
          console.warn(
            "Respuesta de Groq no tiene el formato esperado. Título:",
            !!parsed.title,
            "Descripción:",
            !!parsed.description
          );
        }
      } catch (parseError) {
        // Si el JSON no es válido, continuar con fallback
        console.error("Error parseando JSON de Groq:", parseError);
        console.error("Respuesta recibida:", response);
      }
    } else {
      console.warn(
        "No se recibió respuesta de Groq (response es null o undefined)"
      );
    }
  } catch (error) {
    console.error("Error obteniendo consejo de IA de Groq:", error);
    if (error instanceof Error) {
      console.error("Mensaje de error:", error.message);
      console.error("Stack:", error.stack);
    }
    // Continuar con fallback estático
  }

  // Fallback a consejo estático aleatorio
  const randomTip = STATIC_TIPS[Math.floor(Math.random() * STATIC_TIPS.length)];
  dailyTipCache = { date: today, tip: randomTip };
  return randomTip;
}

// Cache para consejos de la página de tips
let tipsCache: {
  date: string;
  tips: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    detailedDescription: string;
    tips: string[];
  }>;
} | null = null;

/**
 * Obtiene múltiples consejos financieros usando Groq AI
 * Con caché diario para evitar múltiples llamadas
 */
export async function getFinancialTips(): Promise<
  Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    detailedDescription: string;
    tips: string[];
  }>
> {
  const today = new Date().toISOString().split("T")[0];

  if (tipsCache?.date === today) {
    console.log("Usando consejos en caché para hoy");
    return tipsCache.tips;
  }

  const groqClient = getGroqClient();

  if (!groqClient) {
    console.log("No hay API key, usando consejos estáticos");
    return STATIC_TIPS.map((tip, index) => {
      const category = getCategoryFromTitle(tip.title);
      const defaultDetails = getDefaultTipDetails(tip.title, category);
      return {
        id: `static-${index + 1}`,
        title: tip.title,
        description: tip.description,
        category,
        detailedDescription: defaultDetails.detailedDescription,
        tips: defaultDetails.tips,
      };
    });
  }

  try {
    console.log("Llamando a Groq para obtener múltiples consejos...");
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en finanzas personales. Proporciona consejos prácticos, concisos y motivadores sobre ahorro, inversión y gestión financiera personal. Responde siempre en español.",
        },
        {
          role: "user",
          content:
            'Genera 6 consejos financieros diferentes y prácticos. Para cada consejo incluye: un título corto, una descripción breve (2-3 oraciones), una descripción detallada (3-4 oraciones que expliquen más profundamente el concepto), y 4 consejos prácticos accionables. Responde SOLO con un objeto JSON válido con esta estructura exacta: {"tips": [{"title": "título", "description": "descripción breve", "detailedDescription": "descripción detallada", "category": "categoría", "tips": ["consejo 1", "consejo 2", "consejo 3", "consejo 4"]}]}. Las categorías pueden ser: Planificación, Ahorro, Análisis, Automatización, Estrategia, Motivación.',
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.8,
      max_tokens: 2000,
      response_format: {
        type: "json_object",
      },
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        const parsed = JSON.parse(response) as {
          tips?: Array<{
            title?: string;
            description?: string;
            detailedDescription?: string;
            category?: string;
            tips?: string[];
          }>;
        };

        if (
          parsed.tips &&
          Array.isArray(parsed.tips) &&
          parsed.tips.length > 0
        ) {
          const tips = parsed.tips
            .filter(
              (t) =>
                t.title &&
                t.description &&
                t.detailedDescription &&
                t.tips &&
                Array.isArray(t.tips) &&
                t.tips.length > 0
            )
            .slice(0, 6)
            .map((t, index) => {
              const category = t.category || getCategoryFromTitle(t.title!);
              // Si falta detailedDescription o tips, usar contenido por defecto
              const defaultDetails = getDefaultTipDetails(t.title!, category);
              return {
                id: `groq-${index + 1}`,
                title: t.title!,
                description: t.description!,
                detailedDescription:
                  t.detailedDescription || defaultDetails.detailedDescription,
                category,
                tips: t.tips!.slice(0, 4),
              };
            });

          if (tips.length > 0) {
            console.log(
              `Consejos con detalles obtenidos exitosamente de Groq: ${tips.length}`
            );
            tipsCache = { date: today, tips };
            return tips;
          }
        }
      } catch (parseError) {
        console.error("Error parseando JSON de consejos:", parseError);
        console.error("Respuesta recibida:", response);
      }
    }
  } catch (error) {
    console.error("Error obteniendo consejos de IA:", error);
  }

  // Fallback a consejos estáticos con detalles por defecto
  const staticTips = STATIC_TIPS.map((tip, index) => {
    const category = getCategoryFromTitle(tip.title);
    const defaultDetails = getDefaultTipDetails(tip.title, category);
    return {
      id: `static-${index + 1}`,
      title: tip.title,
      description: tip.description,
      category,
      detailedDescription: defaultDetails.detailedDescription,
      tips: defaultDetails.tips,
    };
  });
  tipsCache = { date: today, tips: staticTips };
  return staticTips;
}

/**
 * Obtiene detalles completos de un consejo específico usando Groq AI
 */
export async function getTipDetails(
  title: string,
  description: string,
  category: string
): Promise<{
  detailedDescription: string;
  tips: string[];
}> {
  const groqClient = getGroqClient();

  if (!groqClient) {
    // Fallback a contenido por defecto basado en la categoría
    return getDefaultTipDetails(title, category);
  }

  try {
    console.log(`Obteniendo detalles de Groq para: ${title}`);
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en finanzas personales. Proporciona información detallada y consejos prácticos sobre gestión financiera personal. Responde siempre en español.",
        },
        {
          role: "user",
          content: `Basándote en este consejo financiero:
Título: ${title}
Descripción: ${description}
Categoría: ${category}

Proporciona:
1. Una descripción detallada (3-4 oraciones) que explique más profundamente el concepto
2. Una lista de 4 consejos prácticos y accionables relacionados

Responde SOLO con un objeto JSON válido con esta estructura exacta:
{"detailedDescription": "descripción detallada", "tips": ["consejo 1", "consejo 2", "consejo 3", "consejo 4"]}`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 400,
      response_format: {
        type: "json_object",
      },
    });

    const response = completion.choices[0]?.message?.content;
    if (response) {
      try {
        const parsed = JSON.parse(response) as {
          detailedDescription?: string;
          tips?: string[];
        };

        if (
          parsed.detailedDescription &&
          parsed.tips &&
          Array.isArray(parsed.tips)
        ) {
          return {
            detailedDescription: parsed.detailedDescription,
            tips: parsed.tips.slice(0, 4),
          };
        }
      } catch (parseError) {
        console.error("Error parseando detalles de consejo:", parseError);
      }
    }
  } catch (error) {
    console.error("Error obteniendo detalles de consejo:", error);
  }

  // Fallback a contenido por defecto
  return getDefaultTipDetails(title, category);
}

/**
 * Helper para obtener categoría desde el título
 */
function getCategoryFromTitle(title: string): string {
  const titleLower = title.toLowerCase();
  if (titleLower.includes("meta") || titleLower.includes("objetivo")) {
    return "Planificación";
  }
  if (titleLower.includes("ahorro") || titleLower.includes("fondo")) {
    return "Ahorro";
  }
  if (titleLower.includes("gasto") || titleLower.includes("revisa")) {
    return "Análisis";
  }
  if (
    titleLower.includes("automatiza") ||
    titleLower.includes("automatización")
  ) {
    return "Automatización";
  }
  if (titleLower.includes("prioriza") || titleLower.includes("estrategia")) {
    return "Estrategia";
  }
  if (titleLower.includes("celebra") || titleLower.includes("motivación")) {
    return "Motivación";
  }
  return "Planificación";
}

/**
 * Obtiene detalles por defecto basados en la categoría
 */
function getDefaultTipDetails(
  title: string,
  category: string
): { detailedDescription: string; tips: string[] } {
  const defaultDetails: Record<
    string,
    { detailedDescription: string; tips: string[] }
  > = {
    Planificación: {
      detailedDescription:
        "Las metas financieras efectivas siguen el principio SMART: Específicas, Medibles, Alcanzables, Relevantes y con Tiempo definido. Establecer metas claras te ayuda a mantener el enfoque y medir tu progreso.",
      tips: [
        "Escribe tus metas y revísalas regularmente",
        "Divide metas grandes en pasos más pequeños",
        "Establece fechas límite realistas",
        "Celebra cada hito alcanzado",
      ],
    },
    Ahorro: {
      detailedDescription:
        "El ahorro es la base de la libertad financiera. Un fondo de emergencia te protege ante imprevistos y te da tranquilidad para tomar decisiones financieras más informadas.",
      tips: [
        "Comienza con un objetivo pequeño y alcanzable",
        "Automatiza transferencias mensuales",
        "Mantén el fondo separado de tus gastos diarios",
        "Revisa y ajusta el monto anualmente",
      ],
    },
    Análisis: {
      detailedDescription:
        "El conocimiento es poder cuando se trata de finanzas personales. Revisar regularmente tus gastos te permite identificar oportunidades de ahorro y ajustar tu presupuesto.",
      tips: [
        "Revisa tus transacciones semanalmente",
        "Categoriza tus gastos para mejor análisis",
        "Identifica gastos recurrentes innecesarios",
        "Compara mes a mes para ver tendencias",
      ],
    },
    Automatización: {
      detailedDescription:
        "La automatización elimina la tentación de gastar dinero que deberías ahorrar. Al programar transferencias automáticas, te aseguras de que el ahorro sea una prioridad.",
      tips: [
        "Configura transferencias el día que recibes tu pago",
        "Comienza con un porcentaje pequeño (5-10%)",
        "Aumenta gradualmente el monto",
        "Usa cuentas separadas para diferentes metas",
      ],
    },
    Estrategia: {
      detailedDescription:
        "Priorizar tus metas financieras te ayuda a concentrar tus recursos donde más importan. No todas las metas tienen la misma urgencia o impacto en tu bienestar financiero.",
      tips: [
        "Clasifica tus metas por urgencia e importancia",
        "Enfócate en 2-3 metas a la vez",
        "Revisa y ajusta prioridades trimestralmente",
        "No te sientas mal por posponer metas menos críticas",
      ],
    },
    Motivación: {
      detailedDescription:
        "La motivación es crucial para mantener hábitos financieros saludables. Celebrar pequeños logros crea un ciclo positivo de refuerzo que te mantiene comprometido con tus objetivos.",
      tips: [
        "Establece mini-celebraciones en hitos del 25%, 50%, 75%",
        "Comparte tus logros con familiares o amigos",
        "Mantén un registro visual de tu progreso",
        "Recuerda por qué empezaste cuando te sientas desmotivado",
      ],
    },
  };

  return (
    defaultDetails[category] || {
      detailedDescription: `${title} es un concepto importante en finanzas personales. Aplicar este consejo de manera consistente te ayudará a mejorar tu situación financiera a largo plazo.`,
      tips: [
        "Comienza implementando este consejo gradualmente",
        "Establece recordatorios para mantener el hábito",
        "Revisa tu progreso regularmente",
        "Ajusta tu estrategia según tus necesidades",
      ],
    }
  );
}
