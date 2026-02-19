import { useState } from 'react';
import { Bot, X, Send, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  language?: string;
}

export function AIAssistant({ language = 'en' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  
  const getInitialMessage = (lang: string) => {
    const messages: Record<string, string> = {
      en: 'Hello! I\'m AgriConnect AI. Ask me anything - farming, weather, markets, or any topic you need help with!',
      fr: 'Bonjour! Je suis AgriConnect AI. Demandez-moi n\'importe quoi - agriculture, météo, marchés ou tout autre sujet!',
      rw: 'Muraho! Ndi AgriConnect AI. Baza ikibazo cyose - ubuhinzi, ikirere, amasoko cyangwa ikindi kintu cyose!'
    };
    return messages[lang] || messages.en;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: getInitialMessage(language),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    '🌱 Best crops for this season?',
    '🌧️ Should I irrigate today?',
    '💰 Current market prices?',
    '🐛 How to prevent pests?'
  ];

  const generateAIResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();

    // Weather-related
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('rain') || lowerQuestion.includes('irrigate') || lowerQuestion.includes('irrigation')) {
      return 'Based on the current weather forecast, we have 70% rain predicted for Wednesday. I recommend:\n\n✓ Skip irrigation for the next 3 days\n✓ Ensure proper drainage in your fields\n✓ Consider applying fertilizers after the rain\n✓ Monitor for potential waterlogging\n\nThe temperatures will be moderate (24-28°C), which is ideal for most crops. Would you like specific advice for your crop type?';
    }

    // Crop recommendations
    if (lowerQuestion.includes('crop') || lowerQuestion.includes('plant') || lowerQuestion.includes('season') || lowerQuestion.includes('grow')) {
      return 'For this season, I recommend these crops based on your location and current conditions:\n\n🌾 **Wheat**: High demand, good weather conditions\n🌽 **Maize**: Suitable temperature range\n🥔 **Potatoes**: Excellent market prices currently\n🍅 **Tomatoes**: Short growing cycle, high returns\n\nWheat and maize show 15-20% better yields when planted in the next 2 weeks. Would you like detailed planting guidelines for any specific crop?';
    }

    // Market/pricing
    if (lowerQuestion.includes('price') || lowerQuestion.includes('market') || lowerQuestion.includes('sell') || lowerQuestion.includes('buyer')) {
      return 'Current market analysis shows:\n\n📈 **Trending Up**:\n• Organic vegetables: +15%\n• Wheat: +8%\n• Rice: +5%\n\n📊 **Stable**:\n• Maize: Steady demand\n• Potatoes: $0.85/kg average\n\n💡 **Tip**: List your organic produce now to maximize returns. We have 12 verified buyers actively looking for organic crops in your area. Would you like me to connect you?';
    }

    // Pest control
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect') || lowerQuestion.includes('bug') || lowerQuestion.includes('disease')) {
      return 'For pest prevention and management, I recommend:\n\n🛡️ **Preventive Measures**:\n• Use neem-based organic sprays weekly\n• Maintain proper plant spacing for air circulation\n• Remove infected plants immediately\n• Introduce beneficial insects like ladybugs\n\n⚠️ **Current Alert**: Aphid activity reported in your region\n\n🌿 **Natural Solutions**:\n• Neem oil spray (2-3ml per liter)\n• Garlic-chili solution\n• Companion planting with marigolds\n\nWould you like specific treatment plans for particular pests?';
    }

    // Yield optimization
    if (lowerQuestion.includes('yield') || lowerQuestion.includes('production') || lowerQuestion.includes('harvest') || lowerQuestion.includes('increase')) {
      return 'To optimize your yields, focus on these key areas:\n\n📊 **Current Analysis**:\n• Your average yield: 12% above regional average\n• Room for improvement: 15-20% with optimizations\n\n✨ **Recommendations**:\n1. **Soil Testing**: Check NPK levels monthly\n2. **Precision Watering**: Use drip irrigation to save 40% water\n3. **Crop Rotation**: Alternate with legumes to improve soil\n4. **Timing**: Plant during optimal windows (next 10 days ideal)\n\n💡 **AI Insight**: Your historical data shows 23% better yields when you plant before Nov 15. Would you like a detailed action plan?';
    }

    // Fertilizer
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('soil') || lowerQuestion.includes('nutrient')) {
      return 'Soil nutrition recommendations:\n\n🌱 **Current Season Needs**:\n• Nitrogen: Medium (50-60 kg/acre)\n• Phosphorus: High (30-40 kg/acre)\n• Potassium: Medium (20-30 kg/acre)\n\n📅 **Application Schedule**:\n• Week 1: Base fertilizer before planting\n• Week 4: First top dressing\n• Week 8: Second top dressing\n\n♻️ **Organic Options**:\n• Compost: 2-3 tons/acre\n• Vermicompost: Rich in micronutrients\n• Green manure: Improves soil structure\n\nWould you like soil testing services or organic fertilizer suppliers?';
    }

    // Water management
    if (lowerQuestion.includes('water') || lowerQuestion.includes('drought') || lowerQuestion.includes('moisture')) {
      return 'Water management insights:\n\n💧 **Current Conditions**:\n• Soil moisture: 65% (Good level)\n• Next rainfall: Wednesday (70% probability)\n• Temperature: Moderate evaporation rate\n\n📋 **Recommendations**:\n1. Skip irrigation until after Wednesday\'s rain\n2. Check drainage systems before rainfall\n3. Consider mulching to retain moisture\n4. Install moisture sensors for precision\n\n💡 **Water Saving Tips**:\n• Drip irrigation: 40% more efficient\n• Early morning watering: Reduces evaporation\n• Mulching: Retains 30% more moisture\n\nWould you like help setting up efficient irrigation schedules?';
    }

    // OPEN TO ALL QUESTIONS - Default response for anything
    return `I'm here to help with "${userQuestion}"!\n\nI can assist you with:\n\n🌾 **Agriculture**: Crops, soil, pests, irrigation, harvest\n🌦️ **Weather**: Forecasts, climate advice, seasonal planning\n💰 **Markets**: Prices, buyers, selling strategies\n🐄 **Livestock**: Care, feeding, health management\n📚 **General Knowledge**: Any topic or question\n🛠️ **Tools & Tech**: Equipment, apps, techniques\n💡 **Business**: Planning, financing, record-keeping\n🌍 **Sustainability**: Organic methods, conservation\n\nPlease provide more details about what you'd like to know, and I'll give you a comprehensive answer with practical advice and actionable steps!\n\nFeel free to ask anything - I'm designed to help with all your questions! 🌱`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-blue-500 via-yellow-400 to-green-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-110 transition-all flex items-center justify-center group"
          >
            <Bot className="w-7 h-7" />
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="absolute -top-12 right-0 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Ask AI Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white flex items-center gap-2">
                    AI Farm Assistant
                    <Sparkles className="w-4 h-4" />
                  </p>
                  <p className="text-green-100 text-xs">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${
                      message.type === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    {message.type === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-gray-200 bg-white">
                <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs px-3 py-1.5 bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything about farming..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}