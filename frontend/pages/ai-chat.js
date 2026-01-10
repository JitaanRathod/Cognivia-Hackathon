import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Heart,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function AIChat() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceInput, setVoiceInput] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [conversation, setConversation] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/ai/conversation`);
        setConversation(res.data);
        // Convert conversation to messages format
        const formattedMessages = res.data.flatMap(msg => [
          { role: 'user', content: msg.role === 'user' ? msg.content : '' },
          { role: 'assistant', content: msg.role === 'assistant' ? msg.content : '' }
        ]).filter(msg => msg.content);
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Failed to fetch conversation:', error);
      }
    };
    fetchConversation();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.API_URL}/ai/interact`, {
        input: input,
        voiceInput: voiceInput
      });

      const aiMessage = {
        role: 'assistant',
        content: res.data.response,
        riskLevel: res.data.riskLevel,
        reasons: res.data.reasons
      };

      setMessages(prev => [...prev, aiMessage]);

      // Text-to-speech if enabled
      if (speechEnabled && res.data.textToSpeech) {
        speakText(res.data.response);
      }
    } catch (error) {
      console.error('AI interaction failed:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        riskLevel: 'Normal'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; // Hindi/English mix
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setVoiceInput(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };

      recognition.onend = () => {
        setVoiceInput(false);
      };

      recognition.start();
    } else {
      alert('Voice input is not supported in this browser.');
    }
  };

  const clearConversation = async () => {
    try {
      await axios.delete(`${process.env.API_URL}/ai/conversation`);
      setMessages([]);
      setConversation([]);
    } catch (error) {
      console.error('Failed to clear conversation:', error);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'Be Careful': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk) {
      case 'Urgent': return <AlertTriangle className="h-4 w-4" />;
      case 'Be Careful': return <Clock className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">AI Health Assistant</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-2 rounded-lg ${speechEnabled ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'}`}
                title={speechEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
              >
                {speechEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              <button
                onClick={clearConversation}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Messages */}
        <div className="bg-white rounded-lg shadow-sm border h-96 overflow-y-auto p-4 mb-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                <p className="text-gray-500">
                  Ask me anything about your health, symptoms, or get personalized advice.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'assistant' && message.riskLevel && (
                      <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(message.riskLevel)}`}>
                        {getRiskIcon(message.riskLevel)}
                        <span className="ml-1">{message.riskLevel}</span>
                      </div>
                    )}
                    {message.role === 'assistant' && message.reasons && message.reasons.length > 0 && (
                      <ul className="mt-2 text-xs text-gray-600 list-disc list-inside">
                        {message.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about your health, symptoms, or get advice..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              disabled={loading}
            />
            <button
              onClick={startVoiceInput}
              disabled={loading || voiceInput}
              className={`p-2 rounded-lg ${voiceInput ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              title="Voice input"
            >
              {voiceInput ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-pink-600 text-white p-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Voice input works best in Chrome. AI responses are for guidance only, not medical advice.
          </p>
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
