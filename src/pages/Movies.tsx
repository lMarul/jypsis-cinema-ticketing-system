import { useState, useEffect } from "react";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetail } from "@/components/MovieDetail";
import { AIChatbot } from "@/components/AIChatbot";
import { MOCK_MOVIES } from "@/data/mockData";
import { useAIContext } from "@/contexts/AIContext";

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState<typeof MOCK_MOVIES[0] | null>(null);
  const { setCurrentMovieId } = useAIContext();

  // Update AI context when movie is selected
  useEffect(() => {
    if (selectedMovie) {
      setCurrentMovieId(selectedMovie.id);
    } else {
      setCurrentMovieId(undefined);
    }
  }, [selectedMovie, setCurrentMovieId]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-6 z-10">
            <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 text-gradient">
              CinemaBook
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Experience movies like never before. Book your perfect seat with AI assistance.
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* Movies Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Now Showing</h2>
          <p className="text-muted-foreground">Select a movie to find nearby cinemas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_MOVIES.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => setSelectedMovie(movie)}
            />
          ))}
        </div>
      </section>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Movies;
