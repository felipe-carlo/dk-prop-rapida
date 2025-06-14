
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export const NavButtons = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isLastStep = false,
  isSubmitting = false
}: NavButtonsProps) => {
  return (
    <div className="flex justify-between items-center w-full max-w-md mx-auto mt-12">
      {currentStep > 0 ? (
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2 font-inter"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </Button>
      ) : (
        <div />
      )}
      
      <Button
        onClick={onNext}
        disabled={isSubmitting}
        className="bg-[#0066FF] hover:bg-blue-700 text-white flex items-center gap-2 font-inter px-8"
      >
        {isLastStep ? (isSubmitting ? "Enviando..." : "Enviar") : "Próximo"}
        {!isLastStep && <ArrowRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};
