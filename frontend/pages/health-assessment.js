import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';

const healthSections = [
  {
    id: 'hormonal',
    title: 'Hormonal Health',
    questions: [
      { id: 'age', label: 'What is your age?', type: 'number', min: 13, max: 100 },
      { id: 'cycleLength', label: 'Average menstrual cycle length (days)?', type: 'number', min: 21, max: 35 },
      { id: 'periodLength', label: 'Average period length (days)?', type: 'number', min: 3, max: 7 },
      { id: 'symptoms', label: 'Common symptoms during cycle?', type: 'multiselect', options: ['Cramps', 'Headache', 'Mood swings', 'Fatigue', 'Bloating', 'None'] },
      { id: 'hormoneTherapy', label: 'Are you on hormone therapy?', type: 'radio', options: ['Yes', 'No'] },
    ]
  },
  {
    id: 'reproductive',
    title: 'Reproductive or Maternal Health',
    questions: [
      { id: 'pregnant', label: 'Are you currently pregnant?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'breastfeeding', label: 'Are you breastfeeding?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'conceptions', label: 'Number of previous conceptions?', type: 'number', min: 0, max: 10 },
      { id: 'miscarriages', label: 'Number of miscarriages?', type: 'number', min: 0, max: 10 },
      { id: 'lastPregnancy', label: 'When was your last pregnancy? (if applicable)', type: 'date' },
    ]
  },
  {
    id: 'heart',
    title: 'Heart Health',
    questions: [
      { id: 'bloodPressure', label: 'Do you monitor blood pressure regularly?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'heartRate', label: 'Resting heart rate (bpm)?', type: 'number', min: 40, max: 120 },
      { id: 'exercise', label: 'How often do you exercise?', type: 'select', options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'] },
      { id: 'smoking', label: 'Do you smoke?', type: 'radio', options: ['Yes', 'No', 'Occasionally'] },
      { id: 'familyHistory', label: 'Family history of heart disease?', type: 'radio', options: ['Yes', 'No'] },
    ]
  },
  {
    id: 'menstrual',
    title: 'Menstrual Health',
    questions: [
      { id: 'lastPeriod', label: 'When was your last period?', type: 'date' },
      { id: 'flow', label: 'Typical flow intensity?', type: 'select', options: ['Light', 'Medium', 'Heavy', 'Very Heavy'] },
      { id: 'pain', label: 'Pain level during periods?', type: 'select', options: ['None', 'Mild', 'Moderate', 'Severe'] },
      { id: 'irregular', label: 'Are your periods irregular?', type: 'radio', options: ['Yes', 'No'] },
      { id: 'pms', label: 'Do you experience PMS?', type: 'radio', options: ['Yes', 'No'] },
    ]
  }
];

export default function HealthAssessment() {
  useProtectedRoute();
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (sectionId, questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [questionId]: value
      }
    }));
  };

  const calculateHealthScores = () => {
    const scores = {};

    // Hormonal Health Score
    const hormonal = responses.hormonal || {};
    let hormonalScore = 100;
    if (hormonal.symptoms && hormonal.symptoms.length > 3) hormonalScore -= 20;
    if (hormonal.hormoneTherapy === 'Yes') hormonalScore -= 10;
    if (hormonal.cycleLength < 21 || hormonal.cycleLength > 35) hormonalScore -= 15;
    scores.hormonal = Math.max(0, hormonalScore);

    // Reproductive Health Score
    const reproductive = responses.reproductive || {};
    let reproductiveScore = 100;
    if (reproductive.pregnant === 'Yes') reproductiveScore -= 5; // Pregnancy is normal
    if (reproductive.miscarriages > 0) reproductiveScore -= reproductive.miscarriages * 10;
    scores.reproductive = Math.max(0, reproductiveScore);

    // Heart Health Score
    const heart = responses.heart || {};
    let heartScore = 100;
    if (heart.smoking === 'Yes') heartScore -= 30;
    if (heart.smoking === 'Occasionally') heartScore -= 15;
    if (heart.exercise === 'Rarely' || heart.exercise === 'Never') heartScore -= 20;
    if (heart.familyHistory === 'Yes') heartScore -= 15;
    if (heart.heartRate > 80) heartScore -= 10;
    scores.heart = Math.max(0, heartScore);

    // Menstrual Health Score
    const menstrual = responses.menstrual || {};
    let menstrualScore = 100;
    if (menstrual.pain === 'Severe') menstrualScore -= 25;
    if (menstrual.pain === 'Moderate') menstrualScore -= 15;
    if (menstrual.irregular === 'Yes') menstrualScore -= 20;
    if (menstrual.flow === 'Very Heavy') menstrualScore -= 10;
    scores.menstrual = Math.max(0, menstrualScore);

    return scores;
  };

  const getHealthStatus = (score) => {
    if (score >= 80) return { status: 'Good', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 60) return { status: 'Needs Attention', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Bad', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getHealthTips = (section, score) => {
    const tips = {
      hormonal: {
        good: "Keep maintaining your hormonal balance with regular exercise and a healthy diet.",
        attention: "Consider tracking your symptoms more closely and consult a healthcare provider if irregularities persist.",
        bad: "Seek medical advice for hormonal imbalances. Consider lifestyle changes and professional consultation."
      },
      reproductive: {
        good: "Continue with regular check-ups and maintain a healthy lifestyle for reproductive health.",
        attention: "Monitor any changes and consult with a gynecologist for personalized advice.",
        bad: "Immediate consultation with a reproductive health specialist is recommended."
      },
      heart: {
        good: "Maintain your healthy habits. Regular exercise and a balanced diet are key.",
        attention: "Increase physical activity and consider dietary improvements. Regular check-ups are important.",
        bad: "Consult a cardiologist immediately. Lifestyle changes and medical intervention may be necessary."
      },
      menstrual: {
        good: "Your menstrual health looks good. Continue with healthy habits and regular tracking.",
        attention: "Monitor your cycle closely and consider lifestyle adjustments to improve regularity.",
        bad: "Seek medical attention for severe menstrual issues. Professional diagnosis and treatment are advised."
      }
    };

    const status = score >= 80 ? 'good' : score >= 60 ? 'attention' : 'bad';
    return tips[section][status];
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const scores = calculateHealthScores();
      await api.post('/health/assessment', { responses, scores });
      // Redirect to results page or show results
      window.location.href = '/health-results';
    } catch (error) {
      alert('Failed to save assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentSectionData = healthSections[currentSection];
  const isLastSection = currentSection === healthSections.length - 1;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Health Assessment</h1>
            <span className="text-sm text-gray-500">
              {currentSection + 1} of {healthSections.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / healthSections.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">{currentSectionData.title}</h2>

          <div className="space-y-6">
            {currentSectionData.questions.map((question) => (
              <div key={question.id} className="animate-slide-up">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {question.label}
                </label>

                {question.type === 'number' && (
                  <input
                    type="number"
                    min={question.min}
                    max={question.max}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange(currentSectionData.id, question.id, parseInt(e.target.value))}
                  />
                )}

                {question.type === 'text' && (
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange(currentSectionData.id, question.id, e.target.value)}
                  />
                )}

                {question.type === 'date' && (
                  <input
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange(currentSectionData.id, question.id, e.target.value)}
                  />
                )}

                {question.type === 'radio' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name={`${currentSectionData.id}-${question.id}`}
                          value={option}
                          onChange={(e) => handleInputChange(currentSectionData.id, question.id, e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'select' && (
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onChange={(e) => handleInputChange(currentSectionData.id, question.id, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {question.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                )}

                {question.type === 'multiselect' && (
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          onChange={(e) => {
                            const current = responses[currentSectionData.id]?.[question.id] || [];
                            const updated = current.includes(option)
                              ? current.filter(item => item !== option)
                              : [...current, option];
                            handleInputChange(currentSectionData.id, question.id, updated);
                          }}
                          className="mr-2"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentSection(prev => prev - 1)}
              disabled={currentSection === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {isLastSection ? (
              <button
                onClick={submitAssessment}
                disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Assessment'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentSection(prev => prev + 1)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
