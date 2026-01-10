import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Heart, ArrowLeft, Save, Activity, Droplets, Baby, Moon } from 'lucide-react';

export default function HealthInput() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('period');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [periodData, setPeriodData] = useState({
    lastPeriodDate: '',
    regular: '',
    painLevel: '',
    heavyBleeding: false,
    moodChanges: false,
    acne: false,
    hairFall: false,
    weightGain: false
  });

  const [heartData, setHeartData] = useState({
    bpReading: '',
    chestPain: false,
    breathlessness: false,
    dizziness: false,
    stressLevel: ''
  });

  const [pregnancyData, setPregnancyData] = useState({
    pregnancyMonth: '',
    doctorVisit: '',
    headache: false,
    visionBlur: false,
    lessMovement: false,
    bleeding: false,
    breastPain: false,
    moodIssues: false
  });

  const [lifestyleData, setLifestyleData] = useState({
    sleepHours: '',
    foodHabits: '',
    physicalActivity: ''
  });

  const handleSubmit = async (e, type, data) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${process.env.API_URL}/health/${type}`, data);
      setMessage(`${type.charAt(0).toUpperCase() + type.slice(1)} data saved successfully!`);
      setTimeout(() => setMessage(''), 3000);
      // Reset form
      if (type === 'period') setPeriodData({ lastPeriodDate: '', regular: '', painLevel: '', heavyBleeding: false, moodChanges: false, acne: false, hairFall: false, weightGain: false });
      if (type === 'heart') setHeartData({ bpReading: '', chestPain: false, breathlessness: false, dizziness: false, stressLevel: '' });
      if (type === 'pregnancy') setPregnancyData({ pregnancyMonth: '', doctorVisit: '', headache: false, visionBlur: false, lessMovement: false, bleeding: false, breastPain: false, moodIssues: false });
      if (type === 'lifestyle') setLifestyleData({ sleepHours: '', foodHabits: '', physicalActivity: '' });
    } catch (error) {
      setMessage('Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'period', label: 'Period & Hormonal', icon: Heart },
    { id: 'heart', label: 'Heart Health', icon: Activity },
    { id: 'pregnancy', label: 'Pregnancy', icon: Baby },
    { id: 'lifestyle', label: 'Lifestyle', icon: Moon }
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Health Input</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-pink-500 text-pink-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-5 w-5 mx-auto mb-1" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Period & Hormonal Tab */}
            {activeTab === 'period' && (
              <form onSubmit={(e) => handleSubmit(e, 'period', periodData)} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Period & Hormonal Health</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Period Date
                    </label>
                    <input
                      type="date"
                      value={periodData.lastPeriodDate}
                      onChange={(e) => setPeriodData({...periodData, lastPeriodDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Regular Cycle?
                    </label>
                    <select
                      value={periodData.regular}
                      onChange={(e) => setPeriodData({...periodData, regular: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pain Level
                    </label>
                    <select
                      value={periodData.painLevel}
                      onChange={(e) => setPeriodData({...periodData, painLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Symptoms (check all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'heavyBleeding', label: 'Heavy Bleeding' },
                      { key: 'moodChanges', label: 'Mood Changes' },
                      { key: 'acne', label: 'Acne' },
                      { key: 'hairFall', label: 'Hair Fall' },
                      { key: 'weightGain', label: 'Weight Gain' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={periodData[key]}
                          onChange={(e) => setPeriodData({...periodData, [key]: e.target.checked})}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Period Data'}
                </button>
              </form>
            )}

            {/* Heart Health Tab */}
            {activeTab === 'heart' && (
              <form onSubmit={(e) => handleSubmit(e, 'heart', heartData)} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Heart Health</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Pressure Reading (e.g., 120/80)
                    </label>
                    <input
                      type="text"
                      value={heartData.bpReading}
                      onChange={(e) => setHeartData({...heartData, bpReading: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      placeholder="120/80"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stress Level
                    </label>
                    <select
                      value={heartData.stressLevel}
                      onChange={(e) => setHeartData({...heartData, stressLevel: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Low">Low</option>
                      <option value="Moderate">Moderate</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Symptoms (check all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'chestPain', label: 'Chest Pain' },
                      { key: 'breathlessness', label: 'Breathlessness' },
                      { key: 'dizziness', label: 'Dizziness' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={heartData[key]}
                          onChange={(e) => setHeartData({...heartData, [key]: e.target.checked})}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Heart Data'}
                </button>
              </form>
            )}

            {/* Pregnancy Tab */}
            {activeTab === 'pregnancy' && (
              <form onSubmit={(e) => handleSubmit(e, 'pregnancy', pregnancyData)} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Pregnancy & Maternal Health</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregnancy Month
                    </label>
                    <input
                      type="number"
                      value={pregnancyData.pregnancyMonth}
                      onChange={(e) => setPregnancyData({...pregnancyData, pregnancyMonth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      placeholder="1-9"
                      min="1"
                      max="9"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Doctor Visit
                    </label>
                    <input
                      type="date"
                      value={pregnancyData.doctorVisit}
                      onChange={(e) => setPregnancyData({...pregnancyData, doctorVisit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Warning Symptoms (check all that apply)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'headache', label: 'Headache' },
                      { key: 'visionBlur', label: 'Vision Blur' },
                      { key: 'lessMovement', label: 'Less Baby Movement' },
                      { key: 'bleeding', label: 'Bleeding' },
                      { key: 'breastPain', label: 'Breast Pain' },
                      { key: 'moodIssues', label: 'Mood Issues' }
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={pregnancyData[key]}
                          onChange={(e) => setPregnancyData({...pregnancyData, [key]: e.target.checked})}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Pregnancy Data'}
                </button>
              </form>
            )}

            {/* Lifestyle Tab */}
            {activeTab === 'lifestyle' && (
              <form onSubmit={(e) => handleSubmit(e, 'lifestyle', lifestyleData)} className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Lifestyle & Daily Habits</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Sleep Hours per Night
                    </label>
                    <input
                      type="number"
                      value={lifestyleData.sleepHours}
                      onChange={(e) => setLifestyleData({...lifestyleData, sleepHours: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      placeholder="7-8"
                      min="0"
                      max="24"
                      step="0.5"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Habits
                    </label>
                    <textarea
                      value={lifestyleData.foodHabits}
                      onChange={(e) => setLifestyleData({...lifestyleData, foodHabits: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      rows="3"
                      placeholder="Describe your typical daily meals, any dietary restrictions, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Physical Activity Level
                    </label>
                    <select
                      value={lifestyleData.physicalActivity}
                      onChange={(e) => setLifestyleData({...lifestyleData, physicalActivity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Sedentary">Sedentary (little to no exercise)</option>
                      <option value="Light">Light (light exercise 1-3 days/week)</option>
                      <option value="Moderate">Moderate (moderate exercise 3-5 days/week)</option>
                      <option value="Active">Active (hard exercise 6-7 days/week)</option>
                      <option value="Very Active">Very Active (very hard exercise & physical job)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Lifestyle Data'}
                </button>
              </form>
            )}
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
