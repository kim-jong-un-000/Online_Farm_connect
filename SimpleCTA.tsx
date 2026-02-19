import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SimpleCTAProps {
  onGetStarted: () => void;
}

export function SimpleCTA({ onGetStarted }: SimpleCTAProps) {
  return (
    <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-green-600 to-yellow-500 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full mb-6 border border-white/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Your Journey Today</span>
        </motion.div>

        <motion.h2 
          className="text-white text-4xl lg:text-6xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Ready to Transform Your Farm?
        </motion.h2>
        
        <motion.p 
          className="text-white/90 text-xl lg:text-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Join 10,000+ farmers across Rwanda who are already growing smarter and earning more with AgriConnect
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-green-600 rounded-full hover:bg-green-50 transition-all flex items-center justify-center gap-3 shadow-2xl hover:shadow-white/20 hover:scale-105 group text-lg"
          >
            Get Started Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.p 
          className="text-white/80 mt-6 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          ✓ Free 14-day trial  •  ✓ No credit card required  •  ✓ Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
