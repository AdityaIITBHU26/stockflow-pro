import { useParams, useNavigate } from 'react-router-dom'
import { useOrder, useCancelOrder } from '../hooks/useOrders'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../api/orders'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Skeleton from '../components/ui/Skeleton'
import { ArrowLeft, XCircle, Download, Printer } from 'lucide-react'
import toast from 'react-hot-toast'
import { downloadInvoicePDF } from '../utils/invoicePDF'

export default function OrderDetails() {
  const { id } = useParams()
  const { data, isLoading } = useOrder(id)
  const cancelMutation = useCancelOrder()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => orderApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['order', id])
      toast.success('Status updated')
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (!data?.success) return <div className="text-red-500">Order not found</div>
  const order = data.data

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}><ArrowLeft size={16} /></Button>
        <h1 className="text-2xl font-bold dark:text-white">Order #{order.id}</h1>
        <Badge status={order.status} />
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-2">
        <p className="dark:text-white"><span className="font-medium">Customer:</span> {order.customer_name}</p>
        <p className="dark:text-white"><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleString()}</p>
        <p className="dark:text-white"><span className="font-medium">Total:</span> ${parseFloat(order.total_amount).toFixed(2)}</p>
      </div>

      <div className="flex gap-2">
        {order.status !== 'cancelled' && order.status !== 'completed' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 flex-1">
            <label className="block text-sm font-medium mb-2 dark:text-white">Update Status</label>
            <select
              value={order.status}
              onChange={(e) => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
              className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-3 py-2 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
            {updateStatusMutation.isLoading && <span className="ml-2 text-sm text-slate-500">Updating...</span>}
          </div>
        )}
        <Button variant="secondary" onClick={() => downloadInvoicePDF(order)} className="self-start">
          <Download size={16} className="mr-1" /> PDF
        </Button>
        <Button variant="secondary" onClick={() => window.print()} className="self-start">
          <Printer size={16} className="mr-1" /> Print
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="font-semibold mb-2 dark:text-white">Items</h3>
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 dark:border-slate-700">
            <tr><th className="text-left py-2 dark:text-white">Product</th><th className="text-right py-2 dark:text-white">Qty</th><th className="text-right py-2 dark:text-white">Unit Price</th><th className="text-right py-2 dark:text-white">Subtotal</th></tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0">
                <td className="py-2 dark:text-white">{item.product_name}</td>
                <td className="text-right py-2 dark:text-white">{item.quantity}</td>
                <td className="text-right py-2 dark:text-white">${parseFloat(item.unit_price).toFixed(2)}</td>
                <td className="text-right py-2 dark:text-white">${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Printable invoice (hidden normally, visible when printing) */}
      <div id="printable-invoice" className="hidden print:block p-8 bg-white text-black">
        <h1 className="text-3xl font-bold">StockFlow Pro</h1>
        <h2 className="text-2xl mt-4">Invoice #{order.id}</h2>
        <p className="mt-2">Customer: {order.customer_name}</p>
        <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
        <table className="w-full mt-6 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Product</th>
              <th className="border border-gray-300 p-2 text-right">Qty</th>
              <th className="border border-gray-300 p-2 text-right">Unit Price</th>
              <th className="border border-gray-300 p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">{item.product_name}</td>
                <td className="border border-gray-300 p-2 text-right">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">${parseFloat(item.unit_price).toFixed(2)}</td>
                <td className="border border-gray-300 p-2 text-right">${(item.quantity * parseFloat(item.unit_price)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-right text-xl font-bold mt-4">Total: ${parseFloat(order.total_amount).toFixed(2)}</p>
      </div>

      {order.status !== 'cancelled' && order.status !== 'completed' && (
        <Button variant="danger" onClick={() => cancelMutation.mutate(order.id)}>
          <XCircle size={16} className="mr-1" /> Cancel Order
        </Button>
      )}
    </div>
  )
}
