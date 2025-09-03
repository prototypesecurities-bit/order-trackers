import React, { useState, useEffect } from 'react';
import { Package, Search, Plus, LogOut, BarChart3, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ShipmentForm from './components/ShipmentForm';
import TrackingPage from './components/TrackingPage';
import ShipmentList from './components/ShipmentList';

interface User {
  id: number;
  email: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<User | null>({
    id: 1,
    email: 'info@thexpertcourier.com',
    role: 'admin'
  });
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setCurrentPage('tracking');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (currentPage === 'tracking') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img 
                  src="https://thexpertcourier.com/wp-content/uploads/2024/04/xpert_logo_main_2.png" 
                  alt="The Xpert Courier" 
                  className="h-10"
                />
              </div>
              <div className="flex gap-2">
                {user && (
                  <button
                    onClick={() => setCurrentPage('dashboard')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Dashboard
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
        <TrackingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="https://thexpertcourier.com/wp-content/uploads/2024/04/xpert_logo_main_2.png" 
                alt="The Xpert Courier" 
                className="h-10"
              />
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'dashboard' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentPage('shipments')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'shipments' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4" />
                Shipments
              </button>
              <button
                onClick={() => setCurrentPage('new-shipment')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'new-shipment' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus className="w-4 h-4" />
                New Shipment
              </button>
              <button
                onClick={() => setCurrentPage('tracking')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'tracking' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Search className="w-4 h-4" />
                Track Package
              </button>
            </nav>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
        {currentPage === 'shipments' && <ShipmentList />}
        {currentPage === 'new-shipment' && <ShipmentForm />}
      </main>
    </div>
  );
}

export default App;