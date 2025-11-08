import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock } from "lucide-react";
import { AIChatbot } from "@/components/AIChatbot";

// Mock cinema data
const cinemas = [
  {
    id: 1,
    name: "SM Makati Cinema",
    distance: "2.5 km",
    location: "Makati City",
    showtimes: ["10:00 AM", "1:30 PM", "4:00 PM", "7:30 PM", "10:00 PM"],
    tiers: ["Regular", "Premium", "VIP"]
  },
  {
    id: 2,
    name: "Ayala Malls Cinema",
    distance: "3.8 km",
    location: "Makati City",
    showtimes: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"],
    tiers: ["Regular", "Premium"]
  },
  {
    id: 3,
    name: "Glorietta Cineplex",
    distance: "4.2 km",
    location: "Makati City",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
          <h1 className="text-3xl font-display font-bold">Nearby Cinemas</h1>
          <p className="text-muted-foreground">Select a showtime to continue</p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative h-64 bg-muted">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
            <p className="text-muted-foreground">Interactive Map View</p>
            <p className="text-sm text-muted-foreground">(Map integration coming soon)</p>
          </div>
        </div>
      </div>

      {/* Cinemas List */}
      <div className="container mx-auto px-6 py-12">
        <div className="space-y-6">
          {cinemas.map((cinema) => (
            <Card key={cinema.id} className="p-6 bg-card border-border shadow-card">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-2xl font-display font-bold mb-2">{cinema.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {cinema.location}
                    </span>
                    <span>{cinema.distance}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {cinema.tiers.map((tier) => (
                    <Badge key={tier} variant="secondary">
                      {tier}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Available Showtimes
                </p>
                <div className="flex flex-wrap gap-2">
                  {cinema.showtimes.map((time) => (
                    <Button
                      key={time}
                      variant="outline"
                      onClick={() => handleSelectShowtime(cinema.id, time)}
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-smooth"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <AIChatbot />
    </div>
  );
};

export default Cinemas;
