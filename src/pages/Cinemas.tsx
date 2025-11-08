import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { AIChatbot } from "@/components/AIChatbot";
import { Navbar } from "@/components/Navbar";
import MapView from "@/components/MapView";

// Mock cinema data (includes lat/lng for map markers)
const cinemas = [
  {
    id: 1,
    name: "SM Makati Cinema",
    distance: "2.5 km",
    location: "Makati City",
    lat: 14.5547,
    lng: 121.0244,
    showtimes: ["10:00 AM", "1:30 PM", "4:00 PM", "7:30 PM", "10:00 PM"],
    tiers: ["Regular", "Premium", "VIP"]
  },
  {
    id: 2,
    name: "Ayala Malls Cinema",
    distance: "3.8 km",
    location: "Makati City",
    lat: 14.5516,
    lng: 121.0253,
    showtimes: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"],
    tiers: ["Regular", "Premium"]
  },
  {
    id: 3,
    name: "Glorietta Cineplex",
    distance: "4.2 km",
    location: "Makati City",
    lat: 14.5539,
    lng: 121.0260,
    showtimes: ["12:00 PM", "3:30 PM", "6:30 PM", "9:30 PM"],
    tiers: ["Regular", "IMAX", "4DX"]
  }
];

const Cinemas = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();

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
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border"
      >
        <div className="container mx-auto px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Nearby Cinemas</h1>
          <p className="text-muted-foreground text-lg">Select a showtime to continue</p>
        </div>
      </motion.div>

      {/* Interactive Map View */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative h-64 border-b border-border"
      >
        <div className="absolute inset-0">
          {/* MapView will render Google Maps (if API key present) or an OSM fallback */}
          <MapView cinemas={cinemas} onMarkerClick={handleMarkerClick} />
        </div>
      </motion.div>

      {/* Cinemas List */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
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
                      <motion.div
                        key={time}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                      >
                        <Button
                          variant="outline"
                          onClick={() => handleSelectShowtime(cinema.id, time)}
                          className="hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-200 shadow-sm"
                        >
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
      </div>

      <AIChatbot />
    </div>
  );
};

export default Cinemas;
