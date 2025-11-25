/**
 * Authentication library for Intranet
 *
 * Handles authentication against Strapi users-permissions plugin
 * and session management via httpOnly cookies.
 */

import { cookies } from 'next/headers';
import * as jose from 'jose';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const JWT_SECRET = process.env.STRAPI_JWT_SECRET || 'toBeModifiedJwtSecret';
const COOKIE_NAME = 'intranet-session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface StrapiUser {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  jwt: string;
  user: StrapiUser;
}

interface LoginResponse {
  jwt: string;
  user: StrapiUser;
}

interface StrapiError {
  data: null;
  error: {
    status: number;
    name: string;
    message: string;
  };
}

/**
 * Authenticate user against Strapi
 */
export async function login(
  identifier: string,
  password: string
): Promise<{ success: true; user: StrapiUser } | { success: false; error: string }> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as StrapiError;
      return {
        success: false,
        error: error.error?.message || 'Authentication failed',
      };
    }

    const loginData = data as LoginResponse;

    // Store JWT in httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, loginData.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: COOKIE_MAX_AGE,
    });

    return { success: true, user: loginData.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Connection error' };
  }
}

/**
 * Clear the authentication cookie
 */
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get the current session from cookie
 * Returns null if not authenticated or token is invalid
 */
export async function getSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token?.value) {
      return null;
    }

    // Verify JWT signature
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token.value, secret);

    // Fetch user info from Strapi using the JWT
    const response = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as StrapiUser;

    return {
      jwt: token.value,
      user,
    };
  } catch (error) {
    // Token verification failed or other error
    console.error('Session verification error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (lightweight check without fetching user data)
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME);

    if (!token?.value) {
      return false;
    }

    // Verify JWT signature only
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jose.jwtVerify(token.value, secret);

    return true;
  } catch {
    return false;
  }
}
