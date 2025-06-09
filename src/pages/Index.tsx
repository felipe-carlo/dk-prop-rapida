
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CampaignOptions } from "@/components/CampaignOptions";
import { ObjectiveSelector } from "@/components/ObjectiveSelector";
import { toast } from "@/hooks/use-toast";

export type QuoteRequest = {
  name: string;
  email: string;
  campaign_options: string[];
  budget: number;
  main_objective: string;
  start_date: Date | null;
  end_date: Date | null;
  products: string;
  additional_details: string;
};

const Index = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<QuoteRequest>({
    name: "",
    email: "",
    campaign_options: [],
    budget: 50000,
    main_objective: "",
    start_date: null,
    end_date: null,
    products: "",
    additional_details: "",
  });
  const [budgetOverride, setBudgetOverride] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || formData.campaign_options.length === 0 || !formData.main_objective) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would save to Supabase and trigger email
      console.log("Quote request submitted:", {
        ...formData,
        budget: budgetOverride || formData.budget,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate("/thanks");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualBudget = budgetOverride || formData.budget;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-bold text-white">DAKI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-owners font-bold text-gray-900 mb-4">
            Solicite sua Cotação
          </h1>
          <p className="text-xl text-gray-600 font-inter">
            Receba uma proposta personalizada para sua campanha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="ring-2 ring-[#0066ff] mx-auto max-w-2xl p-6 bg-white rounded-2xl">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-inter font-medium">
                  Nome completo *
                </Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 font-inter"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-inter font-medium">
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 font-inter"
                  required
                />
              </div>
            </div>

            {/* Main Objective */}
            <div className="mb-8">
              <Label className="text-base font-inter font-medium mb-4 block">
                Objetivo Principal *
              </Label>
              <ObjectiveSelector
                selectedObjective={formData.main_objective}
                onObjectiveChange={(objective) => 
                  setFormData({ ...formData, main_objective: objective })
                }
              />
            </div>

            {/* Campaign Options */}
            <div className="mb-8">
              <Label className="text-base font-inter font-medium mb-4 block">
                Opções de Campanha *
              </Label>
              <CampaignOptions
                selectedOptions={formData.campaign_options}
                onSelectionChange={(options) => 
                  setFormData({ ...formData, campaign_options: options })
                }
              />
            </div>

            {/* Budget */}
            <div className="mb-8">
              <Label className="text-base font-inter font-medium mb-4 block">
                Orçamento (BRL)
              </Label>
              <div className="space-y-4">
                <div className="px-4">
                  <Slider
                    value={[formData.budget]}
                    onValueChange={([value]) => {
                      setFormData({ ...formData, budget: value });
                      setBudgetOverride(null);
                    }}
                    max={500000}
                    min={10000}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2 font-inter">
                    <span>R$ 10.000</span>
                    <span>R$ 500.000+</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-semibold text-primary font-inter">
                    R$ {actualBudget.toLocaleString('pt-BR')}
                  </span>
                </div>
                {formData.budget >= 500000 && (
                  <div className="max-w-xs mx-auto">
                    <Label htmlFor="budget-override" className="text-sm font-inter">
                      Orçamento específico (opcional)
                    </Label>
                    <Input
                      id="budget-override"
                      type="number"
                      placeholder="Ex: 750000"
                      value={budgetOverride || ""}
                      onChange={(e) => setBudgetOverride(e.target.value ? Number(e.target.value) : null)}
                      className="mt-1 font-inter"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-8">
              <Label className="text-base font-inter font-medium mb-4 block">
                Período da Campanha
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600 font-inter">Data de início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 font-inter",
                          !formData.start_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.start_date ? format(formData.start_date, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.start_date || undefined}
                        onSelect={(date) => setFormData({ ...formData, start_date: date || null })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm text-gray-600 font-inter">Data de término</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-12 font-inter",
                          !formData.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.end_date ? format(formData.end_date, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.end_date || undefined}
                        onSelect={(date) => setFormData({ ...formData, end_date: date || null })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mb-8">
              <Label htmlFor="products" className="text-base font-inter font-medium mb-2 block">
                Produtos
              </Label>
              <Textarea
                id="products"
                placeholder="Ex.: Daki Sabão em Pó 1 kg..."
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                className="min-h-24 font-inter"
                rows={3}
              />
            </div>

            {/* Additional Details */}
            <div className="mb-8">
              <Label htmlFor="additional_details" className="text-base font-inter font-medium mb-2 block">
                Detalhes Adicionais
              </Label>
              <Textarea
                id="additional_details"
                placeholder="Informações extras sobre sua campanha..."
                value={formData.additional_details}
                onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
                className="min-h-32 font-inter"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-blue-700 transition-colors font-inter"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Solicitar Cotação"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Index;
