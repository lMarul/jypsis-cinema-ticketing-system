/**
 * Agentic AI Service
 * 
 * This service enables the AI chatbot to take ACTIONS, not just respond.
 * It uses OpenAI's function calling to understand user intent and autonomously
 * navigate the app, filter content, and perform booking operations.
 */

import { NavigateFunction } from "react-router-dom";

// Define the actions the AI can take
export interface AIAction {
  type: 'navigate' | 'filter_movies' | 'select_movie' | 'find_cinemas' | 
        'select_showtime' | 'select_seats' | 'confirm_booking' | 'show_info';
  params: Record<string, any>;
}

// Movie data structure (should match the actual data)
export interface Movie {
  id: number;
  title: string;
  genre: string;
  runtime: string;
  synopsis: string;
  cast: string[];
  image: string;
}

export interface Cinema {
  id: number;
  name: string;
  distance: string;
  location: string;
  showtimes: string[];
  tiers: string[];
}

// Context that the AI needs to be aware of
export interface AIContext {
  currentPage: 'movies' | 'cinemas' | 'seats';
  currentMovieId?: number;
  currentCinemaId?: number;
  selectedShowtime?: string;
  selectedSeats?: string[];
  userLocation?: string;
  availableMovies: Movie[];
  availableCinemas: Cinema[];
}

/**
 * Function definitions for OpenAI function calling
 * These tell the AI what actions it can take
 */
export const AI_FUNCTIONS = [
  {
    name: "navigate_to_page",
    description: "Navigate to a specific page in the cinema booking app",
    parameters: {
      type: "object",
      properties: {
        page: {
          type: "string",
          enum: ["movies", "cinemas", "seats"],
          description: "The page to navigate to"
        },
        movieId: {
          type: "number",
          description: "Movie ID (required for cinemas and seats pages)"
        },
        cinemaId: {
          type: "number",
          description: "Cinema ID (required for seats page)"
        },
        showtime: {
          type: "string",
          description: "Selected showtime (for seats page)"
        }
      },
      required: ["page"]
    }
  },
  {
    name: "filter_movies",
    description: "Filter or search for movies by genre, title, or other criteria",
    parameters: {
      type: "object",
      properties: {
        genre: {
          type: "string",
          description: "Genre to filter by (e.g., 'Action', 'Sci-Fi', 'Animation')"
        },
        searchTerm: {
          type: "string",
          description: "Search term to find specific movies by title"
        }
      }
    }
  },
  {
    name: "select_movie",
    description: "Select a specific movie and navigate to view available cinemas",
    parameters: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "ID of the movie to select"
        },
        movieTitle: {
          type: "string",
          description: "Title of the movie (used to find the movie if ID not known)"
        }
      }
    }
  },
  {
    name: "find_cinemas",
    description: "Find cinemas showing a movie, optionally filtered by location or distance",
    parameters: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "ID of the movie"
        },
        location: {
          type: "string",
          description: "Preferred location (e.g., 'Makati', 'SM Makati')"
        },
        maxDistance: {
          type: "string",
          description: "Maximum distance (e.g., '5 km')"
        }
      },
      required: ["movieId"]
    }
  },
  {
    name: "select_showtime",
    description: "Select a cinema and showtime, then navigate to seat selection",
    parameters: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "Movie ID"
        },
        cinemaId: {
          type: "number",
          description: "Cinema ID"
        },
        cinemaName: {
          type: "string",
          description: "Cinema name (used to find cinema if ID not known)"
        },
        showtime: {
          type: "string",
          description: "Selected showtime (e.g., '7:30 PM')"
        }
      },
      required: ["movieId"]
    }
  },
  {
    name: "select_seats",
    description: "Automatically select seats based on user preferences",
    parameters: {
      type: "object",
      properties: {
        quantity: {
          type: "number",
          description: "Number of seats to select"
        },
        tier: {
          type: "string",
          enum: ["regular", "premium", "vip"],
          description: "Seat tier preference"
        },
        seatIds: {
          type: "array",
          items: { type: "string" },
          description: "Specific seat IDs to select (e.g., ['A5', 'A6'])"
        }
      }
    }
  },
  {
    name: "show_movie_info",
    description: "Display detailed information about a specific movie",
    parameters: {
      type: "object",
      properties: {
        movieId: {
          type: "number",
          description: "Movie ID"
        },
        movieTitle: {
          type: "string",
          description: "Movie title"
        }
      }
    }
  }
];

/**
 * OpenAI API call with function calling
 */
