"use client";

import { Goal } from "@/lib/types";

interface GoalFilterProps {
  goals: readonly Goal[];
  active: Goal | "All";
  onChange: (goal: Goal | "All") => void;
}

export default function GoalFilter({ goals, active, onChange }: GoalFilterProps) {
  const options: (Goal | "All")[] = ["All", ...goals];

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`flex h-12 shrink-0 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium transition ${
              isActive
                ? "border-brand bg-brand text-charcoal"
                : "border-border bg-surface text-muted hover:border-brand hover:text-ink"
            }`}
          >
            {option === "All" ? "All Goals" : option}
          </button>
        );
      })}
    </div>
  );
}
