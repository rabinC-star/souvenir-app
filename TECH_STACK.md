# Technology Stack

Complete overview of all technologies, frameworks, libraries, and tools used in the Souvenir App.

## 🎨 Frontend Technologies

### Core Framework
- **Next.js 14.0.4** - React framework with App Router
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes
  - File-based routing
  - Built-in optimizations

- **React 18.2.0** - JavaScript library for building user interfaces
  - Component-based architecture
  - Hooks (useState, useEffect, useCallback, useRef)
  - Client-side rendering

- **React DOM 18.2.0** - React renderer for web browsers

### Language & Type Safety
- **TypeScript 5** - Typed superset of JavaScript
  - Type safety
  - Better IDE support
  - Compile-time error checking

### Styling
- **Tailwind CSS 3.3.0** - Utility-first CSS framework
  - Responsive design utilities
  - Custom color schemes
  - Utility classes for rapid UI development

- **PostCSS 8** - CSS transformation tool
  - Processes Tailwind CSS
  - Autoprefixer integration

- **Autoprefixer 10.0.1** - Adds vendor prefixes to CSS

### Authentication
- **NextAuth.js 4.24.5** - Authentication library for Next.js
  - OAuth providers (Google, Microsoft, Yahoo)
  - Credentials provider (Guest mode)
  - Session management
  - JWT tokens
  - Secure cookie handling

### HTTP Client
- **Axios 1.6.2** - Promise-based HTTP client
  - API requests to backend
  - Request/response interceptors
  - Error handling

### File Handling
- **React Dropzone 14.2.3** - File upload component
  - Drag & drop interface
  - File validation
  - Multiple file type support

- **React Webcam 7.2.0** - Webcam component
  - Camera access
  - Photo capture
  - Screenshot functionality

### Development Tools
- **@types/node 20** - TypeScript definitions for Node.js
- **@types/react 18** - TypeScript definitions for React
- **@types/react-dom 18** - TypeScript definitions for React DOM

---

## ⚙️ Backend Technologies

### Runtime & Framework
- **Node.js** - JavaScript runtime environment
  - Event-driven architecture
  - Non-blocking I/O

- **Express.js 4.18.2** - Web application framework
  - RESTful API endpoints
  - Middleware support
  - Route handling
  - HTTP server

### File Upload
- **Multer 1.4.5-lts.1** - Middleware for handling multipart/form-data
  - File upload handling
  - File validation
  - Storage configuration
  - File size limits

### Email Service
- **@sendgrid/mail 8.1.0** - SendGrid email API client
  - Transactional emails
  - HTML email templates
  - Email delivery tracking

### Utilities
- **UUID 9.0.1** - Generate unique identifiers
  - Tracking number generation
  - Unique IDs for print jobs

- **JSON Web Token 9.0.2** - Token-based authentication
  - Secure token generation
  - Token verification

### Configuration
- **dotenv 16.3.1** - Environment variable management
  - Load .env files
  - Secure configuration management

### CORS
- **CORS 2.8.5** - Cross-Origin Resource Sharing middleware
  - Enable cross-origin requests
  - Configure allowed origins

### Development Tools
- **Nodemon 3.0.2** - Development utility
  - Auto-restart server on file changes
  - Development workflow improvement

---

## 🛠️ Development Tools & Scripts

### Process Management
- **Concurrently 8.2.2** - Run multiple commands concurrently
  - Run frontend and backend simultaneously
  - Unified development workflow

### Package Manager
- **npm** - Node Package Manager
  - Dependency management
  - Script execution
  - Package installation

---

## 🔐 Authentication Providers

### OAuth Providers
- **Google OAuth 2.0** - Google Sign-In integration
- **Microsoft Azure AD** - Microsoft account authentication
- **Yahoo OAuth** - Yahoo account authentication (custom provider)
- **Guest Mode** - Credentials-based guest authentication

---

## 📧 External Services

### Email Service
- **SendGrid** - Email delivery service
  - Transactional email API
  - Email templates
  - Delivery tracking

### OAuth Services
- **Google Cloud Console** - Google OAuth credentials
- **Microsoft Azure Portal** - Azure AD app registration
- **Yahoo Developer Network** - Yahoo OAuth credentials

---

## 💾 Storage & Data

### Client-Side Storage
- **localStorage** - Browser storage API
  - Store uploaded photos
  - Persist user data
  - Session data

### Server-Side Storage
- **File System (fs)** - Node.js file system module
  - Store uploaded files
  - File management
  - Temporary storage

### In-Memory Storage
- **Map Data Structure** - Store print jobs
  - Print job tracking
  - Status management

---

## 🌐 Protocols & Standards

### Web Standards
- **HTTP/HTTPS** - Hypertext Transfer Protocol
- **REST API** - Representational State Transfer
- **OAuth 2.0** - Authorization framework
- **JWT** - JSON Web Token standard
- **CORS** - Cross-Origin Resource Sharing

### File Formats
- **JPEG/JPG** - Image format
- **PNG** - Image format
- **GIF** - Image format
- **WebP** - Modern image format
- **FormData** - Multipart form data

---

## 📦 Project Structure

### Frontend Structure
```
frontend/
├── app/              # Next.js App Router
├── components/       # React components
├── types/           # TypeScript definitions
└── public/          # Static assets
```

### Backend Structure
```
backend/
├── server.js        # Express server
├── printer-integration.js  # Printer examples
└── uploads/         # Uploaded files
```

---

## 🔧 Build & Deployment Tools

### Build Tools
- **Next.js Build System** - Production builds
- **TypeScript Compiler** - Type checking and compilation
- **PostCSS** - CSS processing

### Development Server
- **Next.js Dev Server** - Hot reload development
- **Express Dev Server** - Backend development server

---

## 📱 Browser APIs Used

- **FileReader API** - Read file contents
- **Blob API** - Binary large object handling
- **FormData API** - Form data construction
- **localStorage API** - Client-side storage
- **MediaDevices API** - Camera access (via react-webcam)

---

## 🎯 Key Features by Technology

| Feature | Technology Used |
|---------|----------------|
| **UI Framework** | React + Next.js |
| **Styling** | Tailwind CSS |
| **Type Safety** | TypeScript |
| **Authentication** | NextAuth.js |
| **File Upload** | Multer + React Dropzone |
| **Camera Capture** | React Webcam |
| **Email** | SendGrid |
| **API Client** | Axios |
| **Unique IDs** | UUID |
| **Session Management** | NextAuth.js Sessions |
| **CORS** | CORS middleware |
| **Environment Config** | dotenv |

---

## 📊 Version Summary

### Frontend
- Next.js: 14.0.4
- React: 18.2.0
- TypeScript: 5.x
- Tailwind CSS: 3.3.0
- NextAuth: 4.24.5

### Backend
- Express: 4.18.2
- Node.js: 18+ (recommended)
- Multer: 1.4.5-lts.1
- SendGrid: 8.1.0
- UUID: 9.0.1

---

## 🚀 Deployment Considerations

### Frontend Deployment
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containers

### Backend Deployment
- **Heroku**
- **AWS EC2/Lambda**
- **DigitalOcean**
- **Railway**
- **Docker** containers

### Required Environment Variables
- API keys (SendGrid, OAuth)
- Database URLs (if added)
- Secret keys (NextAuth)
- CORS origins

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Express.js Documentation](https://expressjs.com)
- [SendGrid Documentation](https://docs.sendgrid.com)
