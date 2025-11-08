# 🔑 Get Your FREE Gemini API Key

## Why Gemini?

✅ **Completely FREE** - No credit card required  
✅ **1,500 requests/day** - Perfect for hackathon demos  
✅ **60 requests/minute** - Fast rate limit  
✅ **Latest AI model** - Gemini 2.0 Flash (Dec 2024)  
✅ **Function calling** - Full agentic AI support  

---

## 📝 Step-by-Step Guide

### 1. Go to Google AI Studio
**Visit:** https://aistudio.google.com/app/apikey

### 2. Sign in with Google
- Use any Google account (Gmail, etc.)
- No payment info required

### 3. Create API Key
- Click **"Create API key"**
- Select **"Create API key in new project"** (or use existing)
- Copy the key (starts with `AIza...`)

### 4. Add to `.env` file
Open your `.env` file and paste the key:

```env
VITE_GEMINI_API_KEY="AIzaSy...your-actual-key..."
```

### 5. Restart Dev Server
```powershell
# Press Ctrl+C in the terminal running the dev server
# Then restart:
npm run dev
```

---

## ✅ Verify It Works

1. Open http://localhost:8081/
2. Click the chatbot button (bottom-right)
3. Type: **"Show me action movies"**
4. If it works, you'll see:
   - AI responds
   - Action badge appears
   - Movies filter

---

## 🔒 Security Note

⚠️ **Keep your API key private!**
- Don't commit it to Git
- Don't share it publicly
- Don't post screenshots with the key visible

The `.env` file is already in `.gitignore` so it won't be committed.

---

## 📊 Free Tier Limits

| Limit | Value |
|-------|-------|
| Requests per minute | 60 |
| Requests per day | 1,500 |
| Cost | $0 (FREE) |
| Expires | Never |

**Perfect for your hackathon demo!** 🎉

---

## 🆘 Troubleshooting

### "API key not configured" error
- Make sure key starts with `AIza`
- Check no extra spaces in `.env`
- Restart dev server after adding key

### "Quota exceeded" error
- Wait 1 minute (rate limit resets)
- Or wait 24 hours (daily limit resets)

### Still not working?
1. Check browser console (F12) for errors
2. Verify `.env` file has correct key
3. Make sure you restarted the server

---

## 💡 Pro Tip

Generate multiple API keys for different environments:
- One for development
- One for production
- One for team members

All FREE! 🎁

---

**That's it! Get your key and start testing QELV! 🚀**
