import React from "react";
import NewGoalContainer from "@/components/features/goals/forms/new-goal-container";

export default function NewGoalPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Crear Nueva Meta
        </h1>
        <p className="text-muted-foreground mt-2">
          Define tu próximo objetivo financiero
        </p>
      </div>

      <NewGoalContainer />
    </div>
  );
}
