import { useState } from 'react';
import { X, LogIn, UserPlus, Globe, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../utils/supabase/client.tsx';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { MTNPayment } from './MTNPayment';

interface BuyerAuthProps {
  onClose: () => void;
  onSuccess: (session: any) => void;
}

export function BuyerAuth({ onClose, onSuccess }: BuyerAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState('en');
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
    
    if (!name || !email || !password || !phoneNumber) {
      setError('Please fill in all required fields');
      return;
    }

    // Store signup data and show payment
    setPendingData({
      email,
      password,
      name,
      phoneNumber,
      businessName,
      location,
      language
    });
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setLoading(true);
      setError('');

      // Create buyer account after payment
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/buyer-signup`,
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
      signup: 'Sign Up as Buyer',
      email: 'Email',
      password: 'Password',
      name: 'Full Name',
      phoneNumber: 'Phone Number',
      businessName: 'Business Name (Optional)',
      location: 'Location',
      selectLanguage: 'Select Language',
      haveAccount: 'Already have an account?',
      noAccount: "Don't have an account?",
      welcome: 'Welcome Buyers',
      subtitle: 'Connect with verified farmers',
      loginBtn: 'Login to Your Account',
      signupBtn: 'Create Buyer Account',
      paymentRequired: 'Payment Required: 500 FRW verification fee'
    },
    fr: {
      login: 'Connexion',
      signup: 'S\'inscrire en tant qu\'acheteur',
      email: 'Email',
      password: 'Mot de passe',
      name: 'Nom complet',
      phoneNumber: 'Numéro de téléphone',
      businessName: 'Nom de l\'entreprise (optionnel)',
      location: 'Emplacement',
      selectLanguage: 'Sélectionner la langue',
      haveAccount: 'Vous avez déjà un compte?',
      noAccount: "Vous n'avez pas de compte?",
      welcome: 'Bienvenue aux acheteurs',
      subtitle: 'Connectez-vous avec des agriculteurs vérifiés',
      loginBtn: 'Se connecter à votre compte',
      signupBtn: 'Créer un compte acheteur',
      paymentRequired: 'Paiement requis: Frais de vérification de 500 FRW'
    },
    rw: {
      login: 'Injira',
      signup: 'Iyandikishe nk\'umuguzi',
      email: 'Imeyili',
      password: 'Ijambo ryibanga',
      name: 'Amazina yuzuye',
      phoneNumber: 'Numero ya telefone',
      businessName: 'Izina ry\'ubucuruzi (bitari ngombwa)',
      location: 'Aho utuye',
      selectLanguage: 'Hitamo ururimi',
      haveAccount: 'Usanzwe ufite konti?',
      noAccount: 'Ntufite konti?',
      welcome: 'Murakaza neza abaguzi',
      subtitle: 'Huza n\'abahinzi bemejwe',
      loginBtn: 'Injira muri konti yawe',
      signupBtn: 'Fungura konti y\'umuguzi',
      paymentRequired: 'Kwishyura birasabwa: Amafaranga yo kwemeza 500 FRW'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (showPayment) {
    return (
      <MTNPayment
        amount={500}
        purpose="buyer"
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
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-white" />
            <h2 className="text-white text-2xl">{t.welcome}</h2>
          </div>
          <p className="text-blue-100">{t.subtitle}</p>
        </div>

        {/* Form */}
        <div className="p-6">
          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
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
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{lang.flag}</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300">{lang.name}</div>
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
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {t.login}
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {t.signup}
            </button>
          </div>

          {!isLogin && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-amber-700 dark:text-amber-400 text-sm">
              {t.paymentRequired}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.phoneNumber}</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="078XXXXXXX"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.businessName}</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your business or company name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">{t.location}</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Kigali, Rwanda"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? t.noAccount : t.haveAccount}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              {isLogin ? t.signup : t.login}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}