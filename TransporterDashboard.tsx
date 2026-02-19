import { useState, useEffect } from 'react';
import { LogOut, Truck, MapPin, Package, DollarSign, Clock, User, Moon, Sun, Navigation } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useTheme } from './ThemeContext';
import { AIAssistant } from './AIAssistant';

interface TransporterDashboardProps {
  session: any;
  onLogout: () => void;
}

export function TransporterDashboard({ session, onLogout }: TransporterDashboardProps) {
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('active');
  const [trackingMode, setTrackingMode] = useState(false);

  useEffect(() => {
    loadProfile();
    loadDeliveries();
  }, [session]);

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/profile`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );
      const data = await response.json();
      setProfile(data.profile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadDeliveries = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/transporter-deliveries`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );
      const data = await response.json();
      setDeliveries(data.deliveries || []);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const activeDeliveries = deliveries.filter(d => d.status === 'in_transit' || d.status === 'pending');
  const completedDeliveries = deliveries.filter(d => d.status === 'delivered');

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AgriConnect Transporter</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome, {profile?.name || 'Transporter'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Truck className="w-4 h-4 inline mr-2" />
              Active Deliveries ({activeDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Completed ({completedDeliveries.length})
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'earnings'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Earnings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Active Jobs</span>
              <Truck className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{activeDeliveries.length}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Completed</span>
              <Package className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{completedDeliveries.length}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Earnings</span>
              <DollarSign className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-3xl font-bold">
              {completedDeliveries.reduce((sum, d) => sum + (d.fee || 0), 0).toLocaleString()} FRW
            </p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
            <div className="flex items-center justify-between mb-2">
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Rating</span>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-3xl font-bold">4.8</p>
          </div>
        </div>

        {activeTab === 'active' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Active Deliveries</h2>
              <button
                onClick={() => setTrackingMode(!trackingMode)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Navigation className="w-4 h-4" />
                {trackingMode ? 'Exit Tracking' : 'Start GPS Tracking'}
              </button>
            </div>

            {activeDeliveries.length === 0 ? (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-12 text-center`}>
                <Truck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No active deliveries
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{delivery.productName}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Delivery #{delivery.id}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {delivery.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Pickup</p>
                          <p className="font-medium">{delivery.pickupLocation || 'Not specified'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Delivery</p>
                          <p className="font-medium">{delivery.deliveryLocation || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-xl font-bold text-green-600">
                        {delivery.fee || 5000} FRW
                      </span>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Mark as Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Completed Deliveries</h2>
            {completedDeliveries.length === 0 ? (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-12 text-center`}>
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No completed deliveries yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedDeliveries.map((delivery) => (
                  <div
                    key={delivery.id}
                    className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{delivery.productName}</h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Completed: {new Date(delivery.completedAt || delivery.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {delivery.fee || 5000} FRW
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Earnings Summary</h2>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">
                    {completedDeliveries.reduce((sum, d) => sum + (d.fee || 0), 0).toLocaleString()} FRW
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>This Month</p>
                  <p className="text-3xl font-bold">
                    {completedDeliveries
                      .filter(d => new Date(d.completedAt || d.createdAt).getMonth() === new Date().getMonth())
                      .reduce((sum, d) => sum + (d.fee || 0), 0)
                      .toLocaleString()} FRW
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Average per Delivery</p>
                  <p className="text-3xl font-bold">
                    {completedDeliveries.length > 0
                      ? Math.round(
                          completedDeliveries.reduce((sum, d) => sum + (d.fee || 0), 0) / completedDeliveries.length
                        ).toLocaleString()
                      : 0} FRW
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Full Name
                  </label>
                  <p className="text-lg">{profile.name}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <p className="text-lg">{profile.email}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Phone Number
                  </label>
                  <p className="text-lg">{profile.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Vehicle Type
                  </label>
                  <p className="text-lg capitalize">{profile.vehicleType || 'Not specified'}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Location
                  </label>
                  <p className="text-lg">{profile.location || 'Not provided'}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Account Type
                  </label>
                  <p className="text-lg font-semibold text-blue-600">Transporter</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AIAssistant />
    </div>
  );
}
