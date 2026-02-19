import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sprout, ArrowRight, TrendingUp, Users, CloudSun } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-amber-300 to-emerald-600 min-h-screen">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-300/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-5 lg:px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Sprout className="w-7 h-7 text-emerald-600" />
            </div>
            <span className="text-white text-xl font-bold">AgriConnect</span>
          </motion.div>
          <motion.div 
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="#features" className="text-white font-medium hover:text-white/80 transition-colors">Features</a>
            <a href="#benefits" className="text-white font-medium hover:text-white/80 transition-colors">Benefits</a>
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-full hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:scale-105">
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-12 lg:py-16 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-block px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-full mb-6 border border-white/30"
            >
              <span className="flex items-center gap-2">
                🇷🇼 Empowering Rwandan Farmers with Technology
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-white text-5xl lg:text-7xl mb-6 max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Transform Your Farm with Smart Agriculture
            </motion.h1>
            
            <motion.p 
              className="text-white/90 text-xl lg:text-2xl mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Connect with buyers, track yields, get weather insights, and grow your farming business in Rwanda
            </motion.p>
            
            <motion.div 
              className="flex justify-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <button 
                onClick={onGetStarted}
                className="px-10 py-5 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-white/20 hover:scale-105 group">
                Get Started
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div 
              className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/25 transition-all hover:scale-105"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-white text-2xl mb-3">Track Your Yields</h3>
              <p className="text-white/80 text-lg">Monitor production, analyze trends, and maximize your harvest with data-driven insights</p>
            </motion.div>

            <motion.div 
              className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/25 transition-all hover:scale-105"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-white text-2xl mb-3">Connect with Buyers</h3>
              <p className="text-white/80 text-lg">Direct marketplace access to verified buyers across Rwanda for better prices</p>
            </motion.div>

            <motion.div 
              className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/25 transition-all hover:scale-105"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                <CloudSun className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-white text-2xl mb-3">Weather Intelligence</h3>
              <p className="text-white/80 text-lg">Real-time weather forecasts and AI predictions for optimal farming decisions</p>
            </motion.div>
          </div>

          {/* Hero Image Section */}
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
          >
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1756245994848-1eb2be3b9b63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSd2FuZGElMjBmYXJtZXJzJTIwZmllbGR8ZW58MXx8fHwxNzY1NTIzMzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Rwandan farmers working in fields"
              className="w-full h-[500px] object-cover"
            />
            
            {/* Floating Stats */}
            <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
              <motion.div 
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-green-600 text-3xl mb-1">10,000+</p>
                <p className="text-gray-700">Active Farmers</p>
              </motion.div>
              <motion.div 
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-blue-600 text-3xl mb-1">500+</p>
                <p className="text-gray-700">Verified Buyers</p>
              </motion.div>
              <motion.div 
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-yellow-600 text-3xl mb-1">98%</p>
                <p className="text-gray-700">Satisfaction</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}