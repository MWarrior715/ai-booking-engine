'use client';

import { useState } from 'react';
import { Slot } from '@/types';

interface Props {
  slot: Slot;
  serviceName: string;
  onBook: (data: { name: string; email: string; phone: string }) => Promise<void>;
  booking: { status: 'idle' | 'loading' | 'success' | 'error'; message: string };
}

export default function BookingForm({ slot, serviceName, onBook, booking }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const start = new Date(slot.startAt).toLocaleString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onBook({ name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mt-4">
      <h3 className="font-semibold mb-2">Reservar {serviceName}</h3>
      <p className="text-sm text-slate-400 mb-4">{start}</p>

      <div className="grid gap-3">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
        />
        <input
          type="email"
          placeholder="Email (opcional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={booking.status === 'loading'}
        className="mt-4 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 font-medium"
      >
        {booking.status === 'loading' ? 'Reservando…' : 'Confirmar reserva'}
      </button>

      {booking.status === 'success' && (
        <p className="mt-3 text-green-400 text-sm">{booking.message}</p>
      )}
      {booking.status === 'error' && (
        <p className="mt-3 text-red-400 text-sm">{booking.message}</p>
      )}
    </form>
  );
}
