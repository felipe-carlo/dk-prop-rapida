
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
          <div
            key={objective.id}
            onClick={() => onObjectiveChange(objective.id)}
            className={cn(
              "p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md hover:opacity-90 text-center",
              isSelected
                ? "border-primary bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-200"
            )}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 flex items-center justify-center">
                <IconComponent 
                  size={48} 
                  strokeWidth={2}
                  className={cn(
                    "text-[#2B2B2B]",
                    isSelected && "text-primary"
                  )}
                />
              </div>
              <h3 className={cn(
                "font-semibold text-lg mb-1 font-inter text-blue-700",
                isSelected ? "text-primary" : "text-blue-700"
              )}>
                {objective.label}
              </h3>
              <p className="text-sm text-blue-700 font-inter">
                {objective.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
