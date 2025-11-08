# 🤖 Agentic AI Integration - Documentation

## Overview

This cinema ticketing system features a **truly agentic AI chatbot** that doesn't just respond to questions—it **takes action**. The AI can autonomously navigate the app, filter content, select movies, find cinemas, and even help with seat selection.

## What Makes This AI "Agentic"?

Unlike traditional chatbots that only provide information, this AI assistant:

✅ **Autonomously navigates** between pages (Movies → Cinemas → Seats)  
✅ **Performs actions** based on natural language commands  
✅ **Maintains context** about the current booking state  
✅ **Makes decisions** about what actions to take  
✅ **Provides real-time feedback** with action badges  

## Architecture

### Core Components

1. **AI Service** (`src/services/aiAgent.ts`)
   - OpenAI GPT-4 integration with function calling
   - 7 defined actions the AI can execute
   - Action execution engine

2. **Context Provider** (`src/contexts/AIContext.tsx`)
   - Tracks current page, selected movie/cinema/showtime
   - Maintains booking state
   - Shares context with AI for awareness

3. **Enhanced Chatbot** (`src/components/AIChatbot.tsx`)
   - Real-time action execution
   - Visual action feedback with badges
   - Toast notifications for actions

4. **Shared Data** (`src/data/mockData.ts`)
   - Centralized movie and cinema data
   - Shared across components and AI

## Available AI Actions

The AI can perform these actions autonomously:

| Action | Description | Example Command |
|--------|-------------|-----------------|
| `navigate` | Navigate to specific pages | "Take me back to movies" |
| `filter_movies` | Filter movies by genre/title | "Show me action movies" |
| `select_movie` | Select movie and go to cinemas | "Take me to Inside Out 2" |
| `find_cinemas` | Show cinemas for a movie | "Find cinemas showing this" |
| `select_showtime` | Pick cinema/time, go to seats | "Book the 8PM show at SM Makati" |
| `select_seats` | Auto-select seats by preference | "Reserve 2 VIP seats" |
| `show_info` | Display movie details | "Tell me about Cosmic Horizons" |

## Setup Instructions

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 2. Configure Environment

Edit `.env` file:

```env
VITE_OPENAI_API_KEY="sk-your-actual-api-key-here"
```

> ⚠️ **Important**: Never commit your API key to version control!

### 3. Install & Run

```powershell
npm install
npm run dev
```

## Usage Examples

### Example 1: Browse Movies by Genre
**User:** "Show me action movies"

**AI Response:**
- Filters movies to show only action genre
- Displays: "Shadow Protocol", "Speed Chase"
- Shows action badge: `filter_movies`

### Example 2: Direct Navigation
**User:** "Take me to Inside Out 2"

**AI Response:**
- Finds movie by title
- Navigates to `/cinemas/2`
- Shows available cinemas
- Action badge: `select_movie`

### Example 3: Find Specific Cinema
**User:** "Find the next screening at SM Makati"

**AI Response:**
- Filters to SM Makati Cinema
- Shows earliest available showtime
- Can auto-select showtime
- Action badges: `find_cinemas`, `select_showtime`

### Example 4: Complete Booking Flow
**User:** "Book 2 VIP seats for the 8PM show"

**AI Response:**
- Finds 8PM showtime
- Navigates to seat selection
- Auto-selects 2 VIP tier seats
- Action badges: `select_showtime`, `select_seats`

### Example 5: Context-Aware Follow-up
**User:** "Show me action movies"  
**User:** "Take me to the first one"

**AI Response:**
- Remembers filtered movies from context
- Selects first action movie
- Navigates to cinemas
- Demonstrates contextual understanding

## Technical Details

### How Function Calling Works

1. **User sends message** → "Take me to Inside Out 2"

2. **OpenAI receives context:**
   ```json
   {
     "currentPage": "movies",
     "availableMovies": [
       { "id": 2, "title": "Inside Out 2", "genre": "Animation, Family" }
     ]
   }
   ```

3. **AI decides to call function:**
   ```json
   {
     "function_call": {
       "name": "select_movie",
       "arguments": { "movieTitle": "Inside Out 2" }
     }
   }
   ```

4. **System executes action:**
   - Finds movie ID (2)
   - Calls `navigate('/cinemas/2')`
   - Updates context
   - Shows toast notification

5. **User sees:**
   - Page navigates to cinemas
   - Action badge appears
   - Success toast: "Selected movie and showing available cinemas"

### Context Awareness

The AI always knows:

```typescript
{
  currentPage: 'movies' | 'cinemas' | 'seats',
  currentMovieId?: number,
  currentCinemaId?: number,
  selectedShowtime?: string,
  selectedSeats?: string[],
  availableMovies: Movie[],
  availableCinemas: Cinema[]
}
```

