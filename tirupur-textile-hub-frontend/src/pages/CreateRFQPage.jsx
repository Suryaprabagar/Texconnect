import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const CreateRFQPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'tshirt',
    requiredQuantity: '',
    description: '',
    deliveryDeadline: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/rfqs', formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating RFQ:', error);
      alert('Failed to create RFQ. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New RFQ</h1>
        <p className="mt-2 text-gray-600">Tell manufacturers what you need and get best quotes.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            id="title"
            label="What are you looking for? (e.g. 1000 Cotton T-shirts)"
            required
            value={formData.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <option value="ethnic">Ethnic Wear</option>
              </select>
            </div>
            <Input 
              id="requiredQuantity"
              label="Quantity Required"
              type="number"
              required
              value={formData.requiredQuantity}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Requirements Details</label>
            <textarea
              id="description"
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="Specify fabric preferences, GSM, sizes, colors, and any customization needed..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <Input 
            id="deliveryDeadline"
            label="Target Delivery Deadline"
            type="date"
            value={formData.deliveryDeadline}
            onChange={handleChange}
          />

          <div className="pt-4 flex justify-end space-x-4">
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Submit RFQ</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRFQPage;
