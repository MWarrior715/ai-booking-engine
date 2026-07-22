/** @type {import('next').NextConfig} */
const nextConfig = {
  // Incluye la DB sembrada durante el build en el bundle serverless de Vercel.
  // Así las funciones pueden copiarla a /tmp en runtime y escribir reservas.
  experimental: {
    outputFileTracingIncludes: {
      '/api/venues': ['./prisma/dev.db'],
      '/api/services': ['./prisma/dev.db'],
      '/api/slots': ['./prisma/dev.db'],
      '/api/bookings': ['./prisma/dev.db'],
      '/api/chat': ['./prisma/dev.db'],
    },
  },
};

export default nextConfig;
