'use client';

import { Venue } from '@/types';

interface Props {
  venues: Venue[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const industryLabels: Record<string, string> = {
  restaurant: 'Restaurante',
  gym: 'Gimnasio',
  spa: 'Spa',
  salon: 'Salón',
  clinic: 'Consultorio',
  coworking: 'Coworking',
};

export default function VenueSelector({ venues, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {venues.map((venue) => (
        <button
          key={venue.id}
          onClick={() => onSelect(venue.id)}
          className={`text-left p-4 rounded-xl border transition ${
            selectedId === venue.id
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          <div className="text-xs uppercase tracking-wide text-blue-400 mb-1">
            {industryLabels[venue.industry] || venue.industry}
          </div>
          <div className="font-semibold text-lg">{venue.name}</div>
          {venue.description && (
            <p className="text-sm text-slate-400 mt-1">{venue.description}</p>
          )}
        </button>
      ))}
    </div>
  );
}
