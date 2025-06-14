
import { CampaignOptions } from "@/components/CampaignOptions";

interface InventoryStepProps {
  selectedOptions: string[];
  onSelectionChange: (options: string[]) => void;
}

export const InventoryStep = ({ selectedOptions, onSelectionChange }: InventoryStepProps) => {
  return (
    <div className="flex flex-col items-center space-y-10">
      <CampaignOptions
        selectedOptions={selectedOptions}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};
