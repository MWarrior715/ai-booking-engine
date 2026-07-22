# AI Booking Engine

> Motor de reservas multi-rubro con disponibilidad en tiempo real, conflictos bloqueados y asistente conversacional. Un PoC que demuestra la arquitectura de un SaaS de reservas completo.

Este proyecto demuestra **cómo construir un SaaS de reservas AI-First** de punta a punta: modelo de datos de disponibilidad, generación de slots, prevención de doble-booking, confirmaciones en tiempo real y un asistente conversacional que sugiere horarios.

## ¿Qué demuestra? (10 min con un CTO)

- Modelo de datos relacional para venues, servicios, reglas de disponibilidad y reservas.
- Generación automática de slots desde reglas de horario.
- Prevención de doble-booking vía restricción única en base de datos.
- UI adaptada por rubro (restaurante, gym, spa, salón, consultorio, coworking).
- Confirmaciones en tiempo real con Socket.io.
- Asistente de reservas impulsado por un Motor de IA Local/Cloud.

## Stack

- **Framework:** Next.js 14 (App Router) + React + TypeScript
- **Estilos:** TailwindCSS
- **ORM:** Prisma (schema preparado para PostgreSQL; PoC corre con SQLite para portabilidad)
- **Base de datos:** SQLite local (PostgreSQL en ROADMAP)
- **Tiempo real:** Socket.io
- **Motor de IA:** API OpenAI-compatible enchufable

## Inicio rápido

```bash
git clone https://github.com/MWarrior715/ai-booking-engine
cd ai-booking-engine
npm install

cp .env.example .env              # configura tu motor de IA (local o cloud)
npx prisma db push --schema=prisma/schema.prisma
npx ts-node prisma/seed.ts         # carga 6 venues de distintos rubros

npm run dev                       # levanta Next.js + Socket.io en http://localhost:3000
```

Abre el navegador, selecciona un tipo de negocio, un servicio, una fecha y reserva un slot.

## Configuración

| Variable | Descripción | Default |
|---|---|---|
| `DATABASE_URL` | URL de base de datos (SQLite para el PoC) | `file:./prisma/dev.db` |
| `OPENAI_BASE_URL` | Endpoint OpenAI-compatible del motor de IA | `http://localhost:11434/v1` |
| `OPENAI_API_KEY` | API key (placeholder en motor local) | `local-dev-key` |
| `LLM_MODEL` | Modelo generativo | `qwen2.5:7b-instruct` |
| `PORT` | Puerto del servidor | `3000` |

## Estructura

```
ai-booking-engine/
├── prisma/
│   ├── schema.prisma       # Venue, Service, AvailabilityRule, Booking
│   └── seed.ts             # venues multi-rubro
├── server.ts               # servidor custom: Next.js + Socket.io
├── src/
│   ├── app/
│   │   ├── page.tsx        # selector de rubro
│   │   ├── [venueId]/      # UI de reservas
│   │   └── api/            # REST endpoints
│   ├── components/         # VenueSelector, SlotGrid, BookingForm, ChatAssistant
│   ├── lib/
│   │   ├── prisma.ts       # PrismaClient
│   │   ├── slots.ts        # generación de slots + conflictos
│   │   ├── ai.ts           # wrapper del motor LLM
│   │   └── socket.ts       # cliente Socket.io
│   └── types/
└── README.md · ARCHITECTURE.md · DECISIONS.md · ROADMAP.md · CHANGELOG.md · LICENSE
```

## Documentación

- [ARCHITECTURE.md](ARCHITECTURE.md) — diagrama y capas.
- [DECISIONS.md](DECISIONS.md) — por qué Next.js, Prisma+SQLite, Socket.io, etc.
- [ROADMAP.md](ROADMAP.md) — PostgreSQL, pagos, notificaciones, deploy.
- [CHANGELOG.md](CHANGELOG.md)

## Licencia

[MIT](LICENSE).
