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
          <div key={n.id} style={{ borderLeft: `6px solid ${n.color}` }} className="bg-white p-4 rounded mb-3 shadow flex justify-between items-start">
            <div>
              <p className="font-medium text-navy">{n.message}</p>
              <p className="text-xs text-gray-500 mt-1">{new Date(n.timestamp).toLocaleString()}</p>
            </div>
            <div className="text-sm text-gray-400">{n.priority}</div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
