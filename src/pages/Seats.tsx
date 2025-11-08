import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Armchair, ShoppingCart, CreditCard } from "lucide-react";
import { AIChatbot } from "@/components/AIChatbot";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { useAIContext } from "@/contexts/AIContext";

type SeatStatus = "available" | "selected" | "taken";

interface Seat {
  id: string;
  row: string;
  number: number;
  tier: "regular" | "premium" | "vip";
  status: SeatStatus;
  price: number;
}

const Seats = () => {
  const { movieId, cinemaId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showtime = searchParams.get("time") || "7:30 PM";
  const { setCurrentMovieId, setCurrentCinemaId, setSelectedShowtime, setSelectedSeats: setContextSeats } = useAIContext();

  // Update AI context
  useEffect(() => {
    if (movieId) setCurrentMovieId(parseInt(movieId));
    if (cinemaId) setCurrentCinemaId(parseInt(cinemaId));
    setSelectedShowtime(showtime);
  }, [movieId, cinemaId, showtime, setCurrentMovieId, setCurrentCinemaId, setSelectedShowtime]);

  // Generate mock seats with better grouping
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const seatsPerRow = 12;

    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let tier: "regular" | "premium" | "vip" = "regular";
        let price = 250;

        if (rowIndex >= 5) {
          tier = "vip";
          price = 450;
        } else if (rowIndex >= 3) {
          tier = "premium";
          price = 350;
        }

        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          tier,
          status: Math.random() > 0.7 ? "taken" : "available",
          price
        });
      }
    });

    return seats;
  };

  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Update context when seats change
  useEffect(() => {
    setContextSeats(selectedSeats.map(s => s.id));
  }, [selectedSeats.length, setContextSeats]);

  const handleSeatClick = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id === seatId && seat.status !== "taken") {
          return {
            ...seat,
            status: seat.status === "selected" ? "available" : "selected"
          };
        }
        return seat;
      })
    );
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    
    // For UI demo: directly navigate to checkout page
    toast.success("Redirecting to checkout...", { id: "booking" });
    navigate(`/checkout/${movieId}/${cinemaId}?time=${encodeURIComponent(showtime)}&seats=${selectedSeats.map(s => s.id).join(",")}&total=${totalPrice}`);
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "taken") {
      return "bg-muted/50 border-muted cursor-not-allowed opacity-50";
    }
    if (seat.status === "selected") {
      return "bg-primary border-primary hover:bg-primary-hover cursor-pointer shadow-lg shadow-primary/50";
    }
    
    switch (seat.tier) {
      case "vip":
        return "bg-accent/20 border-accent hover:bg-accent/40 cursor-pointer hover:border-accent";
      case "premium":
        return "bg-secondary/20 border-secondary hover:bg-secondary/40 cursor-pointer hover:border-secondary";
      default:
        return "bg-card border-border hover:bg-muted cursor-pointer hover:border-primary/50";
    }
  };

  // Group seats by tier for better visualization
  const regularSeats = seats.filter(s => s.tier === "regular");
  const premiumSeats = seats.filter(s => s.tier === "premium");
  const vipSeats = seats.filter(s => s.tier === "vip");

  const renderSeatRow = (row: string, rowSeats: Seat[]) => (
    <div key={row} className="flex items-center justify-center gap-3 mb-2">
      <span className="w-10 text-center font-semibold text-muted-foreground text-sm">{row}</span>
      <div className="flex gap-1.5">
        {rowSeats.map((seat, idx) => (
          <motion.button
            key={seat.id}
            onClick={() => handleSeatClick(seat.id)}
            disabled={seat.status === "taken"}
            whileHover={{ scale: seat.status !== "taken" ? 1.1 : 1 }}
            whileTap={{ scale: seat.status !== "taken" ? 0.95 : 1 }}
            className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${getSeatColor(seat)}`}
            title={`${seat.id} - ₱${seat.price}`}
          >
            <Armchair className={`w-5 h-5 ${seat.status === "taken" ? "text-muted-foreground" : seat.status === "selected" ? "text-primary-foreground" : ""}`} />
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-32">
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
            onClick={() => navigate(`/cinemas/${movieId}`)}
            className="mb-4 hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cinemas
          </Button>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-1">Select Your Seats</h1>
              <p className="text-muted-foreground text-lg">Showtime: {showtime}</p>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-card border-2 border-border rounded" />
                <span className="text-sm font-medium">Regular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-secondary/20 border-2 border-secondary rounded" />
                <span className="text-sm font-medium">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-accent/20 border-2 border-accent rounded" />
                <span className="text-sm font-medium">VIP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-muted/50 border-2 border-muted rounded opacity-50" />
                <span className="text-sm font-medium">Taken</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Screen */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="w-full max-w-5xl mx-auto">
            <div className="h-3 bg-gradient-cinema rounded-full mb-3 shadow-lg shadow-primary/20" />
            <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider">Screen</p>
          </div>
        </motion.div>

        {/* Seats Grid with Grouped Sections */}
        <div className="max-w-5xl mx-auto">
          {/* Regular Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="mb-4">
              <Badge variant="outline" className="mb-2">Regular Section</Badge>
              <p className="text-xs text-muted-foreground">₱250 per seat</p>
            </div>
            <Card className="p-6 bg-card/50 border-border">
              {Array.from(new Set(regularSeats.map((s) => s.row))).map((row) =>
                renderSeatRow(row, regularSeats.filter((s) => s.row === row))
              )}
            </Card>
          </motion.div>

          {/* Premium Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2">Premium Section</Badge>
              <p className="text-xs text-muted-foreground">₱350 per seat</p>
            </div>
            <Card className="p-6 bg-card/50 border-secondary/30">
              {Array.from(new Set(premiumSeats.map((s) => s.row))).map((row) =>
                renderSeatRow(row, premiumSeats.filter((s) => s.row === row))
              )}
            </Card>
          </motion.div>

          {/* VIP Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="mb-4">
              <Badge className="bg-accent text-accent-foreground mb-2">VIP Section</Badge>
              <p className="text-xs text-muted-foreground">₱450 per seat</p>
            </div>
            <Card className="p-6 bg-card/50 border-accent/30">
              {Array.from(new Set(vipSeats.map((s) => s.row))).map((row) =>
                renderSeatRow(row, vipSeats.filter((s) => s.row === row))
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Checkout Bar */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl z-40"
          >
            <div className="container mx-auto px-6 py-5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="default" className="text-sm px-3 py-1">
                      {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} Selected
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {selectedSeats.map((s) => s.id).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {Object.entries(
                      selectedSeats.reduce((acc, seat) => {
                        acc[seat.tier] = (acc[seat.tier] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([tier, count]) => (
                      <span key={tier} className="capitalize">
                        {tier}: {count}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-primary">₱{totalPrice.toLocaleString()}</p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCheckout}
                    className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AIChatbot />
    </div>
  );
};

export default Seats;
