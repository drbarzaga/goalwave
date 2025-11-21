"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Sparkles, FileEdit } from "lucide-react";
import AIGoalGeneratorModal from "./ai-goal-generator-modal";

export default function CreateGoalButton() {
  const router = useRouter();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleCreateNormal = () => {
    router.push("/goals/new");
  };

  const handleCreateWithAI = () => {
    setIsAIModalOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Nueva Meta
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleCreateNormal} className="cursor-pointer">
            <FileEdit className="mr-2 h-4 w-4" />
            <span>Crear Manualmente</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCreateWithAI} className="cursor-pointer">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>Crear con IA</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AIGoalGeneratorModal
        open={isAIModalOpen}
        onOpenChange={setIsAIModalOpen}
      />
    </>
  );
}

