"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import { format, addDays, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Zap,
  Heart,
  Loader2,
  ChevronDown,
  X,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Check,
} from "lucide-react";
import "react-day-picker/style.css";
import { normalizeItinerary, type TravelPreferences } from "@/lib/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type BudgetType = "economico" | "moderado" | "lujo";
type TravelerType = "solo" | "pareja" | "familia" | "amigos";
type PaceType = "relajado" | "equilibrado" | "intensivo";

const INTERESTS = [
  "Cultura", "Gastronomía", "Aventura", "Playas", "Naturaleza",
  "Arte", "Historia", "Fotografía", "Vida nocturna", "Compras",
];
const TRAVELER_TYPES = [
  { id: "solo", label: "Solo", emoji: "🧑" },
  { id: "pareja", label: "Pareja", emoji: "💑" },
  { id: "familia", label: "Familia", emoji: "👨‍👩‍👧" },
  { id: "amigos", label: "Amigos", emoji: "👥" },
];
const PACE_TYPES = [
  { id: "relajado", label: "Relajado", description: "Pocas actividades, mucho descanso" },
  { id: "equilibrado", label: "Equilibrado", description: "Balance entre actividad y descanso" },
  { id: "intensivo", label: "Intensivo", description: "Máximo aprovechamiento del tiempo" },
];
const BUDGET_LEVELS = [
  { id: "economico", label: "Económico", range: "Hasta $1,000", value: 700 },
  { id: "moderado", label: "Moderado", range: "$1,000–$3,000", value: 2000 },
  { id: "lujo", label: "Lujo", range: "Más de $3,000", value: 5000 },
];

