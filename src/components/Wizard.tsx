
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Question } from "@/components/Question";
import { NavButtons } from "@/components/NavButtons";
import { ObjectiveStep } from "@/components/steps/ObjectiveStep";
import { InventoryStep } from "@/components/steps/InventoryStep";
import { BudgetStep } from "@/components/steps/BudgetStep";
import { PeriodStep } from "@/components/steps/PeriodStep";
import { ProductsDetailsStep } from "@/components/steps/ProductsDetailsStep";
import { ContactStep } from "@/components/steps/ContactStep";
import { supabase } from "@/integrations/supabase/client";
import { sendQuoteEmail } from "@/utils/emailService";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export type QuoteRequest = {
  name: string;
  email: string;
  campaign_options: string[];
  budget: number;
  main_objective: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  products: string;
  additional_details: string;
};

export const Wizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<QuoteRequest>({
    name: "",
    email: "",
    campaign_options: [],
    budget: 50000,
    main_objective: "",
    start_month: "",
    start_year: "",
    end_month: "",
    end_year: "",
    products: "",
    additional_details: "",
  });

  const steps = [
    {
      id: 'objetivo',
      label: 'Objetivo',
      question: "Qual é o objetivo principal da sua campanha?",
      component: (
        <ObjectiveStep
          selectedObjective={formData.main_objective}
          onObjectiveChange={(objective) => 
            setFormData({ ...formData, main_objective: objective })
          }
        />
      )
    },
    {
      id: 'inventario',
      label: 'Inventário',
      question: "Quais opções de inventário te interessam?",
      component: (
        <InventoryStep
          selectedOptions={formData.campaign_options}
          onSelectionChange={(options) => 
            setFormData({ ...formData, campaign_options: options })
          }
        />
      )
    },
    {
      id: 'orcamento',
      label: 'Orçamento',
      question: "Qual é o orçamento disponível para a campanha?",
      component: (
        <BudgetStep
          budget={formData.budget}
          onBudgetChange={(budget) => 
            setFormData({ ...formData, budget })
          }
        />
      )
    },
    {
      id: 'periodo',
      label: 'Período',
      question: "Qual o período da campanha?",
      component: (
        <PeriodStep
          startMonth={formData.start_month}
          startYear={formData.start_year}
          endMonth={formData.end_month}
          endYear={formData.end_year}
          onStartMonthChange={(month) => 
            setFormData({ ...formData, start_month: month })
          }
          onStartYearChange={(year) => 
            setFormData({ ...formData, start_year: year })
          }
          onEndMonthChange={(month) => 
            setFormData({ ...formData, end_month: month })
          }
          onEndYearChange={(year) => 
            setFormData({ ...formData, end_year: year })
          }
        />
      )
    },
    {
      id: 'produtos',
      label: 'Produtos & Detalhes',
      question: "Quais produtos deseja incluir na campanha?",
      component: (
        <ProductsDetailsStep
          products={formData.products}
          details={formData.additional_details}
          onProductsChange={(products) => 
            setFormData({ ...formData, products })
          }
          onDetailsChange={(details) => 
            setFormData({ ...formData, additional_details: details })
          }
        />
      )
    },
    {
      id: 'contato',
      label: 'Contato',
      question: "Para finalizarmos, precisamos dos seus dados de contato:",
      component: (
        <ContactStep
          name={formData.name}
          email={formData.email}
          onNameChange={(name) => 
            setFormData({ ...formData, name })
          }
          onEmailChange={(email) => 
            setFormData({ ...formData, email })
          }
        />
      )
    }
  ];

  const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);
  const currentStepId = steps[currentStep].id;

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.main_objective !== "";
      case 1: return formData.campaign_options.length > 0;
      case 2: return formData.budget > 0;
      case 3: return true; // Period is optional
      case 4: return true; // Products and details are optional
      case 5: return formData.name !== "" && formData.email !== "";
      default: return false;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha as informações necessárias para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      console.log("Salvando no Supabase...");
      
      const { data: newLead, error } = await supabase
        .from('quote_requests')
        .insert({
          name: formData.name,
          email: formData.email,
          campaign_options: formData.campaign_options,
          budget: formData.budget,
          main_objective: formData.main_objective,
          start_date: formData.start_month && formData.start_year ? `${formData.start_year}-${formData.start_month}-01` : null,
          end_date: formData.end_month && formData.end_year ? `${formData.end_year}-${formData.end_month}-01` : null,
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

      try {
        console.log("Tentando enviar email...");
        await sendQuoteEmail(newLead);
        console.log("Email enviado com sucesso");
      } catch (emailError) {
        console.error("Erro ao enviar email (mas continuando o processo):", emailError);
      }
      
      navigate("/resumo", { 
        state: { 
          lead: {
            ...newLead,
            objective: formData.main_objective,
            inventory: formData.campaign_options,
            budget: formData.budget,
            startDate: formData.start_month && formData.start_year ? `${formData.start_month}/${formData.start_year}` : "",
            endDate: formData.end_month && formData.end_year ? `${formData.end_month}/${formData.end_year}` : "",
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

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden font-inter">
      {/* Background wave - only on large screens */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 bg-[#0066FF] rounded-tl-[120px] z-[-1]" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Mobile Progress Bar */}
        <div className="md:hidden h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-[#0066FF] transition-all duration-300" 
            style={{width: progressPercentage + '%'}} 
          />
        </div>

        <div className="max-w-5xl mx-auto flex bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden md:flex w-60 bg-[#F8F9FC] flex-col items-center py-12 space-y-12">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <img 
                src="/lovable-uploads/697965a5-aa40-4554-902c-20321af7ad63.png" 
                alt="DAKI Logo" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Progress Circle */}
            <div className="flex flex-col items-center space-y-3">
              <ProgressCircle value={progressPercentage} className="w-24 h-24" />
              <span className="text-sm text-gray-500">{progressPercentage}% preenchido</span>
            </div>
            
            {/* Step indicators */}
            <div className="flex flex-col space-y-3">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-[#0066FF]' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    index === currentStep ? 'text-[#0066FF] font-semibold' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Stage */}
          <div className="flex-1 px-6 py-12 sm:px-10 lg:px-14 lg:py-20 max-w-[100rem] mx-auto relative">
            <div
              className={cn(
                "absolute inset-y-0 right-0 w-1/3 pointer-events-none z-[-1]",
                currentStepId === 'orcamento' && "hidden xl:block"
              )}
              style={{ background: "linear-gradient(135deg,#F7F9FF 0%,transparent 70%)", opacity: 0.15 }}
            />
            
            <div className="max-w-2xl mx-auto relative z-10">
              <div className="flex flex-col items-start gap-8">
                <h2 className="text-2xl font-semibold text-gray-900 text-left">
                  {steps[currentStep].question}
                </h2>
                
                <div className="transition-all duration-300 ease-out w-full">
                  {steps[currentStep].component}
                </div>
              </div>
              
              <NavButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                isLastStep={currentStep === steps.length - 1}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
