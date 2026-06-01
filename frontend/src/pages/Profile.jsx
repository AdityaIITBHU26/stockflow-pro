import { useState, useEffect } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { Upload, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const [company, setCompany] = useState({
    name: 'StockFlow Pro',
    address: '',
    phone: '',
    logo: '',
  })

  useEffect(() => {
    const saved = localStorage.getItem('profile')
    if (saved) setCompany(JSON.parse(saved))
  }, [])

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setCompany({ ...company, logo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem('profile', JSON.stringify(company))
    toast.success('Profile updated')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold dark:text-white">Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          {company.logo ? (
            <img src={company.logo} alt="Logo" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 text-xl font-bold">
              {company.name?.charAt(0) || 'S'}
            </div>
          )}
          <label className="cursor-pointer">
            <Button type="button" variant="secondary" onClick={() => document.getElementById('logoInput')?.click()}>
              <Upload size={14} className="mr-1" /> Upload Logo
            </Button>
            <input id="logoInput" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
        </div>
        <Input
          label="Company Name"
          name="name"
          value={company.name}
          onChange={handleChange}
        />
        <Input
          label="Address"
          name="address"
          value={company.address}
          onChange={handleChange}
        />
        <Input
          label="Phone"
          name="phone"
          value={company.phone}
          onChange={handleChange}
        />
        <Button type="submit">
          <Save size={14} className="mr-1" /> Save Changes
        </Button>
      </form>
    </div>
  )
}
