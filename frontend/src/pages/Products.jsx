import { useState } from 'react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ProductForm from '../components/products/ProductForm'
import Input from '../components/ui/Input'
import { Plus, Pencil, Trash2, Download } from 'lucide-react'
import { exportToCSV } from '../utils/exportCSV'

export default function Products() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const { data, isLoading } = useProducts({ page, limit: 20, search, category })
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const handleCreate = async (formData) => { await createMutation.mutateAsync(formData); setModalOpen(false) }
  const handleUpdate = async (formData) => { await updateMutation.mutateAsync({ id: editingProduct.id, data: formData }); setEditingProduct(null); setModalOpen(false) }

  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'SKU', accessor: 'sku' },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price', render: (row) => `$${parseFloat(row.price).toFixed(2)}` },
    { header: 'Stock', accessor: 'quantity_in_stock', render: (row) => <span className={row.quantity_in_stock <= 5 ? 'text-red-600 font-medium' : ''}>{row.quantity_in_stock}</span> },
    {
      header: '',
      accessor: 'actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setEditingProduct(row); setModalOpen(true) }}><Pencil size={14} /></Button>
          <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(row.id)}><Trash2 size={14} /></Button>
        </div>
      ),
    },
  ]

  const handleExport = () => {
    if (data?.data) exportToCSV(data.data, 'products.csv')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}><Download size={16} className="mr-1" /> Export</Button>
          <Button onClick={() => { setEditingProduct(null); setModalOpen(true) }}><Plus size={16} className="mr-1" /> Add Product</Button>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Books">Books</option>
        </select>
      </div>
      <Table columns={columns} data={data?.data} isLoading={isLoading} />
      <div className="flex justify-between items-center">
        <Button variant="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
        <span className="text-sm text-slate-500">Page {page} (Total: {data?.total || 0})</span>
        <Button variant="secondary" disabled={!data?.data || data.data.length < 20} onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit Product' : 'New Product'}>
        <ProductForm
          initialValues={editingProduct}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
        />
      </Modal>
    </div>
  )
}
