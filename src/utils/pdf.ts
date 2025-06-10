
import jsPDF from 'jspdf';

export async function createPdf(lead: any): Promise<Buffer> {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Cotação - Daki Retail Media', 20, 30);
  
  // Lead information
  doc.setFontSize(12);
  let yPos = 50;
  
  doc.text(`Nome: ${lead.name}`, 20, yPos);
  yPos += 10;
  doc.text(`Email: ${lead.email}`, 20, yPos);
  yPos += 10;
  doc.text(`Objetivo: ${lead.main_objective}`, 20, yPos);
  yPos += 10;
  doc.text(`Orçamento: R$ ${lead.budget.toLocaleString('pt-BR')}`, 20, yPos);
  yPos += 10;
  
  if (lead.campaign_options && lead.campaign_options.length > 0) {
    doc.text(`Opções de Campanha: ${lead.campaign_options.join(', ')}`, 20, yPos);
    yPos += 10;
  }
  
  if (lead.start_date) {
    doc.text(`Data de Início: ${new Date(lead.start_date).toLocaleDateString('pt-BR')}`, 20, yPos);
    yPos += 10;
  }
  
  if (lead.end_date) {
    doc.text(`Data de Término: ${new Date(lead.end_date).toLocaleDateString('pt-BR')}`, 20, yPos);
    yPos += 10;
  }
  
  if (lead.products) {
    doc.text(`Produtos: ${lead.products}`, 20, yPos);
    yPos += 10;
  }
  
  if (lead.additional_details) {
    doc.text(`Detalhes Adicionais: ${lead.additional_details}`, 20, yPos);
  }
  
  const pdfOutput = doc.output('arraybuffer');
  return Buffer.from(pdfOutput);
}
