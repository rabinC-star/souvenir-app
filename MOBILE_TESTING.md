# Mobile Testing Guide

## 🌐 Access URLs for Mobile Testing

### Your Local Network IP Address
**192.168.1.236**

### Frontend URL (Mobile)
```
http://192.168.1.236:3000
```

### Backend API URL (Mobile)
```
http://192.168.1.236:5000
```

---

## 📱 How to Access on Mobile Device

### Prerequisites
1. **Both devices must be on the same Wi-Fi network**
   - Your computer (running the app)
   - Your mobile device

2. **Servers must be running**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

### Steps to Access

1. **Find your computer's IP address** (already found: `192.168.1.236`)

2. **On your mobile device:**
   - Open your mobile browser (Chrome, Safari, etc.)
   - Navigate to: `http://192.168.1.236:3000`
   - The app should load!

3. **If it doesn't work:**
   - Make sure both devices are on the same Wi-Fi network
   - Check firewall settings on your computer
   - Verify servers are running

---

## ⚙️ Configuration Updates Needed

### Update Frontend Environment Variable

You need to update the frontend `.env.local` file to use your network IP:

```env
NEXT_PUBLIC_API_URL=http://192.168.1.236:5000
```

**Current value:** `http://localhost:5000`  
**Change to:** `http://192.168.1.236:5000`

### Update Backend CORS (if needed)

The backend should already allow all origins, but verify in `backend/server.js`:

```javascript
app.use(cors()); // This allows all origins
```

---

## 🔧 Troubleshooting

### Issue: Can't connect from mobile

**Solution 1: Check Firewall**
- macOS: System Settings → Firewall → Allow incoming connections
- Or temporarily disable firewall for testing

**Solution 2: Verify IP Address**
```bash
# On your Mac, run:
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Solution 3: Check Server Binding**
- Next.js dev server should bind to `0.0.0.0` (all interfaces) by default
- Express server should listen on `0.0.0.0` or your IP

**Solution 4: Test Backend API**
- Try accessing from mobile: `http://192.168.1.236:5000/api/health`
- Should return: `{"status":"ok","message":"Server is running"}`

### Issue: OAuth redirects don't work

**Problem:** OAuth redirects are configured for `localhost`

**Solution:** For mobile testing, you may need to:
1. Use Guest mode instead of OAuth
2. Or configure OAuth redirect URIs for your network IP (not recommended for production)

---

## 📝 Quick Setup Checklist

- [ ] Both devices on same Wi-Fi network
- [ ] Servers running (`npm run dev`)
- [ ] Updated `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- [ ] Firewall allows connections
- [ ] Test backend: `http://192.168.1.236:5000/api/health`
- [ ] Test frontend: `http://192.168.1.236:3000`

---

## 🎯 Testing Features on Mobile

Once connected, you can test:
- ✅ Image upload (drag & drop won't work, but file picker will)
- ✅ Camera capture (requires camera permissions)
- ✅ Guest login
- ✅ Form filling
- ✅ Photo printing (simulated)
- ✅ Responsive design

---

## 🔒 Security Note

**Important:** These URLs are for local network testing only. Do not expose these to the public internet without proper security measures.

---

## 📱 Alternative: Use ngrok for External Access

If you want to test from outside your network:

1. Install ngrok: `brew install ngrok` (or download from ngrok.com)
2. Expose frontend: `ngrok http 3000`
3. Expose backend: `ngrok http 5000` (in another terminal)
4. Use ngrok URLs (e.g., `https://abc123.ngrok.io`)

**Note:** ngrok URLs change each time you restart (unless you have a paid plan).
