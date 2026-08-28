import { headers } from "next/headers";
import { getToken } from "@auth/core/jwt";
import { auth } from "./auth";

const AUTH_SECRET = process.env.AUTH_SECRET;
const secureCookie = process.env.NODE_ENV === "production";
const COOKIE_NAME = secureCookie
  ? "__Secure-authjs.session-token"
  : "authjs.session-token";

interface SessionToken {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

async function getSessionToken(): Promise<SessionToken | null> {
  if (!AUTH_SECRET) {
    throw new Error("AUTH_SECRET não configurado.");
  }
  const headerStore = await headers();
  const req = new Request("http://localhost", { headers: headerStore });
  try {
    return (await getToken({
      req,
      secret: AUTH_SECRET,
      salt: COOKIE_NAME,
      secureCookie,
    })) as SessionToken | null;
  } catch (err) {
    console.error("Falha ao ler token da sessão:", err);
    return null;
  }
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; expiresAt: number } | null> {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Credenciais do Google não configuradas.");
  }
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok || !data?.access_token) {
    console.error("Falha ao renovar token do Google:", data);
    return null;
  }
  const expiresIn = data.expires_in as number;
  return {
    accessToken: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
}

export async function getYoutubeAccessToken(): Promise<{
  token: string;
  refreshed: boolean;
} | null> {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return null;
  }

  if (
    sessionToken.accessToken &&
    sessionToken.expiresAt &&
    sessionToken.expiresAt > Date.now() + 5 * 60 * 1000
  ) {
    return { token: sessionToken.accessToken, refreshed: false };
  }

  if (sessionToken.refreshToken) {
    const refreshed = await refreshAccessToken(sessionToken.refreshToken);
    if (refreshed) {
      return { token: refreshed.accessToken, refreshed: true };
    }
  }

  if (sessionToken.accessToken) {
    return { token: sessionToken.accessToken, refreshed: false };
  }

  return null;
}

export { getSessionToken, type SessionToken };

// Reexporta auth para conveniência
export { auth };
