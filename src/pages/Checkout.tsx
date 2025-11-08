import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  CreditCard, 
  Lock, 
  CheckCircle2, 
  Film,
  Calendar,
  MapPin,
  Users,
  Shield,
  Smartphone,
  Building2,
  QrCode
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";

const Checkout = () => {
  const { movieId, cinemaId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showtime = searchParams.get("time") || "7:30 PM";
  const seatsParam = searchParams.get("seats") || "";
  const totalParam = searchParams.get("total") || "0";

  const selectedSeats = seatsParam.split(",").filter(Boolean);
  const totalPrice = parseFloat(totalParam) || 0;

  const [paymentMethod, setPaymentMethod] = useState("gcash");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVC, setCardCVC] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handlePayment = async () => {
    if (paymentMethod === "gcash" || paymentMethod === "paymaya") {
      if (!mobileNumber || mobileNumber.length < 10) {
        toast.error("Please enter a valid mobile number");
        return;
      }
      // Show QR code for mobile wallets
      setShowQR(true);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        toast.success("Payment successful!");
        
        setTimeout(() => {
          navigate(`/booking-success?session_id=mock_${Date.now()}`);
        }, 2000);
      }, 3000);
    } else if (paymentMethod === "card") {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
        toast.error("Please fill in all card details");
        return;
      }
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        toast.success("Payment successful!");
        
        setTimeout(() => {
          navigate(`/booking-success?session_id=mock_${Date.now()}`);
        }, 2000);
      }, 2000);
    } else {
      // Bank transfer or OTC
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        toast.success("Payment instructions sent!");
        
        setTimeout(() => {
          navigate(`/booking-success?session_id=mock_${Date.now()}`);
        }, 2000);
      }, 2000);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10, stiffness: 200 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">Redirecting to confirmation</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(`/seats/${movieId}/${cinemaId}?time=${encodeURIComponent(showtime)}`)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Seats
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-display font-bold mb-2">Payment Details</h1>
              <p className="text-muted-foreground">Choose your preferred payment method</p>
            </motion.div>

            {/* Payment Method Selection */}
            <Card className="p-6 bg-card border-border">
              <Label className="text-lg font-semibold mb-4 block">Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-3">
                  {/* GCash */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="gcash" id="gcash" />
                    <Label htmlFor="gcash" className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        GC
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold">GCash</span>
                        <p className="text-xs text-muted-foreground">Mobile Wallet</p>
                      </div>
                    </Label>
                  </div>

                  {/* PayMaya */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="paymaya" id="paymaya" />
                    <Label htmlFor="paymaya" className="flex-1 cursor-pointer flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        M
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold">PayMaya / Maya</span>
                        <p className="text-xs text-muted-foreground">Mobile Wallet</p>
                      </div>
                    </Label>
                  </div>

                  {/* Credit/Debit Card */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <span className="font-semibold">Credit or Debit Card</span>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard, JCB</p>
                      </div>
                    </Label>
                  </div>

                  {/* Bank Transfer */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex-1 cursor-pointer flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <span className="font-semibold">Bank Transfer</span>
                        <p className="text-xs text-muted-foreground">BPI, BDO, Metrobank, etc.</p>
                      </div>
                    </Label>
                  </div>

                  {/* Over-the-Counter */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="otc" id="otc" />
                    <Label htmlFor="otc" className="flex-1 cursor-pointer flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <span className="font-semibold">Over-the-Counter</span>
                        <p className="text-xs text-muted-foreground">7-Eleven, Bayad Center, etc.</p>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* GCash / PayMaya Form */}
            {(paymentMethod === "gcash" || paymentMethod === "paymaya") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mobileNumber" className="mb-2 block">
                        Mobile Number ({paymentMethod === "gcash" ? "GCash" : "PayMaya"} Registered)
                      </Label>
                      <Input
                        id="mobileNumber"
                        placeholder="09XX XXX XXXX"
                        value={mobileNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 11);
                          setMobileNumber(value);
                        }}
                        className="text-lg"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Enter the mobile number linked to your {paymentMethod === "gcash" ? "GCash" : "PayMaya"} account
                      </p>
                    </div>

                    {showQR && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 p-6 bg-muted/50 rounded-lg border border-border text-center"
                      >
                        <QrCode className="w-16 h-16 mx-auto mb-4 text-primary" />
                        <p className="font-semibold mb-2">Scan QR Code to Pay</p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Open your {paymentMethod === "gcash" ? "GCash" : "PayMaya"} app and scan this QR code
                        </p>
                        <div className="w-48 h-48 mx-auto bg-white rounded-lg border-2 border-dashed border-border flex items-center justify-center mb-4">
                          <div className="text-center">
                            <div className="w-40 h-40 bg-muted rounded mx-auto mb-2" />
                            <p className="text-xs text-muted-foreground">QR Code Placeholder</p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-primary">₱{totalPrice.toLocaleString()}</p>
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Card Details Form */}
            {paymentMethod === "card" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber" className="mb-2 block">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
                          const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                          setCardNumber(formatted);
                        }}
                        maxLength={19}
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cardName" className="mb-2 block">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        placeholder="Juan dela Cruz"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry" className="mb-2 block">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            const formatted = value.length >= 2 
                              ? `${value.slice(0, 2)}/${value.slice(2, 4)}`
                              : value;
                            setCardExpiry(formatted);
                          }}
                          maxLength={5}
                          className="text-lg"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvc" className="mb-2 block">CVC</Label>
                        <Input
                          id="cvc"
                          placeholder="123"
                          type="password"
                          value={cardCVC}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 3);
                            setCardCVC(value);
                          }}
                          maxLength={3}
                          className="text-lg"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Bank Transfer Info */}
            {paymentMethod === "bank" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                      <h3 className="font-semibold mb-3">Bank Transfer Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bank:</span>
                          <span className="font-semibold">BPI (Bank of the Philippine Islands)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Name:</span>
                          <span className="font-semibold">CinemaBook Inc.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span className="font-mono font-semibold">1234 5678 9012</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-bold text-primary">₱{totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Please include your booking reference in the transfer notes. Payment confirmation may take 1-2 business days.
                    </p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Over-the-Counter Info */}
            {paymentMethod === "otc" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg border border-border">
                      <h3 className="font-semibold mb-3">Payment Instructions</h3>
                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          Visit any of these payment centers and present the reference number:
                        </p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>7-Eleven (CLIQQ)</li>
                          <li>Bayad Center</li>
                          <li>SM Payment Centers</li>
                          <li>Robinsons Payment Centers</li>
                        </ul>
                        <div className="mt-4 p-3 bg-background rounded border border-border">
                          <p className="text-xs text-muted-foreground mb-1">Reference Number:</p>
                          <p className="font-mono font-bold text-lg">CB{Date.now().toString().slice(-8)}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">Amount to Pay:</p>
                          <p className="font-bold text-primary text-lg">₱{totalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg border border-border"
            >
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Secure Payment</p>
                <p>Your payment information is encrypted and secure. We never store your card details or mobile wallet credentials.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 bg-card border-border sticky top-24">
                <h2 className="text-xl font-display font-bold mb-6">Order Summary</h2>

                {/* Movie Info */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-border">
                    <div className="w-16 h-24 bg-muted rounded overflow-hidden flex-shrink-0">
                      <Film className="w-full h-full p-3 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">Movie Booking</h3>
                      <p className="text-sm text-muted-foreground truncate">Movie ID: {movieId}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Showtime: {showtime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Cinema ID: {cinemaId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{selectedSeats.length} Seat{selectedSeats.length > 1 ? "s" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Selected Seats */}
                <div className="mb-6">
                  <Label className="text-sm font-semibold mb-2 block">Selected Seats</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <Badge key={seat} variant="secondary" className="text-xs">
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₱{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>₱0</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₱{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  disabled={
                    isProcessing || 
                    (paymentMethod === "gcash" && !mobileNumber) ||
                    (paymentMethod === "paymaya" && !mobileNumber) ||
                    (paymentMethod === "card" && (!cardNumber || !cardName || !cardExpiry || !cardCVC))
                  }
                  size="lg"
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold py-6 text-lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay ₱{totalPrice.toLocaleString()}
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  By completing this purchase, you agree to our Terms of Service
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
