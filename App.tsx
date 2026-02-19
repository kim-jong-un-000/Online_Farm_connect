import { useState, useEffect } from "react";
import { supabase } from "./utils/supabase/client.tsx";
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Benefits } from "./components/Benefits";
import { SimpleCTA } from "./components/SimpleCTA";
import { Footer } from "./components/Footer";
import { AIAssistant } from "./components/AIAssistant";
import { ScrollToTop } from "./components/ScrollToTop";
import { Auth } from "./components/Auth";
import { FarmerDashboard } from "./components/FarmerDashboard";
import { BuyerDashboard } from "./components/BuyerDashboard";
import { TransporterDashboard } from "./components/TransporterDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { ThemeProvider } from "./components/ThemeContext";
import { FeedbackDisplay } from "./components/FeedbackDisplay";
import { UserFeedback } from "./components/UserFeedback";
import { Toaster } from "sonner@2.0.3";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedbackKey, setFeedbackKey] = useState(0);
  const [userRole, setUserRole] = useState<string>('');

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        loadUserRole(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        loadUserRole(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserRole = async (session: any) => {
    try {
      // Get user role from metadata
      const role = session.user.user_metadata?.userType || 'farmer';
      setUserRole(role);
    } catch (error) {
      console.error('Error loading user role:', error);
      setUserRole('farmer');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (newSession: any) => {
    setSession(newSession);
    setShowAuth(false);
    loadUserRole(newSession);
  };

  const handleLogout = () => {
    setSession(null);
    setUserRole('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-yellow-400 to-green-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">
            Loading AgriConnect...
          </p>
        </div>
      </div>
    );
  }

  // If user is logged in, show farmer dashboard
  if (session) {
    return (
      <ThemeProvider>
        {userRole === 'farmer' && (
          <FarmerDashboard
            session={session}
            onLogout={handleLogout}
          />
        )}
        {userRole === 'buyer' && (
          <BuyerDashboard
            session={session}
            onLogout={handleLogout}
          />
        )}
        {userRole === 'transporter' && (
          <TransporterDashboard
            session={session}
            onLogout={handleLogout}
          />
        )}
        {userRole === 'admin' && (
          <AdminDashboard
            session={session}
            onLogout={handleLogout}
          />
        )}
      </ThemeProvider>
    );
  }

  // Otherwise show marketing site
  return (
    <div className="min-h-screen bg-white">
      <Toaster position="top-right" richColors />
      <Hero onGetStarted={() => setShowAuth(true)} />
      <FeedbackDisplay key={feedbackKey} />
      <Features />
      <Benefits />
      <UserFeedback onSubmitFeedback={() => setFeedbackKey(prev => prev + 1)} />
      <SimpleCTA onGetStarted={() => setShowAuth(true)} />
      <Footer />
      <AIAssistant />
      <ScrollToTop />

      {showAuth && (
        <Auth
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}