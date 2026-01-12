import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { useEffect, useState } from 'react';

export default function Notifications() {
  useProtectedRoute();
  const [list, setList] = useState([]);

  useEffect(() => {
    api.get('/notifications').then(res => setList(res.data));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {list.map(n => (
          <div key={n._id} className="bg-white p-4 rounded mb-3 shadow">
            <p>{n.message}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
