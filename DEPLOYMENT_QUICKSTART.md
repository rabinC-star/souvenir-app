# Quick Deployment Guide

## 🚀 Deploy to Vercel in 5 Minutes

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready"
git push origin main
```

### 2. Deploy to Vercel

**Via Dashboard:**
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **IMPORTANT:** Set **Root Directory** to `frontend`
4. Add environment variables (see below)
5. Click Deploy

**Via CLI:**
```bash
cd frontend
npm install -g vercel
vercel
```

### 3. Required Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXT_PUBLIC_API_URL=https://your-backend-url.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Update OAuth Redirect URIs

In your OAuth provider console, update redirect URIs to:
- `https://your-app.vercel.app/api/auth/callback/google`

### 5. Deploy Backend

Deploy backend to Railway, Render, or Heroku separately.

**Done!** 🎉

For detailed instructions, see `PRODUCTION_DEPLOYMENT.md`
