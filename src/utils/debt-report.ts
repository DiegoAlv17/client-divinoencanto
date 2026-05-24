import type { ClientResponse, SaleResponse } from '../types';

interface DebtReportData {
  client: ClientResponse;
  salesWithDebt: SaleResponse[];
  totalDebt: number;
}

export function generateDebtReportHtml({ client, salesWithDebt, totalDebt }: DebtReportData): string {
  const debtItems = salesWithDebt.flatMap((sale) =>
    sale.items
      .filter((item) => item.difference > 0)
      .map((item) => ({ ...item, saleDate: sale.saleDate, saleId: sale.id }))
  );

  const rows = debtItems.map((item) => `
    <tr>
      <td>${item.saleDate}</td>
      <td>#${item.saleId}</td>
      <td>${item.productName}</td>
      <td>${item.quantity}</td>
      <td>$${item.subTotal.toFixed(2)}</td>
      <td class="debt">$${item.difference.toFixed(2)}</td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<head>
  <title>Reporte de Deuda - ${client.name} ${client.lastname}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #2C1810; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: #7A6555; font-size: 13px; margin-bottom: 24px; }
    .info { display: flex; gap: 32px; margin-bottom: 24px; font-size: 13px; }
    .info span { color: #7A6555; }
    .total-box { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
    .total-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #7A6555; }
    .total-amount { font-size: 28px; font-weight: bold; color: #DC2626; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 8px 12px; background: #F5F0EB; border-bottom: 2px solid #D9CCBF; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #7A6555; }
    td { padding: 8px 12px; border-bottom: 1px solid #E8E0D8; }
    .debt { color: #DC2626; font-weight: 600; }
    .footer { margin-top: 32px; font-size: 11px; color: #7A6555; text-align: center; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>Reporte de Deuda</h1>
  <p class="subtitle">${client.name} ${client.lastname}</p>
  <div class="info">
    ${client.email ? `<div><span>Email:</span> ${client.email}</div>` : ''}
    ${client.phone ? `<div><span>Tel:</span> ${client.phone}</div>` : ''}
    <div><span>Fecha:</span> ${new Date().toLocaleDateString('es-ES')}</div>
  </div>
  <div class="total-box">
    <div class="total-label">Total pendiente</div>
    <div class="total-amount">$${totalDebt.toFixed(2)}</div>
  </div>
  <table>
    <thead>
      <tr><th>Fecha</th><th>Venta</th><th>Producto</th><th>Cant.</th><th>Subtotal</th><th>Debe</th></tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">Divino Encanto — Sistema de gestión — Generado el ${new Date().toLocaleString('es-ES')}</div>
</body>
</html>`;
}

export function openPrintableReport(html: string): boolean {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return false;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
  return true;
}
