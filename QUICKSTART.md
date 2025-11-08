# 🚀 Quick Start Guide - Agentic AI Cinema System

## You're Almost Ready! 

The app is running on **http://localhost:8081/** ✅

## Final Step: Add Your OpenAI API Key

### Option 1: Get a Free OpenAI Key (Recommended)

1. **Go to OpenAI:**
   - Visit: https://platform.openai.com/signup
   - Sign up (free trial includes $5 credit)

2. **Create API Key:**
   - Go to: https://platform.openai.com/api-keys
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

3. **Add to .env file:**
   - Open: `.env` in your project
   - Replace: `VITE_OPENAI_API_KEY="sk-your-openai-api-key-here"`
   - With: `VITE_OPENAI_API_KEY="sk-proj-abc123..."` (your actual key)
   - Save the file

4. **Restart the server:**
   ```powershell
   # Press Ctrl+C in the terminal, then:
   npm run dev
   ```

### Option 2: Test Without AI (Limited)

You can test the basic app without AI:
- Browse movies ✅
- Select cinemas ✅
- Choose seats ✅
- But chatbot won't work ❌

## Test the Agentic AI

Once API key is added:

1. **Open the app:** http://localhost:8081/
2. **Click the chatbot button** (bottom-right floating button)
3. **Try these commands:**

```
"Show me action movies"
"Take me to Inside Out 2"
"Find the next screening at SM Makati"
"Book 2 VIP seats for the 8PM show"
```

4. **Watch the magic happen!**
   - AI will navigate the app for you
   - Action badges show what it's doing
   - Pages change automatically

## What to Show Judges

### 🎯 Demo Script (2 minutes)

**Start at movies page:**

1. **Say:** "Watch how the AI takes autonomous actions"
2. **Type in chat:** "Show me action movies"
   - **Point out:** Action badge appears, movies filter
3. **Type:** "Take me to Inside Out 2"
   - **Point out:** Page navigates automatically (URL changes)
4. **Type:** "Find the 8PM show at SM Makati"
   - **Point out:** Multi-step navigation, action badges
5. **Say:** "Notice it doesn't just respond—it actually controls the app!"

### 💡 Key Points to Highlight

- ✅ **Agentic Behavior:** AI executes actions, not just responds
- ✅ **Autonomous Navigation:** Pages change without clicking
- ✅ **Context Awareness:** AI knows where you are and what's happening
- ✅ **Natural Language:** No rigid commands, talk naturally
- ✅ **Visual Feedback:** Action badges show what AI is doing

## Files to Show (If Asked)

1. **`src/services/aiAgent.ts`**
   - Show function definitions
   - Explain OpenAI function calling
   - Point out action handlers

2. **`src/contexts/AIContext.tsx`**
   - Explain context tracking
   - Show how AI gets app state

3. **`src/components/AIChatbot.tsx`**
   - Show action execution
   - Visual feedback implementation

4. **`AGENTIC_AI.md`**
   - Full technical documentation
   - Architecture explanation

## Troubleshooting

### Chatbot says "AI Not Configured"
- Check `.env` file has `VITE_OPENAI_API_KEY`
- Restart dev server after adding key
- Key must start with `sk-`

### AI responds but doesn't navigate
- Check browser console for errors
- Verify React Router is working (try manual navigation)
- Check AIContext is wrapping App

### Server won't start
- Run `npm install` first
- Check Node version (need 18+)
- Try different port: `npm run dev -- --port 3000`

## Cost Information

**OpenAI Usage:**
- Free trial: $5 credit
- This demo uses: ~$0.01-0.03 per conversation
- You can demo **100+ times** on free credit

## Project Structure

```
src/
├── services/
│   └── aiAgent.ts          ← AI brain (OpenAI integration)
├── contexts/
│   └── AIContext.tsx       ← State tracking
├── components/
│   └── AIChatbot.tsx       ← Chat UI + action execution
├── data/
│   └── mockData.ts         ← Movies and cinemas data
└── pages/
    ├── Movies.tsx          ← Updated with context
    ├── Cinemas.tsx         ← Updated with context
    └── Seats.tsx           ← Updated with context
```

## Next Steps

1. ✅ Add OpenAI API key to `.env`
2. ✅ Restart server: `npm run dev`
3. ✅ Open http://localhost:8081/
4. ✅ Click chatbot and test commands
5. ✅ Read `AGENTIC_AI.md` for full docs
6. ✅ Review `TESTING.md` for test cases
7. ✅ Check `IMPLEMENTATION_REPORT.md` for compliance

## Documentation Index

- **`AGENTIC_AI.md`** - Full technical documentation
- **`TESTING.md`** - Testing guide and test cases
- **`IMPLEMENTATION_REPORT.md`** - What was built and why
- **`README.md`** - Updated with AI setup

## Questions?

Check console for errors:
- Press F12 in browser
- Look at Console tab
- Network tab shows API calls

---

**You're ready to demonstrate a truly agentic AI! 🎬🤖**

The AI doesn't just respond—it **acts**. It doesn't just describe—it **executes**. It doesn't just inform—it **navigates**.

Have fun demoing! 🚀
