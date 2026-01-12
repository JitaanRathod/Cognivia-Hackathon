import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useState } from 'react';

export default function HeartForm() {
  useProtectedRoute();
  const [form, setForm] = useState({ bpReading: '', chestPain: false, breathlessness: false, dizziness: false, stressLevel: 'Low' });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/health/heart', form);
      alert('Heart data saved');
    } catch (err) {
      alert('Failed to save');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Heart Health</h1>
        <label className="text-sm">BP Reading (systolic)</label>
        <input type="number" className="w-full p-2 border rounded mb-3" value={form.bpReading} onChange={e=>setForm({...form, bpReading: e.target.value})} />
        <label className="text-sm">Stress Level</label>
        <select className="w-full p-2 border rounded mb-3" value={form.stressLevel} onChange={e=>setForm({...form, stressLevel: e.target.value})}>
          <option>Low</option><option>Moderate</option><option>High</option>
        </select>
        <div className="flex gap-2">
          <label className="flex items-center"><input type="checkbox" checked={form.chestPain} onChange={e=>setForm({...form, chestPain: e.target.checked})} className="mr-2"/>Chest Pain</label>
          <label className="flex items-center"><input type="checkbox" checked={form.breathlessness} onChange={e=>setForm({...form, breathlessness: e.target.checked})} className="mr-2"/>Breathlessness</label>
        </div>
        <div className="mt-4">
          <button onClick={submit} disabled={loading} className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded">{loading? 'Saving...':'Save'}</button>
        </div>
      </div>
    </AppLayout>
  );
}