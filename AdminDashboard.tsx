import { useState, useEffect } from 'react';
import { LogOut, Users, Package, Truck, DollarSign, TrendingUp, Shield, Moon, Sun, Search, AlertCircle } from 'lucide-react';
import { supabase } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useTheme } from './ThemeContext';
import { AIAssistant } from './AIAssistant';

interface AdminDashboardProps {
  session: any;
  onLogout: () => void;
}

export function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const { isDark, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    farmers: 0,
    buyers: 0,
    transporters: 0,
    products: 0,
    orders: 0,
    revenue: 0
  });
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProfile();
    loadStats();
    loadUsers();
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

  const loadStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/admin-stats`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );
      const data = await response.json();
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/admin-users`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.userType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AgriConnect Admin Portal</h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Welcome, {profile?.adminUsername || 'Admin'}
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
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Manage Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'payments'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Payments
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'reports'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Reports
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Platform Overview</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Farmers</span>
                  <Users className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{stats.farmers}</p>
                <p className="text-sm text-green-600 mt-2">+12% this month</p>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Buyers</span>
                  <Package className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold">{stats.buyers}</p>
                <p className="text-sm text-blue-600 mt-2">+8% this month</p>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Transporters</span>
                  <Truck className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">{stats.transporters}</p>
                <p className="text-sm text-purple-600 mt-2">+5% this month</p>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Active Products</span>
                  <Package className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold">{stats.products}</p>
                <p className="text-sm text-gray-500 mt-2">Listed on platform</p>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Orders</span>
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-3xl font-bold">{stats.orders}</p>
                <p className="text-sm text-indigo-600 mt-2">+20% this month</p>
              </div>

              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Platform Revenue</span>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{stats.revenue.toLocaleString()} FRW</p>
                <p className="text-sm text-green-600 mt-2">+15% this month</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    New farmer registered: John Doe
                  </p>
                  <span className={`ml-auto text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    2 mins ago
                  </span>
                </div>
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    New product listed: Fresh Tomatoes
                  </p>
                  <span className={`ml-auto text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    15 mins ago
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Delivery completed by Transporter #123
                  </p>
                  <span className={`ml-auto text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    1 hour ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Users</h2>
              <div className={`flex items-center gap-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md px-4 py-2`}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className={`bg-transparent outline-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                />
              </div>
            </div>

            {filteredUsers.length === 0 ? (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-12 text-center`}>
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  No users found
                </p>
              </div>
            ) : (
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
                <table className="w-full">
                  <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.userType === 'farmer'
                              ? 'bg-green-100 text-green-800'
                              : user.userType === 'buyer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {user.userType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            user.paymentVerified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.paymentVerified ? 'Active' : 'Pending Payment'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-800">Suspend</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Payment Management</h2>
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Registration Fees Collected</p>
                  <p className="text-3xl font-bold text-green-600">
                    {((stats.farmers * 2500) + (stats.buyers * 1500) + (stats.transporters * 1000)).toLocaleString()} FRW
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Pending Verifications</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {users.filter(u => !u.paymentVerified).length}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Transaction Volume</p>
                  <p className="text-3xl font-bold">
                    {stats.orders}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Platform Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <h3 className="font-bold text-lg mb-4">User Growth</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart placeholder - User growth over time
                </div>
              </div>
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
                <h3 className="font-bold text-lg mb-4">Revenue Analytics</h3>
                <div className="h-64 flex items-center justify-center text-gray-400">
                  Chart placeholder - Revenue trends
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
