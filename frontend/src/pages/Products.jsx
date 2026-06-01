import { useState, useRef } from 'react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ProductForm from '../components/products/ProductForm'
import Input from '../components/ui/Input'
import { Plus, Pencil, Trash2, Download, Upload, ArrowUp, ArrowDown } from 'lucide-react'
import { exportToCSV } from '../utils/exportCSV'
import { importProducts } from '../api/products'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function Products() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const fileInputRef = useRef(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useProducts({ page, limit: 20, search, category, sort_by: sortBy, sort_order: sortOrder })
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  
  const importMutation = useMutation({
    mutationFn: importProducts,
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err) => toast.error(err.message)
  })

  const handleCreate = async (formData) => { await createMutation.mutateAsync(formData); setModalOpen(false) }
  const handleUpdate = async (formData) => { await updateMutation.mutateAsync({ id: editingProduct.id, data: formData }); setEditingProduct(null); setModalOpen(false) }

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleImportClick = () => fileInputRef.current?.click()
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) importMutation.mutate(file)
    e.target.value = ''
  }

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'SKU', accessor: 'sku', sortable: true },
    { header: 'Category', accessor: 'category', sortable: true },
    { header: 'Price', accessor: 'price', render: (row) => `$${parseFloat(row.price).toFixed(2)}`, sortable: true },
    { header: 'Stock', accessor: 'quantity_in_stock', render: (row) => <span className={row.quantity_in_stock <= 5 ? 'text-red-600 font-medium' : ''}>{row.quantity_in_stock}</span>, sortable: true },
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
          <Button variant="secondary" onClick={handleImportClick} disabled={importMutation.isLoading}>
            <Upload size={16} className="mr-1" /> {importMutation.isLoading ? 'Importing...' : 'Import'}
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
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
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => col.sortable && handleSort(col.accessor)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && sortBy === col.accessor && (
                      sortOrder === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data?.data?.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-3 text-sm text-slate-700">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {(!data?.data || data.data.length === 0) && (
          <div className="p-6 text-center text-sm text-slate-500">No products found</div>
        )}
      </div>
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
