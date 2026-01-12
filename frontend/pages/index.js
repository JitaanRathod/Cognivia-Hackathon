import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import HerCureLogo from '../components/branding/HerCureLogo';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/login');
    }
  }, [user, loading]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-200 via-purple-100 to-blue-50">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <HerCureLogo size={80} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 animate-slide-up delay-200">
            Your Health, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Empowered</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 animate-slide-up delay-400">
            Track your menstrual cycle, monitor hormonal health, and get personalized insights with AI-powered guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-600">
            <button
              onClick={() => router.push('/signup')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white bg-opacity-50 backdrop-blur-sm py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 animate-slide-up delay-800">
            Comprehensive Health Tracking
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center animate-slide-up delay-1000">
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">H</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Hormonal Health</h3>
              <p className="text-gray-600">Monitor your hormonal balance and get insights on your cycle.</p>
            </div>
            <div className="text-center animate-slide-up delay-1200">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">R</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reproductive Health</h3>
              <p className="text-gray-600">Track pregnancy and maternal health with expert guidance.</p>
            </div>
            <div className="text-center animate-slide-up delay-1400">
              <div className="bg-gradient-to-r from-pink-400 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">♥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Heart Health</h3>
              <p className="text-gray-600">Keep your cardiovascular health in check with regular monitoring.</p>
            </div>
            <div className="text-center animate-slide-up delay-1600">
              <div className="bg-gradient-to-r from-teal-400 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-2xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Menstrual Health</h3>
              <p className="text-gray-600">Log your periods and symptoms for better cycle prediction.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <HerCureLogo size={40} />
          <p className="text-gray-400 mt-4">
            HerCure · AI guidance only · Not a doctor replacement
          </p>
        </div>
      </footer>
    </div>
  );
}
