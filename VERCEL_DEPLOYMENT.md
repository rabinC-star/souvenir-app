# Vercel Deployment Guide

## Common Deployment Issues & Solutions

### 1. Build Configuration

If deploying from the root directory, Vercel needs to know where your frontend is:

**Option A: Deploy from `frontend` directory**
- Set Root Directory in Vercel project settings to: `frontend`
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Option B: Use vercel.json (already created)**
- The `vercel.json` file configures the build from root directory

### 2. Environment Variables

Make sure to add these in Vercel Dashboard → Settings → Environment Variables:

**Required:**
```
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret_here
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

**OAuth (at least one):**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OR

AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id

# OR

YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
YAHOO_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback/yahoo
```

### 3. Common Errors

#### Error: "Module not found"
- **Solution**: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

#### Error: "Cannot find module 'next-auth'"
- **Solution**: Check that `next-auth` is in dependencies (not devDependencies)

#### Error: "Route handler export error"
- **Solution**: Already fixed - `authOptions` is not exported, only GET/POST handlers

#### Error: "Environment variable not found"
- **Solution**: Add all required env vars in Vercel dashboard
- Make sure `NEXT_PUBLIC_*` vars are set for client-side access

### 4. Backend Deployment

Your backend needs to be deployed separately (not on Vercel):
- Deploy backend to: Railway, Render, Heroku, or AWS
- Update `NEXT_PUBLIC_API_URL` to your backend URL
- Ensure CORS is configured on backend for your Vercel domain

### 5. OAuth Redirect URIs

Update OAuth provider redirect URIs:
- Google: `https://your-app.vercel.app/api/auth/callback/google`
- Microsoft: `https://your-app.vercel.app/api/auth/callback/azure-ad`
- Yahoo: `https://your-app.vercel.app/api/auth/callback/yahoo`

### 6. Build Settings in Vercel

If deploying from root:
- **Root Directory**: Leave empty or set to project root
- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/.next`
- **Install Command**: `cd frontend && npm install`

If deploying from frontend folder:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 7. TypeScript Errors

If you get TypeScript errors:
- Ensure `tsconfig.json` is in the frontend directory
- Check that all types are properly defined
- Run `npm run build` locally first to catch errors

### 8. Next.js Version Issues

If you see Next.js version warnings:
- Update Next.js: `npm install next@latest` in frontend directory
- Check compatibility with NextAuth version

## Quick Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] OAuth redirect URIs updated
- [ ] Backend deployed and accessible
- [ ] `NEXT_PUBLIC_API_URL` points to backend
- [ ] Build passes locally (`cd frontend && npm run build`)
- [ ] No TypeScript errors
- [ ] Root directory configured correctly in Vercel

## Testing Deployment

1. Deploy to Vercel
2. Check build logs for errors
3. Test authentication (OAuth and Guest)
4. Test photo upload
5. Verify API calls to backend work

## Need Help?

Check Vercel build logs for specific error messages. Common issues are usually:
- Missing environment variables
- Incorrect build configuration
- TypeScript/compilation errors
- Missing dependencies
