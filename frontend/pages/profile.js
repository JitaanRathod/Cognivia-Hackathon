import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useState, useEffect } from 'react';

export default function Profile() {
  useProtectedRoute();
  const [form, setForm] = useState({ name: '', dob: '', phone: '', emergencyContact: '', height: '', weight: '', bloodType: '', location: '', pregnancyStatus: '', knownConditions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get('/auth/me');
        if (res.data) {
          setForm({
            name: res.data.name || '',
            dob: res.data.dob ? res.data.dob.split('T')[0] : '',
            phone: res.data.phone || '',
            emergencyContact: res.data.emergencyContact || '',
            height: res.data.height || '',
            weight: res.data.weight || '',
            bloodType: res.data.bloodType || '',
            location: res.data.location || '',
            pregnancyStatus: res.data.pregnancyStatus || '',
            knownConditions: res.data.knownConditions || []
          });
        }
      } catch (err) {
        // no-op
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const save = async () => {
    await api.put('/auth/profile', form);
    alert('Updated');
  };

  if (loading) return <AppLayout><div className="p-8">Loading...</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>

        <label className="text-sm text-navy">Name</label>
        <input className="w-full p-2 border rounded mb-3" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />

        <label className="text-sm text-navy">Date of Birth</label>
        <input type="date" className="w-full p-2 border rounded mb-3" value={form.dob} onChange={e=>setForm({...form, dob: e.target.value})} />

        <label className="text-sm text-navy">Phone</label>
        <input className="w-full p-2 border rounded mb-3" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} />

        <label className="text-sm text-navy">Emergency Contact</label>
        <input className="w-full p-2 border rounded mb-3" value={form.emergencyContact} onChange={e=>setForm({...form, emergencyContact: e.target.value})} />

        <label className="text-sm text-navy">Height (cm)</label>
        <input type="number" className="w-full p-2 border rounded mb-3" value={form.height} onChange={e=>setForm({...form, height: e.target.value})} />

        <label className="text-sm text-navy">Weight (kg)</label>
        <input type="number" className="w-full p-2 border rounded mb-3" value={form.weight} onChange={e=>setForm({...form, weight: e.target.value})} />

        <label className="text-sm text-navy">Blood Type</label>
        <input className="w-full p-2 border rounded mb-3" value={form.bloodType} onChange={e=>setForm({...form, bloodType: e.target.value})} />

        <button onClick={save}
          className="mt-4 bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </AppLayout>
  );
}
