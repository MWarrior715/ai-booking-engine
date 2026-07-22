# AI Booking Engine — Arquitectura

## Diagrama conceptual

```
Usuario
  │
  ▼
┌─────────────────────────────────────┐
│  Next.js App Router                 │
│  /                → selector de rubro│
│  /[venueId]       → reserva          │
│  /api/*           → REST + chat      │
└─────────────────────────────────────┘
  │
  ├──▶ Prisma ORM ◀── SQLite (PoC) / PostgreSQL (prod)
  │      ├─ Venue
  │      ├─ Service
  │      ├─ AvailabilityRule
  │      └─ Booking
  │
  └──▶ Socket.io Server
         └── emite booking:created a clientes del mismo venue

Asistente conversacional
  └── /api/chat → Motor de IA Local/Cloud (OpenAI-compatible)
```

## Capas

1. **Presentación (React + Tailwind):**
   - `VenueSelector`: tarjetas por rubro.
   - `ServicePicker`: servicios del venue.
   - `SlotGrid`: horarios disponibles, marcando ocupados.
   - `BookingForm`: captura datos del cliente y reserva.
   - `ChatAssistant`: chat con sugerencias del motor LLM.

2. **API REST (Next.js App Router):**
   - `GET /api/venues`
   - `GET /api/services?venueId=...`
   - `GET /api/slots?serviceId=...&date=...`
   - `POST /api/bookings`
   - `POST /api/chat`

3. **Dominio (`src/lib/slots.ts`):**
   - `generateSlots`: lee reglas de disponibilidad, divide en slots, descarta los ya reservados.
   - `bookSlot`: persiste la reserva. El `@@unique([serviceId, startAt])` en Prisma evita race conditions/doble-booking.

4. **Persistencia (Prisma + SQLite):**
   - Schema preparado para PostgreSQL; SQLite solo para portabilidad del PoC.

5. **Tiempo real (Socket.io):**
   - Custom server `server.ts` monta Next.js + Socket.io.
   - Los clientes se unen a `venue:<id>`.
   - Al crear reserva, el servidor emite `booking:created`.

6. **IA (`src/lib/ai.ts`):**
   - Wrapper sobre cliente OpenAI-compatible.
   - Configurable por `.env`; mago-compliant.

## Decisiones clave

- **SQLite para el PoC.** Permite clonar y correr sin Docker ni Postgres. El schema de Prisma es idéntico al de PostgreSQL; cambiar `provider` y `DATABASE_URL` es trivial.
- **Custom server para Socket.io.** App Router de Next.js no expone WebSocket nativamente; `server.ts` une Next.js + Socket.io de forma limpia.
- **UTC simplificado.** Las fechas/horarios se manejan en UTC para evitar inconsistencias de timezone en demos. La zona horaria real es ROADMAP.
