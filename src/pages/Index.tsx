
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
import { supabase } from "@/integrations/supabase/client";
import { sendQuoteEmail } from "@/utils/emailService";

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
      const finalBudget = budgetOverride || formData.budget;
      
      console.log("Salvando no Supabase...");
      // Insert into Supabase
      const { data: newLead, error } = await supabase
        .from('quote_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          campaign_options: formData.campaign_options,
          budget: finalBudget,
          main_objective: formData.main_objective,
          start_date: formData.start_date ? formData.start_date.toISOString().split('T')[0] : null,
          end_date: formData.end_date ? formData.end_date.toISOString().split('T')[0] : null,
          products: formData.products || null,
          additional_details: formData.additional_details || null,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro do Supabase:", error);
        throw error;
      }

      console.log("Dados salvos no Supabase:", newLead);

      // Try to send email, but don't fail the whole process if it fails
      try {
        console.log("Tentando enviar email...");
        await sendQuoteEmail(newLead);
        console.log("Email enviado com sucesso");
      } catch (emailError) {
        console.error("Erro ao enviar email (mas continuando o processo):", emailError);
        // Show warning but don't block the process
        toast({
          title: "Cotação salva",
          description: "Sua cotação foi salva com sucesso, mas houve um problema no envio do email.",
          variant: "default",
        });
      }
      
      // Navigate to summary page with lead data
      navigate("/resumo", { 
        state: { 
          lead: {
            ...newLead,
            objective: formData.main_objective,
            inventory: formData.campaign_options,
            budget: finalBudget,
            startDate: formData.start_date ? format(formData.start_date, "dd/MM/yyyy") : "",
            endDate: formData.end_date ? format(formData.end_date, "dd/MM/yyyy") : "",
            notes: formData.additional_details
          }
        }
      });
    } catch (error) {
      console.error("Erro geral:", error);
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
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
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

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 sm:p-10 space-y-8">
          {/* Main Objective */}
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label className="text-2xl font-bold text-black font-semibold mb-2 block underline">
                Objetivo Principal
              </Label>
              <p className="text-gray-600 font-inter">
                Selecione abaixo qual o objetivo primário da sua campanha
              </p>
            </div>
            <ObjectiveSelector
              selectedObjective={formData.main_objective}
              onObjectiveChange={(objective) => 
                setFormData({ ...formData, main_objective: objective })
              }
            />
          </div>

          {/* Campaign Options */}
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label className="text-2xl font-bold text-black font-semibold mb-2 block underline">
                Opções de Campanha
              </Label>
              <p className="text-gray-600 font-inter">
                Selecione abaixo quantas desejar
              </p>
            </div>
            <CampaignOptions
              selectedOptions={formData.campaign_options}
              onSelectionChange={(options) => 
                setFormData({ ...formData, campaign_options: options })
              }
            />
          </div>

          {/* Budget */}
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label className="text-2xl font-bold text-gray-800 mb-4 block">
                Orçamento (BRL)
              </Label>
            </div>
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
                  <Label htmlFor="budget-override" className="text-base text-gray-800">
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
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label className="text-2xl font-bold text-gray-800 mb-4 block">
                Período da Campanha
              </Label>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base text-gray-800 font-inter">Data de início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 font-inter transition-opacity hover:opacity-90",
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
                <Label className="text-base text-gray-800 font-inter">Data de término</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 font-inter transition-opacity hover:opacity-90",
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
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label htmlFor="products" className="text-2xl font-bold text-gray-800 mb-2 block">
                Produtos
              </Label>
            </div>
            <Textarea
              id="products"
              placeholder="Ex.: Daki Sabão em Pó 1 kg..."
              value={formData.products}
              onChange={(e) => setFormData({ ...formData, products: e.target.value })}
              className="min-h-24 font-inter text-base"
              rows={3}
            />
          </div>

          {/* Additional Details */}
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label htmlFor="additional_details" className="text-2xl font-bold text-gray-800 mb-2 block">
                Detalhes Adicionais
              </Label>
            </div>
            <Textarea
              id="additional_details"
              placeholder="Informações extras sobre sua campanha..."
              value={formData.additional_details}
              onChange={(e) => setFormData({ ...formData, additional_details: e.target.value })}
              className="min-h-32 font-inter text-base"
              rows={4}
            />
          </div>

          {/* Contact Block */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-4">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <Label className="text-2xl font-bold text-gray-800 mb-4 block">
                Informações de Contato
              </Label>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-inter font-medium text-gray-800">
                  Nome completo
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
                <Label htmlFor="email" className="text-base font-inter font-medium text-gray-800">
                  Email
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
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-blue-700 transition-opacity hover:opacity-90 font-inter"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Solicitar Cotação"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;
