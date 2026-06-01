import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function downloadInvoicePDF(order) {
  const element = document.createElement('div')
  element.innerHTML = `
    <div style="padding:40px;font-family:Arial;max-width:700px">
      <h1>StockFlow Pro</h1>
      <h2>Invoice #${order.id}</h2>
      <p>Customer: ${order.customer_name}</p>
      <p>Date: ${new Date(order.created_at).toLocaleDateString()}</p>
      <table style="width:100%;border-collapse:collapse;margin-top:20px">
        <thead>
          <tr style="background:#f2f2f2">
            <th style="text-align:left;padding:8px">Product</th>
            <th style="text-align:right;padding:8px">Qty</th>
            <th style="text-align:right;padding:8px">Unit Price</th>
            <th style="text-align:right;padding:8px">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding:8px">${item.product_name}</td>
              <td style="text-align:right;padding:8px">${item.quantity}</td>
              <td style="text-align:right;padding:8px">$${parseFloat(item.unit_price).toFixed(2)}</td>
              <td style="text-align:right;padding:8px">$${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="text-align:right;font-size:1.2em;margin-top:20px">Total: <strong>$${parseFloat(order.total_amount).toFixed(2)}</strong></p>
    </div>
  `
  document.body.appendChild(element)

  const canvas = await html2canvas(element.firstChild)
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  pdf.save(`invoice-${order.id}.pdf`)

  document.body.removeChild(element)
}