export default function PlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [destination, setDestination] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [budget, setBudget] = useState(2000);
  const [budgetType, setBudgetType] = useState<BudgetType>("moderado");
  const [travelerType, setTravelerType] = useState<TravelerType>("pareja");
  const [pace, setPace] = useState<PaceType>("equilibrado");
  const [interests, setInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRangeError, setDateRangeError] = useState<string | null>(null);

  useEffect(() => {
    const dest = searchParams.get("destination");
    if (dest) setDestination(dest);
  }, [searchParams]);

  const toggleInterest = (interest: string) =>
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );

  const formatDateDisplay = () => {
    if (!dateRange?.from) return "Selecciona las fechas";
    if (!dateRange.to)
      return format(dateRange.from, "d 'de' MMMM yyyy", { locale: es });
    return `${format(dateRange.from, "d MMM", { locale: es })} — ${format(
      dateRange.to, "d MMM yyyy", { locale: es }
    )}`;
  };

  const handleSubmit = async () => {
    if (!destination.trim()) { setError("Por favor ingresa un destino"); return; }
    if (!dateRange?.from || !dateRange?.to) { setError("Por favor selecciona las fechas"); return; }
    if (interests.length === 0) { setError("Por favor selecciona al menos un interés"); return; }

    setError(null);
    setIsLoading(true);

    const prefs: TravelPreferences = {
      destination,
      startDate: format(dateRange.from, "yyyy-MM-dd"),
      endDate: format(dateRange.to, "yyyy-MM-dd"),
      budget,
      budgetType,
      travelerType,
      pace,
      interests,
    };

    // Backend expects snake_case and budget as string
    const apiPayload = {
      destination: prefs.destination,
      start_date: prefs.startDate,
      end_date: prefs.endDate,
      budget: prefs.budgetType,        // "economico" | "moderado" | "lujo"
      budget_amount: prefs.budget,     // numeric amount
      traveler_type: prefs.travelerType,
      pace: prefs.pace,
      interests: prefs.interests,
    };

    try {
      const res = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });

      if (!res.ok) {
        let detail = `El servidor respondió con un error (${res.status}).`;
        try {
          const body = await res.json();
          if (body.detail) detail = body.detail;
        } catch { /* non-JSON error body */ }
        throw new Error(detail);
      }

      const raw = await res.json();
      const itinerary = normalizeItinerary(raw);
      localStorage.setItem("travelItinerary", JSON.stringify(itinerary));
      localStorage.setItem("travelPreferences", JSON.stringify(prefs));
      localStorage.setItem("freshItinerary", "true");
      router.push("/itinerary");
    } catch (err) {
      const isNetworkError = err instanceof TypeError;
      setError(
        isNetworkError
          ? `No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en ${API_URL}.`
          : err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado. Inténtalo de nuevo."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Destination */}
      <Field label="¿A dónde quieres ir?" icon={<MapPin className="w-5 h-5 text-green-600" />}>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="Ej: París, Francia"
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors text-lg"
        />
      </Field>

      {/* Date picker */}
      <Field label="Fechas del viaje" icon={<Calendar className="w-5 h-5 text-green-600" />}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCalendar((v) => !v)}
            className="w-full flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 py-3.5 text-left hover:border-green-400 transition-colors focus:outline-none focus:border-green-500"
          >
            <span className={dateRange?.from ? "text-gray-800 font-medium text-lg" : "text-gray-400 text-lg"}>
              {formatDateDisplay()}
            </span>
            <div className="flex items-center gap-2">
              {dateRange?.from && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateRange(undefined);
                    setDateRangeError(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCalendar ? "rotate-180" : ""}`} />
            </div>
          </button>

          {showCalendar && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-2xl shadow-2xl z-50 p-4 border border-gray-100 overflow-auto max-w-[calc(100vw-2rem)]">

              {/* Ida / Vuelta status */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`flex-1 rounded-xl p-2.5 border-2 transition-colors ${dateRange?.from ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                  <div className="text-xs text-gray-400 mb-0.5 font-medium">✈ Ida</div>
                  <div className="text-sm font-bold text-gray-800">
                    {dateRange?.from
                      ? format(dateRange.from, "d MMM yyyy", { locale: es })
                      : <span className="text-gray-400 font-normal">Selecciona</span>}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                <div className={`flex-1 rounded-xl p-2.5 border-2 transition-colors ${dateRange?.to ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}>
                  <div className="text-xs text-gray-400 mb-0.5 font-medium">✈ Vuelta</div>
                  <div className="text-sm font-bold text-gray-800">
                    {dateRange?.to
                      ? format(dateRange.to, "d MMM yyyy", { locale: es })
                      : <span className="text-gray-400 font-normal">
                          {dateRange?.from ? "Elige vuelta" : "Selecciona"}
                        </span>}
                  </div>
                </div>
              </div>

              {/* 7-day limit error */}
              {dateRangeError && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-3 py-2.5 text-sm mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  {dateRangeError}
                </div>
              )}

              <DayPicker
                mode="range"
                selected={dateRange}
                onSelect={(selected) => {
                  if (selected?.from && selected?.to) {
                    const days = differenceInDays(selected.to, selected.from);
                    if (days > 6) {
                      setDateRangeError("El itinerario máximo es de 7 días");
                      setDateRange({ from: selected.from, to: addDays(selected.from, 6) });
                      return;
                    }
                    setDateRangeError(null);
                  } else {
                    setDateRangeError(null);
                  }
                  setDateRange(selected);
                }}
                disabled={[
                  { before: new Date() },
                  ...(dateRange?.from && !dateRange.to
                    ? [{ after: addDays(dateRange.from, 6) }]
                    : []),
                ]}
                locale={es}
                numberOfMonths={2}
                startMonth={new Date()}
              />

              {/* Confirm button — only when both dates selected */}
              {dateRange?.from && dateRange?.to && (
                <button
                  type="button"
                  onClick={() => setShowCalendar(false)}
                  className="w-full mt-3 bg-green-700 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Confirmar fechas · {differenceInDays(dateRange.to, dateRange.from) + 1} días
                </button>
              )}
            </div>
          )}
        </div>
      </Field>

      {/* Budget */}
      <Field label="Presupuesto" icon={<DollarSign className="w-5 h-5 text-green-600" />}>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {BUDGET_LEVELS.map((level) => (
            <button
              key={level.id} type="button"
              onClick={() => { setBudgetType(level.id as BudgetType); setBudget(level.value); }}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                budgetType === level.id ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className={`font-semibold text-sm ${budgetType === level.id ? "text-green-700" : "text-gray-700"}`}>
                {level.label}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{level.range}</div>
            </button>
          ))}
        </div>
        <div className="px-1">
          <input
            type="range" min={200} max={10000} step={100} value={budget}
            onChange={(e) => {
              const val = Number(e.target.value);
              setBudget(val);
              if (val < 1000) setBudgetType("economico");
              else if (val <= 3000) setBudgetType("moderado");
              else setBudgetType("lujo");
            }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-green-600 bg-green-100"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>$200</span>
            <span className="font-bold text-green-700 text-base">${budget.toLocaleString()} USD</span>
            <span>$10,000</span>
          </div>
        </div>
      </Field>

      {/* Traveler type */}
      <Field label="Tipo de viajero" icon={<Users className="w-5 h-5 text-green-600" />}>
        <div className="grid grid-cols-4 gap-3">
          {TRAVELER_TYPES.map((type) => (
            <button key={type.id} type="button"
              onClick={() => setTravelerType(type.id as TravelerType)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                travelerType === type.id ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="text-2xl mb-1">{type.emoji}</div>
              <div className={`text-sm font-medium ${travelerType === type.id ? "text-green-700" : "text-gray-600"}`}>
                {type.label}
              </div>
            </button>
          ))}
        </div>
      </Field>

      {/* Pace */}
      <Field label="Ritmo del viaje" icon={<Zap className="w-5 h-5 text-green-600" />}>
        <div className="grid grid-cols-3 gap-3">
          {PACE_TYPES.map((type) => (
            <button key={type.id} type="button"
              onClick={() => setPace(type.id as PaceType)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                pace === type.id ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className={`font-semibold text-sm ${pace === type.id ? "text-green-700" : "text-gray-700"}`}>
                {type.label}
              </div>
              <div className="text-xs text-gray-400 mt-1 leading-snug">{type.description}</div>
            </button>
          ))}
        </div>
      </Field>

      {/* Interests */}
      <Field label="Tus intereses" icon={<Heart className="w-5 h-5 text-green-600" />} hint="Selecciona todos los que apliquen">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button key={interest} type="button" onClick={() => toggleInterest(interest)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                interests.includes(interest)
                  ? "border-green-600 bg-green-600 text-white shadow-sm"
                  : "border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </Field>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="button" onClick={handleSubmit} disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-800 to-green-600 text-white py-5 rounded-2xl text-xl font-bold hover:from-green-700 hover:to-green-500 transition-all transform hover:scale-[1.02] shadow-xl shadow-green-900/25 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Generando tu itinerario con IA...
          </>
        ) : (
          <>
            <Sparkles className="w-6 h-6" />
            Generar mi itinerario
          </>
        )}
      </button>
    </div>
  );
}

function Field({
  label, icon, hint, children,
}: {
  label: string;
  icon: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
        {icon}
        {label}
        {hint && <span className="text-gray-400 font-normal text-sm ml-1">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
