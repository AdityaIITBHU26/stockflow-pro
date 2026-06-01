import { useForm } from 'react-hook-form'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function CustomerForm({ onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" {...register('full_name', { required: true })} error={errors.full_name?.message} />
      <Input label="Email" type="email" {...register('email', { required: true })} error={errors.email?.message} />
      <Input label="Phone" {...register('phone', { required: true, pattern: /^\+?1?\d{9,15}$/ })} error={errors.phone?.message} />
      <Input label="Address" {...register('address')} />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Creating...' : 'Create Customer'}
      </Button>
    </form>
  )
}