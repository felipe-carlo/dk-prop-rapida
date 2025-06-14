
import { Textarea } from "@/components/ui/textarea";

interface ProductsDetailsStepProps {
  products: string;
  details: string;
  onProductsChange: (products: string) => void;
  onDetailsChange: (details: string) => void;
}

export const ProductsDetailsStep = ({ 
  products, 
  details, 
  onProductsChange, 
  onDetailsChange 
}: ProductsDetailsStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-8 w-full max-w-lg mx-auto">
      <div className="w-full space-y-2">
        <label className="text-base font-semibold text-gray-800 block">
          Produtos da campanha
        </label>
        <Textarea
          placeholder="Ex.: Daki Sabão em Pó 1 kg, Amaciante Daki 2L..."
          value={products}
          onChange={(e) => onProductsChange(e.target.value)}
          className="min-h-32 text-base w-full"
          rows={4}
        />
        <p className="text-sm text-gray-500 text-left">
          Liste os produtos que deseja incluir na campanha
        </p>
      </div>

      <div className="w-full space-y-2">
        <label className="text-base font-semibold text-gray-800 block">
          Detalhes adicionais (opcional)
        </label>
        <Textarea
          placeholder="Informações extras sobre sua campanha, público-alvo, regiões específicas..."
          value={details}
          onChange={(e) => onDetailsChange(e.target.value)}
          className="min-h-32 text-base w-full"
          rows={4}
        />
        <p className="text-sm text-gray-500 text-left">
          Compartilhe detalhes adicionais que podem nos ajudar a criar uma proposta mais assertiva
        </p>
      </div>
    </div>
  );
};
