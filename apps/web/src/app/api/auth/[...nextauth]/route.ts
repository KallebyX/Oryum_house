import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: '[email protected]',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Call backend API to authenticate
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Authentication failed');
          }

          const data = await response.json();

          // Return user object that will be stored in the JWT
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            avatarUrl: data.user.avatarUrl,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
    // Optional Google OAuth provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/dashboard',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.avatarUrl = user.avatarUrl;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // OAuth sign in (Google)
      if (account?.provider === 'google') {
        try {
          // Register or login via backend OAuth endpoint
          const response = await fetch(`${API_URL}/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              email: user.email,
              name: user.name,
              avatarUrl: user.image,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.id = data.user.id;
            token.role = data.user.role;
            token.accessToken = data.accessToken;
            token.refreshToken = data.refreshToken;
          }
        } catch (error) {
          console.error('OAuth backend integration error:', error);
        }
      }

      // TODO: Implement token refresh logic here
      // Check if token is expired and refresh using refreshToken

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.avatarUrl = token.avatarUrl as string;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', { user: user.email, account: account?.provider });
    },
    async signOut({ token }) {
      console.log('User signed out:', token.email);
    },
    async session({ session }) {
      // Update last login time in backend
      if (session.accessToken) {
        try {
          await fetch(`${API_URL}/users/me/last-login`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
        } catch (error) {
          console.error('Failed to update last login:', error);
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
