# Vercel Deployment Fix

## The Problem
Vercel error: `cd: frontend: No such file or directory`

This happens because Vercel needs to know where your Next.js app is located.

## Solution: Configure Root Directory in Vercel Dashboard

### Step 1: Go to Vercel Dashboard
1. Open your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Go to **Settings** → **General**

### Step 2: Set Root Directory
- Find **Root Directory** setting
- Click **Edit**
- Enter: `frontend`
- Click **Save**

### Step 3: Verify Build Settings
After setting Root Directory to `frontend`, Vercel will auto-detect:
- **Framework:** Next.js
- **Build Command:** `npm run build` (auto)
- **Output Directory:** `.next` (auto)
- **Install Command:** `npm install` (auto)

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger deployment

## Alternative: If Root Directory Setting Doesn't Work

If you can't set Root Directory in Vercel Dashboard, use this `vercel.json`:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install",
  "framework": "nextjs"
}
```

But make sure the `frontend` folder is committed to GitHub:
```bash
git add frontend/
git commit -m "Ensure frontend directory is in repo"
git push origin main
```

## Verify Frontend is in GitHub

Check your GitHub repo:
```
https://github.com/rabinC-star/souvenir-app
```

You should see:
- `frontend/` folder
- `frontend/package.json`
- `frontend/app/` folder
- etc.

If `frontend` folder is missing from GitHub, commit it:
```bash
cd /Users/sonofgod/SovernirApp
git add frontend/
git commit -m "Add frontend directory"
git push origin main
```

## Current vercel.json

The current `vercel.json` assumes Root Directory is set to `frontend` in Vercel Dashboard. If Root Directory is set correctly, Vercel will:
- Run commands from `frontend/` directory
- Use `npm install` and `npm run build` directly
- Output to `.next` directory

## Quick Fix Summary

1. **Vercel Dashboard** → **Settings** → **General**
2. Set **Root Directory** to: `frontend`
3. **Save** and **Redeploy**

That's it! 🎉
