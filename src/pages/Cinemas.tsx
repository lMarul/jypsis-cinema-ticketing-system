import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { AIChatbot } from "@/components/AIChatbot";
import { Navbar } from "@/components/Navbar";
import MapView from "@/components/MapView";
import { MOCK_CINEMAS } from "@/data/mockData";
import { useAIContext } from "@/contexts/AIContext";

// Normalize/mock lat/lng for MOCK_CINEMAS so MapView always has coordinates
const cinemas = MOCK_CINEMAS.map((c, i) => ({
  ...c,
  lat: (c as any).lat ?? 14.5547 + i * 0.001,
  lng: (c as any).lng ?? 121.0244 + i * 0.001,
}));

const Cinemas = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { setCurrentMovieId, setCurrentCinemaId } = useAIContext();

  // Update AI context
  useEffect(() => {
    if (movieId) {
      setCurrentMovieId(parseInt(movieId));
    }
    return () => {
      setCurrentCinemaId(undefined);
    };
  }, [movieId, setCurrentMovieId, setCurrentCinemaId]);

  const handleSelectShowtime = (cinemaId: number, time: string) => {
    navigate(`/seats/${movieId}/${cinemaId}?time=${encodeURIComponent(time)}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const handleMarkerClick = (cinemaId: number) => {
    const el = document.getElementById(`cinema-${cinemaId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
      visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Map Banner */}
      <div className="w-full h-[400px] relative">
        <MapView
          cinemas={cinemas}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Cinema List */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">Nearby Cinemas</h1>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            {cinemas.map((cinema) => (
              <motion.div key={cinema.id} variants={itemVariants}>
                <Card id={`cinema-${cinema.id}`} className="p-6 md:p-8 bg-card border-border shadow-card hover:shadow-glow transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">{cinema.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {cinema.location}
                        </span>
                        <span className="px-2 py-1 bg-muted rounded-md">{cinema.distance}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cinema.tiers.map((tier) => (
                        <Badge key={tier} variant="secondary" className="text-xs px-3 py-1">
                          {tier}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-4 flex items-center gap-2 text-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      Available Showtimes
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {cinema.showtimes.map((time, idx) => (
                        <motion.div key={time} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + idx * 0.05 }}>
                          <Button variant="outline" onClick={() => handleSelectShowtime(cinema.id, time)} className="hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-200 shadow-sm">
                            {time}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <AIChatbot />
    </div>
  );
  };

  export default Cinemas;
