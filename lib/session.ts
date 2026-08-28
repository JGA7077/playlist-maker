import { auth } from "./auth";

export interface ConnectedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export async function getConnectedUser(): Promise<ConnectedUser | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user as ConnectedUser;
}
