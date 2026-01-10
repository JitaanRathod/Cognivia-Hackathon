import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import {
  Heart,
  Bell,
  TrendingUp,
  Calendar,
  User,
  MessageCircle,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [healthSummary, setHealthSummary] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, notifRes, recordsRes] = await Promise.all([
          axios.get(`${process.env.API_URL}/health`),
          axios.get(`${process.env.API_URL}/notifications`),
          axios.get(`${process.env.API_URL}/health`)
        ]);
        setHealthSummary(healthRes.data);
        setNotifications(notifRes.data.slice(0, 5)); // Show latest 5
        setRecentRecords(recordsRes.data.slice(0, 3)); // Show latest 3
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'Be Careful': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Warning': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Agentic AI PAS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center text-gray-700 hover:text-pink-600">
                <User className="h-5 w-5 mr-1" />
                Profile
              </Link>
              <Link href="/notifications" className="flex items-center text-gray-700 hover:text-pink-600 relative">
                <Bell className="h-5 w-5 mr-1" />
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Link>
              <button
                onClick={logout}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-gray-600">Here's your health overview for today.</p>
        </div>

        {/* Health Status Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Current Health Status</h3>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(healthSummary.riskLevel || 'Normal')}`}>
                <Activity className="h-4 w-4 mr-2" />
                {healthSummary.riskLevel || 'Normal'}
              </div>
            </div>
            <TrendingUp className="h-12 w-12 text-pink-500" />
          </div>
          <p className="mt-4 text-gray-600">
            Your health data is being monitored. Stay consistent with your health tracking for better insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/health-input" className="block w-full bg-pink-50 hover:bg-pink-100 text-pink-700 px-4 py-3 rounded-lg text-center font-medium transition-colors">
                Log Health Data
              </Link>
              <Link href="/ai-chat" className="block w-full bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-3 rounded-lg text-center font-medium transition-colors">
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Chat with AI Assistant
              </Link>
              <Link href="/calendar" className="block w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-lg text-center font-medium transition-colors">
                <Calendar className="h-4 w-4 inline mr-2" />
                View Health Calendar
              </Link>
            </div>
          </div>

          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Notifications</h3>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getPriorityIcon(notification.priority)}
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent notifications</p>
            )}
            <Link href="/notifications" className="block text-center text-pink-600 hover:text-pink-700 mt-4">
              View all notifications
            </Link>
          </div>
        </div>

        {/* Recent Health Records */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Health Records</h3>
          {recentRecords.length > 0 ? (
            <div className="space-y-4">
              {recentRecords.map((record) => (
                <div key={record._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{record.type} Tracking</p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No health records yet. Start tracking your health!</p>
              <Link href="/health-input" className="inline-block mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700">
                Add First Record
              </Link>
            </div>
          )}
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
