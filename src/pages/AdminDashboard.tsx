
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getAdminSession, clearAdminSession } from "@/utils/adminAuth";
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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const adminUser = getAdminSession();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin/login");
      return;
    }
    fetchQuotes();
  }, [adminUser, navigate]);

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
    clearAdminSession();
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

  if (!adminUser) {
    return null;
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
              <h1 className="text-xl font-semibold">Painel Administrativo</h1>
              <p className="text-sm text-gray-500">Bem-vindo, {adminUser.username}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
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
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">Nenhuma solicitação de cotação encontrada.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <Card key={quote.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{quote.name}</CardTitle>
                      <CardDescription>{quote.email}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(quote.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
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
                    <div>
                      <p className="text-sm font-medium text-gray-500">Produtos</p>
                      <p className="text-sm">{quote.products}</p>
                    </div>
                  )}
                  
                  {quote.additional_details && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Detalhes Adicionais</p>
                      <p className="text-sm">{quote.additional_details}</p>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuoteStatus(quote.id, 'Em Andamento')}
                      disabled={quote.status === 'Em Andamento'}
                    >
                      Em Andamento
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuoteStatus(quote.id, 'Finalizada')}
                      disabled={quote.status === 'Finalizada'}
                    >
                      Finalizada
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuoteStatus(quote.id, 'Cancelada')}
                      disabled={quote.status === 'Cancelada'}
                    >
                      Cancelada
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
