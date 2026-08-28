"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { loginWithGoogle } from "@/app/actions/auth";
import { Button } from "@/app/components/ui/Button";

function ConnectContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
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

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-8 px-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <span className="text-6xl text-[#A238FF]">▶</span>
        <h1 className="text-3xl font-bold">Conecte sua conta do YouTube</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Entre com sua conta do Google para criar e salvar playlists
          diretamente no seu YouTube.
        </p>
      </div>

      {error && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error === "denied" &&
            "Você não autorizou o acesso. Tente novamente."}
          {error === "config" &&
            "Configuração incompleta. Verifique as variáveis de ambiente."}
          {error === "unknown" &&
            "Ocorreu um erro inesperado. Tente novamente."}
        </div>
      )}

      <Button onClick={handleLogin} size="lg" isLoading={pending}>
        <span className="text-lg leading-none">▶</span> Conectar com YouTube
      </Button>

      <p className="text-xs text-zinc-500">
        Ao conectar, você autoriza este aplicativo a criar playlists na sua
        conta do YouTube. As credenciais são armazenadas com segurança no seu
        navegador. Você poderá exportar suas playlists para outros serviços
        futuramente.
      </p>
    </div>
  );
}

export default function ConnectForm() {
  return (
    <Suspense fallback={null}>
      <ConnectContent />
    </Suspense>
  );
}
