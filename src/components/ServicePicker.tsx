'use client';

import { Service } from '@/types';

interface Props {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ServicePicker({ services, selectedId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service.id)}
          className={`px-4 py-2 rounded-full border text-sm transition ${
            selectedId === service.id
              ? 'border-blue-500 bg-blue-500 text-white'
              : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
          }`}
        >
          {service.name} ({service.durationMin} min)
        </button>
      ))}
    </div>
  );
}
