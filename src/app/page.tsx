'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import VenueSelector from '@/components/VenueSelector';
import { Venue } from '@/types';

export default function Home() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/venues')
      .then((r) => r.json())
      .then((data: Venue[]) => setVenues(data));
  }, []);

  const selectedVenue = venues.find((v) => v.id === selectedId);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">AI Booking Engine</h1>
        <p className="text-slate-400">
          Motor de reservas multi-rubro: restaurantes, gimnasios, spas, salones,
          consultorios y coworking. Disponibilidad real, conflictos bloqueados y
          asistente conversacional.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Selecciona un tipo de negocio</h2>
        <VenueSelector
          venues={venues}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </section>

      {selectedVenue && (
        <div className="flex justify-center">
          <Link
            href={`/${selectedVenue.id}`}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold"
          >
            Reservar en {selectedVenue.name} →
          </Link>
        </div>
      )}

      <footer className="text-center text-sm text-slate-500 pt-8">
        Deploy en Vercel · SQLite serverless para la demo · Schema listo para PostgreSQL
      </footer>
    </div>
  );
}
