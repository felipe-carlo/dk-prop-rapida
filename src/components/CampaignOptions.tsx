
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  RectangleHorizontal, 
  Target, 
  Smartphone, 
  UserCheck, 
  MessageCircle, 
  ShoppingBag, 
  Store, 
  MonitorSpeaker, 
  Gift 
} from "lucide-react";

const campaignOptions = [
  {
    id: "onsite-banners",
    label: "Onsite Banners",
    icon: RectangleHorizontal
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
    icon: UserCheck
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
    icon: MonitorSpeaker
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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {campaignOptions.map((option) => {
        const isSelected = selectedOptions.includes(option.id);
        const IconComponent = option.icon;
        
        return (
          <div
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={cn(
              "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md text-center",
              isSelected
                ? "border-primary bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-200"
            )}
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 flex items-center justify-center">
                <IconComponent 
                  size={48} 
                  strokeWidth={2}
                  className={cn(
                    "text-[#2B2B2B]",
                    isSelected && "text-primary"
                  )}
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-sm font-inter text-blue-700 leading-tight">
                  {option.label}
                </h3>
              </div>
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-gray-300"
              )}>
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
