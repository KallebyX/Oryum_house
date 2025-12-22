import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Token expiration buffer (refresh 5 minutes before expiry)
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes in ms
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes in ms

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data: RefreshTokenResponse = await response.json();

    return {
      ...token,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + ACCESS_TOKEN_LIFETIME,
      error: undefined,
    };
  } catch (error) {
    console.error('Token refresh error:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

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
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME;
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
            token.accessTokenExpires = Date.now() + ACCESS_TOKEN_LIFETIME;
          }
        } catch (error) {
          console.error('OAuth backend integration error:', error);
        }
      }

      // Token refresh logic
      const accessTokenExpires = token.accessTokenExpires as number | undefined;

      // Return existing token if it's still valid
      if (accessTokenExpires && Date.now() < accessTokenExpires - TOKEN_REFRESH_BUFFER) {
        return token;
      }

      // Token is expired or about to expire, refresh it
      if (token.refreshToken) {
        return refreshAccessToken(token);
      }

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
        session.error = token.error as string | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
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
