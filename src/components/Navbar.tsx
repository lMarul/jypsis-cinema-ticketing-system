import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, Film } from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <motion.nav
  initial={{ y: -100 }}
  animate={{ y: 0 }}
  transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Film className="w-6 h-6 text-primary transition-transform group-hover:scale-110" />
              <motion.div
                className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CinemaBook
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isHome ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Movies
            </Link>
          </div>

          {/* User Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-muted"
          >
            <User className="w-5 h-5" />
            <span className="sr-only">User account</span>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};

