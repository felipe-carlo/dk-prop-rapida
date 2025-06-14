
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface QuoteEmailRequest {
  leadId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId }: QuoteEmailRequest = await req.json();

    // Get lead data from Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: lead, error } = await supabaseClient
      .from('quote_requests')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      throw new Error('Lead not found');
    }

    // Create PDF content (simplified version)
    const pdfContent = `
      Nome: ${lead.name}
      Email: ${lead.email}
      Objetivo: ${lead.main_objective}
      Orçamento: R$ ${lead.budget.toLocaleString('pt-BR')}
      Opções: ${lead.campaign_options.join(', ')}
      ${lead.start_date ? `Data Início: ${new Date(lead.start_date).toLocaleDateString('pt-BR')}` : ''}
      ${lead.end_date ? `Data Fim: ${new Date(lead.end_date).toLocaleDateString('pt-BR')}` : ''}
      ${lead.products ? `Produtos: ${lead.products}` : ''}
      ${lead.additional_details ? `Detalhes: ${lead.additional_details}` : ''}
    `;

    const emailResponse = await resend.emails.send({
      from: "Daki Retail Media <onboarding@resend.dev>",
      to: ["felipe.carlo@soudaki.com"],
      subject: `Novo pedido de cotação – ${lead.name}`,
      html: `
        <h1>Nova Cotação Recebida</h1>
        <p>Segue resumo do pedido gerado automaticamente:</p>
        <pre>${pdfContent}</pre>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
