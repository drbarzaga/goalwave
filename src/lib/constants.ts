import { GoalCategory } from "@/types/goals";
import {
  Car,
  GraduationCap,
  Heart,
  Stethoscope,
  Laptop,
  Plane,
  TrendingUp,
  Briefcase,
  Home,
  ShoppingBag,
  Gamepad2,
  Dumbbell,
  HeartHandshake,
  Baby,
  Building2,
  Music,
  Camera,
  UtensilsCrossed,
  DollarSign,
} from "lucide-react";

export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 50;

export const GOAL_PRIORITIES_VALUES = ["high", "medium", "low"];
export const GOAL_SAVING_FREQUENCIES_VALUES = [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "custom",
];

export const GOAL_CATEGORIES_VALUES = [
  "emergency",
  "travel",
  "vehicle",
  "tech",
  "education",
  "health",
  "investment",
  "business",
  "home",
  "shopping",
  "entertainment",
  "fitness",
  "wedding",
  "baby",
  "real-estate",
  "music",
  "photography",
  "food",
  "other",
];

export const GOAL_STATUS_VALUES = [
  "active",
  "inactive",
  "completed",
  "cancelled",
];

export const GOAL_TRANSACTION_TYPES_VALUES = ["deposit", "withdrawal"];

export const GOAL_CATEGORIES: GoalCategory[] = [
  {
    value: "emergency",
    label: "Seguridad Financiera",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    value: "travel",
    label: "Viajes",
    icon: Plane,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    value: "vehicle",
    label: "Vehículo",
    icon: Car,
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    value: "tech",
    label: "Tecnología",
    icon: Laptop,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    value: "education",
    label: "Educación",
    icon: GraduationCap,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    value: "health",
    label: "Salud",
    icon: Stethoscope,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    value: "investment",
    label: "Inversiones",
    icon: TrendingUp,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    value: "business",
    label: "Negocio",
    icon: Briefcase,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    value: "home",
    label: "Hogar",
    icon: Home,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    value: "shopping",
    label: "Compras",
    icon: ShoppingBag,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    value: "entertainment",
    label: "Entretenimiento",
    icon: Gamepad2,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    value: "fitness",
    label: "Deportes y Fitness",
    icon: Dumbbell,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    value: "wedding",
    label: "Boda",
    icon: HeartHandshake,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    value: "baby",
    label: "Bebé/Familia",
    icon: Baby,
    color: "text-pink-400",
    bgColor: "bg-pink-400/10",
  },
  {
    value: "real-estate",
    label: "Propiedad",
    icon: Building2,
    color: "text-slate-600",
    bgColor: "bg-slate-600/10",
  },
  {
    value: "music",
    label: "Música",
    icon: Music,
    color: "text-fuchsia-500",
    bgColor: "bg-fuchsia-500/10",
  },
  {
    value: "photography",
    label: "Fotografía",
    icon: Camera,
    color: "text-gray-600",
    bgColor: "bg-gray-600/10",
  },
  {
    value: "food",
    label: "Restaurantes",
    icon: UtensilsCrossed,
    color: "text-orange-600",
    bgColor: "bg-orange-600/10",
  },
  {
    value: "other",
    label: "Otro",
    icon: DollarSign,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
];
