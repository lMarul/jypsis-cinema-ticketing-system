import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    genre: string;
    runtime: string;
    synopsis: string;
    cast: string[];
    image: string;
  };
  onClick: () => void;
}

export const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  return (
    <Card
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer transition-smooth hover:scale-105 shadow-card bg-card border-border"
    >
      {/* Movie Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full h-full object-cover transition-smooth group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-smooth">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-sm font-semibold">Featured</span>
            </div>
            <p className="text-sm line-clamp-3">{movie.synopsis}</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {movie.genre}
              </Badge>
              <Badge variant="outline" className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {movie.runtime}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
        <p className="text-sm text-muted-foreground">{movie.genre}</p>
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none shadow-glow" />
    </Card>
  );
};
