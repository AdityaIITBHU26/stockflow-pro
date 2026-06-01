import { useState } from 'react'
import { useCustomers, useCreateCustomer, useDeleteCustomer } from '../hooks/useCustomers'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import CustomerForm from '../components/customers/CustomerForm'
import Input from '../components/ui/Input'
import { Plus, Trash2 } from 'lucide-react'

export default function Customers() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading } = useCustomers({ page, limit: 20, search })
  const createMutation = useCreateCustomer()
  const deleteMutation = useDeleteCustomer()

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Address', accessor: 'address' },
    { header: '', accessor: 'actions', render: (row) => (
      <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(row.id)}><Trash2 size={14} /></Button>
    )},
  ]

  const handleCreate = async (formData) => {
    await createMutation.mutateAsync(formData)
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={() => setModalOpen(true)}><Plus size={16} className="mr-1" /> Add Customer</Button>
      </div>
      <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
      <Table columns={columns} data={data?.data} isLoading={isLoading} />
      <div className="flex justify-between">
        <Button variant="secondary" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</Button>
        <Button variant="secondary" disabled={!data?.data || data.data.length < 20} onClick={()=>setPage(p=>p+1)}>Next</Button>
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Customer">
        <CustomerForm onSubmit={handleCreate} isLoading={createMutation.isLoading} />
      </Modal>
    </div>
  )
}