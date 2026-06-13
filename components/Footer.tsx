import Link from "next/link";
import { Plane, Globe, Mail, GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-green-800/40">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="bg-green-400 p-1.5 rounded-lg">
                <Plane className="w-5 h-5 text-green-950" />
              </div>
              <span className="text-white font-bold text-xl">
                Travel<span className="text-green-400">Planner</span>
              </span>
            </Link>
            <p className="text-green-400/80 text-sm leading-relaxed max-w-xs">
              Planifica el viaje perfecto con inteligencia artificial. Itinerarios
              personalizados en segundos, adaptados a tus gustos y presupuesto.
            </p>
            <div className="flex gap-4 mt-6">
              {[Globe, Mail, GitBranch].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-green-900 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <Icon className="w-4 h-4 text-green-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Producto</h4>
            <ul className="space-y-3">
              {["Cómo funciona", "Destinos", "Planes y precios", "API"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-green-400/80 hover:text-green-300 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-3">
              {["Sobre nosotros", "Blog de viajes", "Contacto", "Privacidad"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-green-400/80 hover:text-green-300 text-sm transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-green-500">
          <p>© {new Date().getFullYear()} TravelPlanner. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1.5">
            Hecho con
            <span className="text-green-400">♥</span>
            para los viajeros del mundo
          </p>
        </div>
      </div>
    </footer>
  );
}
