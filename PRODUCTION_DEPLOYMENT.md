# Production Deployment Guide

Complete guide for deploying Souvenir App to Vercel (Frontend) and a backend hosting service.

## 📋 Pre-Deployment Checklist

- [ ] All code committed to Git
- [ ] Environment variables documented
- [ ] Backend deployed separately
- [ ] OAuth redirect URIs configured
- [ ] SendGrid API key ready
- [ ] Domain configured (optional)

---

## 🚀 Frontend Deployment (Vercel)

### Step 1: Prepare Your Repository

1. **Ensure your project structure:**
   ```
   SovernirApp/
   ├── frontend/          # Next.js app
   ├── backend/           # Express API (deploy separately)
   └── vercel.json        # Vercel config
   ```

2. **Push to GitHub/GitLab/Bitbucket**

### Step 2: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. **Configure Project Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` ⚠️ **IMPORTANT**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

#### Option B: Vercel CLI

```bash
cd frontend
npm install -g vercel
vercel
```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

#### Required Variables:
```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_generated_secret_here
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### OAuth Variables (at least one provider):
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OR Microsoft Azure AD
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id

# OR Yahoo OAuth
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
YAHOO_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback/yahoo
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Update OAuth Redirect URIs

Update your OAuth provider settings:

- **Google:** `https://your-app.vercel.app/api/auth/callback/google`
- **Microsoft:** `https://your-app.vercel.app/api/auth/callback/azure-ad`
- **Yahoo:** `https://your-app.vercel.app/api/auth/callback/yahoo`

### Step 5: Deploy

1. Click **"Deploy"** in Vercel
2. Wait for build to complete
3. Check deployment logs for errors
4. Visit your deployed app!

---

## 🔧 Backend Deployment

The backend needs to be deployed separately. Recommended platforms:

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select your backend folder
4. Add environment variables:
   ```bash
   PORT=5000
   SENDGRID_API_KEY=your_sendgrid_key
   SENDGRID_FROM_EMAIL=your-email@domain.com
   ```
5. Railway auto-deploys on push

### Option 2: Render

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables

### Option 3: Heroku

```bash
cd backend
heroku create your-app-backend
heroku config:set SENDGRID_API_KEY=your_key
heroku config:set SENDGRID_FROM_EMAIL=your-email@domain.com
git push heroku main
```

### Option 4: AWS/DigitalOcean

Deploy as a Node.js application with PM2 or Docker.

---

## 🔐 Environment Variables Summary

### Frontend (Vercel)
```bash
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_API_URL=https://your-backend-url.com
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Backend (Railway/Render/etc.)
```bash
PORT=5000
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend accessible at Vercel URL
- [ ] Backend accessible and responding
- [ ] OAuth login works
- [ ] Guest login works
- [ ] Photo upload works
- [ ] Email notifications sent
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Vercel)

---

## 🐛 Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check `frontend/package.json` has all dependencies
- Ensure Root Directory is set to `frontend` in Vercel

**Error: "Environment variable not found"**
- Add all required env vars in Vercel Dashboard
- Redeploy after adding variables

**Error: "Route handler export error"**
- Already fixed in code
- Ensure you're using latest code

### Runtime Errors

**OAuth not working:**
- Check redirect URIs match exactly
- Verify environment variables are set
- Check OAuth provider console for errors

**API calls failing:**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend CORS allows your Vercel domain
- Test backend health endpoint

**Images not loading:**
- Check `next.config.js` image domains
- Verify image URLs are accessible

---

## 📊 Monitoring

### Vercel Analytics
- Enable in Vercel Dashboard
- Monitor performance and errors

### Error Tracking
- Consider adding Sentry or similar
- Monitor API errors

---

## 🔄 Continuous Deployment

Vercel automatically deploys on:
- Push to main branch
- Pull request creation
- Manual deployment trigger

---

## 📝 Production Optimizations Applied

✅ Next.js 14.2.0 (latest stable)
✅ SWC minification enabled
✅ Image optimization (AVIF, WebP)
✅ Console removal in production
✅ Security headers
✅ Error boundaries
✅ Loading states
✅ 404 page
✅ Environment validation

---

## 🆘 Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify all environment variables
4. Test backend API separately
5. Review deployment guide

---

## 🎉 Success!

Once deployed, your app will be available at:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend-url.com`

Happy deploying! 🚀
