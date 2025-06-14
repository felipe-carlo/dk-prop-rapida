
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Question } from "@/components/Question";
import { NavButtons } from "@/components/NavButtons";
import { ObjectiveStep } from "@/components/steps/ObjectiveStep";
import { InventoryStep } from "@/components/steps/InventoryStep";
import { BudgetStep } from "@/components/steps/BudgetStep";
import { PeriodStep } from "@/components/steps/PeriodStep";
import { ProductsStep } from "@/components/steps/ProductsStep";
import { DetailsStep } from "@/components/steps/DetailsStep";
import { ContactStep } from "@/components/steps/ContactStep";
import { supabase } from "@/integrations/supabase/client";
import { sendQuoteEmail } from "@/utils/emailService";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

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
    start_date: null,
    end_date: null,
    products: "",
    additional_details: "",
  });

  const steps = [
    {
      label: "Qual é o objetivo principal da sua campanha?",
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
      label: "Quais opções de inventário te interessam?",
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
      label: "Qual é o orçamento disponível para a campanha?",
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
      label: "Qual o período da campanha?",
      component: (
        <PeriodStep
          startDate={formData.start_date}
          endDate={formData.end_date}
          onStartDateChange={(date) => 
            setFormData({ ...formData, start_date: date })
          }
          onEndDateChange={(date) => 
            setFormData({ ...formData, end_date: date })
          }
        />
      )
    },
    {
      label: "Quais produtos deseja incluir na campanha?",
      component: (
        <ProductsStep
          products={formData.products}
          onProductsChange={(products) => 
            setFormData({ ...formData, products })
          }
        />
      )
    },
    {
      label: "Algum detalhe adicional sobre a campanha?",
      component: (
        <DetailsStep
          details={formData.additional_details}
          onDetailsChange={(details) => 
            setFormData({ ...formData, additional_details: details })
          }
        />
      )
    },
    {
      label: "Para finalizarmos, precisamos dos seus dados de contato:",
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

  const canProceed = () => {
    switch (currentStep) {
      case 0: return formData.main_objective !== "";
      case 1: return formData.campaign_options.length > 0;
      case 2: return formData.budget > 0;
      case 3: return true; // Period is optional
      case 4: return true; // Products is optional
      case 5: return true; // Details is optional
      case 6: return formData.name !== "" && formData.email !== "";
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

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Background wave - only on large screens */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/2 bg-[#0066FF] rounded-tl-[120px] z-[-1]" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto flex bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
          {/* Sidebar */}
          <div className="w-60 bg-[#F8F9FC] flex flex-col items-center py-12 space-y-12">
            {/* Logo */}
            <div className="w-16 h-16 bg-[#0066FF] rounded-2xl flex items-center justify-center">
              <span className="text-lg font-bold text-white font-owners">DAKI</span>
            </div>
            
            {/* Progress Circle */}
            <div className="flex flex-col items-center space-y-3">
              <ProgressCircle value={progressPercentage} className="w-24 h-24" />
              <span className="text-sm text-gray-500 font-inter">{progressPercentage}% preenchido</span>
            </div>
            
            {/* Step indicators */}
            <div className="flex flex-col space-y-3">
              {steps.map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-[#0066FF]' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm font-inter ${
                    index === currentStep ? 'text-[#0066FF] font-semibold' : 'text-gray-500'
                  }`}>
                    Etapa {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Main Stage */}
          <div className="flex-1 relative px-16 py-20">
            <div className="max-w-2xl mx-auto">
              <Question>{steps[currentStep].label}</Question>
              
              <div className="transition-all duration-300 ease-out">
                {steps[currentStep].component}
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
