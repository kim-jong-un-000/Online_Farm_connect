import { BarChart3, ShoppingCart, CloudSun, Lightbulb, MessageCircle, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: 'Yield Tracking',
      description: 'Monitor crop production and analyze trends to optimize your farming operations.',
      color: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: ShoppingCart,
      title: 'Marketplace',
      description: 'Connect directly with verified buyers across Rwanda and get fair prices.',
      color: 'bg-sky-100',
      iconColor: 'text-sky-600',
    },
    {
      icon: CloudSun,
      title: 'Weather Forecasts',
      description: 'Access real-time weather data and AI predictions for optimal planting times.',
      color: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: Lightbulb,
      title: 'AI Assistant',
      description: 'Get expert agricultural advice in Kinyarwanda, French, or English 24/7.',
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      icon: MessageCircle,
      title: 'Community Chat',
      description: 'Connect with fellow farmers, share experiences, and learn best practices.',
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security and privacy.',
      color: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
    }
  ];

  return (
    <section id="features" className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Platform Features
          </motion.div>
          <motion.h2 
            className="text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Everything You Need for Successful Farming
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Comprehensive tools designed specifically for Rwandan farmers to thrive in modern agriculture.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={index}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                
                <h3 className="text-gray-900 mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}