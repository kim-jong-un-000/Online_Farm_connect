import { UserPlus, Upload, TrendingUp, Handshake } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Account',
      description: 'Sign up in minutes and set up your farmer profile with your farm details, location, and crop types.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: '02',
      icon: Upload,
      title: 'Track Your Production',
      description: 'Input your yield data, monitor crop growth, and access weather forecasts tailored to your location.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: '03',
      icon: TrendingUp,
      title: 'Get Smart Insights',
      description: 'Receive personalized recommendations on farming practices, optimal harvest times, and market trends.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      number: '04',
      icon: Handshake,
      title: 'Connect & Sell',
      description: 'List your commodities, connect with verified buyers, negotiate prices, and complete secure transactions.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full mb-4">
            Simple Process
          </div>
          <h2 className="text-gray-900 mb-4">
            How AgriConnect Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get started in four simple steps and transform the way you manage 
            your agricultural business.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-300 to-transparent" />
                )}
                
                <div className="relative">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center z-10">
                    <span className="text-gray-400">{step.number}</span>
                  </div>

                  {/* Card */}
                  <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all">
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Start Your Journey Today
          </button>
        </div>
      </div>
    </section>
  );
}
