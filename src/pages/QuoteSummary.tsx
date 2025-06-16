
import { useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";

interface FieldProps {
  label: string;
  value: string;
  className?: string;
}

const Field = ({ label, value, className = "" }: FieldProps) => (
  <div className={`space-y-1 ${className}`}>
    <Label className="text-sm font-medium text-gray-500">{label}</Label>
    <p className="text-base text-gray-900">{value}</p>
  </div>
);

const QuoteSummary = () => {
  const location = useLocation();
  const lead = location.state?.lead;

  if (!lead) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <h1 className="text-2xl font-bold">Erro</h1>
        <p className="text-gray-700">Dados da cotação não encontrados.</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-10">
      <div className="text-center">
        <div className="flex items-center justify-center mx-auto mb-6">
          <img 
            src="/lovable-uploads/697965a5-aa40-4554-902c-20321af7ad63.png" 
            alt="DAKI Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h1 className="text-2xl font-bold">Recebemos sua solicitação!</h1>
        <p className="text-gray-700">Nossa equipe enviará uma proposta em até 48 h.</p>
      </div>

      <section className="border border-gray-100 rounded-xl p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Objetivo" value={lead.objective} />
          <Field label="Inventário" value={lead.inventory.join(', ')} />
          <Field label="Orçamento" value={`R$ ${lead.budget.toLocaleString('pt-BR')}`} />
          <Field label="Período" value={`${lead.startDate} – ${lead.endDate}`} />
          <Field label="Produtos" value={lead.products} className="md:col-span-2" />
          {lead.notes && <Field label="Detalhes" value={lead.notes} className="md:col-span-2" />}
          <Field label="Nome" value={lead.name} />
          <Field label="E-mail" value={lead.email} />
        </div>
      </section>
    </main>
  );
};

export default QuoteSummary;
