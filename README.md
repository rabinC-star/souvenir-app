# Souvenir App

A full-stack mobile/web application for uploading, printing, and managing souvenir photos with authentication and email notifications.

## Features

- 📸 **Image Upload & Capture**: Upload existing photos or capture new ones using device camera
- 🖨️ **Print Photo**: Send photos to connected printers
- 💾 **Local Storage**: Automatically save photos to device storage
- 🗑️ **Auto-Delete**: Automatically delete photos after successful printing
- 📧 **Email Notifications**: Send email with tracking number after printing
- 👤 **User Authentication**: Sign in with Google, Yahoo, or Microsoft accounts, or continue as Guest
- 📝 **User Info Collection**: Collect first name, last name, email, and location

## Tech Stack

### Frontend
- **Next.js 14** (React framework)
- **TypeScript** (type safety)
- **Tailwind CSS** (styling)
- **NextAuth.js** (authentication)
- **React Dropzone** (file uploads)
- **React Webcam** (camera capture)
- **Axios** (HTTP client)

### Backend
- **Node.js** with **Express**
- **Multer** (file upload handling)
- **SendGrid** (email service)
- **UUID** (tracking number generation)

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- SendGrid account (for email)
- OAuth credentials (Google, Microsoft, Yahoo)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   
   Create `.env` files in both `frontend/` and `backend/` directories (or use root `.env`):
   
   ```bash
   # Copy example file
   cp .env.example .env
   ```
   
   Fill in your credentials:
   - SendGrid API key
   - OAuth client IDs and secrets
   - NextAuth secret (generate with: `openssl rand -base64 32`)

3. **Start development servers:**
   ```bash
   npm run dev
   ```
   
   This starts both frontend (http://localhost:3000) and backend (http://localhost:5000)

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### Microsoft Azure AD
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add redirect URI: `http://localhost:3000/api/auth/callback/azure-ad`
4. Create client secret

#### Yahoo OAuth
1. Go to [Yahoo Developer Network](https://developer.yahoo.com/)
2. Create an application
3. Configure redirect URI: `http://localhost:3000/api/auth/callback/yahoo`

### SendGrid Setup
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Verify your sender email address
4. Add API key to `.env` file

## Usage

1. **Sign In**: Choose your preferred OAuth provider (Google, Microsoft, or Yahoo) OR click "Continue as Guest" to use the app without authentication
2. **Upload/Capture Photo**: Either drag & drop an image or use the camera button
3. **Fill User Info**: Enter your first name, last name, email, and location
4. **Upload**: Click "Upload Photo" to save the photo
5. **Print**: Click "Print Photo" to start the print job
6. **Check Email**: You'll receive an email with your tracking number

## Project Structure

```
SovernirApp/
├── frontend/           # Next.js frontend application
│   ├── app/           # Next.js app directory
│   ├── components/    # React components
│   └── package.json
├── backend/           # Express backend API
│   ├── server.js      # Main server file
│   ├── uploads/      # Uploaded photos (gitignored)
│   └── package.json
├── package.json       # Root package.json with scripts
└── README.md
```

## API Endpoints

### `POST /api/upload`
Upload a photo file
- Body: FormData with `photo` field
- Returns: File information

### `POST /api/print`
Start a print job
- Body: `{ filename, userInfo }`
- Returns: Tracking number and print job status

### `GET /api/print-job/:trackingNumber`
Get print job status
- Returns: Print job details

## Printer Integration

The current implementation simulates printing. For actual printer integration:

### Windows
```javascript
const printer = require('printer');
printer.printFile({
  filename: filePath,
  printer: 'printer-name',
  success: (jobID) => console.log('Printed:', jobID),
  error: (err) => console.error('Error:', err)
});
```

### Mac/Linux (CUPS)
Use system commands or CUPS API:
```bash
lp -d printer-name file.jpg
```

## Local Storage

Photos are saved to browser's `localStorage` and automatically deleted after successful printing. In production, consider using IndexedDB for larger files.

## Email Templates

Email notifications include:
- Personalized greeting
- Tracking number
- Order details
- Professional HTML template

## Security Notes

- Never commit `.env` files
- Use HTTPS in production
- Validate file uploads (size, type)
- Implement rate limiting
- Use secure session management

## Production Deployment

1. Set environment variables in your hosting platform
2. Build frontend: `cd frontend && npm run build`
3. Start backend: `cd backend && npm start`
4. Configure CORS for your domain
5. Set up SSL certificates
6. Configure OAuth redirect URIs for production domain

## License

MIT
