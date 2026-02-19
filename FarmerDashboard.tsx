import { useState, useEffect } from 'react';
import { LogOut, Plus, Calendar, CloudSun, MessageSquare, Package, ShoppingBag, TrendingUp, Edit2, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../utils/supabase/client.tsx';
import { projectId } from '../utils/supabase/info';
import { ProductManager } from './ProductManager';
import { WeatherWidget } from './WeatherWidget';
import { FarmerChat } from './FarmerChat';
import { MarketplaceDashboard } from './MarketplaceDashboard';
import { Settings } from './Settings';
import { useTheme } from './ThemeContext';

interface FarmerDashboardProps {
  session: any;
  onLogout: () => void;
}

export function FarmerDashboard({ session, onLogout }: FarmerDashboardProps) {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadProducts();
  }, []);

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
      if (response.ok) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Load profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/products`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Load products error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'community', label: 'Community Chat', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  const translations = {
    en: {
      welcome: 'Welcome back',
      totalProducts: 'Total Products',
      activeListings: 'Active Listings',
      thisWeek: 'This Week',
      quickActions: 'Quick Actions',
      addProduct: 'Add Product',
      checkWeather: 'Check Weather',
      viewMarket: 'View Market',
      joinChat: 'Join Chat'
    },
    fr: {
      welcome: 'Bon retour',
      totalProducts: 'Total des produits',
      activeListings: 'Annonces actives',
      thisWeek: 'Cette semaine',
      quickActions: 'Actions rapides',
      addProduct: 'Ajouter un produit',
      checkWeather: 'Vérifier la météo',
      viewMarket: 'Voir le marché',
      joinChat: 'Rejoindre le chat'
    },
    rw: {
      welcome: 'Turakwakira',
      totalProducts: 'Ibicuruzwa byose',
      activeListings: 'Ibibanza bikora',
      thisWeek: 'Iki cyumweru',
      quickActions: 'Ibikorwa byihuse',
      addProduct: 'Ongeraho ibicuruzwa',
      checkWeather: 'Reba ikirere',
      viewMarket: 'Reba isoko',
      joinChat: 'Injira mu biganiro'
    }
  };

  const lang = profile?.language || 'en';
  const t = translations[lang as keyof typeof translations] || translations.en;

  const stats = [
    {
      label: t.totalProducts,
      value: products.length.toString(),
      icon: Package,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: t.activeListings,
      value: '0',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: t.thisWeek,
      value: '+3',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 dark:text-white">
                {t.welcome}, {profile?.name || 'Farmer'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {profile?.location && `📍 ${profile.location}`}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div>
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${stat.bg} dark:bg-opacity-20 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color} dark:opacity-90`} />
                      </div>
                      <span className={`${stat.color} dark:opacity-90`}>{stat.value}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
              <h3 className="text-gray-900 dark:text-white mb-4">{t.quickActions}</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-left transition-colors"
                >
                  <Package className="w-8 h-8 text-green-600 dark:text-green-400 mb-2" />
                  <p className="text-gray-900 dark:text-white">{t.addProduct}</p>
                </button>
                <button
                  onClick={() => setActiveTab('weather')}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-left transition-colors"
                >
                  <CloudSun className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-gray-900 dark:text-white">{t.checkWeather}</p>
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className="p-4 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg text-left transition-colors"
                >
                  <ShoppingBag className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
                  <p className="text-gray-900 dark:text-white">{t.viewMarket}</p>
                </button>
                <button
                  onClick={() => setActiveTab('community')}
                  className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-left transition-colors"
                >
                  <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="text-gray-900 dark:text-white">{t.joinChat}</p>
                </button>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-gray-900 dark:text-white mb-4">Recent Products</h3>
              {products.length > 0 ? (
                <div className="space-y-3">
                  {products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          {product.type === 'livestock' ? '🐄' : '🌾'}
                        </div>
                        <div>
                          <p className="text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {product.quantity} {product.unit}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{product.category}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No products added yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <ProductManager session={session} onUpdate={loadProducts} />
        )}

        {activeTab === 'weather' && (
          <WeatherWidget location={profile?.location} language={lang} />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceDashboard session={session} profile={profile} />
        )}

        {activeTab === 'community' && (
          <FarmerChat session={session} profile={profile} />
        )}

        {activeTab === 'settings' && (
          <Settings session={session} profile={profile} onUpdate={loadProfile} />
        )}
      </div>
    </div>
  );
}