
import { cn } from "@/lib/utils";

const objectives = [
  {
    id: "awareness",
    label: "Awareness",
    description: "Maximize reach",
    icon: "📢"
  },
  {
    id: "consideration",
    label: "Consideration",
    description: "Engage & inform",
    icon: "🤔"
  },
  {
    id: "conversion",
    label: "Conversion",
    description: "Drive sales now",
    icon: "💰"
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
        
        return (
          <div
            key={objective.id}
            onClick={() => onObjectiveChange(objective.id)}
            className={cn(
              "p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md text-center",
              isSelected
                ? "border-primary bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-200"
            )}
          >
            <div className="text-4xl mb-3">{objective.icon}</div>
            <h3 className={cn(
              "font-semibold text-lg mb-1 font-inter",
              isSelected ? "text-primary" : "text-gray-900"
            )}>
              {objective.label}
            </h3>
            <p className="text-sm text-gray-600 font-inter">
              {objective.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
