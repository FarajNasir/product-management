import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { vendorAPI } from '../utils/api'

const VendorList = () => {
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVendors()
  }, [])

  const fetchVendors = async () => {
    try {
      const response = await vendorAPI.getAll()
      setVendors(response.data)
    } catch (err) {
      setError('Failed to fetch vendors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        await vendorAPI.delete(id)
        fetchVendors()
      } catch (err) {
        console.error('Failed to delete vendor:', err)
        alert('Failed to delete vendor. Make sure no products are associated with this vendor.')
      }
    }
  }

  if (loading) return <div className="text-center py-8">Loading...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendors</h1>
        <Link
          to="/vendors/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Vendor
        </Link>
      </div>

      <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Vendor Name</th>
              <th className="py-3 px-6 text-left">Contact Person</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">
                  {vendor.vendor_name}
                </td>
                <td className="py-3 px-6 text-left">
                  {vendor.contact_person}
                </td>
                <td className="py-3 px-6 text-left">
                  {vendor.email}
                </td>
                <td className="py-3 px-6 text-left">
                  {vendor.phone}
                </td>
                <td className="py-3 px-6 text-left">
                  <div className="flex item-center space-x-2">
                    <Link
                      to={`/vendors/edit/${vendor._id}`}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Edit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(vendor._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VendorList