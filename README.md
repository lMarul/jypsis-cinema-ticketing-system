# Welcome to your Lovable project

## 🤖 Agentic AI Feature (Hackathon Requirement)

This project features a **truly agentic AI chatbot** that autonomously navigates the app and performs actions based on natural language commands.

**Try these commands:**
- "Show me action movies"
- "Take me to Inside Out 2"
- "Find the next screening at SM Makati"
- "Book 2 VIP seats for the 8PM show"

The AI doesn't just respond—it **takes action** by navigating pages, filtering content, and helping you book tickets!

📖 **[Read full Agentic AI Documentation](./AGENTIC_AI.md)**

### Quick Setup for AI

1. Get OpenAI API key: https://platform.openai.com/api-keys
2. Copy `.env.example` to `.env`
3. Add your API key:
   ```env
   VITE_OPENAI_API_KEY="sk-your-key-here"
   ```
4. Run `npm run dev`

---

## Project info

**URL**: https://lovable.dev/projects/7106a5b8-4bb0-4a91-8f8a-8b749673de8c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7106a5b8-4bb0-4a91-8f8a-8b749673de8c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7106a5b8-4bb0-4a91-8f8a-8b749673de8c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
