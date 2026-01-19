# Quick Start Guide

Get your Souvenir App up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- SendGrid account (free tier available)
- OAuth credentials (at least one: Google, Microsoft, or Yahoo)

## Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

Or use the convenience script:
```bash
npm run install:all
```

## Step 2: Set Up Environment Variables

### Backend (.env in root or backend/)
```env
PORT=5000
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your-verified-email@domain.com
```

### Frontend (.env.local in frontend/)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32

# At least one OAuth provider required
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Optional: Microsoft
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id

# Optional: Yahoo
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
YAHOO_REDIRECT_URI=http://localhost:3000/api/auth/callback/yahoo
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

## Step 3: Get OAuth Credentials

### Google (Easiest to set up)
1. Visit https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`

### SendGrid
1. Sign up at https://sendgrid.com/ (free tier: 100 emails/day)
2. Create API key
3. Verify sender email address

## Step 4: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

Or start separately:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

## Step 5: Access the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing the App

1. **Sign In**: Use one of the OAuth providers
2. **Upload Photo**: Drag & drop an image or click to select
3. **Fill Form**: Enter your details (email auto-fills from OAuth)
4. **Upload**: Click "Upload Photo" to save locally
5. **Print**: Click "Print Photo" to start print job
6. **Check Email**: You'll receive an email with tracking number

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env files if 3000 or 5000 are taken
```

### OAuth Redirect URI Mismatch
- Ensure redirect URI in OAuth provider matches exactly: `http://localhost:3000/api/auth/callback/[provider]`

### SendGrid Email Not Sending
- Verify sender email is verified in SendGrid
- Check API key is correct
- Check spam folder

### Printer Not Working
- See `backend/printer-integration.js` for platform-specific setup
- For testing, the app simulates printing (check console logs)

## Next Steps

- Configure actual printer integration (see `backend/printer-integration.js`)
- Set up production environment variables
- Deploy to hosting platform (Vercel, Heroku, etc.)
- Configure production OAuth redirect URIs

## Production Deployment

1. Set environment variables in hosting platform
2. Update OAuth redirect URIs to production domain
3. Build frontend: `cd frontend && npm run build`
4. Use HTTPS for OAuth callbacks
5. Configure CORS for your domain