export async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  context: AIContext
): Promise<{ response: string; actions: AIAction[] }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const useMock = (import.meta.env.VITE_USE_MOCK_AI === "true") || !apiKey || apiKey === 'your-gemini-api-key-here';

  // If explicitly configured to use a mock AI, or if the API key is missing,
  // return a safe mocked assistant response so the app remains functional.
  if (useMock) {
    // Simple mock "agent" that can perform a few actions locally based on the last user message.
    const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content || messages[messages.length - 1]?.content || '';
    const actions: AIAction[] = [];
    let responseText = `Hi — I'm QELV (mock assistant). I can't contact the AI service right now, but I can still help you navigate the app.`;

    try {
      const lower = lastUser.toLowerCase();

      // Match: "take me to <movie title>"
      const takeMatch = lower.match(/take me to (.+)/i);
      if (takeMatch) {
        const movieTitle = takeMatch[1].trim();
        actions.push({ type: 'select_movie', params: { movieTitle } });
        responseText = `Okay — taking you to cinemas showing "${movieTitle}".`;
        return Promise.resolve({ response: responseText, actions });
      }

      // Match: "show me <genre> movies" or "show me action movies"
      const showMatch = lower.match(/show me (.+) movies/i);
      if (showMatch) {
        const genre = showMatch[1].trim();
        actions.push({ type: 'filter_movies', params: { genre } });
        responseText = `Showing movies in the \"${genre}\" genre.`;
        return Promise.resolve({ response: responseText, actions });
      }

      // Match: "book <n> <tier> seats" e.g., "book 2 vip seats"
      const bookMatch = lower.match(/book\s+(\d+)\s+(vip|premium|regular)?/i);
      if (bookMatch) {
        const quantity = parseInt(bookMatch[1], 10);
        const tier = bookMatch[2] || undefined;
        actions.push({ type: 'select_seats', params: { quantity, tier } });
        responseText = `I will select ${quantity} ${tier || ''} seat(s) for you.`;
        return Promise.resolve({ response: responseText, actions });
      }

      // Default mock reply when no action detected
      responseText += ` Try: \"Show me action movies\" or \"Take me to Inside Out 2\".`;
    } catch (err) {
      // If parsing fails, fall back to a friendly response
      responseText = `Hi — I'm QELV (mock assistant). I can't contact the AI service right now, but I can still help you navigate the app.`;
    }

    return Promise.resolve({ response: responseText, actions });
  }

  // Build system prompt with current context
  const systemPrompt = `You are an intelligent cinema booking assistant with the ability to TAKE ACTIONS.

CURRENT CONTEXT:
- Current page: ${context.currentPage}
- Current movie: ${context.currentMovieId ? `Movie #${context.currentMovieId}` : 'None'}
- Current cinema: ${context.currentCinemaId ? `Cinema #${context.currentCinemaId}` : 'None'}
- Selected showtime: ${context.selectedShowtime || 'None'}
- Selected seats: ${context.selectedSeats?.join(', ') || 'None'}

AVAILABLE MOVIES:
${context.availableMovies.map(m => `- ${m.title} (ID: ${m.id}) - ${m.genre}`).join('\n')}

${context.availableCinemas.length > 0 ? `AVAILABLE CINEMAS:
${context.availableCinemas.map(c => `- ${c.name} (ID: ${c.id}) - ${c.location}, ${c.distance} away`).join('\n')}` : ''}

YOUR CAPABILITIES:
You can autonomously navigate the app, filter content, and perform actions. When users ask you to do something:
1. Understand their intent
2. Call the appropriate function(s) to take action
3. Confirm what you did in your response

