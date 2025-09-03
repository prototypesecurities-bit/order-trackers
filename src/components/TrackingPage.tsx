import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, XCircle, Clock, MapPin, Calendar } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  receiverName: string;
  receiverAddress: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  packageType: string;
  weight: string;
  serviceType: string;
}

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
        'XC12345678ABCD': {
          id: '1',
          trackingNumber: 'XC12345678ABCD',
          senderName: 'John Smith',
          receiverName: 'Jane Doe',
          receiverAddress: '123 Main St, New York, NY 10001',
          status: 'In Transit',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          packageType: 'parcel',
          weight: '2.5',
          serviceType: 'express'
        },
        'XC87654321EFGH': {
          id: '2',
          trackingNumber: 'XC87654321EFGH',
          senderName: 'Alice Johnson',
          receiverName: 'Bob Wilson',
          receiverAddress: '456 Oak Ave, Los Angeles, CA 90210',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 43200000).toISOString(),
          packageType: 'document',
          weight: '0.5',
          serviceType: 'standard'
        },
        'XC11223344IJKL': {
          id: '3',
          trackingNumber: 'XC11223344IJKL',
          senderName: 'Carol Brown',
          receiverName: 'David Lee',
          receiverAddress: '777 Birch Road, Austin, TX 73301',
          status: 'In Process',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          packageType: 'electronics',
          weight: '1.2',
          serviceType: 'overnight'
        },
        'XC99887766MNOP': {
          id: '4',
          trackingNumber: 'XC99887766MNOP',
          senderName: 'Emma Davis',
          receiverName: 'Frank Miller',
          receiverAddress: '999 Willow Way, Denver, CO 80201',
          status: 'In Transit',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          packageType: 'clothing',
          weight: '0.8',
          serviceType: 'express'
        },
        'XC55443322QRST': {
          id: '5',
          trackingNumber: 'XC55443322QRST',
          senderName: 'Grace Wilson',
          receiverName: 'Henry Taylor',
          receiverAddress: '222 Oak Circle, Portland, OR 97201',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString(),
          packageType: 'fragile',
          weight: '3.2',
          serviceType: 'standard'
        },
        'XC77665544UVWX': {
          id: '6',
          trackingNumber: 'XC77665544UVWX',
          senderName: 'Ian Anderson',
          receiverName: 'Julia Roberts',
          receiverAddress: '444 Maple Manor, Nashville, TN 37201',
          status: 'In Process',
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          updatedAt: new Date(Date.now() - 432000000).toISOString(),
          packageType: 'other',
          weight: '1.8',
          serviceType: 'same-day'
        },
        'XC33221100YZAB': {
          id: '7',
          trackingNumber: 'XC33221100YZAB',
          senderName: 'Kevin Brown',
          receiverName: 'Lisa Green',
          receiverAddress: '666 Cedar Court, San Francisco, CA 94101',
          status: 'Cancelled',
          createdAt: new Date(Date.now() - 518400000).toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString(),
          packageType: 'document',
          weight: '0.3',
          serviceType: 'overnight'
        },
        'XC66554433CDEF': {
          id: '8',
          trackingNumber: 'XC66554433CDEF',
          senderName: 'Michael Chen',
          receiverName: 'Nancy White',
          receiverAddress: '888 Spruce Springs, Salt Lake City, UT 84101',
          status: 'In Transit',
          createdAt: new Date(Date.now() - 604800000).toISOString(),
          updatedAt: new Date(Date.now() - 345600000).toISOString(),
          packageType: 'electronics',
          weight: '4.5',
          serviceType: 'express'
        },
        'XC44332211GHIJ': {
          id: '9',
          trackingNumber: 'XC44332211GHIJ',
          senderName: 'Olivia Martinez',
          receiverName: 'Peter Johnson',
          receiverAddress: '101 Aspen Avenue, Cleveland, OH 44101',
          status: 'Delivered',
          createdAt: new Date(Date.now() - 691200000).toISOString(),
          updatedAt: new Date(Date.now() - 432000000).toISOString(),
          packageType: 'parcel',
          weight: '2.1',
          serviceType: 'standard'
        },
        'XC22110099KLMN': {
          id: '10',
          trackingNumber: 'XC22110099KLMN',
          senderName: 'Quinn Davis',
          receiverName: 'Rachel Adams',
          receiverAddress: '303 Cypress Circle, Richmond, VA 23201',
          status: 'In Process',
          createdAt: new Date(Date.now() - 777600000).toISOString(),
          updatedAt: new Date(Date.now() - 777600000).toISOString(),
          packageType: 'fragile',
          weight: '1.5',
          serviceType: 'overnight'
        }
      };
      
      const foundShipment = mockShipments[trackingNumber.toUpperCase()];
      if (foundShipment) {
        setShipment(foundShipment);
      } else {
        setError('Shipment not found. Please check your tracking number.');
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Process':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'In Transit':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Process':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
          <p className="text-gray-600">Enter your tracking number to get real-time updates on your package</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (e.g., XC12345678ABCD)"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track
                </>
              )}
            </button>
          </form>
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
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-red-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Tracking Details</h2>
                  <p className="text-red-100">Tracking Number: {shipment.trackingNumber}</p>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(shipment.status)} bg-white`}>
                    {getStatusIcon(shipment.status)}
                    <span className="font-semibold">{shipment.status}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Package Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package Type:</span>
                      <span className="font-medium capitalize">{shipment.packageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Weight:</span>
                      <span className="font-medium">{shipment.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Type:</span>
                      <span className="font-medium capitalize">{shipment.serviceType.replace('-', ' ')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Delivery Information
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-600">From:</span>
                      <p className="font-medium">{shipment.senderName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">To:</span>
                      <p className="font-medium">{shipment.receiverName}</p>
                      <p className="text-sm text-gray-500">{shipment.receiverAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Shipment Created</p>
                      <p className="text-sm text-gray-500">
                        {new Date(shipment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {shipment.status !== 'In Process' && (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Status Updated</p>
                        <p className="text-sm text-gray-500">
                          {new Date(shipment.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need help? Contact us at{' '}
            <a href="mailto:info@thexpertcourier.com" className="text-red-600 hover:text-red-700">
              info@thexpertcourier.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;