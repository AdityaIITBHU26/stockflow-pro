import { useForm } from 'react-hook-form'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function ProductForm({ initialValues, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues || {} })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Product Name" {...register('name', { required: 'Name is required' })} error={errors.name?.message} />
      <Input label="SKU" {...register('sku', { required: 'SKU is required' })} error={errors.sku?.message} />
      <Input label="Description" {...register('description')} />
      <Input label="Category" {...register('category')} />
      <Input label="Price" type="number" step="0.01" {...register('price', { required: true, min: 0.01 })} error={errors.price?.message} />
      <Input label="Quantity in Stock" type="number" {...register('quantity_in_stock', { required: true, min: 0 })} error={errors.quantity_in_stock?.message} />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : 'Save Product'}
      </Button>
    </form>
  )
}