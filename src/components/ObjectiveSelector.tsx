
import { cn } from "@/lib/utils";
import { Target, Eye, ShoppingCart } from "lucide-react";

const objectives = [
  {
    id: "awareness",
    label: "Awareness",
    description: "Maximizar alcance e conhecimento",
    icon: Eye
  },
  {
    id: "consideracao",
    label: "Consideração",
    description: "Engajar e informar sobre o produto",
    icon: Target
  },
  {
    id: "conversao",
    label: "Conversão",
    description: "Foco em vendas",
    icon: ShoppingCart
  }
];

interface ObjectiveSelectorProps {
  selectedObjective: string;
  onObjectiveChange: (objective: string) => void;
}

export const ObjectiveSelector = ({ selectedObjective, onObjectiveChange }: ObjectiveSelectorProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 justify-items-center">
      {objectives.map((objective) => {
        const isSelected = selectedObjective === objective.id;
        const IconComponent = objective.icon;
        
        return (
          <button
            key={objective.id}
            onClick={() => onObjectiveChange(objective.id)}
            className={cn(
              "w-32 h-36 flex flex-col items-center justify-center space-y-2 rounded-xl transition",
              "border border-gray-200 hover:border-[#0066FF] hover:shadow-md",
              isSelected && "border-[#0066FF] ring-2 ring-[#0066FF]"
            )}
          >
            <IconComponent className="w-8 h-8 stroke-[2] text-gray-800" />
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-900 block">
                {objective.label}
              </span>
              <span className="text-xs text-gray-500 text-center leading-tight max-w-[9rem]">
                {objective.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
