
import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  MonitorSpeaker, 
  Bullseye, 
  Smartphone, 
  UserStar, 
  ChatRound, 
  ShoppingBag, 
  Storefront, 
  Book, 
  GiftBox 
} from "lucide-react";

const campaignOptions = [
  {
    id: "onsite-banners",
    label: "Onsite Banners",
    icon: MonitorSpeaker
  },
  {
    id: "paid-media",
    label: "Paid Media with Custom Audiences",
    icon: Bullseye
  },
  {
    id: "crm",
    label: "CRM (Push, WhatsApp, SMS)",
    icon: Smartphone
  },
  {
    id: "influencers",
    label: "Influencers",
    icon: UserStar
  },
  {
    id: "social-posts",
    label: "Social Posts",
    icon: ChatRound
  },
  {
    id: "sponsored-product",
    label: "Sponsored Product",
    icon: ShoppingBag
  },
  {
    id: "offline-activations",
    label: "Offline Activations",
    icon: Storefront
  },
  {
    id: "out-of-home",
    label: "Out-of-Home (Street clocks, bus shelters, subway)",
    icon: Book
  },
  {
    id: "special-actions",
    label: "Special Actions (Custom bags, etc.)",
    icon: GiftBox
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
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-0">
      {campaignOptions.map((option, index) => {
        const isSelected = selectedOptions.includes(option.id);
        const IconComponent = option.icon;
        
        return (
          <div
            key={option.id}
            onClick={() => toggleOption(option.id)}
            className={cn(
              "flex flex-col border-r py-10 relative group/feature cursor-pointer transition-all duration-200",
              "dark:border-neutral-800",
              (index === 0 || index === 3 || index === 6) && "lg:border-l dark:border-neutral-800",
              (index === 0 || index === 1 || index === 2) && "border-b dark:border-neutral-800",
              (index === 3 || index === 4 || index === 5) && "lg:border-b dark:border-neutral-800",
              isSelected && "bg-blue-50"
            )}
          >
            <div className={cn(
              "opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full pointer-events-none",
              index < 3 && "bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent",
              index >= 3 && index < 6 && "bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent",
              index >= 6 && "bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent",
              isSelected && "opacity-20"
            )} />
            
            <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
              <IconComponent 
                size={48} 
                strokeWidth={2}
                className={cn(
                  "text-[#2B2B2B]",
                  isSelected && "text-primary"
                )}
              />
            </div>
            
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
              <div className={cn(
                "absolute left-0 inset-y-0 h-6 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 transition-all duration-200 origin-center",
                "group-hover/feature:h-8 group-hover/feature:bg-blue-500",
                isSelected && "bg-primary h-8"
              )} />
              <span className={cn(
                "group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100 font-medium text-sm font-inter text-blue-700 leading-tight",
                isSelected && "text-primary translate-x-2"
              )}>
                {option.label}
              </span>
            </div>
            
            <div className="relative z-10 px-10">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto",
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
