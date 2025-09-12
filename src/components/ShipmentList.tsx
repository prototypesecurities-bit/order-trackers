import React, { useState, useEffect } from 'react';
import { Search, Filter, Package, Edit, Eye, Download, XCircle } from 'lucide-react';
import { Shipment } from '../types/shipment';
import PDFGenerator from './PDFGenerator';

const ShipmentList: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  useEffect(() => {
    fetchShipments();
  }, [searchTerm, statusFilter]);

  const fetchShipments = async () => {
    // Mock shipments data
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
          senderPhone: '+1-555-0101',
          senderEmail: 'john.smith@email.com',
          senderAddress: '123 Oak Street, New York, NY 10001',
          receiverName: 'Jane Doe',
          receiverEmail: 'jane@receiver.com',
          receiverPhone: '+1-555-0102',
          receiverAddress: '456 Pine Avenue',
          receiverCity: 'Los Angeles',
          receiverCountry: 'United States',
          receiverComments: '',
          accountNo: '992',
          shipperReference: 'AHSAN KHAN',
          shipmentType: 'Commercial',
          service: 'Express',
          pieces: '1',
          origin: 'Pakistan',
          totalVolumetricWeight: '2.5',
          destination: 'United States',
          weight: '2.0',
          comments: 'Handle with care',
          description: 'Electronic components',
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
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          trackingNumber: 'XC87654321EFGH',
          senderName: 'Alice Johnson',
          senderPhone: '+1-555-0201',
          senderEmail: 'alice.johnson@email.com',
          senderAddress: '789 Maple Drive, Chicago, IL 60601',
          receiverName: 'Bob Wilson',
          receiverPhone: '+1-555-0202',
          receiverEmail: 'bob.wilson@email.com',
          receiverAddress: '321 Elm Street, Miami, FL 33101',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
          packageType: 'document',
          serviceType: 'standard',
          weight: '0.5',
          dimensions: '25 x 18 x 2',
          value: '50.00',
          specialInstructions: ''
        },
        {
          id: '3',
          trackingNumber: 'XC11223344IJKL',
          senderName: 'Carol Brown',
          senderPhone: '+1-555-0301',
          senderEmail: 'carol.brown@email.com',
          senderAddress: '555 Cedar Lane, Seattle, WA 98101',
          receiverName: 'David Lee',
          receiverPhone: '+1-555-0302',
          receiverEmail: 'david.lee@email.com',
          receiverAddress: '777 Birch Road, Austin, TX 73301',
          status: 'In Process',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          packageType: 'electronics',
          serviceType: 'overnight',
          weight: '1.2',
          dimensions: '20 x 15 x 10',
          value: '300.00',
          specialInstructions: 'Fragile - Electronics'
        },
        {
          id: '4',
          trackingNumber: 'XC99887766MNOP',
          senderName: 'Emma Davis',
          senderPhone: '+1-555-0401',
          senderEmail: 'emma.davis@email.com',
          senderAddress: '888 Spruce Street, Boston, MA 02101',
          receiverName: 'Frank Miller',
          receiverPhone: '+1-555-0402',
          receiverEmail: 'frank.miller@email.com',
          receiverAddress: '999 Willow Way, Denver, CO 80201',
          status: 'In Transit',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          packageType: 'clothing',
          serviceType: 'express',
          weight: '0.8',
          dimensions: '35 x 25 x 5',
          value: '75.00',
          specialInstructions: 'Gift wrapping included'
        },
        {
          id: '5',
          trackingNumber: 'XC55443322QRST',
          senderName: 'Grace Wilson',
          senderPhone: '+1-555-0501',
          senderEmail: 'grace.wilson@email.com',
          senderAddress: '111 Ash Boulevard, Phoenix, AZ 85001',
          receiverName: 'Henry Taylor',
          receiverPhone: '+1-555-0502',
          receiverEmail: 'henry.taylor@email.com',
          receiverAddress: '222 Oak Circle, Portland, OR 97201',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          packageType: 'fragile',
          serviceType: 'standard',
          weight: '3.2',
          dimensions: '40 x 30 x 20',
          value: '200.00',
          specialInstructions: 'Fragile - Glass items'
        },
        {
          id: '6',
          trackingNumber: 'XC77665544UVWX',
          senderName: 'Ian Anderson',
          senderPhone: '+1-555-0601',
          senderEmail: 'ian.anderson@email.com',
          senderAddress: '333 Pine Plaza, Atlanta, GA 30301',
          receiverName: 'Julia Roberts',
          receiverPhone: '+1-555-0602',
          receiverEmail: 'julia.roberts@email.com',
          receiverAddress: '444 Maple Manor, Nashville, TN 37201',
          status: 'In Process',
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          updatedAt: new Date(Date.now() - 432000000).toISOString(),
          packageType: 'other',
          serviceType: 'same-day',
          weight: '1.8',
          dimensions: '25 x 25 x 25',
          value: '120.00',
          specialInstructions: 'Perishable goods'
        },
        {
          id: '7',
          trackingNumber: 'XC33221100YZAB',
          senderName: 'Kevin Brown',
          senderPhone: '+1-555-0701',
          senderEmail: 'kevin.brown@email.com',
          senderAddress: '555 Elm Estate, Las Vegas, NV 89101',
          receiverName: 'Lisa Green',
          receiverPhone: '+1-555-0702',
          receiverEmail: 'lisa.green@email.com',
          receiverAddress: '666 Cedar Court, San Francisco, CA 94101',
          status: 'Cancelled',
          createdAt: new Date(Date.now() - 518400000).toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
          packageType: 'document',
          serviceType: 'overnight',
          weight: '0.3',
          dimensions: '30 x 21 x 1',
          value: '25.00',
          specialInstructions: 'Urgent delivery required'
        },
        {
          id: '8',
          trackingNumber: 'XC66554433CDEF',
          senderName: 'Michael Chen',
          senderPhone: '+1-555-0801',
          senderEmail: 'michael.chen@email.com',
          senderAddress: '777 Birch Bay, Minneapolis, MN 55401',
          receiverName: 'Nancy White',
          receiverPhone: '+1-555-0802',
          receiverEmail: 'nancy.white@email.com',
          receiverAddress: '888 Spruce Springs, Salt Lake City, UT 84101',
          status: 'In Transit',
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date(Date.now() - 345600000).toISOString(),
          packageType: 'electronics',
          serviceType: 'express',
          weight: '4.5',
          dimensions: '50 x 40 x 30',
          value: '800.00',
          specialInstructions: 'Signature required'
        },
        {
          id: '9',
          trackingNumber: 'XC44332211GHIJ',
          senderName: 'Olivia Martinez',
          senderPhone: '+1-555-0901',
          senderEmail: 'olivia.martinez@email.com',
          senderAddress: '999 Willow Woods, Tampa, FL 33601',
          receiverName: 'Peter Johnson',
          receiverPhone: '+1-555-0902',
          receiverEmail: 'peter.johnson@email.com',
          receiverAddress: '101 Aspen Avenue, Cleveland, OH 44101',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 691200000).toISOString(),
          updatedAt: new Date(Date.now() - 432000000).toISOString(),
          packageType: 'parcel',
          serviceType: 'standard',
          weight: '2.1',
          dimensions: '28 x 22 x 12',
          value: '95.00',
          specialInstructions: 'Leave at front door'
        },
        {
          id: '10',
          trackingNumber: 'XC22110099KLMN',
          senderName: 'Quinn Davis',
          senderPhone: '+1-555-1001',
          senderEmail: 'quinn.davis@email.com',
          senderAddress: '202 Redwood Ridge, Sacramento, CA 95801',
          receiverName: 'Rachel Adams',
          receiverPhone: '+1-555-1002',
          receiverEmail: 'rachel.adams@email.com',
          receiverAddress: '303 Cypress Circle, Richmond, VA 23201',
          status: 'In Process',
          createdAt: new Date(Date.now() - 777600000).toISOString(),
          updatedAt: new Date(Date.now() - 777600000).toISOString(),
          packageType: 'fragile',
          serviceType: 'overnight',
          weight: '1.5',
          dimensions: '22 x 18 x 8',
          value: '180.00',
          specialInstructions: 'Handle with extreme care'
        }
      ];
      
      let filteredShipments = [...mockShipments];
      
      if (searchTerm) {
        filteredShipments = filteredShipments.filter(s => 
          s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const updateStatus = async (shipmentId: string, newStatus: string) => {
    // Mock status update
    setShipments(prev => prev.map(s => 
      s.id === shipmentId 
        ? { ...s, status: newStatus }
        : s
    ));
    setEditingStatus(null);
  };

  const handleDownloadAWB = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowPDFModal(true);
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
        <h1 className="text-2xl font-bold text-gray-900">Shipments</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tracking Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sender
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
                        {shipment.trackingNumber}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.senderName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {shipment.receiverName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingStatus === shipment.id ? (
                      <select
                        value={shipment.status}
                        onChange={(e) => updateStatus(shipment.id, e.target.value)}
                        onBlur={() => setEditingStatus(null)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                        autoFocus
                      >
                        <option value="In Process">In Process</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${getStatusColor(shipment.status)}`}
                        onClick={() => setEditingStatus(shipment.id)}
                      >
                        {shipment.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {shipment.serviceType.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingStatus(shipment.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Status"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadAWB(shipment)}
                        className="text-green-600 hover:text-green-900"
                        title="Download AWB"
                      >
                        <Download className="w-4 h-4" />
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

      {/* PDF Modal */}
      {showPDFModal && selectedShipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Download Airway Bill</h2>
                <button
                  onClick={() => setShowPDFModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
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

export default ShipmentList;