import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useState } from 'react';

export default function PeriodForm() {
  useProtectedRoute();
  const [form, setForm] = useState({ lastPeriodDate: '', regular: 'Yes', painLevel: 'Mild', heavyBleeding: false, moodChanges: false, acne: false, hairFall: false, weightGain: false });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/health/period', form);
      alert('Period data saved');
    } catch (err) {
      alert('Failed to save');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Period & Hormonal Health</h1>
        <label className="text-sm">Last Period Date</label>
        <input type="date" className="w-full p-2 border rounded mb-3" value={form.lastPeriodDate} onChange={e=>setForm({...form, lastPeriodDate: e.target.value})} />
        <label className="text-sm">Regular</label>
        <select className="w-full p-2 border rounded mb-3" value={form.regular} onChange={e=>setForm({...form, regular: e.target.value})}>
          <option>Yes</option><option>No</option>
        </select>
        <label className="text-sm">Pain Level</label>
        <select className="w-full p-2 border rounded mb-3" value={form.painLevel} onChange={e=>setForm({...form, painLevel: e.target.value})}>
          <option>Mild</option><option>Moderate</option><option>Severe</option>
        </select>
        <div className="flex gap-2">
          <label className="flex items-center"><input type="checkbox" checked={form.moodChanges} onChange={e=>setForm({...form, moodChanges: e.target.checked})} className="mr-2"/>Mood Changes</label>
          <label className="flex items-center"><input type="checkbox" checked={form.acne} onChange={e=>setForm({...form, acne: e.target.checked})} className="mr-2"/>Acne</label>
        </div>
        <div className="mt-4">
          <button onClick={submit} disabled={loading} className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded">{loading? 'Saving...':'Save'}</button>
        </div>
      </div>
    </AppLayout>
  );
}