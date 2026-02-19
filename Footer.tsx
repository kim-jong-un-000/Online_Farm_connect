import { Sprout, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Sprout className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-2xl">AgriConnect</span>
            </div>
            <p className="text-gray-400 mb-6 text-lg">
              🇷🇼 Empowering Rwandan farmers with technology for better yields, fair prices, and sustainable growth.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xl mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-gray-400 hover:text-green-500 transition-colors text-lg flex items-center gap-2">
                  → Features
                </a>
              </li>
              <li>
                <a href="#benefits" className="text-gray-400 hover:text-green-500 transition-colors text-lg flex items-center gap-2">
                  → Benefits
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors text-lg flex items-center gap-2">
                  → Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors text-lg flex items-center gap-2">
                  → Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xl mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-lg">kingmihigo0@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-lg">+250 790 362 220</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
              <p className="text-white text-sm mb-2">Multilingual Support</p>
              <p className="text-green-100 text-xs">Kinyarwanda • Français • English</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 AgriConnect Rwanda. All rights reserved. Made with ❤️ for Rwandan Farmers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}