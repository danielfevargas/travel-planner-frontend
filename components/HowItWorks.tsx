import { ClipboardList, Cpu, Map } from "lucide-react";

const steps = [
  {
    Icon: ClipboardList,
    step: "01",
    title: "Comparte tus preferencias",
    description:
      "Cuéntanos tu destino, fechas, presupuesto e intereses. Solo toma unos minutos rellenar el formulario.",
  },
  {
    Icon: Cpu,
    step: "02",
    title: "La IA planifica por ti",
    description:
      "Nuestra inteligencia artificial analiza miles de opciones para crear el itinerario ideal a tu medida.",
  },
  {
    Icon: Map,
    step: "03",
    title: "Viaja sin estrés",
    description:
      "Recibe un itinerario detallado día a día con actividades, restaurantes recomendados y tips locales.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">
            Proceso simple
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
            ¿Cómo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
              funciona?
            </span>
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto">
            En 3 simples pasos tendrás el itinerario perfecto para tu próximo viaje
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[22%] right-[22%] h-0.5 bg-gradient-to-r from-transparent via-green-300 to-transparent" />

          {steps.map(({ Icon, step, title, description }, idx) => (
            <div key={idx} className="relative text-center group">
              <div className="relative inline-flex mb-8">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                  <Icon className="w-14 h-14 text-green-700" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-black shadow-md">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
