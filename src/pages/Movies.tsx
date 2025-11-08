import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetail } from "@/components/MovieDetail";
import { AIChatbot } from "@/components/AIChatbot";
import { Navbar } from "@/components/Navbar";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 gradient-dark opacity-90" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center px-6 z-10">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 text-gradient">
<<<<<<< HEAD
              JYPTIC
=======
              CinemaBook
>>>>>>> 0e49e070728e64a26fe2351ec239d6e16bfb92f0
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience movies like never before. Book your perfect seat with AI assistance.
            </p>
          </div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* Movies Grid */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">Now Showing</h2>
          <p className="text-muted-foreground text-lg">Select a movie to find nearby cinemas</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_MOVIES.map((movie) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <MovieCard movie={movie} onClick={() => setSelectedMovie(movie)} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Movies;
