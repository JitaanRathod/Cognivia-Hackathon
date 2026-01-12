import { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import useProtectedRoute from '../hooks/useProtectedRoute';
import api from '../services/api';
import { Mic, Send } from 'lucide-react';

export default function AIChat() {
  useProtectedRoute();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    api.get('/ai/conversation')
      .then(res => {
        const formatted = res.data.map(m => ({
          role: m.role,
          content: m.content
        }));
        setMessages(formatted);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/interact', { input });
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.response,
          risk: res.data.riskLevel
        }
      ]);

      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(res.data.response);
        u.lang = 'en-IN';
        window.speechSynthesis.speak(u);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">HerCure AI Assistant</h1>

        <div className="bg-white border rounded-xl p-4 h-[420px] overflow-y-auto">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-3 flex ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  m.role === 'user'
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                <p className="text-xs text-gray-500 mt-3 text-center">
  🔒 Your data is private · 🩺 This AI gives guidance, not diagnosis
</p>

                <p className="text-sm">{m.content}</p>
                {m.risk && (
                  <span className="block mt-1 text-xs font-semibold text-purple-600">
                    Risk: {m.risk}
                  </span>
                )}
              </div>
            </div>
          ))}
          {loading && <p className="text-sm text-gray-400">AI is thinking…</p>}
          <div ref={endRef} />
        </div>

        <div className="flex gap-2 mt-4">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Type or speak your health concern…"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            onClick={sendMessage}
            className="bg-pink-600 text-white px-4 rounded-lg"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Voice output enabled · This does not replace a doctor
        </p>
      </div>
    </AppLayout>
  );
}
