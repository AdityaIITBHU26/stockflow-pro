import { useForm, useFieldArray } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../api/products';
import { customerApi } from '../../api/customers';

export default function OrderForm({ onSubmit, isLoading }) {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { customer_id: '', items: [{ product_id: '', quantity: 1 }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const { data: customersRes } = useQuery({
    queryKey: ['customers', { limit: 100 }],
    queryFn: () => customerApi.getAll({ limit: 100 }),
  });

  const { data: productsRes } = useQuery({
    queryKey: ['products', { limit: 100 }],
    queryFn: () => productApi.getAll({ limit: 100 }),
  });

  const customers = customersRes?.data || [];
  const products = productsRes?.data || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
        <select {...register('customer_id', { required: true })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
        </select>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Items</span>
          <Button type="button" variant="secondary" size="sm" onClick={() => append({ product_id: '', quantity: 1 })}>Add Item</Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-end">
            <div className="flex-1">
              <select {...register(`items.${index}.product_id`, { required: true })} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ${p.price} (Stock: {p.quantity_in_stock})
                  </option>
                ))}
              </select>
            </div>
            <Input type="number" {...register(`items.${index}.quantity`, { required: true, min: 1 })} className="w-24" />
            <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>✕</Button>
          </div>
        ))}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}
