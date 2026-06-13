"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Clock, UtensilsCrossed, Lightbulb,
  Calendar, RefreshCw, Sparkles, BookmarkPlus, CheckCircle, X,
} from "lucide-react";
import type { GeneratedItinerary, TravelPreferences } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

const TYPE_ICONS: Record<string, string> = {
  sightseeing: "🏛️", museum: "🖼️", food: "🍽️", gastronomy: "🍽️",
  experience: "⭐", leisure: "🌿", exploration: "🗺️", cultural: "🎭",
  nature: "🌿", nightlife: "🎶", shopping: "🛍️", outdoor: "🧗",
};

type SaveStatus = "idle" | "saving" | "saved" | "error";
type FeedbackRating = "positive" | "negative" | null;
type FeedbackStatus = "idle" | "submitting" | "done";

export default function ItineraryView() {
  const { user, loading: authLoading, openAuthModal } = useAuth();
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [prefs, setPrefs] = useState<TravelPreferences | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState<FeedbackStatus>("idle");

  const submitFeedback = async (rating: "positive" | "negative") => {
    setFeedbackRating(rating);
    setFeedbackStatus("submitting");

    if (user) {
      await supabase.from("feedback").insert({
        user_id: user.id,
        itinerary_destination: itinerary?.destination ?? "",
        rating,
        comment: feedbackComment.trim() || null,
      });
    }

    setFeedbackStatus("done");
  };

  const saveToSupabase = useCallback(
    async (data: GeneratedItinerary, preferences: TravelPreferences) => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;

      setSaveStatus("saving");
      const { error } = await supabase.from("itineraries").insert({
        user_id: currentUser.id,
        destination: preferences.destination,
        start_date: preferences.startDate,
        end_date: preferences.endDate,
        budget: preferences.budget,
        budget_type: preferences.budgetType,
        traveler_type: preferences.travelerType,
        pace: preferences.pace,
        interests: preferences.interests,
        itinerary_data: data,
      });

      setSaveStatus(error ? "error" : "saved");
    },
    []
  );

  useEffect(() => {
    const raw = localStorage.getItem("travelItinerary");
    const rawPrefs = localStorage.getItem("travelPreferences");
    if (raw) setItinerary(JSON.parse(raw));
    if (rawPrefs) setPrefs(JSON.parse(rawPrefs));
  }, []);

  // Handle "fresh itinerary" flag — auto-save if logged in, prompt if not
  useEffect(() => {
    if (authLoading || !itinerary || !prefs) return;

    const isFresh = localStorage.getItem("freshItinerary") === "true";
    if (!isFresh) return;
    localStorage.removeItem("freshItinerary");

    if (user) {
      saveToSupabase(itinerary, prefs);
    } else {
      setShowSavePrompt(true);
    }
  }, [authLoading, user, itinerary, prefs, saveToSupabase]);

  if (!itinerary) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sin itinerario</h2>
          <p className="text-gray-500 mb-6">Todavía no has planificado ningún viaje.</p>
          <Link href="/plan" className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors">
            Planear ahora
          </Link>
        </div>
      </div>
    );
  }

  const totalDays = itinerary.totalDays ?? itinerary.days.length;
  const day = itinerary.days[activeDay];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Save prompt banner */}
      {showSavePrompt && (
        <div className="bg-gradient-to-r from-green-800 to-green-600 text-white px-4 py-4">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <BookmarkPlus className="w-5 h-5 shrink-0 text-green-200" />
              <p className="text-sm font-medium">
                ¿Te gustó tu itinerario?{" "}
                <span className="text-green-200">Guárdalo en Mis Viajes</span>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setShowSavePrompt(false);
                  openAuthModal("register", () => {
                    const raw = localStorage.getItem("travelItinerary");
                    const rawPrefs = localStorage.getItem("travelPreferences");
                    if (raw && rawPrefs) {
                      saveToSupabase(JSON.parse(raw), JSON.parse(rawPrefs));
                    }
                  });
                }}
                className="bg-green-400 text-green-950 px-4 py-2 rounded-full text-sm font-bold hover:bg-green-300 transition-colors"
              >
                Registrarse
              </button>
              <button
                onClick={() => {
                  setShowSavePrompt(false);
                  openAuthModal("login", () => {
                    const raw = localStorage.getItem("travelItinerary");
                    const rawPrefs = localStorage.getItem("travelPreferences");
                    if (raw && rawPrefs) {
                      saveToSupabase(JSON.parse(raw), JSON.parse(rawPrefs));
                    }
                  });
                }}
                className="border border-green-300/50 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Iniciar sesión
              </button>
              <button onClick={() => setShowSavePrompt(false)} className="text-green-300 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-save status banner */}
      {saveStatus === "saving" && (
        <div className="bg-green-900 text-green-200 text-center py-2 text-sm">
          Guardando en Mis Viajes…
        </div>
      )}
      {saveStatus === "saved" && (
        <div className="bg-green-700 text-white text-center py-2.5 text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          ¡Guardado en Mis Viajes!{" "}
          <Link href="/my-trips" className="underline font-semibold ml-1">
            Ver mis viajes →
          </Link>
        </div>
      )}
      {saveStatus === "error" && (
        <div className="bg-red-600 text-white text-center py-2 text-sm">
          No se pudo guardar. Inténtalo de nuevo.
        </div>
      )}

      {/* Hero header */}
      <div
        className="relative h-72 md:h-96 flex items-end overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/50 to-transparent" />
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 pb-10">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            {itinerary.destination}
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2">
            Tu itinerario perfecto
          </h1>
          <p className="text-green-200 text-sm md:text-base max-w-2xl">
            {itinerary.summary}
          </p>

          {prefs && (
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { icon: <Calendar className="w-3.5 h-3.5" />, label: `${totalDays} días` },
                { icon: <Clock className="w-3.5 h-3.5" />, label: prefs.pace },
                { icon: <MapPin className="w-3.5 h-3.5" />, label: prefs.travelerType },
              ].map((chip) => (
                <span key={chip.label} className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full border border-white/20">
                  {chip.icon}
                  {chip.label}
                </span>
              ))}
              {user && saveStatus === "idle" && (
                <button
                  onClick={() => prefs && itinerary && saveToSupabase(itinerary, prefs)}
                  className="flex items-center gap-1.5 bg-green-400/20 hover:bg-green-400/30 text-green-300 text-xs px-3 py-1.5 rounded-full border border-green-400/30 transition-colors"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  Guardar viaje
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Day selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
          {itinerary.days.map((d, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`shrink-0 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeDay === idx
                  ? "bg-green-700 text-white shadow-md shadow-green-900/30"
                  : "bg-white text-gray-600 hover:bg-green-50 hover:text-green-700 border border-gray-200"
              }`}
            >
              Día {d.day}
            </button>
          ))}
        </div>

        {/* Day card */}
        {day && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-800 to-green-600 px-6 py-6 text-white">
              <div className="text-green-300 text-sm font-medium mb-1">{day.date}</div>
              <h2 className="text-2xl md:text-3xl font-black">{day.title}</h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Activities timeline */}
              <div>
                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-5 text-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                  Actividades del día
                </h3>
                <div className="space-y-5">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 shrink-0 text-right">
                        <span className="text-green-700 font-mono text-sm font-semibold">
                          {activity.time}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mt-0.5 shrink-0 ring-4 ring-green-100" />
                        {idx < day.activities.length - 1 && (
                          <div className="w-0.5 flex-1 bg-green-100 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="flex items-start gap-2">
                          <span className="text-xl leading-none mt-0.5">
                            {TYPE_ICONS[activity.type] ?? "📍"}
                          </span>
                          <div>
                            <h4 className="font-bold text-gray-800">{activity.name}</h4>
                            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                              {activity.description}
                            </p>
                            {activity.tip && (
                              <div className="flex items-start gap-2 mt-2 bg-amber-50 border border-amber-200 p-2.5 rounded-lg">
                                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <p className="text-amber-700 text-sm">{activity.tip}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restaurants */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 text-lg">
                  <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  Dónde comer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {day.restaurants.map((r, idx) => (
                    <span key={idx} className="bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm border border-orange-200 font-medium">
                      🍽 {r}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {(day.tips ?? []).length > 0 && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 text-lg">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                    Tips locales
                  </h3>
                  <ul className="space-y-2">
                    {(day.tips ?? []).map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                        <span className="text-green-500 font-bold mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Day navigation */}
        <div className="flex justify-between items-center mt-6 gap-3">
          <button
            onClick={() => setActiveDay((d) => Math.max(0, d - 1))}
            disabled={activeDay === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Día anterior
          </button>
          <span className="text-gray-400 text-sm">{activeDay + 1} / {itinerary.days.length}</span>
          <button
            onClick={() => setActiveDay((d) => Math.min(itinerary.days.length - 1, d + 1))}
            disabled={activeDay === itinerary.days.length - 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            Día siguiente
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Bottom actions */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/plan" className="flex items-center justify-center gap-2 border-2 border-green-700 text-green-700 px-8 py-3.5 rounded-full font-semibold hover:bg-green-700 hover:text-white transition-all">
            <RefreshCw className="w-4 h-4" />
            Volver a planear
          </Link>
          <Link href="/" className="flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-8 py-3.5 rounded-full font-semibold hover:bg-gray-200 transition-all">
            <ArrowLeft className="w-4 h-4" />
            Inicio
          </Link>
        </div>

        {/* Feedback section */}
        <div className="mt-10 bg-white rounded-2xl shadow-md p-6 text-center">
          {feedbackStatus === "done" ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <span className="text-3xl">🙏</span>
              <p className="text-green-700 font-semibold text-lg">¡Gracias por tu feedback!</p>
              <p className="text-gray-500 text-sm">Nos ayuda a mejorar</p>
            </div>
          ) : (
            <>
              <h3 className="text-gray-800 font-bold text-lg mb-4">¿Qué te pareció este itinerario?</h3>
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={() => setFeedbackRating("positive")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all ${
                    feedbackRating === "positive"
                      ? "bg-green-700 border-green-700 text-white"
                      : "border-green-700 text-green-700 hover:bg-green-50"
                  }`}
                >
                  👍 Me gustó
                </button>
                <button
                  onClick={() => setFeedbackRating("negative")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 transition-all ${
                    feedbackRating === "negative"
                      ? "bg-red-500 border-red-500 text-white"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  👎 No me gustó
                </button>
              </div>

              {feedbackRating && (
                <div className="mt-2 space-y-3 max-w-md mx-auto">
                  <textarea
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="¿Quieres dejarnos un comentario? (opcional)"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => submitFeedback(feedbackRating)}
                    disabled={feedbackStatus === "submitting"}
                    className="w-full bg-green-700 hover:bg-green-600 text-white font-semibold py-3 rounded-full text-sm transition-colors disabled:opacity-60"
                  >
                    {feedbackStatus === "submitting" ? "Enviando..." : "Enviar"}
                  </button>
                  {!user && (
                    <p className="text-xs text-gray-400">No estás logueado — tu feedback no se guardará pero lo apreciamos igual.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
