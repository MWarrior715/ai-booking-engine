'use client';

import { useState } from 'react';

interface Props {
  venueId: string;
}

export default function ChatAssistant({ venueId }: Props) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hola, ¿en qué horario te gustaría reservar?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venueId, message: userMsg }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: data.reply || 'No entendí, ¿puedes repetir?' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Error conectando con el asistente.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col h-96">
      <h3 className="font-semibold mb-3">Asistente de reservas 🤖</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`text-sm p-2 rounded-lg max-w-[80%] ${
              m.role === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-100'
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && <div className="text-xs text-slate-400">Escribiendo…</div>}
      </div>
      <form onSubmit={send} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta por horarios…"
          className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
