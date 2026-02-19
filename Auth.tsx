import { useState } from 'react';
import { X, LogIn, UserPlus, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../utils/supabase/client.tsx';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { MTNPayment } from './MTNPayment';

interface AuthProps {
  onClose: () => void;
  onSuccess: (session: any) => void;
}

type UserRole = 'farmer' | 'buyer' | 'transporter' | 'admin';

export function Auth({ onClose, onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState('en');
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [farmType, setFarmType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;

      onSuccess(data.session);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    // Admin users don't need payment
    if (userRole === 'admin') {
      handleAdminSignup();
      return;
    }

    // Store signup data and show payment
    setPendingData({
      email,
      password,
      name,
      userRole,
      language,
      location,
      farmSize,
      farmType,
      phoneNumber,
      idNumber,
      businessName,
      vehicleType,
      adminUsername
    });
    setShowPayment(true);
  };

  // Get payment amount based on user role
  const getPaymentAmount = () => {
    switch (userRole) {
      case 'farmer': return 2500;
      case 'buyer': return 1500;
      case 'transporter': return 1000;
      case 'admin': return 0;
      default: return 2500;
    }
  };

  // Get payment message based on user role
  const getPaymentMessage = () => {
    switch (userRole) {
      case 'farmer': 
        return {
          en: 'Payment Required: 2,500 FRW activation fee',
          fr: 'Paiement requis: Frais d\'activation de 2,500 FRW',
          rw: 'Kwishyura birasabwa: Amafaranga yo gutangiza 2,500 FRW'
        };
      case 'buyer':
        return {
          en: 'Payment Required: 1,500 FRW verification fee',
          fr: 'Paiement requis: Frais de vérification de 1,500 FRW',
          rw: 'Kwishyura birasabwa: Amafaranga yo kwemeza 1,500 FRW'
        };
      case 'transporter':
        return {
          en: 'Payment Required: 1,000 FRW registration fee',
          fr: 'Paiement requis: Frais d\'inscription de 1,000 FRW',
          rw: 'Kwishyura birasabwa: Amafaranga yo kwiyandikisha 1,000 FRW'
        };
      case 'admin':
        return {
          en: 'Admin registration - No payment required',
          fr: 'Inscription admin - Aucun paiement requis',
          rw: 'Kwiyandikisha kwa admin - Ntakwishyura bisabwa'
        };
      default:
        return {
          en: 'Payment Required: 2,500 FRW activation fee',
          fr: 'Paiement requis: Frais d\'activation de 2,500 FRW',
          rw: 'Kwishyura birasabwa: Amafaranga yo gutangiza 2,500 FRW'
        };
    }
  };

  const handleAdminSignup = async () => {
    try {
      setLoading(true);
      setError('');

      // Create admin account without payment
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            email,
            password,
            name,
            userRole: 'admin',
            language,
            location,
            adminUsername
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create admin account');
      }

      // Now login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;

      onSuccess(data.session);
    } catch (err: any) {
      console.error('Admin signup error:', err);
      setError(err.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      setError('');

      // Create farmer account after payment
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify(pendingData)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }

      // Now login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: pendingData.email,
        password: pendingData.password
      });

      if (loginError) throw loginError;

      onSuccess(data.session);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create account');
      setShowPayment(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignupRequest(e);
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
  ];

  const translations = {
    en: {
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      location: 'Location',
      farmSize: 'Farm Size (acres)',
      farmType: 'Farm Type',
      selectLanguage: 'Select Language',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      welcome: 'Welcome to AgriConnect',
      subtitle: 'Your private farming assistant',
      loginBtn: 'Login to Your Account',
      signupBtn: 'Create New Account',
      paymentRequired: 'Payment Required: 2,500 FRW activation fee'
    },
    fr: {
      login: 'Connexion',
      signup: "S'inscrire",
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom complet',
      location: 'Emplacement',
      farmSize: 'Taille de la ferme (acres)',
      farmType: 'Type de ferme',
      selectLanguage: 'Sélectionner la langue',
      createAccount: 'Créer un compte',
      haveAccount: 'Vous avez déjà un compte?',
      noAccount: "Vous n'avez pas de compte?",
      welcome: 'Bienvenue sur AgriConnect',
      subtitle: 'Votre assistant agricole privé',
      loginBtn: 'Se connecter à votre compte',
      signupBtn: 'Créer un nouveau compte',
      paymentRequired: 'Paiement requis: Frais d\'activation de 2,500 FRW'
    },
    rw: {
      login: 'Injira',
      signup: 'Iyandikishe',
      email: 'Imeyili',
      password: 'Ijambo ryibanga',
      name: 'Amazina yuzuye',
      location: 'Aho utuye',
      farmSize: 'Ubunini bw\'umurima (acres)',
      farmType: 'Ubwoko bw\'ubuhinzi',
      selectLanguage: 'Hitamo ururimi',
      createAccount: 'Fungura konti',
      haveAccount: 'Usanzwe ufite konti?',
      noAccount: 'Ntufite konti?',
      welcome: 'Murakaza neza kuri AgriConnect',
      subtitle: 'Umufasha wawe wihariye mu buhinzi',
      loginBtn: 'Injira muri konti yawe',
      signupBtn: 'Fungura konti nshya',
      paymentRequired: 'Kwishyura birasabwa: Amafaranga yo gutangiza 2,500 FRW'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (showPayment) {
    return (
      <MTNPayment
        amount={getPaymentAmount()}
        purpose="farmer"
        onSuccess={handlePaymentSuccess}
        onCancel={() => {
          setShowPayment(false);
          setPendingData(null);
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-white mb-2">{t.welcome}</h2>
          <p className="text-green-100">{t.subtitle}</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {t.selectLanguage}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    language === lang.code
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-xs text-gray-700">{lang.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                isLogin
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.signup}
            </button>
          </div>

          {!isLogin && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
              {userRole === 'admin' 
                ? 'Admin registration - No payment required' 
                : getPaymentMessage()[language]}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 mb-2">{t.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Register As</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 font-medium bg-white"
                  required
                >
                  <option value="farmer">👨‍🌾 Farmer</option>
                  <option value="buyer">🛒 Buyer</option>
                  <option value="transporter">🚚 Transporter</option>
                  <option value="admin">👤 Admin</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-700 mb-2">{t.location}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Kigali, Rwanda"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {userRole !== 'admin' && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number (MTN Mobile Money)</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="e.g., 0788123456"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Rwandan ID Number</label>
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        placeholder="e.g., 1199780012345678"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  </>
                )}

                {userRole === 'admin' && (
                  <div>
                    <label className="block text-gray-700 mb-2">Admin Username</label>
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="Enter authorized admin username"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Only authorized admin usernames allowed</p>
                  </div>
                )}

                {userRole === 'buyer' && (
                  <div>
                    <label className="block text-gray-700 mb-2">Business Name (Optional)</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g., Kigali Fresh Produce"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                )}

                {userRole === 'transporter' && (
                  <div>
                    <label className="block text-gray-700 mb-2">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select vehicle type...</option>
                      <option value="motorcycle">Motorcycle</option>
                      <option value="pickup">Pickup Truck</option>
                      <option value="van">Van</option>
                      <option value="truck">Large Truck</option>
                    </select>
                  </div>
                )}

                {userRole === 'farmer' && (
                  <>
                    <div>
                      <label className="block text-gray-700 mb-2">{t.farmSize}</label>
                      <input
                        type="text"
                        value={farmSize}
                        onChange={(e) => setFarmSize(e.target.value)}
                        placeholder="e.g., 5 acres"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">{t.farmType}</label>
                      <select
                        value={farmType}
                        onChange={(e) => setFarmType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select type...</option>
                        <option value="crops">Crops Only</option>
                        <option value="livestock">Livestock Only</option>
                        <option value="mixed">Mixed (Crops & Livestock)</option>
                        <option value="dairy">Dairy Farm</option>
                        <option value="poultry">Poultry Farm</option>
                      </select>
                    </div>
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  {isLogin ? t.loginBtn : t.signupBtn}
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            {isLogin ? t.noAccount : t.haveAccount}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-2 text-green-600 hover:text-green-700"
            >
              {isLogin ? t.signup : t.login}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}