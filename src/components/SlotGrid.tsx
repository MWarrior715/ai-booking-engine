'use client';

import { Slot } from '@/types';

interface Props {
  slots: Slot[];
  selected: Slot | null;
  onSelect: (slot: Slot) => void;
  loading: boolean;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export default function SlotGrid({ slots, selected, onSelect, loading }: Props) {
  if (loading) return <p className="text-slate-400">Cargando horarios…</p>;

  if (slots.length === 0) {
    return <p className="text-slate-400">No hay horarios disponibles para esta fecha.</p>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {slots.map((slot, idx) => {
        const isSelected =
          selected?.startAt === slot.startAt && selected?.endAt === slot.endAt;
        return (
          <button
            key={idx}
            disabled={!slot.available}
            onClick={() => onSelect(slot)}
            className={`px-3 py-2 rounded-lg text-sm border transition ${
              slot.available
                ? isSelected
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-slate-700 bg-slate-800 hover:border-blue-400'
                : 'border-slate-800 bg-slate-900/50 text-slate-600 cursor-not-allowed'
            }`}
          >
            {formatTime(slot.startAt)}
          </button>
        );
      })}
    </div>
  );
}
