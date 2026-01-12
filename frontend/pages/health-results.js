import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useEffect, useState } from 'react';

export default function HealthResults() {
  useProtectedRoute();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const res = await api.get('/health/assessment');
        setAssessment(res.data);
      } catch (err) {
        // no assessment yet
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) return <AppLayout><div className="p-8">Loading...</div></AppLayout>;

  if (!assessment || !assessment.data) return (
    <AppLayout>
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">No assessment found</h1>
        <p className="text-gray-600">Please complete the <a href="/health-assessment" className="text-primary underline">Health Assessment</a> first.</p>
      </div>
    </AppLayout>
  );

  const { scores, responses } = assessment.data;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-navy">Health Assessment Results</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {Object.keys(scores).map((section) => (
            <div key={section} className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold text-lg text-navy capitalize">{section}</h3>
              <div className="mt-4">
                <div className="text-4xl font-bold text-primary">{scores[section]}</div>
                <p className="mt-2 text-gray-600">{generateShortTip(section, scores[section])}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-secondary p-6 rounded-lg text-navy">
          <h3 className="font-semibold text-lg">Detailed Responses</h3>
          <pre className="mt-2 text-sm overflow-auto">{JSON.stringify(responses, null, 2)}</pre>
        </div>
      </div>
    </AppLayout>
  );
}

function generateShortTip(section, score) {
  if (score >= 80) return 'Good — maintain your current habits.';
  if (score >= 60) return 'Needs attention — consider lifestyle changes.';
  return 'Seek medical advice as needed.';
}