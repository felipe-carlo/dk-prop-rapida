
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

    // Create email content
    const emailContent = `
      <h1>Nova Cotação Recebida - Daki Retail Media</h1>
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Informações do Cliente:</h2>
        <p><strong>Nome:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        
        <h2>Detalhes da Campanha:</h2>
        <p><strong>Objetivo:</strong> ${lead.main_objective}</p>
        <p><strong>Orçamento:</strong> R$ ${lead.budget.toLocaleString('pt-BR')}</p>
        <p><strong>Opções de Campanha:</strong> ${lead.campaign_options.join(', ')}</p>
        
        ${lead.start_date ? `<p><strong>Data de Início:</strong> ${new Date(lead.start_date).toLocaleDateString('pt-BR')}</p>` : ''}
        ${lead.end_date ? `<p><strong>Data de Término:</strong> ${new Date(lead.end_date).toLocaleDateString('pt-BR')}</p>` : ''}
        ${lead.products ? `<p><strong>Produtos:</strong> ${lead.products}</p>` : ''}
        ${lead.additional_details ? `<p><strong>Detalhes Adicionais:</strong> ${lead.additional_details}</p>` : ''}
        
        <hr style="margin: 20px 0;">
        <p><em>Cotação gerada automaticamente em ${new Date().toLocaleString('pt-BR')}</em></p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Daki Retail Media <onboarding@resend.dev>",
      to: ["felipe.cts1@gmail.com"], // Usando seu email verificado
      subject: `Nova Cotação - ${lead.name} (${lead.email})`,
      html: emailContent,
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
