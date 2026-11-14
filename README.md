# AIRWITNESS — Civic Air Intelligence Studio

AirWitness is an evidence-first civic air-quality briefing interface.

## Core demo flow

1. Load the synthetic demo dataset.
2. Audit messy readings and expose the Ward 19 missing PM2.5 value.
3. Detect the repeated evening hotspot around Ward 17.
4. Inspect the source rows behind the finding.
5. Switch the civic lens between Ward Officer, Housing Society and School.
6. Compare the previous briefing against the current run.
7. Run a clearly-labelled intervention scenario.
8. Rewrite the citizen advisory in English, Hindi, Marathi or Bengali.

## GenAI integration

AirWitness has a real Gemini integration behind the serverless route `/api/analyze`. The frontend never contains the secret.

For deployment:

1. Import the repository into Vercel.
2. Add `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables.
3. Optional: add `GEMINI_MODEL=gemini-2.5-flash`.
4. Redeploy and click **GENERATE BRIEF**.

The demo still renders locally when the API is unavailable, so the submission remains judgeable even if the key is not configured.

See `SETUP_GEMINI.md` for the exact setup.

## Local usage

Open `index.html` directly for the full demo UI.

For the optional Gemini endpoint, use a Vercel deployment or another server runtime that supports the provided `/api/analyze.js` function.

## Submission size

The repository intentionally contains only lightweight source files and a small CSV. Do not commit `node_modules`, build output, videos, screenshots, or secret keys.