IMPORTANT RULES:
- Always take action when asked (don't just describe what to do)
- Navigate users through the booking flow: Movies → Cinemas → Seats
- If a user mentions a movie title, find it and select it
- If asked to find cinemas or showtimes, navigate to the cinemas page
- If asked to book or reserve seats, navigate through the entire flow
- Be proactive and anticipate next steps

Examples:
- "Show me action movies" → Filter movies by genre AND describe what's shown
- "Take me to Inside Out 2" → Select movie #2 AND navigate to cinemas
- "Find the next screening at SM Makati" → Find cinema, select earliest showtime
- "Book 2 VIP seats for 8PM" → Navigate to seats page and auto-select 2 VIP seats

Be conversational, helpful, and ALWAYS take action when possible.`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: systemPrompt + "\n\nConversation:\n" + messages.map(m => `${m.role}: ${m.content}`).join('\n')
        }]
      }],
      tools: [{
        functionDeclarations: AI_FUNCTIONS
      }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Gemini API request failed");
  }

  const data = await response.json();
  const candidate = data.candidates?.[0];
  
  if (!candidate) {
    throw new Error("No response from Gemini");
  }

  const actions: AIAction[] = [];
  
  // Check if Gemini wants to call a function
  const functionCall = candidate.content?.parts?.find((part: any) => part.functionCall);
  
  if (functionCall?.functionCall) {
    const fc = functionCall.functionCall;
    
    actions.push({
      type: mapFunctionToActionType(fc.name),
      params: fc.args || {}
    });
  }

  // Get text response
  const textPart = candidate.content?.parts?.find((part: any) => part.text);
  const textResponse = textPart?.text || generateActionConfirmation(actions);

  return {
    response: textResponse,
    actions
  };
}

/**
 * Map OpenAI function names to our action types
 */
function mapFunctionToActionType(functionName: string): AIAction['type'] {
  const mapping: Record<string, AIAction['type']> = {
    'navigate_to_page': 'navigate',
    'filter_movies': 'filter_movies',
    'select_movie': 'select_movie',
    'find_cinemas': 'find_cinemas',
    'select_showtime': 'select_showtime',
    'select_seats': 'select_seats',
    'show_movie_info': 'show_info'
  };
  
  return mapping[functionName] || 'show_info';
}

/**
 * Generate confirmation message for actions
 */
function generateActionConfirmation(actions: AIAction[]): string {
  if (actions.length === 0) return "";
  
  const action = actions[0];
  
  switch (action.type) {
    case 'select_movie':
      return `Navigating to cinemas showing this movie...`;
    case 'select_showtime':
      return `Taking you to seat selection...`;
    case 'select_seats':
      return `Selecting ${action.params.quantity} ${action.params.tier || ''} seat(s) for you...`;
    case 'filter_movies':
      return `Filtering movies...`;
    default:
      return "Action executed.";
  }
}

/**
 * Execute actions (called by the UI)
 */
export async function executeActions(
  actions: AIAction[],
  navigate: NavigateFunction,
  context: AIContext,
  setters: {
    setFilteredMovies?: (filter: (movies: Movie[]) => Movie[]) => void;
    setSelectedMovie?: (movie: Movie | null) => void;
    setSelectedSeats?: (seats: string[]) => void;
  }
): Promise<string[]> {
  const results: string[] = [];

  for (const action of actions) {
    try {
      const result = await executeAction(action, navigate, context, setters);
      results.push(result);
    } catch (error) {
      console.error(`Failed to execute action ${action.type}:`, error);
      results.push(`Failed to ${action.type}`);
    }
  }

  return results;
}

/**
 * Execute a single action
 */
async function executeAction(
  action: AIAction,
  navigate: NavigateFunction,
  context: AIContext,
  setters: any
): Promise<string> {
  switch (action.type) {
    case 'navigate':
      return handleNavigate(action, navigate);
    
    case 'filter_movies':
      return handleFilterMovies(action, context, setters);
    
    case 'select_movie':
      return handleSelectMovie(action, navigate, context);
    
    case 'find_cinemas':
      return handleFindCinemas(action, navigate);
    
    case 'select_showtime':
      return handleSelectShowtime(action, navigate);
    
    case 'select_seats':
      return handleSelectSeats(action, setters);
    
    default:
      return "Action completed";
  }
}

function handleNavigate(action: AIAction, navigate: NavigateFunction): string {
  const { page, movieId, cinemaId, showtime } = action.params;
  
  if (page === 'movies') {
    navigate('/');
    return "Navigated to movies page";
  } else if (page === 'cinemas' && movieId) {
    navigate(`/cinemas/${movieId}`);
    return `Navigated to cinemas for movie #${movieId}`;
  } else if (page === 'seats' && movieId && cinemaId) {
    const url = showtime 
      ? `/seats/${movieId}/${cinemaId}?time=${encodeURIComponent(showtime)}`
      : `/seats/${movieId}/${cinemaId}`;
    navigate(url);
    return `Navigated to seat selection`;
  }
  
  return "Navigation completed";
}

function handleFilterMovies(
  action: AIAction,
  context: AIContext,
  setters: any
): string {
  const { genre, searchTerm } = action.params;
  
  if (setters.setFilteredMovies) {
    setters.setFilteredMovies((movies: Movie[]) => {
      return movies.filter(movie => {
        if (genre && !movie.genre.toLowerCase().includes(genre.toLowerCase())) {
          return false;
        }
        if (searchTerm && !movie.title.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }
        return true;
      });
    });
    
    return `Filtered movies${genre ? ` by genre: ${genre}` : ''}${searchTerm ? ` matching: ${searchTerm}` : ''}`;
  }
  
  return "Filter applied";
}

function handleSelectMovie(
  action: AIAction,
  navigate: NavigateFunction,
  context: AIContext
): string {
  let movieId = action.params.movieId;
  
  // If movieTitle provided but not ID, find it
  if (!movieId && action.params.movieTitle) {
    const movie = context.availableMovies.find(
      m => m.title.toLowerCase() === action.params.movieTitle.toLowerCase()
    );
    movieId = movie?.id;
  }
  
  if (movieId) {
    navigate(`/cinemas/${movieId}`);
    return `Selected movie and showing available cinemas`;
  }
  
  return "Movie not found";
}

function handleFindCinemas(action: AIAction, navigate: NavigateFunction): string {
  const { movieId } = action.params;
  navigate(`/cinemas/${movieId}`);
  return `Showing cinemas for movie`;
}

function handleSelectShowtime(action: AIAction, navigate: NavigateFunction): string {
  const { movieId, cinemaId, showtime } = action.params;
  
  if (movieId && cinemaId && showtime) {
    navigate(`/seats/${movieId}/${cinemaId}?time=${encodeURIComponent(showtime)}`);
    return `Selected ${showtime} showtime at cinema #${cinemaId}`;
  }
  
  return "Navigating to showtimes";
}

function handleSelectSeats(action: AIAction, setters: any): string {
  const { quantity, tier, seatIds } = action.params;
  
  if (setters.setSelectedSeats) {
    // This would need to be implemented in the Seats page
    // For now, we return a message
    return `Will select ${quantity} ${tier || ''} seat(s)`;
  }
  
  return "Seat selection pending";
}
