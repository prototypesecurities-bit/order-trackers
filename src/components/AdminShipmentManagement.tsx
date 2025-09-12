import React, { useState, useEffect } from 'react';
import { Search, Package, Edit, Eye, Download, Plus, FileText, Receipt } from 'lucide-react';
import { Shipment } from '../types/shipment';
import AdminShipmentForm from './AdminShipmentForm';
import InvoiceGenerator from './InvoiceGenerator';
import PDFGenerator from './PDFGenerator';

const AdminShipmentManagement: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showAWBModal, setShowAWBModal] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [searchTerm, statusFilter]);

  const fetchShipments = async () => {
    // Mock shipments data with enhanced fields
    setTimeout(() => {
      const mockShipments: Shipment[] = [
        {
          id: '1',
          trackingNumber: '1ZG010566711225706',
          consignmentNo: '10150159',
          companyName: 'Tech Solutions Inc.',
          shipperName: 'UMBREEN ZEESHAN',
          shipperEmail: 'umbreen@techsolutions.com',
          shipperAddress: '123 Business District',
          shipperCity: 'Karachi',
          shipperCountry: 'Pakistan',
          shipperPostalCode: '75600',
          cityNrNtnCnc: '420000359083',
          shrepers: '75500',
          productDet: 'AHSAN KHAN',
          consigneeName: 'NAWAL ALMAS',
          consigneeEmail: 'nawal@company.com',
          consigneePhone: '+44-20-7946-0958',
          consigneeAddress: 'Jleeb shuwelkh, block 4,building 36, kuwait',
          consigneeCity: 'Jleeb shuwelkh',
          consigneeCountry: 'Kuwait',
          consigneeComments: 'Office hours delivery preferred',
          zipCode: '000',
          accountNo: '992',
          shipperReference: 'AHSAN KHAN',
          shipmentType: 'Commercial',
          service: 'Express',
          pieces: '1',
          origin: 'Pakistan',
          totalVolumetricWeight: '2.5',
          volumetric: '7.000',
          dimension: 'DUBAI ARAMEX EXPRESS',
          destination: 'United Kingdom',
          weight: '2.0',
          declaredValue: '0.00',
          comments: 'Handle with care',
          description: 'GENTS SHIRTS,LADIES BAGS AND ARTIFICIAL CHAIN',
          fragile: true,
          invoiceType: 'COMMERCIAL INVOICE',
          invoiceItems: [
            {
              description: 'LADIES SUITS',
              code: '620200000',
              quantity: 42,
              price: 150,
              total: 6300
            }
          ],
          status: 'In Transit',
          createdAt: '18 Aug 2025',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          trackingNumber: 'XC87654321EFGH',
          consignmentNo: 'XC876543',
          companyName: 'Global Imports Ltd.',
          shipperName: 'Alice Johnson',
          shipperEmail: 'alice@globalimports.com',
          shipperAddress: '789 Trade Center',
          shipperCity: 'Chicago',
          shipperCountry: 'United States',
          shipperPostalCode: '60601',
          receiverName: 'Bob Wilson',
          receiverEmail: 'bob@receiver.com',
          receiverPhone: '+1-555-0202',
          receiverAddress: '321 Elm Street',
          receiverCity: 'Miami',
          receiverCountry: 'United States',
          receiverComments: '',
          accountNo: '445',
          shipperReference: 'REF-2024-001',
          shipmentType: 'Document',
          service: 'Standard',
          pieces: '1',
          origin: 'United States',
          totalVolumetricWeight: '0.5',
          destination: 'United States',
          weight: '0.5',
          comments: '',
          description: 'Legal documents',
          fragile: false,
          invoiceType: 'COMMERCIAL INVOICE',
          invoiceItems: [
            {
              description: 'Legal Documents',
              code: '490199000',
              quantity: 1,
              price: 50,
              total: 50
            }
          ],
          status: 'Delivered',
          createdAt: '15 Jan 2025',
          updatedAt: new Date(Date.now() - 43200000).toISOString()
        }
      ];
      
      let filteredShipments = [...mockShipments];
      
      if (searchTerm) {
        filteredShipments = filteredShipments.filter(s => 
          s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.consignmentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.shipperName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.receiverName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (statusFilter !== 'all') {
        filteredShipments = filteredShipments.filter(s => s.status === statusFilter);
      }
      
      setShipments(filteredShipments);
      setLoading(false);
    }, 500);
  };

  const handleCreateShipment = (shipmentData: any) => {
    const newShipment: Shipment = {
      id: Math.random().toString(36).substring(2, 9),
      trackingNumber: `XC${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      consignmentNo: `XC${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      ...shipmentData,
      status: 'In Process',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toISOString()
    };
    
    setShipments(prev => [newShipment, ...prev]);
    setCurrentView('list');
  };

  const handleEditShipment = (shipmentData: any) => {
    if (selectedShipment) {
      setShipments(prev => prev.map(s => 
        s.id === selectedShipment.id 
          ? { ...s, ...shipmentData, updatedAt: new Date().toISOString() }
          : s
      ));
      setCurrentView('list');
      setSelectedShipment(null);
    }
  };

  const handleGenerateInvoice = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowInvoiceModal(true);
  };

  const handleGenerateAWB = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowAWBModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Process':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (currentView === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create New Shipment</h1>
          <button
            onClick={() => setCurrentView('list')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to List
          </button>
        </div>
        <AdminShipmentForm onSubmit={handleCreateShipment} />
      </div>
    );
  }

  if (currentView === 'edit' && selectedShipment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Edit Shipment</h1>
          <button
            onClick={() => {
              setCurrentView('list');
              setSelectedShipment(null);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to List
          </button>
        </div>
        <AdminShipmentForm 
          onSubmit={handleEditShipment} 
          initialData={selectedShipment}
          isEditing={true}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin - Shipment Management</h1>
        <button
          onClick={() => setCurrentView('create')}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Shipment
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search shipments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">All Status</option>
          <option value="In Process">In Process</option>
          <option value="In Transit">In Transit</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consignment No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shipper
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="font-mono text-sm font-medium text-gray-900">
                        {shipment.consignmentNo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm text-gray-900">
                      {shipment.trackingNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shipment.shipperName}</div>
                      <div className="text-sm text-gray-500">{shipment.companyName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shipment.consigneeName}</div>
                      <div className="text-sm text-gray-500">{shipment.consigneeCity}, {shipment.consigneeCountry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {shipment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setCurrentView('edit');
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Shipment"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setShowInvoiceModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="View/Edit Invoice"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedShipment(shipment);
                          setShowAWBModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="View/Generate AWB"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {shipments.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new shipment.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedShipment && (
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
                shipment={selectedShipment} 
                onClose={() => setShowInvoiceModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* AWB Modal */}
      {showAWBModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Generate Airway Bill</h2>
                <button
                  onClick={() => setShowAWBModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <PDFGenerator shipment={selectedShipment} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShipmentManagement;