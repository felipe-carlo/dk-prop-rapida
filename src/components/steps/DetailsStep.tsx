
import { Textarea } from "@/components/ui/textarea";

interface DetailsStepProps {
  details: string;
  onDetailsChange: (details: string) => void;
}

export const DetailsStep = ({ details, onDetailsChange }: DetailsStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-lg mx-auto">
      <Textarea
        placeholder="Informações extras sobre sua campanha, público-alvo, regiões específicas..."
        value={details}
        onChange={(e) => onDetailsChange(e.target.value)}
        className="min-h-40 font-inter text-base w-full"
        rows={5}
      />
      <p className="text-sm text-gray-500 font-inter text-center">
        Compartilhe detalhes adicionais que podem nos ajudar a criar uma proposta mais assertiva
      </p>
    </div>
  );
};
