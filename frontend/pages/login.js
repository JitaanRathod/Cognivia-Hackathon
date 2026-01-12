import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import HerCureLogo from '../components/branding/HerCureLogo';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <HerCureLogo size={64} />
          <h2 className="text-3xl font-bold text-navy mt-4">Welcome Back</h2>
          <p className="text-navy opacity-80">Sign in to your HerCure account</p>
        </div>
        <form onSubmit={submit} className="space-y-6">
          <div className="animate-slide-up delay-200">
            <label className="block text-sm font-medium text-navy mb-2">Email</label>
            <input
              className="w-full p-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="animate-slide-up delay-400">
            <label className="block text-sm font-medium text-navy mb-2">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:from-blue-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed animate-slide-up delay-600"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/signup" className="text-primary font-medium hover:underline">Don't have an account? Sign Up</a>
        </div>

        <p className="text-xs text-navy text-center mt-6 animate-slide-up delay-800">
          By continuing, you agree to HerCure's privacy-first care policy
        </p>
      </div>
    </div>
  );
}
