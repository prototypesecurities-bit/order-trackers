import React, { useState } from 'react';
import { Package, User, Building, MapPin, Truck, FileText, Save, X } from 'lucide-react';
import { InvoiceItem } from '../types/shipment';

interface AdminShipmentFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isEditing?: boolean;
}

const AdminShipmentForm: React.FC<AdminShipmentFormProps> = ({ 
  onSubmit, 
  initialData, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    shipperName: initialData?.shipperName || '',
    shipperEmail: initialData?.shipperEmail || '',
    shipperAddress: initialData?.shipperAddress || '',
    shipperCity: initialData?.shipperCity || '',
    shipperCountry: initialData?.shipperCountry || '',
    shipperPostalCode: initialData?.shipperPostalCode || '',
    receiverName: initialData?.receiverName || '',
    receiverEmail: initialData?.receiverEmail || '',
    receiverPhone: initialData?.receiverPhone || '',
    receiverAddress: initialData?.receiverAddress || '',
    receiverCity: initialData?.receiverCity || '',
    receiverCountry: initialData?.receiverCountry || '',
    receiverComments: initialData?.receiverComments || '',
    accountNo: initialData?.accountNo || '',
    shipperReference: initialData?.shipperReference || '',
    shipmentType: initialData?.shipmentType || '',
    service: initialData?.service || '',
    pieces: initialData?.pieces || '',
    origin: initialData?.origin || '',
    totalVolumetricWeight: initialData?.totalVolumetricWeight || '',
    destination: initialData?.destination || '',
    weight: initialData?.weight || '',
    comments: initialData?.comments || '',
    description: initialData?.description || '',
    fragile: initialData?.fragile || false,
    invoiceType: initialData?.invoiceType || 'COMMERCIAL INVOICE'
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(
    initialData?.invoiceItems || [
      { description: '', code: '', quantity: 1, price: 0, total: 0 }
    ]
  );

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleInvoiceItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Calculate total for this item
      if (field === 'quantity' || field === 'price') {
        updated[index].total = updated[index].quantity * updated[index].price;
      }
      
      return updated;
    });
  };

  const addInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, { description: '', code: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeInvoiceItem = (index: number) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onSubmit({
        ...formData,
        invoiceItems
      });
      setLoading(false);
    }, 500);
  };

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 
    'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Indonesia', 
    'Iran', 'Iraq', 'Italy', 'Japan', 'Jordan', 'Kuwait', 'Lebanon', 'Malaysia', 'Netherlands', 
    'Pakistan', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Spain', 
    'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE', 'United Kingdom', 'United States'
  ];

  const services = [
    'Standard', 'Express', 'Overnight', 'Same Day', 'Economy', 'Priority'
  ];

  const shipmentTypes = [
    'Document', 'Parcel', 'Commercial', 'Personal Effects', 'Sample', 'Gift'
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Header with Search Shipment */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Shipment' : 'Add / Create Shipment'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Shipment"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Find
            </button>
            <span className="text-blue-600 cursor-pointer">📋 Shipments</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipper Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Building className="w-5 h-5" />
              Shipper Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipper Name</label>
                <input
                  type="text"
                  name="shipperName"
                  value={formData.shipperName}
                  onChange={handleChange}
                  placeholder="Enter Shipper Name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipper Email</label>
                <input
                  type="email"
                  name="shipperEmail"
                  value={formData.shipperEmail}
                  onChange={handleChange}
                  placeholder="Enter Shipper Email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="shipperAddress"
                  value={formData.shipperAddress}
                  onChange={handleChange}
                  placeholder="Enter Shipper Address"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="shipperCity"
                  value={formData.shipperCity}
                  onChange={handleChange}
                  placeholder="Enter City"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="shipperCountry"
                  value={formData.shipperCountry}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="shipperPostalCode"
                  value={formData.shipperPostalCode}
                  onChange={handleChange}
                  placeholder="Enter Postal Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>

          {/* Consignee Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Consignee Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Name</label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  placeholder="Enter Receiver Name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Receiver Email</label>
                <input
                  type="email"
                  name="receiverEmail"
                  value={formData.receiverEmail}
                  onChange={handleChange}
                  placeholder="Enter Receiver Email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone #</label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  placeholder="Enter Address"
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="receiverCity"
                  value={formData.receiverCity}
                  onChange={handleChange}
                  placeholder="Enter City"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  name="receiverCountry"
                  value={formData.receiverCountry}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Country</option>
                  {['Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 
                    'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Indonesia', 
                    'Iran', 'Iraq', 'Italy', 'Japan', 'Jordan', 'Kuwait', 'Lebanon', 'Malaysia', 'Netherlands', 
                    'Pakistan', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Spain', 
                    'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE', 'United Kingdom', 'United States'].map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments Here</label>
                <textarea
                  name="receiverComments"
                  value={formData.receiverComments}
                  onChange={handleChange}
                  placeholder="Type comments here"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipment Information */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Shipment Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account No.</label>
              <input
                type="text"
                name="accountNo"
                value={formData.accountNo}
                onChange={handleChange}
                placeholder="992"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipper's Reference</label>
              <input
                type="text"
                name="shipperReference"
                value={formData.shipperReference}
                onChange={handleChange}
                placeholder="AHSAN KHAN"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipment Type</label>
              <select
                name="shipmentType"
                value={formData.shipmentType}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select</option>
                {shipmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select</option>
                {services.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pieces</label>
              <input
                type="number"
                name="pieces"
                value={formData.pieces}
                onChange={handleChange}
                placeholder="Enter Pieces"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
              <select
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Pakistan</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Volumetric Weight</label>
              <input
                type="number"
                step="0.1"
                name="totalVolumetricWeight"
                value={formData.totalVolumetricWeight}
                onChange={handleChange}
                placeholder="Volumetric Weight"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input
                type="number"
                step="0.1"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter Weight"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Type comments here"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="fragile"
                  checked={formData.fragile}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-700">Fragile</span>
              </label>
            </div>
          </div>
        </div>

        {/* Invoice Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Invoice Information
          </h2>
          
          {/* Invoice Type Selection */}
          <div className="mb-6">
            <div className="flex gap-6">
              {['COMMERCIAL INVOICE', 'GIFT INVOICE', 'PERFORMA INVOICE', 'SAMPLE INVOICE'].map(type => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="invoiceType"
                    value={type}
                    checked={formData.invoiceType === type}
                    onChange={handleChange}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Invoice Items Table */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Pvt4. Desc.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Its Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Edit
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    VOM
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quarfally Price
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoiceItems.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleInvoiceItemChange(index, 'description', e.target.value)}
                        placeholder="LADIES SUITS"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => handleInvoiceItemChange(index, 'code', e.target.value)}
                        placeholder="620200000"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">Pieces</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleInvoiceItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleInvoiceItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-red-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium">{item.total.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                        >
                          🗑️
                        </button>
                        {index === invoiceItems.length - 1 && (
                          <button
                            type="button"
                            onClick={addInvoiceItem}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                          >
                            Display
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-right font-medium">
                    Total
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {invoiceItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-center font-medium">
                    {invoiceItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 font-bold">
                    {invoiceItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Update Invoice
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Shipment' : 'Create Shipment'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminShipmentForm;