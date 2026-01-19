# Code Examples

Key code snippets demonstrating how each feature works.

## 1. Image Upload with Drag & Drop

```typescript
// frontend/components/ImageUpload.tsx
const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop: (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0])
    }
  },
  accept: {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
  },
  maxFiles: 1,
})
```

## 2. Camera Capture

```typescript
// frontend/app/page.tsx
const handleCapture = useCallback(() => {
  const imageSrc = webcamRef.current?.getScreenshot()
  if (imageSrc) {
    setPhoto(imageSrc)
    // Convert data URL to blob
    fetch(imageSrc)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' })
        setPhotoFile(file)
      })
  }
}, [])
```

## 3. File Upload to Backend

```typescript
// frontend/app/page.tsx
const handleUpload = async () => {
  const formData = new FormData()
  formData.append('photo', photoFile)

  const response = await axios.post(`${API_URL}/api/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  // Save to local storage
  localStorage.setItem('souvenir_photo', photo!)
  localStorage.setItem('souvenir_filename', response.data.file.filename)
}
```

## 4. Backend File Upload Handler

```javascript
// backend/server.js
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname))
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})
```

## 5. Print Job with Tracking Number

```javascript
// backend/server.js
app.post('/api/print', async (req, res) => {
  const { filename, userInfo } = req.body
  
  // Generate tracking number
  const trackingNumber = uuidv4().substring(0, 8).toUpperCase()
  
  // Create print job
  const printJob = {
    trackingNumber,
    filename,
    userInfo,
    status: 'printing',
    createdAt: new Date().toISOString()
  }
  
  // Print and delete file
  setTimeout(() => {
    printJob.status = 'completed'
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting file:', err)
    })
    sendEmailNotification(printJob)
  }, 2000)
})
```

## 6. Email Notification with SendGrid

```javascript
// backend/server.js
async function sendEmailNotification(printJob) {
  const { userInfo, trackingNumber } = printJob
  
  const msg = {
    to: userInfo.email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Your Souvenir is Ready! 🎉',
    html: `
      <h1>Your Souvenir is Ready!</h1>
      <p>Hi ${userInfo.firstName},</p>
      <p>Tracking Number: <strong>${trackingNumber}</strong></p>
      <p>Your order is ready for pickup!</p>
    `
  }
  
  await sgMail.send(msg)
}
```

## 7. OAuth Authentication Setup

```typescript
// frontend/app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID || '',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
      tenantId: process.env.AZURE_AD_TENANT_ID || '',
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
}
```

## 8. Protected Route with Authentication

```typescript
// frontend/app/page.tsx
export default function Home() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (!session) {
    return (
      <div>
        <button onClick={() => signIn('google')}>
          Sign in with Google
        </button>
      </div>
    )
  }
  
  // Protected content here
  return <div>Welcome, {session.user?.name}</div>
}
```

## 9. Local Storage Save/Delete

```typescript
// Save after upload
localStorage.setItem('souvenir_photo', photo!)
localStorage.setItem('souvenir_filename', filename)

// Delete after print
localStorage.removeItem('souvenir_photo')
localStorage.removeItem('souvenir_filename')
```

## 10. Printer Integration (Windows)

```javascript
// backend/printer-integration.js
const printer = require('printer')

function printWindows(filePath, printerName) {
  printer.printFile({
    filename: filePath,
    printer: printerName || printer.getPrinters()[0]?.name,
    success: (jobID) => {
      console.log(`Print job ${jobID} sent`)
    },
    error: (err) => {
      console.error('Print error:', err)
    }
  })
}
```

## 11. Printer Integration (Mac/Linux)

```javascript
// backend/printer-integration.js
const { exec } = require('child_process')

function printUnix(filePath, printerName) {
  return new Promise((resolve, reject) => {
    const printerFlag = printerName ? `-d ${printerName}` : ''
    const command = `lp ${printerFlag} "${filePath}"`
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve({ success: true, jobID: stdout.match(/request id is (\S+)/)?.[1] })
      }
    })
  })
}
```

## 12. User Info Form Component

```typescript
// frontend/components/UserInfoForm.tsx
const handleChange = (field: keyof UserInfo, value: string) => {
  onChange({
    ...userInfo,
    [field]: value,
  })
}

// Auto-fill email from session
useEffect(() => {
  if (defaultEmail && !userInfo.email) {
    handleChange('email', defaultEmail)
  }
}, [defaultEmail])
```

## 13. Print Button with Loading State

```typescript
// frontend/components/PrintButton.tsx
<button
  onClick={onPrint}
  disabled={isPrinting}
  className={isPrinting ? 'bg-gray-400' : 'bg-purple-500'}
>
  {isPrinting ? (
    <span>Printing...</span>
  ) : (
    '🖨️ Print Photo'
  )}
</button>
```

## 14. Error Handling Pattern

```typescript
// Frontend error handling
try {
  const response = await axios.post(`${API_URL}/api/print`, data)
  if (response.data.success) {
    // Success handling
  }
} catch (error) {
  console.error('Print error:', error)
  alert('Failed to print photo')
}
```

```javascript
// Backend error handling
app.post('/api/print', async (req, res) => {
  try {
    // Print logic
    res.json({ success: true, trackingNumber })
  } catch (error) {
    console.error('Print error:', error)
    res.status(500).json({ 
      error: 'Failed to print photo', 
      details: error.message 
    })
  }
})
```

## 15. Environment Variables Usage

```javascript
// Backend
require('dotenv').config()
const PORT = process.env.PORT || 5000
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
```

## 16. File Validation

```javascript
// Backend - Multer file filter
fileFilter: (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'))
  }
}
```

## 17. Tracking Number Generation

```javascript
// backend/server.js
const { v4: uuidv4 } = require('uuid')
const trackingNumber = uuidv4().substring(0, 8).toUpperCase()
// Example: "A3F9B2C1"
```

## 18. Auto-Delete After Print

```javascript
// backend/server.js
setTimeout(() => {
  printJob.status = 'completed'
  
  // Delete file from server
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err)
    } else {
      console.log(`File ${filename} deleted after printing`)
    }
  })
  
  // Send email notification
  sendEmailNotification(printJob)
}, 2000)
```

```typescript
// frontend/app/page.tsx
// Delete from local storage after successful print
localStorage.removeItem('souvenir_photo')
localStorage.removeItem('souvenir_filename')
```

## 19. Responsive Design with Tailwind

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <input className="w-full px-4 py-2 border rounded-lg" />
  <input className="w-full px-4 py-2 border rounded-lg" />
</div>
```

## 20. Webcam Modal

```tsx
{showWebcam && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={handleCapture}>Capture Photo</button>
    </div>
  </div>
)}
```
