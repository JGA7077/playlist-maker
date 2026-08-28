"use client";

import { useRouter } from "next/navigation";
import { loginWithGoogle, logoutFromGoogle } from "@/app/actions/auth";
import { Button } from "./ui/Button";
import { useState } from "react";

interface ServiceConnectorProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function ServiceConnector({ user }: ServiceConnectorProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleLogin() {
    setPending(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setPending(false);
    }
  }

  async function handleLogout() {
    setPending(true);
    await logoutFromGoogle();
    router.refresh();
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name ?? "Usuário"}
              className="h-8 w-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {user.name ?? user.email}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={pending}>
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={handleLogin} size="sm" isLoading={pending}>
      <span className="text-base leading-none">▶</span> Conectar YouTube
    </Button>
  );
}
