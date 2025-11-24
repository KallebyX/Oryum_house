import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * Extended user session
   */
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      avatarUrl?: string;
    };
    accessToken: string;
  }

  /**
   * Extended user object returned from authorize()
   */
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT token
   */
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
    accessToken: string;
    refreshToken: string;
  }
}
