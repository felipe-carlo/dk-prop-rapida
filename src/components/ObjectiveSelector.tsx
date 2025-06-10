
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {objectives.map((objective, index) => {
        const isSelected = selectedObjective === objective.id;
        const IconComponent = objective.icon;
        
        return (
          <div
            key={objective.id}
            onClick={() => onObjectiveChange(objective.id)}
            className={cn(
              "flex flex-col items-center border-r py-10 relative group/feature cursor-pointer transition-all duration-200",
              "dark:border-neutral-800",
              index === 0 && "border-l dark:border-neutral-800",
              "border-b dark:border-neutral-800",
              isSelected && "bg-blue-50"
            )}
          >
            <div className={cn(
              "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none",
              isSelected && "opacity-20"
            )} />
            
            <div className="mb-4 relative z-10 text-neutral-600 dark:text-neutral-400 flex justify-center">
              <IconComponent 
                size={48} 
                strokeWidth={2}
                className={cn(
                  "text-[#2B2B2B]",
                  isSelected && "text-primary"
                )}
              />
            </div>
            
            <div className="text-lg font-bold mb-2 relative z-10 text-center">
              <span className={cn(
                "group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100 font-inter text-blue-700",
                isSelected && "text-primary translate-x-2"
              )}>
                {objective.label}
              </span>
            </div>
            
            <p className="text-sm text-neutral-600 dark:text-neutral-300 relative z-10 font-inter text-blue-700 text-center">
              {objective.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
