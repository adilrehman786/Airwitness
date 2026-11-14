# Gemini setup

AirWitness already contains the server-side Gemini route at `api/analyze.js`.

## 1. Create a key

Create a Gemini API key in Google AI Studio.

## 2. Add it to Vercel

Open your Vercel project:

`Settings → Environment Variables`

Add:

- Name: `GEMINI_API_KEY`
- Value: your actual Gemini API key
- Environments: Production, Preview, Development as needed

Optional:

- Name: `GEMINI_MODEL`
- Value: `gemini-2.5-flash`

Redeploy after saving the variable.

## 3. Test

Open the deployed AirWitness site and click **GENERATE BRIEF**.

The browser calls `/api/analyze`; the serverless function reads `GEMINI_API_KEY` from the environment and calls Gemini. The secret is never sent to the browser.

## 4. Local development

Install Vercel CLI if needed, then from this folder run:

```powershell
npx vercel dev
```

Set `GEMINI_API_KEY` in your local environment or `.env.local` (which is ignored by Git):

```powershell
$env:GEMINI_API_KEY="YOUR_REAL_KEY"
$env:GEMINI_MODEL="gemini-2.5-flash"
```

Then open the localhost URL printed by Vercel.

## Security rule

Never paste the real key into `app.js`, `index.html`, `README.md`, or any public GitHub file. A public repository must contain only placeholders such as `.env.example`.
