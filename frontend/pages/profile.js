import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { User, Save, ArrowLeft, Heart } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    location: '',
    pregnancyStatus: '',
    knownConditions: []
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        age: user.age || '',
        location: user.location || '',
        pregnancyStatus: user.pregnancyStatus || '',
        knownConditions: user.knownConditions || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (condition) => {
    setFormData(prev => ({
      ...prev,
      knownConditions: prev.knownConditions.includes(condition)
        ? prev.knownConditions.filter(c => c !== condition)
        : [...prev.knownConditions, condition]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${process.env.API_URL}/auth/profile`, formData);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <button
              onClick={logout}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center mb-6">
            <User className="h-8 w-8 text-pink-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                placeholder="Enter your age"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                placeholder="City or village name"
              />
            </div>

            <div>
              <label htmlFor="pregnancyStatus" className="block text-sm font-medium text-gray-700 mb-2">
                Pregnancy Status
              </label>
              <select
                id="pregnancyStatus"
                name="pregnancyStatus"
                value={formData.pregnancyStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Select status</option>
                <option value="Not pregnant">Not pregnant</option>
                <option value="Pregnant">Pregnant</option>
                <option value="Recently delivered">Recently delivered</option>
                <option value="Menopause">Menopause</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Known Health Conditions
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['BP', 'Diabetes', 'Thyroid', 'PCOS', 'Anemia'].map((condition) => (
                  <label key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.knownConditions.includes(condition)}
                      onChange={() => handleConditionChange(condition)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>This AI does not replace a doctor. It provides early guidance only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
