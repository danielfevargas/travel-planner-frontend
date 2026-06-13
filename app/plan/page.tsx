import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import PlanForm from "@/components/PlanForm";
import { Plane, Sparkles } from "lucide-react";

export const metadata = {
  title: "Planear viaje — Travel Planner",
  description: "Configura tu viaje ideal y genera un itinerario personalizado con IA.",
};

export default function PlanPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 pt-16">
        {/* Page header */}
        <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 px-4 py-1.5 rounded-full text-green-200 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by IA
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Planifica tu viaje perfecto
            </h1>
            <p className="text-green-200 text-lg max-w-xl mx-auto">
              Cuéntanos sobre tu viaje ideal y nuestra IA creará un itinerario
              personalizado día a día en segundos.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="max-w-3xl mx-auto px-4 -mt-8 pb-16">
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Plane className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Tus preferencias</h2>
                <p className="text-gray-500 text-sm">Personaliza cada detalle de tu aventura</p>
              </div>
            </div>

            <Suspense fallback={<div className="h-96 flex items-center justify-center text-gray-400">Cargando formulario...</div>}>
              <PlanForm />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
