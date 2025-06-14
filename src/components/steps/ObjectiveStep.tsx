
import { ObjectiveSelector } from "@/components/ObjectiveSelector";

interface ObjectiveStepProps {
  selectedObjective: string;
  onObjectiveChange: (objective: string) => void;
}

export const ObjectiveStep = ({ selectedObjective, onObjectiveChange }: ObjectiveStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-10">
      <ObjectiveSelector
        selectedObjective={selectedObjective}
        onObjectiveChange={onObjectiveChange}
      />
    </div>
  );
};
