import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-950/92 via-green-900/75 to-green-950/88" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-green-400/15 border border-green-400/25 px-4 py-2 rounded-full text-green-300 text-sm font-medium mb-8 backdrop-blur-sm">
          <Star className="w-4 h-4 fill-green-400 text-green-400" />
          Planificación impulsada por Inteligencia Artificial
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-6 leading-[0.9] tracking-tight">
          Tu próxima
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-400">
            aventura
          </span>
          <br />
          te espera
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl mb-12 text-green-100 font-light max-w-2xl mx-auto leading-relaxed">
          Itinerarios personalizados en segundos. Comparte tus preferencias y la IA
          diseña el viaje perfecto para ti.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/plan"
            className="group flex items-center gap-3 bg-green-400 text-green-950 px-8 py-4 rounded-full text-lg font-bold hover:bg-green-300 transition-all transform hover:scale-105 shadow-2xl shadow-green-900/50"
          >
            Crea tu itinerario
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-green-200 hover:text-white transition-colors py-4 px-2 text-lg"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Stats */}
        <div className="mt-20 flex flex-wrap justify-center gap-10 md:gap-16">
          {[
            { value: "10,000+", label: "Viajeros satisfechos" },
            { value: "150+", label: "Destinos disponibles" },
            { value: "4.9 ★", label: "Calificación promedio" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-green-400">{stat.value}</div>
              <div className="text-green-300 text-sm mt-1 font-light">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-green-400/50 flex items-start justify-center p-1.5">
          <div className="w-1 h-3 bg-green-400 rounded-full" />
        </div>
      </div>
    </section>
  );
}
