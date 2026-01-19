const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Store print jobs in memory (in production, use a database)
const printJobs = new Map();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Upload photo endpoint
app.post('/api/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      file: fileInfo,
      message: 'Photo uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload photo', details: error.message });
  }
});

// Print photo endpoint
app.post('/api/print', async (req, res) => {
  try {
    const { filename, userInfo } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    const filePath = path.join(uploadsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Generate tracking number
    const trackingNumber = uuidv4().substring(0, 8).toUpperCase();
    
    // Create print job
    const printJob = {
      trackingNumber,
      filename,
      userInfo,
      status: 'printing',
      createdAt: new Date().toISOString()
    };
    
    printJobs.set(trackingNumber, printJob);

    // Print the photo
    // Option 1: Simulate printing (for testing)
    console.log(`Printing ${filename}...`);
    
    // Option 2: Use actual printer integration (uncomment to enable)
    // const { printPhoto } = require('./printer-integration');
    // try {
    //   await printPhoto(filePath, { printerName: process.env.PRINTER_NAME });
    // } catch (printError) {
    //   console.error('Physical print error:', printError);
    //   // Continue with email notification even if print fails
    // }
    
    // Simulate print delay (remove in production if using actual printer)
    setTimeout(() => {
      printJob.status = 'completed';
      printJob.completedAt = new Date().toISOString();
      
      // Delete file after successful print
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log(`File ${filename} deleted after printing`);
        }
      });

      // Send email notification
      sendEmailNotification(printJob);
    }, 2000);

    res.json({
      success: true,
      trackingNumber,
      message: 'Print job started',
      printJob
    });
  } catch (error) {
    console.error('Print error:', error);
    res.status(500).json({ error: 'Failed to print photo', details: error.message });
  }
});

// Send email notification
async function sendEmailNotification(printJob) {
  try {
    const { userInfo, trackingNumber } = printJob;
    
    const msg = {
      to: userInfo.email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@souvenirapp.com',
      subject: 'Your Souvenir is Ready! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .tracking-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .tracking-number { font-size: 24px; font-weight: bold; color: #667eea; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Your Souvenir is Ready! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi ${userInfo.firstName},</p>
              <p>Great news! Your souvenir photo has been successfully printed and is ready for pickup.</p>
              
              <div class="tracking-box">
                <p><strong>Tracking Number:</strong></p>
                <p class="tracking-number">${trackingNumber}</p>
              </div>
              
              <p>Your order details:</p>
              <ul>
                <li><strong>Name:</strong> ${userInfo.firstName} ${userInfo.lastName}</li>
                <li><strong>Location:</strong> ${userInfo.location}</li>
                <li><strong>Status:</strong> Ready for pickup</li>
              </ul>
              
              <p>Please present your tracking number when picking up your souvenir.</p>
              
              <p>Thank you for using Souvenir App!</p>
              
              <p>Best regards,<br>The Souvenir App Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hi ${userInfo.firstName},
        
        Great news! Your souvenir photo has been successfully printed and is ready for pickup.
        
        Tracking Number: ${trackingNumber}
        
        Order Details:
        - Name: ${userInfo.firstName} ${userInfo.lastName}
        - Location: ${userInfo.location}
        - Status: Ready for pickup
        
        Please present your tracking number when picking up your souvenir.
        
        Thank you for using Souvenir App!
        
        Best regards,
        The Souvenir App Team
      `
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${userInfo.email} for tracking ${trackingNumber}`);
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
  }
}

// Get print job status
app.get('/api/print-job/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const printJob = printJobs.get(trackingNumber);
  
  if (!printJob) {
    return res.status(404).json({ error: 'Print job not found' });
  }
  
  res.json({ success: true, printJob });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Server accessible on network at http://192.168.1.236:${PORT}`);
});
