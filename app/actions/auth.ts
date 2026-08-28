"use server";

import { signIn, signOut } from "@/lib/auth";

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/create" });
}

export async function logoutFromGoogle() {
  await signOut({ redirectTo: "/" });
}
