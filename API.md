# AI Booking Engine — API

> Referencia de la API REST y del canal en tiempo real del PoC **AI Booking Engine**.
>
> - **Local:** `http://localhost:3000`
> - **Pública (demo):** `https://ai-booking-engine-one.vercel.app`

## REST

| Método | Ruta                  | Descripción                                                                      |
|--------|-----------------------|----------------------------------------------------------------------------------|
| GET    | `/api/venues`         | Lista todos los venues ordenados por nombre.                                     |
| GET    | `/api/services`       | Lista los servicios de un venue. Requiere `venueId`.                             |
| GET    | `/api/slots`          | Genera los slots disponibles para un servicio en una fecha dada.                 |
| POST   | `/api/bookings`       | Crea una reserva para un slot. Devuelve 409 si el slot ya está reservado.        |
| POST   | `/api/chat`           | Asistente conversacional: sugerencia de horarios vía Motor de IA Local/Cloud.    |

---

### GET `/api/venues`

Devuelve todos los venues (ordenados por `name` asc).

**curl**

```bash
curl https://ai-booking-engine-one.vercel.app/api/venues
```

**Respuesta 200**

```json
[
  {
    "id": "ck VenueCuid01...",
    "name": "Bistró del Puerto",
    "slug": "bistro-del-puerto",
    "industry": "restaurant",
    "description": "Cocura de mar de temporada.",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

---

### GET `/api/services?venueId=`

Lista los servicios de un venue (ordenados por `name` asc).

**Query params**

| Param     | Tipo   | Requerido | Descripción            |
|-----------|--------|-----------|------------------------|
| `venueId` | string | sí        | ID del venue.          |

**curl**

```bash
curl "https://ai-booking-engine-one.vercel.app/api/services?venueId=ckVenueCuid01"
```

**Respuesta 200**

```json
[
  {
    "id": "ckServiceCuid01...",
    "venueId": "ckVenueCuid01",
    "name": "Cena para dos",
    "durationMin": 90,
    "capacity": 1,
    "priceCents": null,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

**Respuesta 400** — Falta `venueId`.

```json
{ "error": "venueId required" }
```

---

### GET `/api/slots?serviceId=&date=`

Genera los slots para un servicio en una fecha dada a partir de las `AvailabilityRule` del venue. Cada slot indica si está `available`.

**Query params**

| Param       | Tipo   | Requerido | Descripción                                  |
|-------------|--------|-----------|----------------------------------------------|
| `serviceId` | string | sí        | ID del servicio.                             |
| `date`      | string | sí        | Fecha en formato `YYYY-MM-DD` (UTC).         |

**curl**

```bash
curl "https://ai-booking-engine-one.vercel.app/api/slots?serviceId=ckServiceCuid01&date=2026-07-25"
```

**Respuesta 200**

```json
[
  { "startAt": "2026-07-25T09:00:00.000Z", "endAt": "2026-07-25T09:30:00.000Z", "available": true },
  { "startAt": "2026-07-25T09:30:00.000Z", "endAt": "2026-07-25T10:00:00.000Z", "available": false }
]
```

**Respuesta 400** — Faltan parámetros.

```json
{ "error": "serviceId and date required" }
```

**Respuesta 500** — Servicio no encontrado o fecha inválida.

```json
{ "error": "Service not found" }
```

---

### POST `/api/bookings`

Crea una reserva para un slot. La unicidad `(serviceId, startAt)` está garantizada por una restricción única en la base de datos → el doble-booking retorna **409**.

**Body**

| Campo           | Tipo    | Requerido | Descripción                                     |
|-----------------|---------|-----------|--------------------------------------------------|
| `serviceId`     | string  | sí        | ID del servicio.                                 |
| `startAt`       | string  | sí        | ISO 8601 del inicio del slot (UTC).              |
| `customerName`  | string  | sí        | Nombre del cliente.                              |
| `customerEmail` | string  | no        | Email del cliente.                               |
| `customerPhone` | string  | no        | Teléfono del cliente.                            |
| `notes`         | string  | no        | Notas de la reserva.                             |
| `venueId`       | string  | no        | ID del venue; usado para emitir el evento SSE.   |

**curl**

```bash
curl -X POST https://ai-booking-engine-one.vercel.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "venueId": "ckVenueCuid01",
    "serviceId": "ckServiceCuid01",
    "startAt": "2026-07-25T09:00:00.000Z",
    "customerName": "María López",
    "customerEmail": "maria@example.com",
    "customerPhone": "+34 600 123 456",
    "notes": "Mesa junto a la ventana"
  }'
```

**Respuesta 201** — Reserva creada.

```json
{
  "id": "ckBookingCuid01...",
  "serviceId": "ckServiceCuid01",
  "startAt": "2026-07-25T09:00:00.000Z",
  "customerName": "María López",
  "customerEmail": "maria@example.com",
  "customerPhone": "+34 600 123 456",
  "status": "confirmed",
  "notes": "Mesa junto a la ventana",
  "createdAt": "2026-07-22T12:30:00.000Z"
}
```

**Respuesta 400** — Faltan `serviceId`, `startAt` o `customerName`.

```json
{ "error": "serviceId, startAt and customerName required" }
```

**Respuesta 409** — Doble-booking: el slot ya está reservado (violación de la restricción única `@@unique([serviceId, startAt])`).

```json
{ "error": "Slot already booked" }
```

**Respuesta 500** — Otro error no esperado.

```json
{ "error": "<mensaje>" }
```

---

### POST `/api/chat`

Asistente conversacional: dado un `venueId` y un `message`, retorna una sugerencia en lenguaje natural generada por un **Motor de IA Local/Cloud** vía API OpenAI-compatible. El contexto del venue (nombre y servicios con duración) se envía al motor.

**Body**

| Campo     | Tipo   | Requerido | Descripción                  |
|-----------|--------|-----------|------------------------------|
| `venueId` | string | sí        | ID del venue.                |
| `message` | string | sí        | Mensaje del usuario.         |

**curl**

```bash
curl -X POST https://ai-booking-engine-one.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{ "venueId": "ckVenueCuid01", "message": "¿Tienen algo libre el viernes por la tarde?" }'
```

**Respuesta 200**

```json
{ "reply": "El viernes tenemos slots a las 16:00, 17:30 y 19:00. ¿Te encaja alguno?" }
```

**Respuesta 400** — Faltan `venueId` o `message`.

```json
{ "error": "venueId and message required" }
```

**Respuesta 404** — Venue no encontrado.

```json
{ "error": "Venue not found" }
```

**Respuesta 500** — Error del motor de IA u otro error.

```json
{ "error": "<mensaje>" }
```

---

## Tiempo real (Socket.io)

Al crear una reserva vía `POST /api/bookings`, si se envió `venueId`, el servidor emite el siguiente evento a la sala `venue:<venueId>`:

| Evento              | Payload                                                       | Destino            |
|---------------------|---------------------------------------------------------------|--------------------|
| `booking:created`   | Objeto `Booking` (mismo cuerpo que la respuesta 201 del POST) | `venue:<venueId>`  |

Los clientes conectados suscritos a la sala `venue:<venueId>` reciben la reserva nueva en tiempo real para actualizar la grilla de slots sin refrescar.

---

## Modelo de datos

Cuatro modelos Prisma (PostgreSQL). Clave: el campo `@@unique([serviceId, startAt])` en `Booking` es el que **previene el doble-booking** y dispara el HTTP 409.

### Venue
| Campo         | Tipo      | Descripción                                                       |
|---------------|-----------|-------------------------------------------------------------------|
| `id`          | String    | Identificador (cuid).                                             |
| `name`        | String    | Nombre del venue.                                                 |
| `slug`        | String    | Slug único.                                                       |
| `industry`    | String    | Rubro: `restaurant \| gym \| spa \| salon \| clinic \| coworking`.|
| `description` | String?   | Descripción opcional.                                             |
| `createdAt`   | DateTime  | Fecha de creación.                                                |
| `services`    | Service[] | Servicios asociados.                                              |
| `rules`       | AvailabilityRule[] | Reglas de disponibilidad del venue.                       |

### Service
| Campo         | Tipo     | Descripción                                              |
|---------------|----------|----------------------------------------------------------|
| `id`          | String   | Identificador (cuid).                                    |
| `venueId`     | String   | Venue al que pertenece (cascade).                        |
| `name`        | String   | Nombre del servicio.                                     |
| `durationMin` | Int      | Duración del slot en minutos (default 60).               |
| `capacity`    | Int      | Capacidad por slot (default 1).                          |
| `priceCents`  | Int?     | Precio opcional en centavos (futuro SaaS).               |
| `createdAt`   | DateTime | Fecha de creación.                                       |
| `bookings`    | Booking[] | Reservas del servicio.                                  |

### AvailabilityRule
| Campo       | Tipo    | Descripción                                                            |
|-------------|---------|------------------------------------------------------------------------|
| `id`        | String  | Identificador (cuid).                                                  |
| `venueId`   | String  | Venue al que aplica (cascade).                                         |
| `serviceId` | String? | Si es `null`, aplica a todos los servicios del venue.                  |
| `dayOfWeek` | Int     | Día de la semana: `0` = domingo … `6` = sábado.                       |
| `startTime` | String  | Inicio del rango en `HH:mm`.                                           |
| `endTime`   | String  | Fin del rango en `HH:mm`.                                              |

### Booking
| Campo           | Tipo     | Descripción                                                 |
|-----------------|----------|-------------------------------------------------------------|
| `id`            | String   | Identificador (cuid).                                       |
| `serviceId`     | String   | Servicio reservado (cascade).                               |
| `startAt`       | DateTime | Inicio del slot (UTC).                                      |
| `customerName`  | String   | Nombre del cliente.                                         |
| `customerEmail` | String?  | Email.                                                      |
| `customerPhone` | String?  | Teléfono.                                                   |
| `status`        | String   | `confirmed \| cancelled \| no_show` (default `confirmed`). |
| `notes`         | String?  | Notas.                                                      |
| `createdAt`     | DateTime | Fecha de creación.                                          |
| **Unique**      | —        | `@@unique([serviceId, startAt])` → bloquea doble-booking.   |