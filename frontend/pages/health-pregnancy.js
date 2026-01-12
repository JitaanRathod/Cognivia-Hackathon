import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useState } from 'react';

export default function PregnancyForm() {
  useProtectedRoute();
  const [form, setForm] = useState({ pregnancyMonth: '', doctorVisit: false, headache: false, visionBlur: false, lessMovement: false, bleeding: false, breastPain: false, moodIssues: false });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/health/pregnancy', form);
      alert('Pregnancy data saved');
    } catch (err) {
      alert('Failed to save');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Pregnancy & Maternal Health</h1>
        <label className="text-sm">Pregnancy Month</label>
        <input type="number" min="1" max="10" className="w-full p-2 border rounded mb-3" value={form.pregnancyMonth} onChange={e=>setForm({...form, pregnancyMonth: e.target.value})} />
        <div className="flex gap-2 mb-3">
          <label className="flex items-center"><input type="checkbox" checked={form.doctorVisit} onChange={e=>setForm({...form, doctorVisit: e.target.checked})} className="mr-2"/>Doctor Visit</label>
          <label className="flex items-center"><input type="checkbox" checked={form.bleeding} onChange={e=>setForm({...form, bleeding: e.target.checked})} className="mr-2"/>Bleeding</label>
        </div>
        <div className="mt-4">
          <button onClick={submit} disabled={loading} className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded">{loading? 'Saving...':'Save'}</button>
        </div>
      </div>
    </AppLayout>
  );
}