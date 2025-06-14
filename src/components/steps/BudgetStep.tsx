
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetStepProps {
  budget: number;
  onBudgetChange: (budget: number) => void;
}

export const BudgetStep = ({ budget, onBudgetChange }: BudgetStepProps) => {
  const [budgetOverride, setBudgetOverride] = useState<number | null>(null);
  
  const actualBudget = budgetOverride || budget;

  return (
    <div className="flex flex-col items-center space-y-10 w-full max-w-md mx-auto">
      <div className="w-full space-y-6">
        <div className="px-4">
          <Slider
            value={[budget]}
            onValueChange={([value]) => {
              onBudgetChange(value);
              setBudgetOverride(null);
            }}
            max={500000}
            min={10000}
            step={5000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2 font-inter">
            <span>R$ 10.000</span>
            <span>R$ 500.000+</span>
          </div>
        </div>
        <div className="text-center">
          <span className="text-3xl font-bold text-[#0066FF] font-inter">
            R$ {actualBudget.toLocaleString('pt-BR')}
          </span>
        </div>
        {budget >= 500000 && (
          <div className="max-w-xs mx-auto">
            <Label htmlFor="budget-override" className="text-base text-gray-800 font-inter">
              Orçamento específico (opcional)
            </Label>
            <Input
              id="budget-override"
              type="number"
              placeholder="Ex: 750000"
              value={budgetOverride || ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setBudgetOverride(value);
                if (value) onBudgetChange(value);
              }}
              className="mt-2 font-inter"
            />
          </div>
        )}
      </div>
    </div>
  );
};
