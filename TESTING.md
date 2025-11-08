# 🧪 Agentic AI Testing Guide

## Prerequisites

✅ Dev server running on http://localhost:8081/
✅ OpenAI API key configured in `.env`

## Testing Workflow

### Test 1: Filter Movies by Genre
**Steps:**
1. Open the chatbot (click floating button bottom-right)
2. Type: "Show me action movies"
3. **Expected Result:**
   - AI responds with filtered movies
   - Action badge shows: `filter_movies`
   - Only action movies displayed (Shadow Protocol, Speed Chase)

### Test 2: Navigate to Specific Movie
**Steps:**
1. Type: "Take me to Inside Out 2"
2. **Expected Result:**
   - Page navigates to `/cinemas/2`
   - Shows cinemas for Inside Out 2
   - Action badge: `select_movie`
   - Toast notification confirms navigation

### Test 3: Find Specific Cinema
**Steps:**
1. From cinemas page, type: "Find SM Makati"
2. **Expected Result:**
   - Highlights or filters to SM Makati Cinema
   - Shows showtimes
   - Action badge: `find_cinemas`

### Test 4: Select Showtime and Navigate
**Steps:**
1. Type: "Book the 8PM show at SM Makati"
2. **Expected Result:**
   - Navigates to `/seats/2/1?time=7:30%20PM` (or 8PM if available)
   - Shows seat selection interface
   - Action badges: `select_showtime`

### Test 5: Context-Aware Follow-up
**Steps:**
1. Type: "Show me action movies"
2. Then type: "Take me to the first one"
3. **Expected Result:**
   - AI remembers filtered list
   - Navigates to first action movie (Shadow Protocol)
   - Demonstrates context awareness

### Test 6: Multi-Step Booking
**Steps:**
1. From movies page, type: "I want to watch Inside Out 2 at SM Makati for the 8PM show"
2. **Expected Result:**
   - AI executes multiple actions
   - Navigates through: Movies → Cinemas → Seats
   - Multiple action badges shown
   - Ends on seat selection page

## Testing Without API Key

**Steps:**
1. Remove `VITE_OPENAI_API_KEY` from `.env`
2. Restart dev server
3. Try to chat
4. **Expected Result:**
   - Error toast appears
   - Message: "AI Not Configured"
   - Instructions to add API key
   - No crash

## Visual Checks

### Action Badges
- [ ] Badges appear below assistant messages
- [ ] Badge shows action type (e.g., "select movie")
- [ ] Green checkmark icon visible
- [ ] Multiple badges for multi-action responses

### Toast Notifications
- [ ] Success toast on action execution
- [ ] Shows action type and result
- [ ] Zap icon displayed
- [ ] Auto-dismisses after 3-5 seconds

### Chat Interface
- [ ] Messages properly aligned (user right, AI left)
- [ ] Loading animation during AI processing
- [ ] Scroll to bottom on new messages
- [ ] Input disabled during loading

## Console Checks

Open browser DevTools → Console

**Should see:**
- No errors during normal operation
- Action execution logs (if enabled)
- Network requests to OpenAI API

**Should NOT see:**
- CORS errors
- React errors
- Navigation errors
- Context provider errors

## Edge Cases

### Test: Invalid Movie Name
**Type:** "Take me to Nonexistent Movie XYZ"
**Expected:** AI responds that movie not found

### Test: Ambiguous Request
**Type:** "Show me a movie"
**Expected:** AI lists all movies or asks for clarification

### Test: Back Navigation
**Type:** "Go back to movies"
**Expected:** Navigates to `/` (movies page)

## Performance Checks

- [ ] AI responds within 2-5 seconds
- [ ] Page navigation is instant after action
- [ ] No lag in UI during action execution
- [ ] Chat remains responsive during navigation

## API Usage Monitoring

Check OpenAI dashboard:
- Typical request: 500-1000 tokens
- Cost per request: $0.01-0.03
- Monitor for unexpected spikes

## Known Limitations

⚠️ **Current limitations (not bugs):**
- Seat auto-selection not fully implemented (shows intent message)
- Cinema filtering by distance not exact
- No payment integration
- No booking persistence

## Success Criteria

✅ **All tests pass if:**
1. AI responds to all test commands
2. Actions execute correctly
3. Navigation works as expected
4. Action badges display
5. No console errors
6. Context maintained across messages

## Debugging Tips

**AI not responding:**
- Check API key in `.env`
- Verify OpenAI account has credits
- Check browser console for errors
- Restart dev server

**Actions not executing:**
- Check React Router is working
- Verify context provider is wrapping app
- Look for navigation errors in console

**Context not working:**
- Check AIContext is updating
- Verify useEffect hooks in pages
- Ensure location changes trigger updates

---

**Happy Testing! 🎬🤖**
