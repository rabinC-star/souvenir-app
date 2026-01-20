# Vercel Deployment - Step by Step Fix

## Current Issue
Error: `cd: frontend: No such file or directory`

## Solution: Two Options

### Option 1: Set Root Directory in Vercel Dashboard (RECOMMENDED)

1. **Go to Vercel Dashboard:**
   - Open: https://vercel.com/dashboard
   - Select your project: `souvenir-app`

2. **Configure Root Directory:**
   - Go to **Settings** → **General**
   - Scroll to **Root Directory**
   - Click **Edit**
   - Enter: `frontend`
   - Click **Save**

3. **Update vercel.json:**
   The current `vercel.json` will work once Root Directory is set to `frontend`.
   Or use this simplified version:

```json
{
  "framework": "nextjs"
}
```

4. **Redeploy:**
   - Go to **Deployments** tab
   - Click **Redeploy** on latest deployment

### Option 2: Use Root-Based vercel.json (Current Setup)

If you can't set Root Directory, the current `vercel.json` should work:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

**But you must ensure:**
1. Frontend directory is committed to GitHub
2. Push latest changes:
   ```bash
   git add .
   git commit -m "Fix Vercel deployment"
   git push origin main
   ```

## Verify Frontend is in GitHub

Check: https://github.com/rabinC-star/souvenir-app/tree/main

You should see:
- ✅ `frontend/` folder
- ✅ `frontend/package.json`
- ✅ `frontend/app/` folder

## Quick Fix Commands

If frontend isn't fully committed:

```bash
cd /Users/sonofgod/SovernirApp
git add frontend/
git commit -m "Ensure frontend directory is committed"
git push origin main
```

Then redeploy in Vercel.

## Recommended Approach

**Use Option 1** - Set Root Directory to `frontend` in Vercel Dashboard. This is the cleanest solution and lets Vercel auto-detect everything.
