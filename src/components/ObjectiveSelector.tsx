
import { cn } from "@/lib/utils";
import { Target, Eye, ShoppingCart } from "lucide-react";

const objectives = [
  {
    id: "awareness",
    label: "Awareness",
    description: "Maximize reach",
    icon: Eye
  },
  {
    id: "consideration",
    label: "Consideration",
    description: "Engage & inform",
    icon: Target
  },
  {
    id: "conversion",
    label: "Conversion",
    description: "Drive sales now",
    icon: ShoppingCart
  }
];

interface ObjectiveSelectorProps {
  selectedObjective: string;
  onObjectiveChange: (objective: string) => void;
}

export const ObjectiveSelector = ({ selectedObjective, onObjectiveChange }: ObjectiveSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {objectives.map((objective) => {
        const isSelected = selectedObjective === objective.id;
        const IconComponent = objective.icon;
        
        return (
          <button
            key={objective.id}
            onClick={() => onObjectiveChange(objective.id)}
            className={cn(
              "w-32 h-36 flex flex-col items-center justify-center space-y-3 rounded-xl transition",
              "border border-gray-200 hover:border-[#0066FF] hover:shadow-md",
              isSelected && "border-[#0066FF] ring-2 ring-[#0066FF]"
            )}
          >
            <IconComponent className="w-10 h-10 stroke-[2] text-gray-800" />
            <div className="text-center">
              <span className="text-sm font-semibold text-gray-900 block">
                {objective.label}
              </span>
              <span className="text-xs text-gray-600">
                {objective.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