This enables smart decisions like:
- "Go back" → knows where to navigate from current page
- "Book this movie" → knows which movie is currently selected
- "Show me another cinema" → knows current cinema, can suggest alternatives

## AI Prompt Engineering

The system prompt includes:

1. **Current context** - Page, selections, available options
2. **Capabilities** - List of functions it can call
3. **Behavioral rules** - Always take action, be proactive
4. **Examples** - How to handle common requests

Example system prompt snippet:

```
You are an intelligent cinema booking assistant with the ability to TAKE ACTIONS.

CURRENT CONTEXT:
- Current page: movies
- Available movies: Cosmic Horizons, Inside Out 2, Shadow Protocol...

YOUR CAPABILITIES:
You can autonomously navigate the app, filter content, and perform actions.

IMPORTANT RULES:
- Always take action when asked (don't just describe what to do)
- Navigate users through: Movies → Cinemas → Seats
- Be proactive and anticipate next steps
```

## Error Handling

The system handles:

- **Missing API key** → Shows setup instructions
- **API rate limits** → Suggests waiting
- **Invalid actions** → Graceful fallback
- **Network errors** → Retry suggestion

## Cost Considerations

- **Model**: GPT-4-turbo-preview
- **Average cost**: ~$0.01-0.03 per conversation
- **Tokens per request**: 500-1000 (including context)
- **Recommendation**: Set usage limits in OpenAI dashboard

## Extending the AI

### Add New Actions

1. Define function in `AI_FUNCTIONS` array:

```typescript
{
  name: "cancel_booking",
  description: "Cancel current booking and return to movies",
  parameters: {
    type: "object",
    properties: {
      confirmCancel: { type: "boolean" }
    }
  }
}
```

2. Add action type:

```typescript
type AIAction = {
  type: 'navigate' | 'cancel_booking' | ...;
  params: Record<string, any>;
}
```

3. Implement handler in `executeAction`:

```typescript
case 'cancel_booking':
  return handleCancelBooking(action, navigate);
```

### Customize AI Behavior

Edit the system prompt in `src/services/aiAgent.ts`:

```typescript
const systemPrompt = `You are an intelligent cinema booking assistant...

PERSONALITY:
- Be enthusiastic about movies
- Use emojis sparingly
- Keep responses concise
...`;
```

## Testing

### Manual Testing Checklist

- [ ] "Show me action movies" → Filters correctly
- [ ] "Take me to Inside Out 2" → Navigates to cinemas
- [ ] "Find SM Makati" → Shows correct cinema
- [ ] "Book 2 seats for 8PM" → Navigates to seats
- [ ] "Go back" → Returns to previous page
- [ ] Follow-up questions maintain context

### Testing Without API Key

The system gracefully handles missing API key:
- Shows error toast
- Provides setup instructions
- Doesn't crash

## Troubleshooting

### AI Not Responding

1. **Check API key**: Ensure `VITE_OPENAI_API_KEY` is set in `.env`
2. **Restart dev server**: After adding API key, run `npm run dev` again
3. **Check browser console**: Look for network errors
4. **Verify OpenAI account**: Ensure you have credits

### Actions Not Executing

1. **Check context**: AI needs current page/movie data
2. **Verify navigation**: React Router must be working
3. **Console logs**: Check for action execution errors

### Unexpected Behavior

1. **Test with simple commands first**: "Show me movies"
2. **Check AI response**: Look at action badges
3. **Review system prompt**: Adjust behavior rules if needed

## Future Enhancements

Potential improvements (not yet implemented):

1. **Voice input** - Speech-to-text integration
2. **Multi-language** - Support for other languages
3. **Seat preferences** - Learn user preferences over time
4. **Booking history** - "Show my previous bookings"
5. **Recommendations** - "Suggest a movie for me"
6. **Payment integration** - Complete checkout flow
7. **Calendar integration** - "Book for next Friday"

## Security Notes

- API key is **client-side** (for demo purposes)
- In production, use **backend proxy** for OpenAI calls
- Implement **rate limiting** to prevent abuse
- Add **authentication** before deploying
- Consider **function whitelisting** for safety

## Why This Approach?

**Agentic vs. Traditional:**

| Traditional Chatbot | Agentic AI |
|---------------------|------------|
| "Here's how to find movies" | *Actually navigates to movies* |
| "Click on Inside Out 2" | *Clicks on Inside Out 2 for you* |
| "Go to the cinemas page" | *Already there* |
| Describes steps | Executes steps |

This creates a **conversational interface** that feels magical—users can just talk naturally and the app responds intelligently.

## Credits

- **AI Model**: OpenAI GPT-4-turbo-preview
- **Function Calling**: OpenAI Functions API
- **Framework**: React + TypeScript + Vite
- **Routing**: React Router v6

---

**Built for hackathon requirement**: ✅ Agentic AI with autonomous navigation and booking actions.
