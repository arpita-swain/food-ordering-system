import { formatCurrency, formatDate } from './formatters';

export const generateInvoiceHtml = (order) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Tax Invoice #${order.id} - FoodieGo</title>
    <style>
      body { font-family: 'Helvetica Neue', Arial, sans-serif; margin: 40px; color: #1e293b; line-height: 1.5; }
      .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f9532d; padding-bottom: 20px; }
      .logo { font-size: 26px; font-weight: 800; color: #f9532d; }
      .invoice-title { font-size: 20px; font-weight: bold; text-align: right; color: #64748b; }
      .details-grid { display: flex; justify-content: space-between; margin-top: 24px; }
      .bill-to, .rest-info { width: 48%; }
      .section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; color: #94a3b8; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; margin-top: 30px; }
      th { background-color: #f8fafc; border-bottom: 2px solid #e2e8f0; text-align: left; padding: 12px 10px; font-size: 13px; color: #475569; }
      td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
      .totals { width: 320px; margin-left: auto; margin-top: 24px; }
      .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
      .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #e2e8f0; padding-top: 10px; margin-top: 8px; color: #0f172a; }
      .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px dashed #cbd5e1; padding-top: 20px; }
      @media print {
        body { margin: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">FoodieGo 🍽️</div>
      <div class="invoice-title">
        <div>TAX INVOICE</div>
        <div style="font-size: 13px; font-weight: normal; margin-top: 4px;">#${order.id}</div>
        <div style="font-size: 12px; font-weight: normal; color: #94a3b8;">${formatDate(order.date)}</div>
      </div>
    </div>

    <div class="details-grid">
      <div class="rest-info">
        <div class="section-label">Order From</div>
        <div style="font-weight: bold; font-size: 16px;">${order.restaurantName}</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${order.restaurantAddress || 'Dantan, West Bengal'}</div>
        <div style="font-size: 12px; color: #94a3b8;">FSSAI Lic: 12821004000312</div>
      </div>
      <div class="bill-to">
        <div class="section-label">Delivered To</div>
        <div style="font-weight: bold; font-size: 16px;">${order.deliveryAddress?.name || 'Customer'}</div>
        <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${order.deliveryAddress?.addressLine || 'Home Delivery'}</div>
        <div style="font-size: 12px; color: #94a3b8;">Payment: ${order.payment?.method || 'UPI'} (${order.payment?.status || 'Paid'})</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Unit Price</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || []).map(item => `
          <tr>
            <td>
              <div style="font-weight: 600;">${item.name}</div>
              ${item.size ? `<div style="font-size: 12px; color: #64748b;">${item.size}</div>` : ''}
              ${item.extras?.length ? `<div style="font-size: 11px; color: #94a3b8;">+ ${item.extras.join(', ')}</div>` : ''}
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">${formatCurrency(item.price)}</td>
            <td style="text-align: right; font-weight: 600;">${formatCurrency(item.price * item.quantity)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Item Total:</span>
        <span>${formatCurrency(order.pricing?.subtotal)}</span>
      </div>
      <div class="totals-row">
        <span>Delivery Fee:</span>
        <span>${order.pricing?.deliveryFee === 0 ? 'FREE' : formatCurrency(order.pricing?.deliveryFee)}</span>
      </div>
      <div class="totals-row">
        <span>Taxes & Charges (GST 5%):</span>
        <span>${formatCurrency(order.pricing?.taxes)}</span>
      </div>
      ${order.pricing?.discount ? `
        <div class="totals-row" style="color: #10b981;">
          <span>Coupon Discount:</span>
          <span>-${formatCurrency(order.pricing.discount)}</span>
        </div>
      ` : ''}
      <div class="totals-row grand-total">
        <span>Grand Total:</span>
        <span style="color: #f9532d;">${formatCurrency(order.pricing?.grandTotal)}</span>
      </div>
    </div>

    <div class="footer">
      Thank you for ordering with FoodieGo! For queries or support, reach us at support@foodiego.com<br>
      This is a computer-generated tax invoice and requires no physical signature.
    </div>
  </body>
  </html>
  `;
};

export const downloadInvoice = (order) => {
  const html = generateInvoiceHtml(order);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
};
