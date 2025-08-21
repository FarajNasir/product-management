import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { vendorAPI } from '../utils/api'

const VendorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm({
    defaultValues: {
      vendor_name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: '',
      tax_id: ''
    }
  })

  useEffect(() => {
    if (isEdit) {
      fetchVendor()
    }
  }, [id])

  const fetchVendor = async () => {
    try {
      const response = await vendorAPI.getById(id)
      const vendor = response.data
      
      // Set form values
      Object.keys(vendor).forEach(key => {
        if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
          setValue(key, vendor[key])
        }
      })
    } catch (err) {
      setError('Failed to fetch vendor')
      console.error(err)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      if (isEdit) {
        await vendorAPI.update(id, data)
      } else {
        await vendorAPI.create(data)
      }
      
      navigate('/vendors')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save vendor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Vendor' : 'Add New Vendor'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 gap-6">
          {/* Vendor Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="vendor_name">
              Vendor Name *
            </label>
            <input
              id="vendor_name"
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.vendor_name ? 'border-red-500' : ''
              }`}
              {...register('vendor_name', { required: 'Vendor name is required' })}
            />
            {errors.vendor_name && (
              <p className="text-red-500 text-xs italic">{errors.vendor_name.message}</p>
            )}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contact_person">
              Contact Person *
            </label>
            <input
              id="contact_person"
              type="text"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.contact_person ? 'border-red-500' : ''
              }`}
              {...register('contact_person', { required: 'Contact person is required' })}
            />
            {errors.contact_person && (
              <p className="text-red-500 text-xs italic">{errors.contact_person.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              type="email"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.email ? 'border-red-500' : ''
              }`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format'
                }
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone *
            </label>
            <input
              id="phone"
              type="tel"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.phone ? 'border-red-500' : ''
              }`}
              {...register('phone', { required: 'Phone is required' })}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs italic">{errors.phone.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address *
            </label>
            <textarea
              id="address"
              rows="3"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.address ? 'border-red-500' : ''
              }`}
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && (
              <p className="text-red-500 text-xs italic">{errors.address.message}</p>
            )}
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tax_id">
              Tax ID
            </label>
            <input
              id="tax_id"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              {...register('tax_id')}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate('/vendors')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Vendor' : 'Add Vendor'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default VendorForm