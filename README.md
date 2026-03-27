<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/34e109e8-9609-478d-b390-8fb699ceb66d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages

This project includes a GitHub Actions workflow that automatically builds and deploys the app to GitHub Pages whenever you push to the `main` branch.

### Setup Steps

1. **Add your Gemini API key as a GitHub Secret:**
   - Go to your repository → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `GEMINI_API_KEY`, Value: your Gemini API key

2. **Enable GitHub Pages:**
   - Go to your repository → **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

3. **Push to `main`** (or trigger the workflow manually via **Actions** → **Deploy to GitHub Pages** → **Run workflow**)

Once deployed, your site will be available at:
`https://<your-username>.github.io/KOLRadar/`

> **Note:** The `GEMINI_API_KEY` is embedded into the static build at compile time and will be visible in the browser's source. Restrict your API key's permissions in the [Google AI Studio](https://ai.google.dev/) console to limit exposure.
