
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PeriodStepProps {
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  onStartMonthChange: (month: string) => void;
  onStartYearChange: (year: string) => void;
  onEndMonthChange: (month: string) => void;
  onEndYearChange: (year: string) => void;
}

export const PeriodStep = ({
  startMonth,
  startYear,
  endMonth,
  endYear,
  onStartMonthChange,
  onStartYearChange,
  onEndMonthChange,
  onEndYearChange
}: PeriodStepProps) => {
  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <div className="flex flex-col items-center space-y-10 w-full max-w-md mx-auto">
      <div className="grid gap-6 w-full">
        <div>
          <label className="text-base text-gray-800 font-inter font-medium block mb-2">
            Período de início
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Select value={startMonth} onValueChange={onStartMonthChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={startYear} onValueChange={onStartYearChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="text-base text-gray-800 font-inter font-medium block mb-2">
            Período de término
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Select value={endMonth} onValueChange={onEndMonthChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={endYear} onValueChange={onEndYearChange}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
