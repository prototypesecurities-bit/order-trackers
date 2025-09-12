import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Calendar } from 'lucide-react';
import { Shipment } from '../types/shipment';

const TrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    setShipment(null);

    // Mock tracking data
    setTimeout(() => {
      const mockShipments: Record<string, Shipment> = {
        '10150159': {
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
          consigneeComments: '',
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
          createdAt: '2025-08-18',
          updatedAt: new Date().toISOString(),
          timeline: [
            {
              date: '25 Aug 2025',
              time: '11:30',
              location: 'LONDON',
              description: 'Shipment is in Custom Clearance'
            },
            {
              date: '24 Aug 2025',
              time: '19:13',
              location: 'LONDON',
              description: 'Shipment is in Custom Clearance'
            },
            {
              date: '23 Aug 2025',
              time: '15:29',
              location: 'LONDON',
              description: 'Shipment is in Custom Clearance'
            },
            {
              date: '22 Aug 2025',
              time: '20:15',
              location: 'LONDON',
              description: 'Shipment Arrived at Airport'
            }
          ]
        },
        'XC12345678ABCD': {
          id: '2',
          trackingNumber: 'XC12345678ABCD',
          consignmentNo: 'XC12345678',
          companyName: 'Global Imports Ltd.',
          shipperName: 'John Smith',
          shipperEmail: 'john@globalimports.com',
          shipperAddress: '789 Trade Center',
          shipperCity: 'Chicago',
          shipperCountry: 'United States',
          shipperPostalCode: '60601',
          receiverName: 'Jane Doe',
          receiverEmail: 'jane@receiver.com',
          receiverPhone: '+1-555-0202',
          receiverAddress: '456 Oak Ave',
          receiverCity: 'Los Angeles',
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
          status: 'In Transit',
          createdAt: '2025-01-15',
          updatedAt: new Date().toISOString(),
          timeline: [
            {
              date: '16 Jan 2025',
              time: '14:30',
              location: 'NEW YORK',
              description: 'Out for Delivery'
            },
            {
              date: '16 Jan 2025',
              time: '09:15',
              location: 'NEW YORK',
              description: 'Arrived at Local Facility'
            },
            {
              date: '15 Jan 2025',
              time: '18:45',
              location: 'CHICAGO',
              description: 'In Transit to Destination'
            },
            {
              date: '15 Jan 2025',
              time: '10:00',
              location: 'CHICAGO',
              description: 'Package Picked Up'
            }
          ]
        }
      };
      
      const foundShipment = mockShipments[trackingNumber] || mockShipments[trackingNumber.toUpperCase()];
      if (foundShipment) {
        setShipment(foundShipment);
      } else {
        setError('Shipment not found. Please check your tracking number.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          {/* Left side - APX Logo */}
          <div className="flex items-center">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
              APX
            </div>
            <div className="ml-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide">Int'l Courier & Cargo</div>
            </div>
          </div>

          {/* Right side - Track Your Parcel */}
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Parcel</h1>
            <p className="text-gray-600 mb-4">Another Tracking</p>
            
            <form onSubmit={handleSearch} className="space-y-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter Consignment No"
                className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Tracking...' : 'Track'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {shipment && (
          <div className="space-y-8">
            {/* Shipment Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-700 font-medium">Consignment No.</span>
                    <p className="text-gray-900 font-semibold">{shipment.consignmentNo}</p>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Shipper Name</span>
                    <p className="text-gray-900 font-semibold">{shipment.shipperName}</p>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Booking Date</span>
                    <p className="text-gray-900 font-semibold">{shipment.createdAt}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-700 font-medium">Tracking No.</span>
                    <p className="text-gray-900 font-semibold">{shipment.trackingNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Consignee Name</span>
                    <p className="text-gray-900 font-semibold">{shipment.consigneeName}</p>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Status</span>
                    <p className="text-gray-900 font-semibold">{shipment.status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-700">
                        Date & Time
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-700">
                        Location
                      </th>
                      <th className="px-8 py-4 text-left text-sm font-medium text-gray-700">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipment.timeline.map((event, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-8 py-4 text-sm text-gray-900">
                          {event.date} {event.time}
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-900 font-medium">
                          {event.location}
                        </td>
                        <td className="px-8 py-4 text-sm text-gray-700">
                          {event.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional tracking notice */}
            <div className="text-right">
              <p className="text-gray-400 text-sm">
                Act to
                <br />
                Go to
              </p>
            </div>
          </div>
        )}

        {!shipment && !error && !loading && (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Track Your Shipment</h3>
            <p className="text-gray-500">
              Enter your consignment number above to get real-time updates on your package
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;