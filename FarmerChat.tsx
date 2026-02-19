import { useState, useEffect, useRef } from 'react';
import { Send, Users, Globe } from 'lucide-react';
import { projectId } from '../utils/supabase/info';

interface FarmerChatProps {
  session: any;
  profile: any;
}

export function FarmerChat({ session, profile }: FarmerChatProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState(profile?.language || 'en');

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/chat/messages?limit=100`,
        {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Load messages error:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f03b739f/chat/messages`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            message: input,
            language: selectedLanguage
          })
        }
      );

      if (response.ok) {
        setInput('');
        await loadMessages();
      }
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const translations = {
    en: {
      title: 'Farmer Community Chat',
      subtitle: 'Connect with farmers in your region',
      placeholder: 'Type your message...',
      send: 'Send',
      onlineFarmers: 'Online Farmers',
      you: 'You',
      selectLanguage: 'Chat Language'
    },
    fr: {
      title: 'Chat communautaire des agriculteurs',
      subtitle: 'Connectez-vous avec les agriculteurs de votre région',
      placeholder: 'Tapez votre message...',
      send: 'Envoyer',
      onlineFarmers: 'Agriculteurs en ligne',
      you: 'Vous',
      selectLanguage: 'Langue du chat'
    },
    rw: {
      title: 'Ikiganiro cy\'abahinzi',
      subtitle: 'Huza n\'abahinzi bo mu karere kawe',
      placeholder: 'Andika ubutumwa bwawe...',
      send: 'Ohereza',
      onlineFarmers: 'Abahinzi bariho',
      you: 'Wowe',
      selectLanguage: 'Ururimi rw\'ikiganiro'
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' }
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-gray-200 h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-900">{t.title}</h3>
                <p className="text-gray-600 text-sm">{t.subtitle}</p>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-green-600">{messages.length > 0 ? new Set(messages.map(m => m.userId)).size : 0}</span>
              </div>
            </div>

            {/* Language Selector */}
            <div className="mt-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600 text-sm">{t.selectLanguage}:</span>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-sm transition-all ${
                      selectedLanguage === lang.code
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.userId === session.user.id;
                const showLanguageTag = message.language !== selectedLanguage;

                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">
                          {isOwnMessage ? t.you : message.userName}
                        </span>
                        {message.userLocation && !isOwnMessage && (
                          <span className="text-xs text-gray-500">📍 {message.userLocation}</span>
                        )}
                        {showLanguageTag && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                            {languages.find(l => l.code === message.language)?.flag}
                          </span>
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isOwnMessage
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {t.send}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Community Info */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <h4 className="text-gray-900 mb-3">Community Guidelines</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Share farming tips and experiences</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Ask questions and help others</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Respect all community members</span>
            </li>
            <li className="flex items-start gap-2">
              <span>✓</span>
              <span>Share in your preferred language</span>
            </li>
          </ul>
        </div>

        {/* Quick Topics */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h4 className="text-gray-900 mb-3">Popular Topics</h4>
          <div className="space-y-2">
            {[
              { icon: '🌾', text: 'Crop cultivation' },
              { icon: '🐄', text: 'Livestock care' },
              { icon: '💰', text: 'Market prices' },
              { icon: '🌧️', text: 'Weather updates' },
              { icon: '🐛', text: 'Pest control' },
              { icon: '🌱', text: 'Organic farming' }
            ].map((topic, index) => (
              <button
                key={index}
                onClick={() => setInput(`Question about ${topic.text}: `)}
                className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <span className="mr-2">{topic.icon}</span>
                {topic.text}
              </button>
            ))}
          </div>
        </div>

        {/* Language Support Info */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h4 className="text-gray-900 mb-3">🌍 Multilingual Support</h4>
          <p className="text-sm text-gray-700 mb-2">
            Chat in your preferred language! Messages show the sender's language.
          </p>
          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <span key={lang.code} className="text-sm px-2 py-1 bg-white rounded">
                {lang.flag} {lang.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
