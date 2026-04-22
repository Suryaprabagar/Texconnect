import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'tshirt',
    pricePerUnit: '',
    moq: '',
    description: '',
    fabricType: '',
    gsm: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/products', formData);
      navigate('/dashboard/manufacturer');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">List your garment products to reach verified buyers.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="name"
              label="Product Name"
              placeholder="e.g. Mens Black Crewneck T-shirt"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="tshirt">T-Shirt</option>
                <option value="hoodie">Hoodie</option>
                <option value="polo">Polo</option>
                <option value="formal">Formal Wear</option>
                <option value="sportswear">Sportswear</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="pricePerUnit"
              label="Base Price (per unit)"
              type="number"
              required
              value={formData.pricePerUnit}
              onChange={handleChange}
            />
            <Input 
              id="moq"
              label="Minimum Order Quantity (MOQ)"
              type="number"
              required
              value={formData.moq}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              id="fabricType"
              label="Fabric Type"
              placeholder="e.g. Sinker, Pique, Interlock"
              value={formData.fabricType}
              onChange={handleChange}
            />
            <Input 
              id="gsm"
              label="GSM"
              type="number"
              placeholder="e.g. 180"
              value={formData.gsm}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Detail your product features, sizing, composition..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Save Product</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
