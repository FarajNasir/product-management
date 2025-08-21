import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProductList from './pages/ProductList'
import ProductForm from './pages/ProductForm'
import VendorList from './pages/VendorList'
import VendorForm from './pages/VendorForm'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<ProductForm />} />
          <Route path="/vendors" element={<VendorList />} />
          <Route path="/vendors/new" element={<VendorForm />} />
          <Route path="/vendors/edit/:id" element={<VendorForm />} />
        </Routes>
      </div>
    </div>
  )
}

export default App