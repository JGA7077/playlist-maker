import Link from "next/link";
import { getConnectedUser } from "../lib/session";

export default async function Home() {
  const user = await getConnectedUser();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center gap-8 px-4 text-center">
      <span className="text-7xl text-[#A238FF]">♪</span>
      <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">
        Crie playlists incríveis no seu YouTube
      </h1>
      <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
        Busque suas bandas, gêneros e álbuns favoritos, monte a playlist perfeita
        e salve diretamente no seu YouTube.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {user ? (
          <Link
            href="/create"
            className="rounded-xl bg-[#A238FF] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#8f2ce6]"
          >
            Criar playlist
          </Link>
        ) : (
          <Link
            href="/connect"
            className="rounded-xl bg-[#A238FF] px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-[#8f2ce6]"
          >
            Conectar YouTube
          </Link>
        )}
      </div>

      <div className="mt-6 grid w-full gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-left">
          <span className="text-2xl">♪</span>
          <h3 className="mt-2 font-semibold">Por bandas</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Escolha bandas e quantas músicas de cada.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-left">
          <span className="text-2xl">🎙</span>
          <h3 className="mt-2 font-semibold">Por gênero</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Descubra as bandas mais ouvidas do estilo.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-left">
          <span className="text-2xl">💿</span>
          <h3 className="mt-2 font-semibold">Por álbuns</h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Monte playlists a partir de álbuns.
          </p>
        </div>
      </div>
    </div>
  );
}
