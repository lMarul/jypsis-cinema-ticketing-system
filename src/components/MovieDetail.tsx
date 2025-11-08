import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MovieDetailProps {
  movie: {
    id: number;
    title: string;
    genre: string;
    runtime: string;
    synopsis: string;
    cast: string[];
    image: string;
  };
  onClose: () => void;
}

export const MovieDetail = ({ movie, onClose }: MovieDetailProps) => {
  const navigate = useNavigate();

  const handleFindCinemas = () => {
    navigate(`/cinemas/${movie.id}`);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-card border-border">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-3xl font-display font-bold mb-4">
                {movie.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 flex-1">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="default" className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Featured
                </Badge>
                <Badge variant="secondary">{movie.genre}</Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {movie.runtime}
                </Badge>
              </div>

              {/* Synopsis */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Synopsis
                </h4>
                <p className="text-muted-foreground leading-relaxed">{movie.synopsis}</p>
              </div>

              {/* Cast */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Starring
                </h4>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <Badge key={actor} variant="outline">
                      {actor}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleFindCinemas}
              size="lg"
              className="w-full mt-6 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold"
            >
              Find Nearby Cinemas
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
