# AI Booking Engine — Decisiones

## ¿Por qué Next.js?

Es el framework que aparece en la card del portafolio y representa un SaaS moderno. App Router + API routes permite tener backend y frontend en el mismo repo, ideal para un PoC autocontenido.

## ¿Por qué Prisma + SQLite?

Prisma demuestra modelado relacional y ORM. SQLite elimina fricción de setup local (sin Docker). El schema está preparado para PostgreSQL: cambiar `provider` y `DATABASE_URL` lo lleva a producción. Es honesto y pragmático.

## ¿Por qué Socket.io?

La card del portafolio menciona "confirmaciones en tiempo real". Socket.io es la forma más directa de demostrarlo: cuando alguien reserva, todos los clientes conectados al mismo venue reciben la actualización.

## ¿Por qué custom server (`server.ts`)?

Next.js App Router no soporta WebSocket en API routes. `server.ts` crea un servidor HTTP con `createServer`, monta Next.js y adjunta Socket.io. Es un patrón documentado y funcional para desarrollo local.

## ¿Por qué UTC simplificado?

Manejar zonas horarias correctamente en un PoC agrega complejidad sin aportar a la narrativa del CTO. Se trabaja todo en UTC y se documenta en ROADMAP como mejora futura.

## Mago-compliance

- Motor LLM vía API OpenAI-compatible, nunca `ollama`/`GLM` en el código público.
- `.env` y bases de datos locales gitignored.
- README y docs hablan de "Motor de IA Local/Cloud".
