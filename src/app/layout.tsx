import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Booking Engine",
  description: "Motor de reservas multi-rubro con disponibilidad en tiempo real",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
