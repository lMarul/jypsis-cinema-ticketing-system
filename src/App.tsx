import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIContextProvider } from "@/contexts/AIContext";
import { MOCK_MOVIES, MOCK_CINEMAS } from "@/data/mockData";
import Movies from "./pages/Movies";
import Cinemas from "./pages/Cinemas";
import Seats from "./pages/Seats";
import Checkout from "./pages/Checkout";
import BookingSuccess from "./pages/BookingSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AIContextProvider availableMovies={MOCK_MOVIES} availableCinemas={MOCK_CINEMAS}>
          <Routes>
            <Route path="/" element={<Movies />} />
            <Route path="/cinemas/:movieId" element={<Cinemas />} />
            <Route path="/seats/:movieId/:cinemaId" element={<Seats />} />
            <Route path="/checkout/:movieId/:cinemaId" element={<Checkout />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AIContextProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
