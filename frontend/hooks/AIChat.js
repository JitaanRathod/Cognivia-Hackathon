import { useState } from 'react';
import axios from 'axios';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [voice, setVoice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/ai/interact', { input });
    setResponse(res.data.response);
    if (voice) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(res.data.response);
      synth.speak(utterance);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Describe symptoms" />
        <button type="submit">Ask AI</button>
        <label><input type="checkbox" checked={voice} onChange={() => setVoice(!voice)} /> Voice Response</label>
      </form>
      <p>{response}</p>
    </div>
  );
}