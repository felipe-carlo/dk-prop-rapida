
import { Resend } from "resend";
import { createPdf } from "./pdf";

export async function sendQuoteEmail(lead: any) {
  try {
    console.log("Iniciando envio de email para:", lead.email);
    
    const pdfUint8Array = await createPdf(lead);
    console.log("PDF gerado com sucesso, tamanho:", pdfUint8Array.length);
    
    const resendKey = import.meta.env.VITE_RESEND_KEY;
    if (!resendKey) {
      throw new Error("Chave da API Resend não configurada");
    }
    
    const resend = new Resend(resendKey);

    const result = await resend.emails.send({
      from: "Daki Retail Media <cotacoes@daki.com>",
      to: ["felipe.carlo@soudaki.com"],
      subject: `Novo pedido de cotação – ${lead.name}`,
      html: `<p>Segue resumo do pedido gerado automaticamente.</p>`,
      attachments: [{ 
        filename: "cotacao.pdf", 
        content: Array.from(pdfUint8Array)
      }]
    });
    
    console.log("Email enviado com sucesso:", result);
    return result;
  } catch (error) {
    console.error("Erro detalhado ao enviar email:", error);
    throw error;
  }
}
