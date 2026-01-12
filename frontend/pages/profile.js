import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useState } from 'react';

export default function Profile() {
  useProtectedRoute();
  const [name, setName] = useState('');

  const save = async () => {
    await api.put('/auth/profile', { name });
    alert('Updated');
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <input className="w-full p-2 border rounded"
          placeholder="Name" onChange={e=>setName(e.target.value)} />
        <button onClick={save}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </AppLayout>
  );
}
