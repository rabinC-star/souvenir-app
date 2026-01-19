# Troubleshooting: "Couldn't Connect to Server" Error

## ✅ Quick Fixes

### 1. Restart Both Servers

The frontend needs to be restarted to pick up the new environment variable:

```bash
# Stop the current servers (Ctrl+C in terminal)
# Then restart:
cd /Users/sonofgod/SovernirApp
npm run dev
```

### 2. Verify Environment Variable

Check that the frontend `.env.local` has the correct API URL:

```bash
cd frontend
cat .env.local | grep NEXT_PUBLIC_API_URL
```

Should show: `NEXT_PUBLIC_API_URL=http://192.168.1.236:5000`

### 3. Test Backend from Mobile

On your mobile browser, try:
```
http://192.168.1.236:5000/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### 4. Test Frontend from Mobile

On your mobile browser, try:
```
http://192.168.1.236:3000
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Couldn't Connect to Server" on Mobile

**Possible Causes:**
- Frontend not restarted after env change
- Wrong IP address
- Devices on different networks
- Firewall blocking (though yours is disabled)

**Solutions:**

1. **Restart Frontend Server:**
   ```bash
   # Kill current process
   # Then restart:
   cd /Users/sonofgod/SovernirApp
   npm run dev
   ```

2. **Verify IP Address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Should show: `192.168.1.236`

3. **Check Network:**
   - Both devices must be on the same Wi-Fi network
   - Try disconnecting and reconnecting mobile to Wi-Fi

4. **Test Directly:**
   - Open mobile browser
   - Go to: `http://192.168.1.236:3000`
   - If page loads but API calls fail, it's a CORS/API issue

---

### Issue 2: Frontend Loads but API Calls Fail

**Symptom:** Page loads but shows errors when uploading/printing

**Solution:** Check browser console on mobile:
1. Open mobile browser developer tools (if available)
2. Or check Network tab
3. Look for failed requests to `http://192.168.1.236:5000`

**Fix:** Ensure backend CORS allows your mobile IP:
```javascript
// In backend/server.js, verify:
app.use(cors()); // This should allow all origins
```

---

### Issue 3: "Network Error" or "Connection Refused"

**Check:**
1. Are servers running?
   ```bash
   lsof -i :3000 -i :5000
   ```

2. Can you access from computer?
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000/api/health`

3. Can you access from network IP?
   - Frontend: `http://192.168.1.236:3000`
   - Backend: `http://192.168.1.236:5000/api/health`

---

### Issue 4: IP Address Changed

If your computer's IP changed:

1. **Find New IP:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Update Frontend .env.local:**
   ```bash
   cd frontend
   # Edit .env.local and change:
   NEXT_PUBLIC_API_URL=http://YOUR_NEW_IP:5000
   ```

3. **Restart Frontend:**
   ```bash
   npm run dev
   ```

---

## 🧪 Step-by-Step Testing

### Test 1: Backend Health Check
```bash
# From your computer:
curl http://192.168.1.236:5000/api/health
# Should return: {"status":"ok","message":"Server is running"}
```

### Test 2: Frontend Access
```bash
# From your computer:
curl http://192.168.1.236:3000
# Should return HTML
```

### Test 3: Mobile Backend
- Open mobile browser
- Go to: `http://192.168.1.236:5000/api/health`
- Should see JSON response

### Test 4: Mobile Frontend
- Open mobile browser
- Go to: `http://192.168.1.236:3000`
- Should see the app

---

## 🔧 Advanced Troubleshooting

### Check Server Logs

**Backend logs:**
- Should show: `Server running on http://localhost:5000`
- Should show: `Server accessible on network at http://192.168.1.236:5000`

**Frontend logs:**
- Should show: `Ready on http://0.0.0.0:3000` or similar

### Check Port Binding

```bash
# Check what's listening:
lsof -i :3000 -i :5000

# Should show:
# node ... TCP *:3000 (LISTEN)
# node ... TCP *:5000 (LISTEN)
```

### Check Firewall (macOS)

```bash
# Check firewall status:
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# If enabled, allow Node.js:
# System Settings → Network → Firewall → Options → Add Node
```

---

## 📱 Mobile-Specific Issues

### Issue: Mobile Browser Shows "Can't Connect"

**Try:**
1. Clear mobile browser cache
2. Try different browser (Chrome, Safari)
3. Check mobile Wi-Fi connection
4. Verify mobile is on same network

### Issue: OAuth Doesn't Work on Mobile

**Note:** OAuth redirects are configured for localhost. For mobile testing:
- Use **Guest Mode** instead of OAuth
- Or configure OAuth for network IP (not recommended)

---

## ✅ Verification Checklist

- [ ] Both devices on same Wi-Fi network
- [ ] Servers restarted after env change
- [ ] Backend accessible: `http://192.168.1.236:5000/api/health`
- [ ] Frontend accessible: `http://192.168.1.236:3000`
- [ ] Frontend `.env.local` has correct API URL
- [ ] No firewall blocking connections
- [ ] IP address hasn't changed

---

## 🆘 Still Not Working?

1. **Try ngrok** (external access):
   ```bash
   # Install: brew install ngrok
   ngrok http 3000
   # Use the ngrok URL on mobile
   ```

2. **Check router settings:**
   - Some routers block device-to-device communication
   - Check "AP Isolation" or "Client Isolation" settings

3. **Use USB debugging** (Android):
   - Connect phone via USB
   - Use Chrome DevTools port forwarding

4. **Check mobile network:**
   - Ensure mobile is on Wi-Fi, not cellular
   - Try forgetting and rejoining Wi-Fi network

---

## 📞 Quick Reference

**Your Current Setup:**
- IP Address: `192.168.1.236`
- Frontend: `http://192.168.1.236:3000`
- Backend: `http://192.168.1.236:5000`
- Firewall: Disabled ✅

**Next Steps:**
1. Restart servers
2. Test backend from mobile
3. Test frontend from mobile
4. Check browser console for errors
