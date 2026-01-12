import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  useProtectedRoute();
  const [healthScores, setHealthScores] = useState(null);

  useEffect(() => {
    const fetchHealthScores = async () => {
      try {
        const res = await api.get('/health/scores');
        setHealthScores(res.data);
      } catch (error) {
        console.error('Failed to fetch health scores:', error);
      }
    };

    fetchHealthScores();
  }, []);

  const getOverallHealth = () => {
    if (!healthScores) return { status: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-100' };

    const average = Object.values(healthScores).reduce((a, b) => a + b, 0) / Object.values(healthScores).length;
    if (average >= 80) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (average >= 60) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (average >= 40) return { status: 'Needs Attention', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const overallHealth = getOverallHealth();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to HerCure</h1>
          <p className="text-xl text-gray-600">Your comprehensive women's health dashboard</p>
        </div>

        {/* Overall Health Status */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Health Status</h2>
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${overallHealth.bg} ${overallHealth.color}`}>
                {overallHealth.status}
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 mb-1">Last Updated</p>
              <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Health Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Hormonal Health</h3>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl font-bold">H</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-2">
              {healthScores?.hormonal || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Score out of 100</p>
            <button
              onClick={() => window.location.href = '/health-assessment'}
              className="mt-4 text-blue-600 font-semibold hover:text-blue-700"
            >
              Update Assessment →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reproductive Health</h3>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-xl font-bold">R</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-600 mb-2">
              {healthScores?.reproductive || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Score out of 100</p>
            <button
              onClick={() => window.location.href = '/health-assessment'}
              className="mt-4 text-purple-600 font-semibold hover:text-purple-700"
            >
              Update Assessment →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-pink-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Heart Health</h3>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-xl font-bold">♥</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-pink-600 mb-2">
              {healthScores?.heart || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Score out of 100</p>
            <button
              onClick={() => window.location.href = '/health-assessment'}
              className="mt-4 text-pink-600 font-semibold hover:text-pink-700"
            >
              Update Assessment →
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Menstrual Health</h3>
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 text-xl font-bold">M</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-teal-600 mb-2">
              {healthScores?.menstrual || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">Score out of 100</p>
            <button
              onClick={() => window.location.href = '/health-assessment'}
              className="mt-4 text-teal-600 font-semibold hover:text-teal-700"
            >
              Update Assessment →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">AI Health Assistant</h3>
              <p className="text-gray-600 mb-4">Get personalized health insights and answers to your questions</p>
              <button
                onClick={() => window.location.href = '/ai-chat'}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Start Chat
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Health Assessment</h3>
              <p className="text-gray-600 mb-4">Complete a comprehensive health assessment for detailed insights</p>
              <button
                onClick={() => window.location.href = '/health-assessment'}
                className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-200"
              >
                Take Assessment
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Log Health Data</h3>
              <p className="text-gray-600 mb-4">Record daily symptoms, mood, and other health metrics</p>
              <button
                onClick={() => window.location.href = '/health-input'}
                className="bg-gradient-to-r from-teal-500 to-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-teal-600 hover:to-green-700 transition-all duration-200"
              >
                Add Entry
              </button>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 text-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">AI Health Insight</h3>
              <p className="text-lg opacity-90">
                Regular health tracking helps identify patterns and provides better guidance for your well-being.
              </p>
            </div>
            <div className="text-6xl opacity-20">💡</div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
