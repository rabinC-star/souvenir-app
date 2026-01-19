# Environment Variables Setup

Create a `.env` file in the root directory and `frontend/.env.local` with the following variables:

## Root `.env` (for backend)

```env
# Backend Environment Variables
PORT=5000
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

## Frontend `.env.local`

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here_generate_with_openssl_rand_base64_32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Microsoft Azure AD OAuth
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id

# Yahoo OAuth
YAHOO_CLIENT_ID=your_yahoo_client_id
YAHOO_CLIENT_SECRET=your_yahoo_client_secret
YAHOO_REDIRECT_URI=http://localhost:3000/api/auth/callback/yahoo
```

## Generating NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Getting OAuth Credentials

### Google OAuth
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

### Microsoft Azure AD
1. Go to https://portal.azure.com/
2. Azure Active Directory → App registrations → New registration
3. Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
4. Certificates & secrets → New client secret

### Yahoo OAuth
1. Go to https://developer.yahoo.com/
2. Create an application
3. Configure redirect URI: `http://localhost:3000/api/auth/callback/yahoo`

## SendGrid Setup
1. Sign up at https://sendgrid.com/
2. Create API key in Settings → API Keys
3. Verify sender email in Settings → Sender Authentication
