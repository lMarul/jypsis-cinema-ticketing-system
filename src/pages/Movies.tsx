import { useState } from "react";
import { motion } from "framer-motion";
import { MovieCard } from "@/components/MovieCard";
import { MovieDetail } from "@/components/MovieDetail";
import { AIChatbot } from "@/components/AIChatbot";
import { Navbar } from "@/components/Navbar";
import cosmicHorizons from "@/assets/cosmic-horizons.jpg";
import insideOut2 from "@/assets/inside-out-2.jpg";
import shadowProtocol from "@/assets/shadow-protocol.jpg";
import echoesYesterday from "@/assets/echoes-yesterday.jpg";
import lastKingdom from "@/assets/last-kingdom.jpg";
import speedChase from "@/assets/speed-chase.jpg";

// Mock movie data
const movies = [
  {
    id: 1,
    title: "Cosmic Horizons",
    genre: "Sci-Fi Adventure",
    runtime: "148 min",
    synopsis: "In a distant future, humanity's last hope lies in exploring uncharted galaxies. A team of astronauts embarks on a perilous journey through cosmic wormholes.",
    cast: ["Emma Stone", "Ryan Gosling", "Michael B. Jordan"],
    image: cosmicHorizons
  },
  {
    id: 2,
    title: "Inside Out 2",
    genre: "Animation, Family",
    runtime: "96 min",
    synopsis: "Riley enters her teenage years and with them come new emotions. Joy, Sadness, Anger, Fear and Disgust must navigate Riley's increasingly complex emotional landscape.",
    cast: ["Amy Poehler", "Phyllis Smith", "Lewis Black"],
    image: insideOut2
  },
  {
    id: 3,
    title: "Shadow Protocol",
    genre: "Action Thriller",
    runtime: "132 min",
    synopsis: "An elite operative uncovers a global conspiracy and must race against time to prevent a catastrophic event that could change the world forever.",
    cast: ["Tom Hardy", "Charlize Theron", "Idris Elba"],
    image: shadowProtocol
  },
  {
    id: 4,
    title: "Echoes of Yesterday",
    genre: "Drama, Romance",
    runtime: "121 min",
    synopsis: "A poignant tale of love and memory that spans decades, exploring how our past shapes our present and the power of human connection.",
    cast: ["Saoirse Ronan", "Timothée Chalamet", "Meryl Streep"],
    image: echoesYesterday
  },
  {
    id: 5,
    title: "The Last Kingdom",
    genre: "Fantasy Epic",
    runtime: "165 min",
    synopsis: "In a world where magic is fading, a young warrior must unite warring kingdoms to face an ancient evil rising from the shadows.",
    cast: ["Chris Hemsworth", "Zendaya", "Benedict Cumberbatch"],
    image: lastKingdom
  },
  {
    id: 6,
    title: "Speed Chase",
    genre: "Action",
    runtime: "110 min",
    synopsis: "A high-octane thriller featuring jaw-dropping car chases and stunts as an ex-racer is pulled back into the dangerous world of illegal street racing.",
    cast: ["Vin Diesel", "Michelle Rodriguez", "John Cena"],
    image: speedChase
  }
];

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState<typeof movies[0] | null>(null);

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
        ease: "easeOut",
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
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center px-6 z-10">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 text-gradient">
              CinemaBook
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
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {movies.map((movie) => (
            <motion.div key={movie.id} variants={itemVariants}>
              <MovieCard
                movie={movie}
                onClick={() => setSelectedMovie(movie)}
              />
            </motion.div>
          ))}
        </motion.div>
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
