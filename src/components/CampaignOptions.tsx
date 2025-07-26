
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  MonitorSpeaker, 
  Target, 
  Smartphone, 
  Star, 
  MessageCircle, 
  ShoppingBag, 
  Store, 
  Book, 
  Gift 
} from "lucide-react";

const campaignOptions = [
  {
    id: "onsite-banners",
    label: "Mídias no App",
    icon: MonitorSpeaker
  },
  {
    id: "paid-media",
    label: "Paid Media with Custom Audiences",
    icon: Target
  },
  {
    id: "crm",
    label: "CRM (Push, WhatsApp, SMS)",
    icon: Smartphone
  },
  {
    id: "influencers",
    label: "Influencers",
    icon: Star
  },
  {
    id: "social-posts",
    label: "Social Posts",
    icon: MessageCircle
  },
  {
    id: "sponsored-product",
    label: "Sponsored Product",
    icon: ShoppingBag
  },
  {
    id: "offline-activations",
    label: "Offline Activations",
    icon: Store
  },
  {
    id: "out-of-home",
    label: "Out-of-Home (Street clocks, bus shelters, subway)",
    icon: Book
  },
  {
    id: "special-actions",
    label: "Special Actions (Custom bags, etc.)",
    icon: Gift
  }
];

interface CampaignOptionsProps {
  selectedOptions: string[];
  onSelectionChange: (options: string[]) => void;
}

export const CampaignOptions = ({ selectedOptions, onSelectionChange }: CampaignOptionsProps) => {
  const toggleOption = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter(id => id !== optionId)
      : [...selectedOptions, optionId];
    
    onSelectionChange(newSelection);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 justify-items-center">
      {campaignOptions.map((option) => {
        const isSelected = selectedOptions.includes(option.id);
        const IconComponent = option.icon;
        
        return (
          <button
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={cn(
              "w-32 h-36 flex flex-col items-center justify-center space-y-2 rounded-xl transition",
              "border border-gray-200 hover:border-[#0066FF] hover:shadow-md",
              isSelected && "border-[#0066FF] ring-2 ring-[#0066FF]"
            )}
          >
            <IconComponent className="w-8 h-8 stroke-[2] text-gray-800" />
            <span className="text-xs text-gray-500 text-center leading-tight max-w-[9rem] px-2">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
