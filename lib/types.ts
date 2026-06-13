export interface TravelPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  budgetType: "economico" | "moderado" | "lujo";
  travelerType: "solo" | "pareja" | "familia" | "amigos";
  pace: "relajado" | "equilibrado" | "intensivo";
  interests: string[];
}

export interface Activity {
  time: string;
  name: string;
  description: string;
  type: string;
  tip?: string;
}

export interface ItineraryDay {
  day: number;
  date?: string;
  title: string;
  activities: Activity[];
  restaurants: string[];
  /** Frontend-normalized field (mapped from local_tips in backend response) */
  tips?: string[];
  /** Raw backend field — use tips after normalization */
  local_tips?: string[];
}

export interface GeneratedItinerary {
  destination: string;
  /** Normalized field — always populated after normalization */
  totalDays?: number;
  /** Raw backend field */
  total_days?: number;
  summary?: string;
  budget_level?: string;
  traveler_type?: string;
  days: ItineraryDay[];
}

export interface SavedItinerary {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  budget_type: string;
  traveler_type: string;
  pace: string;
  interests: string[];
  itinerary_data: GeneratedItinerary;
  created_at: string;
}

/** Normalizes both backend and mock responses into a consistent shape */
export function normalizeItinerary(data: Record<string, unknown>): GeneratedItinerary {
  const days = (data.days as Record<string, unknown>[] | undefined) ?? [];
  return {
    destination: data.destination as string,
    totalDays: (data.total_days as number | undefined) ??
               (data.totalDays as number | undefined) ??
               days.length,
    summary: (data.summary as string | undefined) ??
             `Itinerario para ${data.destination}`,
    days: days.map((day) => ({
      day: day.day as number,
      date: (day.date as string | undefined) ?? `Día ${day.day}`,
      title: day.title as string,
      activities: ((day.activities as Record<string, unknown>[] | undefined) ?? []).map(
        (act) => ({
          time: act.time as string,
          name: act.name as string,
          description: act.description as string,
          type: act.type as string,
          tip: act.tip as string | undefined,
        })
      ),
      restaurants: (day.restaurants as string[] | undefined) ?? [],
      tips:
        (day.tips as string[] | undefined) ??
        (day.local_tips as string[] | undefined) ??
        [],
    })),
  };
}
