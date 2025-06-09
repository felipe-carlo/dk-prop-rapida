
import { useState } from "react";
import { cn } from "@/lib/utils";

const campaignOptions = [
  {
    id: "onsite-banners",
    label: "Onsite Banners",
    icon: "🎯"
  },
  {
    id: "paid-media",
    label: "Paid Media with Custom Audiences",
    icon: "📱"
  },
  {
    id: "crm",
    label: "CRM (Push, WhatsApp, SMS)",
    icon: "💬"
  },
  {
    id: "influencers",
    label: "Influencers",
    icon: "⭐"
  },
  {
    id: "social-posts",
    label: "Social Posts",
    icon: "📸"
  },
  {
    id: "sponsored-product",
    label: "Sponsored Product",
    icon: "🛒"
  },
  {
    id: "offline-activations",
    label: "Offline Activations",
    icon: "🎪"
  },
  {
    id: "out-of-home",
    label: "Out-of-Home (Street clocks, bus shelters, subway)",
    icon: "🚌"
  },
  {
    id: "special-actions",
    label: "Special Actions (Custom bags, etc.)",
    icon: "🎁"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {campaignOptions.map((option) => {
        const isSelected = selectedOptions.includes(option.id);
        
        return (
          <div
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={cn(
              "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md",
              isSelected
                ? "border-primary bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-blue-200"
            )}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl text-black">{option.icon}</div>
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium text-sm font-inter text-blue-700",
                  isSelected ? "text-primary" : "text-blue-700"
                )}>
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
