import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TrendingUp, Users, DollarSign, Package } from 'lucide-react';

export function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const stats = [
    { label: 'Total Yield', value: '2,450 kg', change: '+12%', icon: Package, color: 'text-green-600' },
    { label: 'Active Buyers', value: '34', change: '+5', icon: Users, color: 'text-blue-600' },
    { label: 'Revenue', value: '$12,450', change: '+18%', icon: DollarSign, color: 'text-emerald-600' },
    { label: 'Growth Rate', value: '15.8%', change: '+2.3%', icon: TrendingUp, color: 'text-orange-600' }
  ];

  const recentTransactions = [
    { buyer: 'Green Valley Co-op', commodity: 'Wheat', quantity: '500 kg', amount: '$450', status: 'Completed' },
    { buyer: 'Fresh Foods Ltd', commodity: 'Tomatoes', quantity: '200 kg', amount: '$380', status: 'Pending' },
    { buyer: 'Organic Markets', commodity: 'Rice', quantity: '750 kg', amount: '$620', status: 'Completed' }
  ];

  const weatherData = [
    { day: 'Mon', temp: '28°C', condition: '☀️', rain: '0%' },
    { day: 'Tue', temp: '26°C', condition: '⛅', rain: '10%' },
    { day: 'Wed', temp: '24°C', condition: '🌧️', rain: '70%' },
    { day: 'Thu', temp: '25°C', condition: '⛅', rain: '30%' },
    { day: 'Fri', temp: '27°C', condition: '☀️', rain: '5%' }
  ];

  return (
    <section id="dashboard" className="py-20 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
            Dashboard Preview
          </div>
          <h2 className="text-gray-900 mb-4">
            Manage Your Farm from One Central Hub
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get a complete overview of your farming operations, track performance, 
            and make informed decisions with our intuitive dashboard.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Welcome back,</p>
                <p className="text-white">Farmer Dashboard</p>
              </div>
              <div className="px-4 py-2 bg-white/20 text-white rounded-lg backdrop-blur-sm">
                November 8, 2025
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-8 bg-gray-50">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-green-600 text-sm">{stat.change}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-8">
            <div className="flex gap-6">
              {['overview', 'marketplace', 'weather', 'insights'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-3 capitalize transition-colors relative ${
                    selectedTab === tab
                      ? 'text-green-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                  {selectedTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {selectedTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Transactions */}
                <div>
                  <h3 className="text-gray-900 mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {recentTransactions.map((transaction, index) => (
                      <div 
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-gray-900">{transaction.buyer}</p>
                          <p className="text-gray-600 text-sm">
                            {transaction.commodity} - {transaction.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">{transaction.amount}</p>
                          <span className={`text-sm px-2 py-1 rounded ${
                            transaction.status === 'Completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors text-left">
                      <div className="text-2xl mb-2">📊</div>
                      <p>Add Yield Data</p>
                    </button>
                    <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors text-left">
                      <div className="text-2xl mb-2">🛒</div>
                      <p>Post Product</p>
                    </button>
                    <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors text-left">
                      <div className="text-2xl mb-2">🌤️</div>
                      <p>Check Weather</p>
                    </button>
                    <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors text-left">
                      <div className="text-2xl mb-2">💬</div>
                      <p>Get Advice</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'marketplace' && (
              <div>
                <h3 className="text-gray-900 mb-4">Active Marketplace Listings</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {['Wheat - 1000kg', 'Rice - 800kg', 'Tomatoes - 500kg'].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        🌾
                      </div>
                      <p className="text-gray-900 mb-2">{item}</p>
                      <p className="text-gray-600 text-sm mb-4">12 buyer inquiries</p>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'weather' && (
              <div>
                <h3 className="text-gray-900 mb-4">5-Day Weather Forecast</h3>
                <div className="grid grid-cols-5 gap-4">
                  {weatherData.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                      <p className="text-gray-900 mb-2">{day.day}</p>
                      <div className="text-3xl mb-2">{day.condition}</div>
                      <p className="text-gray-900 mb-1">{day.temp}</p>
                      <p className="text-blue-600 text-sm">💧 {day.rain}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-900">🌧️ Rain expected on Wednesday - Consider postponing irrigation activities</p>
                </div>
              </div>
            )}

            {selectedTab === 'insights' && (
              <div>
                <h3 className="text-gray-900 mb-4">Agricultural Insights & Tips</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        💡
                      </div>
                      <div>
                        <p className="text-gray-900 mb-2">Optimal Planting Time</p>
                        <p className="text-gray-600">Based on current weather patterns and soil conditions, next week is ideal for planting winter crops.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        🐛
                      </div>
                      <div>
                        <p className="text-gray-900 mb-2">Pest Alert</p>
                        <p className="text-gray-600">Aphid activity reported in your region. Consider organic pest control methods for prevention.</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        📈
                      </div>
                      <div>
                        <p className="text-gray-900 mb-2">Market Trend</p>
                        <p className="text-gray-600">Organic produce prices are up 15% this season. Great time to list your organic crops!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
