import { useState } from 'react';
import { Globe, Moon, Sun, Save, CreditCard, Crown } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { projectId } from '../utils/supabase/info';

interface SettingsProps {
  session: any;
  profile: any;
  onUpdate: () => void;
}

export function Settings({ session, profile, onUpdate }: SettingsProps) {
  const { theme, toggleTheme } = useTheme();
  const [language, setLanguage] = useState(profile?.language || 'en');
  const [saving, setSaving] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'rw', name: 'Ikinyarwanda', flag: '🇷🇼' }
  ];

  const translations = {
    en: {
      settings: 'Settings',
      languageSettings: 'Language Settings',
      selectLanguage: 'Select your preferred language',
      themeSettings: 'Theme Settings',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      supportDeveloper: 'Support Developer',
      supportDesc: 'Support the development of AgriConnect',
      monthlyPlan: 'Monthly Plan',
      yearlyPlan: 'Yearly Plan',
      premiumFeatures: 'Premium Features',
      prioritySupport: 'Priority Support',
      advancedAnalytics: 'Advanced Analytics',
      unlimitedListings: 'Unlimited Listings'
    },
    fr: {
      settings: 'Paramètres',
      languageSettings: 'Paramètres de langue',
      selectLanguage: 'Sélectionnez votre langue préférée',
      themeSettings: 'Paramètres du thème',
      lightMode: 'Mode Clair',
      darkMode: 'Mode Sombre',
      saveChanges: 'Sauvegarder les modifications',
      saving: 'Enregistrement...',
      supportDeveloper: 'Soutenir le développeur',
      supportDesc: 'Soutenez le développement d\'AgriConnect',
      monthlyPlan: 'Plan mensuel',
      yearlyPlan: 'Plan annuel',
      premiumFeatures: 'Fonctionnalités Premium',
      prioritySupport: 'Support prioritaire',
      advancedAnalytics: 'Analyses avancées',
      unlimitedListings: 'Annonces illimitées'
    },
    rw: {
      settings: 'Igenamiterere',
      languageSettings: 'Igenamiterere ry\'ururimi',
      selectLanguage: 'Hitamo ururimi ukunda',
      themeSettings: 'Igenamiterere ry\'insanganyamatsiko',
      lightMode: 'Uburyo bwumucyo',
      darkMode: 'Uburyo bw\'umwijima',
      saveChanges: 'Bika impinduka',
      saving: 'Kubika...',
      supportDeveloper: 'Fasha umuvanzi',
      supportDesc: 'Fasha iterambere rya AgriConnect',
      monthlyPlan: 'Gahunda y\'ukwezi',
      yearlyPlan: 'Gahunda y\'umwaka',
      premiumFeatures: 'Ibintu byiza',
      prioritySupport: 'Ubufasha bw\'ibanze',
      advancedAnalytics: 'Isesengura ryateye imbere',
      unlimitedListings: 'Ibibanza bidahagarara'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ language })
        }
      );

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Save settings error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div>
        <h2 className="text-gray-900 dark:text-white">{t.settings}</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your preferences</p>
      </div>

      {/* Language Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{t.languageSettings}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t.selectLanguage}</p>
          </div>
        </div>

        <div className="grid gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                language === lang.code
                  ? 'border-green-600 bg-green-50 dark:bg-green-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="text-gray-900 dark:text-white">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-green-600 dark:text-green-400">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            ) : (
              <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            )}
          </div>
          <div>
            <h3 className="text-gray-900 dark:text-white">{t.themeSettings}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Current: {theme === 'light' ? t.lightMode : t.darkMode}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
              theme === 'light'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <Sun className="w-5 h-5 text-yellow-600" />
            <span className="text-gray-900 dark:text-white">{t.lightMode}</span>
            {theme === 'light' && <span className="ml-auto text-purple-600">✓</span>}
          </button>

          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
              theme === 'dark'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-600" />
            <span className="text-gray-900 dark:text-white">{t.darkMode}</span>
            {theme === 'dark' && <span className="ml-auto text-purple-600">✓</span>}
          </button>
        </div>
      </div>

      {/* Payment/Support Developer */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-gray-900 dark:text-white mb-1">{t.supportDeveloper}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {t.supportDesc}
            </p>

            <div className="grid md:grid-cols-2 gap-3 mb-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 dark:text-white">{t.monthlyPlan}</span>
                  <CreditCard className="w-4 h-4 text-orange-600" />
                </div>
                <div className="mb-3">
                  <span className="text-2xl text-gray-900 dark:text-white">$9.99</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">/month</span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Subscribe
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-orange-500 dark:border-orange-600 relative">
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                  Save 20%
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-900 dark:text-white">{t.yearlyPlan}</span>
                  <CreditCard className="w-4 h-4 text-orange-600" />
                </div>
                <div className="mb-3">
                  <span className="text-2xl text-gray-900 dark:text-white">$95.99</span>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">/year</span>
                </div>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </div>

            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
              <p className="text-sm text-gray-900 dark:text-white mb-2">{t.premiumFeatures}:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>✓ {t.unlimitedListings}</li>
                <li>✓ {t.advancedAnalytics}</li>
                <li>✓ {t.prioritySupport}</li>
                <li>✓ AI-Powered Insights</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-gray-900 dark:text-white mb-4">Payment Methods</h3>
            <div className="space-y-3 mb-6">
              <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition-colors flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-gray-900 dark:text-white">Credit/Debit Card</span>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition-colors flex items-center gap-3">
                <span className="text-2xl">📱</span>
                <span className="text-gray-900 dark:text-white">Mobile Money (MTN, Airtel)</span>
              </button>
              <button className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 transition-colors flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <span className="text-gray-900 dark:text-white">PayPal</span>
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPayment(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-5 h-5" />
        {saving ? t.saving : t.saveChanges}
      </button>
    </div>
  );
}
