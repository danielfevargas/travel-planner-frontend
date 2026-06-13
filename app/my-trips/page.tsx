"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Calendar, Users, Wallet, Trash2, Eye,
  Plane, Loader2, AlertTriangle, Briefcase,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import type { SavedItinerary } from "@/lib/types";
import Navbar from "@/components/Navbar";

export default function MyTripsPage() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<SavedItinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Redirect to home + open modal if not authenticated
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      openAuthModal("login");
      router.replace("/");
    }
  }, [user, authLoading, openAuthModal, router]);

  // Fetch trips when user is available
  useEffect(() => {
    if (!user) return;

    const fetchTrips = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("itineraries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setTrips(data as SavedItinerary[]);
      setLoading(false);
    };

    fetchTrips();
  }, [user]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from("itineraries").delete().eq("id", id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const handleViewTrip = (trip: SavedItinerary) => {
    localStorage.setItem("travelItinerary", JSON.stringify(trip.itinerary_data));
    localStorage.setItem(
      "travelPreferences",
      JSON.stringify({
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        budget: trip.budget,
        budgetType: trip.budget_type,
        travelerType: trip.traveler_type,
        pace: trip.pace,
        interests: trip.interests,
      })
    );
    router.push("/itinerary");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-16">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-14 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-black">Mis Viajes</h1>
                <p className="text-green-200 text-sm mt-0.5">
                  Tus itinerarios guardados
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-3 text-green-500" />
              <p>Cargando tus viajes…</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Plane className="w-10 h-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Aún no tienes viajes guardados
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Planifica tu primer itinerario y guárdalo aquí para consultarlo cuando quieras.
              </p>
              <Link
                href="/plan"
                className="bg-green-700 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-green-600 transition-colors inline-flex items-center gap-2"
              >
                <Plane className="w-4 h-4" />
                Planear mi primer viaje
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {trips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-green-800 to-green-600 p-5 text-white">
                    <div className="flex items-center gap-1.5 text-green-300 text-xs mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {trip.destination}
                    </div>
                    <h3 className="font-black text-xl">
                      {trip.itinerary_data?.destination ?? trip.destination}
                    </h3>
                    <p className="text-green-200 text-xs mt-1">
                      Guardado el{" "}
                      {new Date(trip.created_at).toLocaleDateString("es-ES", {
                        day: "numeric", month: "long", year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <InfoChip icon={<Calendar className="w-3.5 h-3.5" />} label="Fechas">
                        {formatDate(trip.start_date)} – {formatDate(trip.end_date)}
                      </InfoChip>
                      <InfoChip icon={<Wallet className="w-3.5 h-3.5" />} label="Presupuesto">
                        {trip.budget_type
                          ? trip.budget_type.charAt(0).toUpperCase() + trip.budget_type.slice(1)
                          : "—"}{" "}
                        {trip.budget ? `· $${trip.budget.toLocaleString()}` : ""}
                      </InfoChip>
                      <InfoChip icon={<Users className="w-3.5 h-3.5" />} label="Viajero">
                        {trip.traveler_type ?? "—"}
                      </InfoChip>
                      <InfoChip icon={<MapPin className="w-3.5 h-3.5" />} label="Ritmo">
                        {trip.pace ?? "—"}
                      </InfoChip>
                    </div>

                    {trip.interests && trip.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {trip.interests.slice(0, 4).map((i) => (
                          <span key={i} className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full border border-green-200">
                            {i}
                          </span>
                        ))}
                        {trip.interests.length > 4 && (
                          <span className="text-gray-400 text-xs py-1">
                            +{trip.interests.length - 4} más
                          </span>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {confirmDeleteId === trip.id ? (
                      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                        <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-red-700 text-sm flex-1">¿Eliminar este viaje?</span>
                        <button
                          onClick={() => handleDelete(trip.id)}
                          disabled={deletingId === trip.id}
                          className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 disabled:opacity-60"
                        >
                          {deletingId === trip.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sí, eliminar"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-gray-500 hover:text-gray-700 text-xs px-2"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewTrip(trip)}
                          className="flex-1 flex items-center justify-center gap-2 bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver itinerario
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(trip.id)}
                          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {trips.length > 0 && (
            <div className="mt-10 text-center">
              <Link
                href="/plan"
                className="inline-flex items-center gap-2 border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-700 hover:text-white transition-all"
              >
                <Plane className="w-4 h-4" />
                Planear otro viaje
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

function InfoChip({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-2.5">
      <div className="flex items-center gap-1 text-gray-400 text-xs mb-0.5">
        {icon}
        {label}
      </div>
      <div className="text-gray-700 text-sm font-medium capitalize">{children}</div>
    </div>
  );
}
