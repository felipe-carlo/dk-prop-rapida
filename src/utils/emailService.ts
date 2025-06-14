
import { supabase } from "@/integrations/supabase/client";

export async function sendQuoteEmail(lead: any) {
  try {
    console.log("Enviando email via edge function para:", lead.email);
    
    const { data, error } = await supabase.functions.invoke('send-quote-email', {
      body: { leadId: lead.id },
    });

    if (error) {
      console.error("Erro na edge function:", error);
      throw error;
    }

    console.log("Email enviado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Erro detalhado ao enviar email:", error);
    throw error;
  }
}
