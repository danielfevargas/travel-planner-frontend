import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "LiliTravelPlanner — Itinerarios con IA",
  description:
    "Planifica el viaje perfecto con inteligencia artificial. Itinerarios personalizados en segundos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
