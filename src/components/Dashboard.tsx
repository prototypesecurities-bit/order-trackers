import React, { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface Stats {
  total: number;
  inProcess: number;
  inTransit: number;
  delivered: number;
  cancelled: number;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    inProcess: 0,
    inTransit: 0,
    delivered: 0,
    cancelled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    // Mock data for demonstration
    setTimeout(() => {
      setStats({
        total: 156,
        inProcess: 23,
        inTransit: 45,
        delivered: 78,
        cancelled: 10
      });
      setLoading(false);
    }, 500);
  };

  const statCards = [
    {
      title: 'Total Shipments',
      value: stats.total,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'In Process',
      value: stats.inProcess,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      title: 'In Transit',
      value: stats.inTransit,
      icon: Truck,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      title: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      title: 'Cancelled',
      value: stats.cancelled,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          Real-time statistics
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onNavigate('new-shipment')}
            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-left transition-colors"
          >
            <Package className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">Create New Shipment</h3>
            <p className="text-sm opacity-90">Add a new package for delivery</p>
          </button>
          <button 
            onClick={() => onNavigate('tracking')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg text-left transition-colors"
          >
            <Truck className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">Track Shipment</h3>
            <p className="text-sm opacity-90">Monitor package status</p>
          </button>
          <button 
            onClick={() => onNavigate('shipments')}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg text-left transition-colors"
          >
            <CheckCircle className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">Update Status</h3>
            <p className="text-sm opacity-90">Change shipment status</p>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">Delivery Success Rate</span>
            <span className="text-green-600 font-bold">
              {stats.total > 0 ? Math.round((stats.delivered / stats.total) * 100) : 0}%
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">Active Shipments</span>
            <span className="text-blue-600 font-bold">
              {stats.inProcess + stats.inTransit}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;