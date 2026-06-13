"use client";

import Link from "next/link";
import { useState } from "react";
import { Plane, Menu, X, LogOut, Briefcase, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, signOut, openAuthModal } = useAuth();

  const displayName =
    (user?.user_metadata?.name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "Viajero";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-950/95 backdrop-blur-sm border-b border-green-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-green-400 p-1.5 rounded-lg group-hover:bg-green-300 transition-colors">
              <Plane className="w-5 h-5 text-green-950" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Lili<span className="text-green-400">TravelPlanner</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-green-200 hover:text-white transition-colors text-sm font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/#how-it-works"
              className="text-green-200 hover:text-white transition-colors text-sm font-medium"
            >
              Cómo funciona
            </Link>
            <Link
              href="/#destinations"
              className="text-green-200 hover:text-white transition-colors text-sm font-medium"
            >
              Destinos
            </Link>

            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/my-trips"
                      className="flex items-center gap-1.5 text-green-200 hover:text-white transition-colors text-sm font-medium"
                    >
                      <Briefcase className="w-4 h-4" />
                      Mis viajes
                    </Link>
                    <div className="flex items-center gap-2 bg-green-900/60 border border-green-700/40 px-3 py-1.5 rounded-full">
                      <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-green-950" />
                      </div>
                      <span className="text-white text-sm font-medium max-w-[120px] truncate">
                        {displayName}
                      </span>
                    </div>
                    <button
                      onClick={signOut}
                      className="flex items-center gap-1.5 text-green-300 hover:text-red-300 transition-colors text-sm"
                      title="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openAuthModal("login")}
                      className="text-green-200 hover:text-white transition-colors text-sm font-medium"
                    >
                      Iniciar sesión
                    </button>
                    <Link
                      href="/plan"
                      className="bg-green-400 text-green-950 px-5 py-2 rounded-full text-sm font-bold hover:bg-green-300 transition-all transform hover:scale-105 shadow-lg"
                    >
                      Planear viaje
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-green-950 border-t border-green-800/30">
          <div className="px-4 py-4 space-y-2">
            {[
              { href: "/", label: "Inicio" },
              { href: "/#how-it-works", label: "Cómo funciona" },
              { href: "/#destinations", label: "Destinos" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-green-200 hover:text-white py-2.5 px-2 rounded-lg hover:bg-green-900/50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!loading && (
              <>
                {user ? (
                  <>
                    <Link
                      href="/my-trips"
                      className="flex items-center gap-2 text-green-200 hover:text-white py-2.5 px-2 rounded-lg hover:bg-green-900/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Briefcase className="w-4 h-4" />
                      Mis viajes
                    </Link>
                    <div className="flex items-center justify-between px-2 py-2">
                      <span className="text-green-300 text-sm">{displayName}</span>
                      <button
                        onClick={() => { signOut(); setIsOpen(false); }}
                        className="flex items-center gap-1.5 text-red-300 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Salir
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { openAuthModal("login"); setIsOpen(false); }}
                      className="block w-full text-left text-green-200 hover:text-white py-2.5 px-2 rounded-lg hover:bg-green-900/50 transition-colors"
                    >
                      Iniciar sesión
                    </button>
                    <Link
                      href="/plan"
                      className="block bg-green-400 text-green-950 px-5 py-3 rounded-full text-center font-bold mt-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Planear viaje
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
