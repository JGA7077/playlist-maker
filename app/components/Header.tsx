import Link from "next/link";
import { getConnectedUser } from "@/lib/session";
import ServiceConnector from "./ServiceConnector";

export default async function Header() {
  const user = await getConnectedUser();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#A238FF]">♪</span> Playlist Maker
        </Link>
        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/create"
              className="hidden sm:inline text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-[#A238FF]"
            >
              Criar playlist
            </Link>
          )}
          <ServiceConnector user={user} />
        </div>
      </div>
    </header>
  );
}
