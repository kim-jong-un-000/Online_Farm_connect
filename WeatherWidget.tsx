import { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, AlertCircle, Calendar } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface WeatherWidgetProps {
  location?: string;
  language: string;
}

export function WeatherWidget({ location = 'Kigali', language = 'en' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadWeather();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [location]);

  const loadWeather = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/weather?location=${encodeURIComponent(location)}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      }
    } catch (error) {
      console.error('Load weather error:', error);
    } finally {
      setLoading(false);
    }
  };

  const translations = {
    en: {
      liveWeather: 'Live Weather',
      currentConditions: 'Current Conditions',
      temperature: 'Temperature',
      humidity: 'Humidity',
      windSpeed: 'Wind Speed',
      rainfall: 'Rainfall',
      forecast: '7-Day Forecast',
      aiPredictions: 'AI-Powered Predictions',
      irrigationAdvice: 'Irrigation Advice',
      plantingWindow: 'Planting Window',
      pestRisk: 'Pest Risk',
      harvestAdvice: 'Harvest Advice',
      alerts: 'Weather Alerts',
      lastUpdated: 'Last Updated'
    },
    fr: {
      liveWeather: 'Météo en direct',
      currentConditions: 'Conditions actuelles',
      temperature: 'Température',
      humidity: 'Humidité',
      windSpeed: 'Vitesse du vent',
      rainfall: 'Précipitations',
      forecast: 'Prévisions 7 jours',
      aiPredictions: 'Prédictions IA',
      irrigationAdvice: "Conseil d'irrigation",
      plantingWindow: 'Fenêtre de plantation',
      pestRisk: 'Risque de ravageurs',
      harvestAdvice: 'Conseil de récolte',
      alerts: 'Alertes météo',
      lastUpdated: 'Dernière mise à jour'
    },
    rw: {
      liveWeather: 'Ikirere kiriho',
      currentConditions: 'Ikirere muriyi minsi',
      temperature: 'Ubushyuhe',
      humidity: 'Ubushuhe',
      windSpeed: 'Umuvuduko w\'umuyaga',
      rainfall: 'Imvura',
      forecast: 'Ikirere cy\'iminsi 7',
      aiPredictions: 'Ibitekerezo bya AI',
      irrigationAdvice: 'Inama ku kuvomesha',
      plantingWindow: 'Igihe cyo gutera',
      pestRisk: 'Ibyago by\'udukoko',
      harvestAdvice: 'Inama ku gusarura',
      alerts: 'Ibyitonderwa by\'ikirere',
      lastUpdated: 'Byavuguruwe bwa nyuma'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.en;

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <p className="text-gray-600 text-center">Weather data not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live Date & Time */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-white mb-1">{t.liveWeather}</h2>
            <p className="text-blue-100">📍 {location}</p>
          </div>
          <Calendar className="w-8 h-8 text-white/80" />
        </div>
        <div className="text-3xl mb-2">
          {currentTime.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="text-5xl">
          {currentTime.toLocaleTimeString(language === 'fr' ? 'fr-FR' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      {/* Current Conditions */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">{t.currentConditions}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-6xl">⛅</div>
              <div>
                <div className="text-4xl text-gray-900">{weather.current.temperature}°C</div>
                <p className="text-gray-600">{weather.current.condition}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{t.humidity}</span>
              </div>
              <span className="text-gray-900">{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">{t.windSpeed}</span>
              </div>
              <span className="text-gray-900">{weather.current.windSpeed} km/h</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">{t.rainfall}</span>
              </div>
              <span className="text-gray-900">{weather.current.rainfall} mm</span>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          {t.lastUpdated}: {new Date(weather.current.lastUpdated).toLocaleTimeString()}
        </p>
      </div>

      {/* Weather Alerts */}
      {weather.alerts && weather.alerts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <h3 className="text-gray-900">{t.alerts}</h3>
          </div>
          <div className="space-y-3">
            {weather.alerts.map((alert: any, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-gray-700">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-gray-900 mb-4">{t.forecast}</h3>
        <div className="grid grid-cols-7 gap-2">
          {weather.forecast.map((day: any, index: number) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-gray-700 text-sm mb-2">{day.day}</p>
              <div className="text-3xl mb-2">{day.icon}</div>
              <p className="text-gray-900 mb-1">{day.temp}°C</p>
              <p className="text-blue-600 text-sm">💧 {day.rain}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            🤖
          </div>
          <h3 className="text-gray-900">{t.aiPredictions}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-purple-900 mb-1">💧 {t.irrigationAdvice}</p>
            <p className="text-gray-700">{weather.aiPredictions.irrigationAdvice}</p>
          </div>
          <div>
            <p className="text-purple-900 mb-1">🌱 {t.plantingWindow}</p>
            <p className="text-gray-700">{weather.aiPredictions.plantingWindow}</p>
          </div>
          <div>
            <p className="text-purple-900 mb-1">🐛 {t.pestRisk}</p>
            <p className="text-gray-700">{weather.aiPredictions.pestRisk}</p>
          </div>
          <div>
            <p className="text-purple-900 mb-1">🌾 {t.harvestAdvice}</p>
            <p className="text-gray-700">{weather.aiPredictions.harvestAdvice}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
