/**
 * Environment variable validation and access
 * Ensures required env vars are present in production
 */

const requiredEnvVars = {
  development: ['NEXTAUTH_SECRET'],
  production: ['NEXTAUTH_SECRET', 'NEXTAUTH_URL'],
} as const

export function validateEnv() {
  const env = process.env.NODE_ENV || 'development'
  const required = requiredEnvVars[env as keyof typeof requiredEnvVars] || []

  const missing: string[] = []

  for (const varName of required) {
    if (!process.env[varName]) {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`)
    if (env === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
    }
  }
}

// Validate on module load (only in production)
if (process.env.NODE_ENV === 'production') {
  validateEnv()
}

export const env = {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID || '',
  AZURE_AD_CLIENT_SECRET: process.env.AZURE_AD_CLIENT_SECRET || '',
  AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID || '',
  YAHOO_CLIENT_ID: process.env.YAHOO_CLIENT_ID || '',
  YAHOO_CLIENT_SECRET: process.env.YAHOO_CLIENT_SECRET || '',
  YAHOO_REDIRECT_URI: process.env.YAHOO_REDIRECT_URI || '',
}
