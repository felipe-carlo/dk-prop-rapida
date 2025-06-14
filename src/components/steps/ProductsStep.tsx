
import { Textarea } from "@/components/ui/textarea";

interface ProductsStepProps {
  products: string;
  onProductsChange: (products: string) => void;
}

export const ProductsStep = ({ products, onProductsChange }: ProductsStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-6 w-full max-w-lg mx-auto">
      <Textarea
        placeholder="Ex.: Daki Sabão em Pó 1 kg, Amaciante Daki 2L..."
        value={products}
        onChange={(e) => onProductsChange(e.target.value)}
        className="min-h-32 font-inter text-base w-full"
        rows={4}
      />
      <p className="text-sm text-gray-500 font-inter text-center">
        Liste os produtos que deseja incluir na campanha
      </p>
    </div>
  );
};
