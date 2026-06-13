import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

const destinations = [
  {
    name: "París",
    country: "Francia",
    description: "La ciudad del amor, el arte y la moda",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    duration: "5–7 días",
    tag: "Romance",
  },
  {
    name: "Bali",
    country: "Indonesia",
    description: "Templos, arrozales y playas paradisíacas",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    duration: "7–10 días",
    tag: "Aventura",
  },
  {
    name: "Tokio",
    country: "Japón",
    description: "Tradición milenaria y modernidad futurista",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    duration: "7–10 días",
    tag: "Cultura",
  },
  {
    name: "Cartagena",
    country: "Colombia",
    description: "Historia colonial, color y mar Caribe",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    duration: "4–5 días",
    tag: "Caribe",
  },
  {
    name: "Medellín",
    country: "Colombia",
    description: "La ciudad de la eterna primavera",
    image: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=800&q=80",
    duration: "4–6 días",
    tag: "Urbano",
  },
];

export default function PopularDestinations() {
  return (
    <section id="destinations" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
            Explora el mundo
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
            Destinos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
              populares
            </span>
          </h2>
          <p className="text-gray-500 text-lg mt-4">
            Inspírate con estos destinos y crea tu itinerario personalizado
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest, idx) => (
            <Link
              key={dest.name}
              href={`/plan?destination=${encodeURIComponent(dest.name)}`}
              className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ${
                idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="bg-green-400 text-green-950 text-xs font-bold px-3 py-1 rounded-full">
                    {dest.tag}
                  </span>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-1 text-green-300 text-sm mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {dest.country}
                  </div>
                  <h3 className="text-2xl font-black">{dest.name}</h3>
                  <p className="text-white/75 text-sm mt-1">{dest.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-green-300 text-sm font-medium">{dest.duration}</span>
                    <span className="flex items-center gap-1 text-white/50 text-sm group-hover:text-green-300 transition-colors">
                      Planear
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/plan"
            className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-700 hover:text-white transition-all duration-200"
          >
            Explorar todos los destinos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
