import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useState } from 'react';

export default function HealthInput() {
  useProtectedRoute();
  const [data, setData] = useState({
    sleepHours: '',
    mood: '',
    energy: '',
    symptoms: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  const moodOptions = ['Excellent', 'Good', 'Neutral', 'Poor', 'Terrible'];
  const energyOptions = ['High', 'Moderate', 'Low', 'Very Low'];
  const symptomOptions = ['Headache', 'Cramps', 'Fatigue', 'Nausea', 'Bloating', 'Mood Swings', 'Back Pain', 'Breast Tenderness', 'None'];

  const handleSymptomToggle = (symptom) => {
    setData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/health/lifestyle', data);
      setStatus({ type: 'success', message: 'Health data saved successfully!' });
      setData({
        sleepHours: '',
        mood: '',
        energy: '',
        symptoms: [],
        notes: ''
      });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to save health data. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 4000);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Daily Health Log</h1>
          <p className="text-gray-600">Track your daily health metrics and symptoms</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {status && (
            <div className={`mb-6 p-4 rounded ${status.type === 'success' ? 'bg-secondary text-navy' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sleep Hours */}
            <div className="animate-slide-up delay-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours</label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 8.5"
                value={data.sleepHours}
                onChange={e => setData({...data, sleepHours: e.target.value})}
              />
            </div>

            {/* Mood */}
            <div className="animate-slide-up delay-400">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={data.mood}
                onChange={e => setData({...data, mood: e.target.value})}
              >
                <option value="">Select mood</option>
                {moodOptions.map(mood => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>
            </div>

            {/* Energy Level */}
            <div className="animate-slide-up delay-600">
              <label className="block text-sm font-medium text-gray-700 mb-2">Energy Level</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={data.energy}
                onChange={e => setData({...data, energy: e.target.value})}
              >
                <option value="">Select energy level</option>
                {energyOptions.map((energy) => (
                  <option key={energy} value={energy}>{energy}</option>
                ))}
              </select>
            </div>

            {/* Symptoms */}
            <div className="animate-slide-up delay-800">
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (select all that apply)</label>
              <div className="grid grid-cols-2 gap-2">
                {symptomOptions.map(symptom => (
                  <label key={symptom} className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={data.symptoms.includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="mr-2"
                    />
                    {symptom}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-8 animate-slide-up delay-1000">
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows="4"
              placeholder="Any additional notes about your health today..."
              value={data.notes}
              onChange={e => setData({...data, notes: e.target.value})}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8 text-center animate-slide-up delay-1200">
            <button
              onClick={submit}
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Saving...' : 'Save Health Log'}
            </button>
          </div>
        </div>

        {/* Health Tips */}
        <div className="mt-8 bg-gradient-to-r from-teal-400 to-blue-500 text-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-xl font-bold mb-4">💡 Health Tip</h3>
          <p className="text-lg opacity-90">
            Regular health logging helps identify patterns and provides valuable insights for your well-being.
            Consistency is key to better health management.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
