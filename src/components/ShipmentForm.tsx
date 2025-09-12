import React, { useState } from 'react';
import { Package, User, Building, MapPin, Truck, FileText, Save, Search, Edit, Plus, Trash2 } from 'lucide-react';
import { Shipment, InvoiceItem } from '../types/shipment';
import PDFGenerator from './PDFGenerator';
import InvoiceGenerator from './InvoiceGenerator';

const ShipmentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    shipperName: '',
    shipperEmail: '',
    shipperAddress: '',
    shipperCity: '',
    shipperCountry: '',
    shipperPostalCode: '',
    cityNrNtnCnc: '',
    shrepers: '',
    productDet: '',
    consigneeName: '',
    consigneeEmail: '',
    consigneePhone: '',
    consigneeAddress: '',
    consigneeCity: '',
    consigneeCountry: '',
    consigneeComments: '',
    zipCode: '',
    accountNo: '992',
    shipperReference: 'AHSAN KHAN',
    shipmentType: '',
    service: '',
    pieces: '',
    origin: 'Pakistan',
    totalVolumetricWeight: '',
    volumetric: '',
    dimension: '',
    destination: '',
    weight: '',
    declaredValue: '0.00',
    comments: '',
    description: '',
    fragile: false,
    invoiceType: 'COMMERCIAL INVOICE'
  });

  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { description: 'LADIES SUITS', code: '620200000', quantity: 42, price: 150, total: 6300 }
  ]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdShipment, setCreatedShipment] = useState<Shipment | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAWBModal, setShowAWBModal] = useState(false);
  const [showInvoiceEditor, setShowInvoiceEditor] = useState(false);

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 
    'Brazil', 'Canada', 'China', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Indonesia', 
    'Iran', 'Iraq', 'Italy', 'Japan', 'Jordan', 'Kuwait', 'Lebanon', 'Malaysia', 'Netherlands', 
    'Pakistan', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'South Korea', 'Spain', 
    'Sri Lanka', 'Sweden', 'Switzerland', 'Thailand', 'Turkey', 'UAE', 'United Kingdom', 'United States'
  ];

  const services = ['Standard', 'Express', 'Overnight', 'Same Day', 'Economy', 'Priority'];
  const shipmentTypes = ['Document', 'Parcel', 'Commercial', 'Personal Effects', 'Sample', 'Gift'];

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
    if (invoiceItems.length > 1) {
      setInvoiceItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const trackingNumber = `1ZG${Date.now().toString().slice(-10)}${Math.random().toString(36).substring(2, 4).toUpperCase()}`;
      const consignmentNo = Date.now().toString().slice(-8);
      
      const newShipment: Shipment = {
        id: Math.random().toString(36).substring(2, 9),
        trackingNumber,
        consignmentNo,
        ...formData,
        invoiceItems,
        status: 'In Process',
        createdAt: new Date().toLocaleDateString('en-GB'),
        updatedAt: new Date().toISOString(),
        timeline: [
          {
            date: new Date().toLocaleDateString('en-GB'),
            time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
            location: formData.origin.toUpperCase(),
            description: 'Shipment Created and In Process'
          }
        ]
      };
      
      setCreatedShipment(newShipment);
      setSuccess(true);
      setLoading(false);
    }, 1000);
  };

  const resetForm = () => {
    setSuccess(false);
    setCreatedShipment(null);
    setFormData({
      companyName: '',
      shipperName: '',
      shipperEmail: '',
      shipperAddress: '',
      shipperCity: '',
      shipperCountry: '',
      shipperPostalCode: '',
      receiverName: '',
      receiverEmail: '',
      receiverPhone: '',
      receiverAddress: '',
      receiverCity: '',
      receiverCountry: '',
      receiverComments: '',
      accountNo: '992',
      shipperReference: 'AHSAN KHAN',
      shipmentType: '',
      service: '',
      pieces: '',
      origin: 'Pakistan',
      totalVolumetricWeight: '',
      destination: '',
      weight: '',
      comments: '',
      description: '',
      fragile: false,
      invoiceType: 'COMMERCIAL INVOICE'
    });
    setInvoiceItems([
      { description: 'LADIES SUITS', code: '620200000', quantity: 42, price: 150, total: 6300 }
    ]);
  };

  if (success && createdShipment) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-green-800">Shipment Created Successfully!</h2>
              <p className="text-green-700">
                Consignment No: <span className="font-mono font-bold">{createdShipment.consignmentNo}</span> | 
                Tracking No: <span className="font-mono font-bold">{createdShipment.trackingNumber}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg flex items-center justify-center gap-3"
            >
              <FileText className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Generate Invoice</div>
                <div className="text-sm opacity-90">Download commercial invoice</div>
              </div>
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => setShowAWBModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg flex items-center justify-center gap-3"
            >
              <Package className="w-6 h-6" />
              <div className="text-left">
                <div className="font-semibold">Generate AWB</div>
                <div className="text-sm opacity-90">Download airway bill</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resetForm}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Create Another Shipment
          </button>
        </div>

        {/* Invoice Modal */}
        {showInvoiceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Generate Invoice</h2>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <InvoiceGenerator 
                  shipment={createdShipment} 
                  onClose={() => setShowInvoiceModal(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* AWB Modal */}
        {showAWBModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Airway Bill Management</h2>
                  <button
                    onClick={() => setShowAWBModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                <PDFGenerator shipment={createdShipment} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Add / Create Shipment</h1>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City Nr NTN/CNC</label>
                  <input
                    type="text"
                    name="cityNrNtnCnc"
                    value={formData.cityNrNtnCnc}
                    onChange={handleChange}
                    placeholder="Enter City Nr NTN/CNC"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shrepers</label>
                  <input
                    type="text"
                    name="shrepers"
                    value={formData.shrepers}
                    onChange={handleChange}
                    placeholder="Enter Shrepers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Det</label>
                  <input
                    type="text"
                    name="productDet"
                    value={formData.productDet}
                    onChange={handleChange}
                    placeholder="Enter Product Details"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consignee Name</label>
                  <input
                    type="text"
                    name="consigneeName"
                    value={formData.consigneeName}
                    onChange={handleChange}
                    placeholder="Enter Consignee Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consignee Email</label>
                  <input
                    type="email"
                    name="consigneeEmail"
                    value={formData.consigneeEmail}
                    onChange={handleChange}
                    placeholder="Enter Consignee Email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone #</label>
                  <input
                    type="tel"
                    name="consigneePhone"
                    value={formData.consigneePhone}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    name="consigneeAddress"
                    value={formData.consigneeAddress}
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
                    name="consigneeCity"
                    value={formData.consigneeCity}
                    onChange={handleChange}
                    placeholder="Enter City"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <select
                    name="consigneeCountry"
                    value={formData.consigneeCountry}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Enter Zip Code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments Here</label>
                  <textarea
                    name="consigneeComments"
                    value={formData.consigneeComments}
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
                  <option value="Pakistan">Pakistan</option>
                  {countries.filter(c => c !== 'Pakistan').map(country => (
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Volumetric</label>
                <input
                  type="number"
                  step="0.1"
                  name="volumetric"
                  value={formData.volumetric}
                  onChange={handleChange}
                  placeholder="Volumetric"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dimension</label>
                <input
                  type="text"
                  name="dimension"
                  value={formData.dimension}
                  onChange={handleChange}
                  placeholder="Enter Dimensions"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Declared Value</label>
                <input
                  type="number"
                  step="0.01"
                  name="declaredValue"
                  value={formData.declaredValue}
                  onChange={handleChange}
                  placeholder="0.00"
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
              <div>
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
              <div>
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
                            onClick={() => removeInvoiceItem(index)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            disabled={invoiceItems.length === 1}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          {index === invoiceItems.length - 1 && (
                            <button
                              type="button"
                              onClick={addInvoiceItem}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
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
              onClick={() => setShowInvoiceEditor(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Update Invoice
            </button>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Shipment
                </>
              )}
            </button>
          </div>
        </form>

        {/* Invoice Editor Modal */}
        {showInvoiceEditor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Edit Invoice</h2>
                  <button
                    onClick={() => setShowInvoiceEditor(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                {/* Invoice Type Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Invoice Type</h3>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
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
                                <Edit className="w-4 h-4" />
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
                                  onClick={() => removeInvoiceItem(index)}
                                  className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                  disabled={invoiceItems.length === 1}
                                >
                                  🗑️
                                </button>
                                {index === invoiceItems.length - 1 && (
                                  <button
                                    type="button"
                                    onClick={addInvoiceItem}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
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
                  
                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={addInvoiceItem}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                    <div className="text-lg font-bold">
                      Grand Total: ${invoiceItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceEditor(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInvoiceEditor(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentForm;