import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
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
    // Yahoo OAuth (custom provider)
    {
      id: 'yahoo',
      name: 'Yahoo',
      type: 'oauth',
      authorization: {
        url: 'https://api.login.yahoo.com/oauth2/request_auth',
        params: {
          client_id: process.env.YAHOO_CLIENT_ID,
          redirect_uri: process.env.YAHOO_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/yahoo',
          response_type: 'code',
          language: 'en-us',
        },
      },
      token: 'https://api.login.yahoo.com/oauth2/get_token',
      userinfo: 'https://api.login.yahoo.com/openid/v1/userinfo',
      clientId: process.env.YAHOO_CLIENT_ID,
      clientSecret: process.env.YAHOO_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    },
    // Guest login provider
    CredentialsProvider({
      id: 'guest',
      name: 'Guest',
      credentials: {},
      async authorize() {
        // Create a guest user object
        return {
          id: 'guest-' + Date.now(),
          name: 'Guest User',
          email: null,
          image: null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      if (account) {
        token.accessToken = account.access_token
      }
      // Mark guest sessions
      if (user && user.id?.startsWith('guest-')) {
        token.isGuest = true
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.isGuest = token.isGuest as boolean
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
