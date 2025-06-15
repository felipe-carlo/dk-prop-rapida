
import BudgetSlider from "@/components/ui/BudgetSlider";

interface BudgetStepProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
}

export const BudgetStep = ({ budget, onBudgetChange }: BudgetStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-10 w-full max-w-md mx-auto">
      <div className="w-full space-y-6">
        <BudgetSlider value={budget} setValue={onBudgetChange} />
      </div>
    </div>
  );
};
