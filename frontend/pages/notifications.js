import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { Bell, ArrowLeft, CheckCircle, AlertTriangle, Clock, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/notifications`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    setMarkingRead(id);
    try {
      await axios.put(`${process.env.API_URL}/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark as read:', error);
    } finally {
      setMarkingRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
      await Promise.all(
        unreadIds.map(id => axios.put(`${process.env.API_URL}/notifications/${id}/read`))
      );
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Urgent': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Warning': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'border-red-200 bg-red-50';
      case 'Warning': return 'border-yellow-200 bg-yellow-50';
      default: return 'border-green-200 bg-green-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <Bell className="h-8 w-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <span className="ml-2 bg-pink-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500">
              You'll receive health reminders, alerts, and summaries here as you use the app.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`bg-white rounded-lg shadow-sm border p-6 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'border-l-4' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getPriorityIcon(notification.priority)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900 capitalize">
                          {notification.type}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notification.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.priority}
                        </span>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-pink-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-900 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      disabled={markingRead === notification._id}
                      className="ml-4 flex items-center text-pink-600 hover:text-pink-700 disabled:opacity-50"
                    >
                      {markingRead === notification._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Read
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notification Types Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Reminders</h4>
                <p className="text-sm text-gray-600">Daily health tips and routine reminders</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Alerts</h4>
                <p className="text-sm text-gray-600">Important health alerts and warnings</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Urgent</h4>
                <p className="text-sm text-gray-600">Critical health issues requiring immediate attention</p>
              </div>
            </div>
          </div>
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
