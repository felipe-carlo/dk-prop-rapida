
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  campaign_options: string[];
  budget: number;
  main_objective: string;
  start_date: string | null;
  end_date: string | null;
  products: string | null;
  additional_details: string | null;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { adminUser, isLoading: authLoading, logout } = useAdminAuth();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !adminUser) {
      navigate("/admin/login");
      return;
    }
    if (adminUser) {
      fetchQuotes();
    }
  }, [adminUser, authLoading, navigate]);

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar cotações:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as cotações.",
          variant: "destructive",
        });
        return;
      }

      setQuotes(data || []);
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: newStatus })
        .eq('id', quoteId);

      if (error) {
        console.error("Erro ao atualizar status:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status.",
          variant: "destructive",
        });
        return;
      }

      setQuotes(quotes.map(quote => 
        quote.id === quoteId ? { ...quote, status: newStatus } : quote
      ));

      toast({
        title: "Status atualizado",
        description: `Status alterado para "${newStatus}".`,
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em Andamento': return 'bg-blue-100 text-blue-800';
      case 'Finalizada': return 'bg-green-100 text-green-800';
      case 'Cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || !adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#0066FF] rounded-xl flex items-center justify-center">
              <span className="text-sm font-bold text-white">DAKI</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">Dashboard Admin</h1>
              <p className="text-sm text-gray-500">Bem-vindo, {adminUser.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Solicitações de Cotação</h2>
          <p className="text-gray-600">
            {quotes.length} {quotes.length === 1 ? 'solicitação encontrada' : 'solicitações encontradas'}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Carregando cotações...</p>
          </div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">Nenhuma solicitação de cotação encontrada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <div key={quote.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{quote.name}</h3>
                    <p className="text-gray-600">{quote.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {quote.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {format(new Date(quote.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Objetivo</p>
                    <p className="text-sm">{quote.main_objective}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Orçamento</p>
                    <p className="text-sm">R$ {quote.budget.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Inventário</p>
                    <p className="text-sm">{quote.campaign_options.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Período</p>
                    <p className="text-sm">
                      {quote.start_date && quote.end_date
                        ? `${format(new Date(quote.start_date), "dd/MM/yyyy", { locale: ptBR })} - ${format(new Date(quote.end_date), "dd/MM/yyyy", { locale: ptBR })}`
                        : "Não especificado"
                      }
                    </p>
                  </div>
                </div>
                
                {quote.products && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Produtos</p>
                    <p className="text-sm">{quote.products}</p>
                  </div>
                )}
                
                {quote.additional_details && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500">Detalhes Adicionais</p>
                    <p className="text-sm">{quote.additional_details}</p>
                  </div>
                )}

                <div className="flex space-x-2 pt-4 border-t">
                  <button
                    onClick={() => updateQuoteStatus(quote.id, 'Em Andamento')}
                    disabled={quote.status === 'Em Andamento'}
                    className="px-3 py-1 text-sm border border-blue-300 text-blue-700 rounded hover:bg-blue-50 disabled:opacity-50"
                  >
                    Em Andamento
                  </button>
                  <button
                    onClick={() => updateQuoteStatus(quote.id, 'Finalizada')}
                    disabled={quote.status === 'Finalizada'}
                    className="px-3 py-1 text-sm border border-green-300 text-green-700 rounded hover:bg-green-50 disabled:opacity-50"
                  >
                    Finalizada
                  </button>
                  <button
                    onClick={() => updateQuoteStatus(quote.id, 'Cancelada')}
                    disabled={quote.status === 'Cancelada'}
                    className="px-3 py-1 text-sm border border-red-300 text-red-700 rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    Cancelada
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
