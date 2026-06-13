import Navbar from "@/components/Navbar";
import ItineraryView from "@/components/ItineraryView";

export const metadata = {
  title: "Tu itinerario — Travel Planner",
  description: "Tu itinerario de viaje personalizado generado por IA.",
};

export default function ItineraryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <ItineraryView />
      </main>
    </>
  );
}
