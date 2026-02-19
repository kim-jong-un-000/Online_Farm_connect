import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TrendingUp, DollarSign, Users, Clock } from 'lucide-react';

export function Benefits() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Your Yields',
      value: '35%',
      description: 'Average yield improvement with our data-driven farming insights',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: DollarSign,
      title: 'Better Prices',
      value: '25%',
      description: 'Higher income by connecting directly with verified buyers',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Growing Community',
      value: '10K+',
      description: 'Active farmers sharing knowledge and experiences',
      color: 'from-amber-500 to-yellow-600'
    },
    {
      icon: Clock,
      title: 'Save Time',
      value: '15hrs',
      description: 'Per week saved with automated tracking and insights',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const testimonials = [
    {
      name: 'Jean Claude Mugabo',
      role: 'Coffee Farmer, Huye District',
      quote: 'AgriConnect helped me connect with premium coffee buyers. My income has increased by 40% in just 6 months!',
      rating: 5
    },
    {
      name: 'Marie Uwase',
      role: 'Vegetable Farmer, Musanze',
      quote: 'The weather predictions are incredibly accurate. I can now plan my planting perfectly and avoid crop losses.',
      rating: 5
    },
    {
      name: 'Patrick Nkubito',
      role: 'Dairy Farmer, Nyagatare',
      quote: 'The AI assistant answers all my questions in Kinyarwanda. It\'s like having an agricultural expert available 24/7.',
      rating: 5
    }
  ];

  return (
    <section id="benefits" className="py-20 px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded-full mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Real Results for Rwandan Farmers
          </motion.div>
          <motion.h2 
            className="text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Transform Your Farming Business
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of successful farmers across Rwanda who are already seeing real results
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className={`text-5xl bg-gradient-to-r ${benefit.color} bg-clip-text text-transparent mb-2`}>
                  {benefit.value}
                </p>
                <h3 className="text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <motion.h3 
            className="text-gray-900 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Rwandan Farmers Say
          </motion.h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1763231228595-12e443569896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwYWdyaWN1bHR1cmUlMjBjb21tdW5pdHl8ZW58MXx8fHwxNzY1NTIzMzMzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="African agriculture community working together"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-3xl mb-2">Building Rwanda's Agricultural Future Together</h3>
              <p className="text-white/90 text-lg">Join our community of innovative farmers leading the way in modern agriculture</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}