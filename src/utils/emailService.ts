
import { Resend } from "resend";
import { createPdf } from "./pdf";

export async function sendQuoteEmail(lead: any) {
  const pdfBuffer = await createPdf(lead);
  const resend = new Resend(import.meta.env.VITE_RESEND_KEY);

  await resend.emails.send({
    from: "Daki Retail Media <cotacoes@daki.com>",
    to: ["felipe.carlo@soudaki.com"],
    subject: `Novo pedido de cotação – ${lead.name}`,
    html: `<p>Segue resumo do pedido gerado automaticamente.</p>`,
    attachments: [{ filename: "cotacao.pdf", content: pdfBuffer }]
  });
}
