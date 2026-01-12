import Link from 'next/link';
import { useRouter } from 'next/router';
import HerCureLogo from '../branding/HerCureLogo';
import { useAuth } from '../../hooks/useAuth';

export default function AppLayout({ children }) {
  const { logout } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/health-assessment', label: 'Assessment', icon: '📊' },
    { href: '/ai-chat', label: 'AI Chat', icon: '🤖' },
    { href: '/health-input', label: 'Health Log', icon: '📝' },
    { href: '/notifications', label: 'Alerts', icon: '🔔' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <header className="bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="hover:opacity-80 transition-opacity">
            <HerCureLogo />
          </Link>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  router.pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <span>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-md"
          >
            Logout
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex justify-around">
              {navItems.slice(0, 4).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                    router.pathname === item.href
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <HerCureLogo size={40} />
          <p className="text-gray-400 mt-4 text-sm">
            HerCure · AI guidance only · Not a doctor replacement
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
