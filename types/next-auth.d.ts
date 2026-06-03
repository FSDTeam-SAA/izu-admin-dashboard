import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken?: string;
    role: string;
    user: {
      _id: string;
      name?: string | null;
      lastName?: string | null;
      email?: string | null;
      phone?: string | null;
      bio?: string | null;
      image?: string | null;
    };
  }

  interface User {
    _id: string;
    accessToken: string;
    refreshToken?: string;
    role: string;
    name?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    bio?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken?: string;
    role: string;
    _id: string;
    name?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    bio?: string | null;
    picture?: string | null;
  }
}
