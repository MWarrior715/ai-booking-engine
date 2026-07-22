'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ServicePicker from '@/components/ServicePicker';
import SlotGrid from '@/components/SlotGrid';
import BookingForm from '@/components/BookingForm';
import ChatAssistant from '@/components/ChatAssistant';
import { getSocket } from '@/lib/socket';
import { Service, Slot, Venue } from '@/types';

export default function VenuePage() {
  const { venueId } = useParams<{ venueId: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  useEffect(() => {
    if (!venueId) return;
    fetch('/api/venues')
      .then((r) => r.json())
      .then((venues: Venue[]) => {
        const v = venues.find((x) => x.id === venueId || x.slug === venueId);
        if (v) {
          setVenue(v);
          const socket = getSocket();
          socket.emit('join-venue', v.id);
          socket.on('booking:created', () => {
            // Refrescar slots si alguien más reserva.
            setSlots((prev) =
              prev.map((s) => ({ ...s, available: s.available && true })));
          });
        }
      });

    fetch(`/api/services?venueId=${encodeURIComponent(venueId)}`)
      .then((r) => r.json())
      .then((data: Service[]) => {
        setServices(data);
        if (data[0]) setServiceId(data[0].id);
      });
  }, [venueId]);

  useEffect(() => {
    if (!serviceId || !date) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    setBooking({ status: 'idle', message: '' });
    fetch(`/api/slots?serviceId=${encodeURIComponent(serviceId)}&date=${encodeURIComponent(date)}`)
      .then((r) => r.json())
      .then((data: Slot[]) => setSlots(data))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, date]);

  const handleBook = async (data: { name: string; email: string; phone: string }) => {
    if (!serviceId || !selectedSlot) return;
    setBooking({ status: 'loading', message: '' });

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          startAt: selectedSlot.startAt,
          customerName: data.name,
          customerEmail: data.email || undefined,
          customerPhone: data.phone || undefined,
          venueId: venue.id,
        }),
      });

      if (res.ok) {
        setBooking({ status: 'success', message: 'Reserva confirmada ✅' });
        setSlots((prev) =
          prev.map((s) =>
            s.startAt === selectedSlot.startAt ? { ...s, available: false } : s,
          ),
        );
      } else {
        const err = await res.json();
        setBooking({
          status: 'error',
          message: err.error || 'No se pudo confirmar la reserva',
        });
      }
    } catch {
      setBooking({ status: 'error', message: 'Error de red' });
    }
  };

  if (!venue) {
    return <div className="p-8 text-slate-400">Cargando venue…</div>;
  }

  const serviceName = services.find((s) => s.id === serviceId)?.name || '';

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-bold">{venue.name}</h1>
        {venue.description && <p className="text-slate-400">{venue.description}</p>}
      </header>

      <section className="space-y-3">
        <h2 className="font-semibold">1. Selecciona un servicio</h2>
        <ServicePicker
          services={services}
          selectedId={serviceId}
          onSelect={setServiceId}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold">2. Elige una fecha</h2>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700"
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">3. Horarios disponibles</h2>
        <SlotGrid
          slots={slots}
          selected={selectedSlot}
          onSelect={setSelectedSlot}
          loading={loadingSlots}
        />
      </section>

      {selectedSlot && (
        <BookingForm
          slot={selectedSlot}
          serviceName={serviceName}
          onBook={handleBook}
          booking={booking}
        />
      )}

      <section className="grid md:grid-cols-2 gap-6 pt-4">
        <ChatAssistant venueId={venue.id} />
      </section>
    </div>
  );
}
