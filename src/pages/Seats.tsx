import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Armchair, ShoppingCart } from "lucide-react";
import { AIChatbot } from "@/components/AIChatbot";
import { toast } from "sonner";

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

  // Generate mock seats
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

  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    toast.success(`Booking ${selectedSeats.length} seat(s) for ₱${totalPrice}`);
    // Navigate to checkout
  };

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "taken") return "bg-muted cursor-not-allowed";
    if (seat.status === "selected") return "bg-primary hover:bg-primary-hover cursor-pointer";
    
    switch (seat.tier) {
      case "vip":
        return "bg-accent hover:bg-accent/80 cursor-pointer";
      case "premium":
        return "bg-secondary hover:bg-secondary/80 cursor-pointer";
      default:
        return "bg-card hover:bg-card/80 border border-border cursor-pointer";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/cinemas/${movieId}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cinemas
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-bold">Select Your Seats</h1>
              <p className="text-muted-foreground">Showtime: {showtime}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-card border border-border rounded" />
                <span className="text-sm">Regular</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-secondary rounded" />
                <span className="text-sm">Premium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent rounded" />
                <span className="text-sm">VIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Screen */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="w-full max-w-4xl mx-auto">
            <div className="h-2 bg-gradient-cinema rounded-full mb-2" />
            <p className="text-center text-sm text-muted-foreground">SCREEN</p>
          </div>
        </div>

        {/* Seats Grid */}
        <div className="max-w-4xl mx-auto space-y-3">
          {Array.from(new Set(seats.map((s) => s.row))).map((row) => (
            <div key={row} className="flex items-center justify-center gap-2">
              <span className="w-8 text-center font-semibold text-muted-foreground">{row}</span>
              <div className="flex gap-2">
                {seats
                  .filter((s) => s.row === row)
                  .map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat.id)}
                      disabled={seat.status === "taken"}
                      className={`w-8 h-8 rounded-md transition-smooth ${getSeatColor(seat)}`}
                      title={`${seat.id} - ₱${seat.price}`}
                    >
                      <Armchair className="w-4 h-4 mx-auto" />
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Bar */}
      {selectedSeats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">
                  {selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""} Selected
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedSeats.map((s) => s.id).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">₱{totalPrice}</p>
                </div>
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AIChatbot />
    </div>
  );
};

export default Seats;
