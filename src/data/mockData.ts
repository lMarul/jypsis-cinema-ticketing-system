// Mock data shared across the app
import cosmicHorizons from "@/assets/cosmic-horizons.jpg";
import insideOut2 from "@/assets/inside-out-2.jpg";
import shadowProtocol from "@/assets/shadow-protocol.jpg";
import echoesYesterday from "@/assets/echoes-yesterday.jpg";
import lastKingdom from "@/assets/last-kingdom.jpg";
import speedChase from "@/assets/speed-chase.jpg";

export const MOCK_MOVIES = [
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

export const MOCK_CINEMAS = [
  {
    id: 1,
    name: "SM Makati Cinema",
    distance: "2.5 km",
    location: "Makati City",
    showtimes: ["10:00 AM", "1:30 PM", "4:00 PM", "7:30 PM", "10:00 PM"],
    tiers: ["Regular", "Premium", "VIP"]
  },
  {
    id: 2,
    name: "Ayala Malls Cinema",
    distance: "3.8 km",
    location: "Makati City",
    showtimes: ["11:00 AM", "2:00 PM", "5:00 PM", "8:00 PM"],
    tiers: ["Regular", "Premium"]
  },
  {
    id: 3,
    name: "Glorietta Cineplex",
    distance: "4.2 km",
    location: "Makati City",
    showtimes: ["12:00 PM", "3:30 PM", "6:30 PM", "9:30 PM"],
    tiers: ["Regular", "IMAX", "4DX"]
  }
];
