import Link from "next/link";

const modes = [
  {
    href: "/create/by-artists",
    title: "Por bandas",
    description:
      "Informe as bandas e quantas músicas de cada uma deseja. Buscamos as mais tocadas de cada uma.",
    icon: "♪",
    color: "from-purple-500 to-fuchsia-600",
  },
  {
    href: "/create/by-genre",
    title: "Por gênero",
    description:
      "Escolha um estilo musical, veja as bandas mais ouvidas e selecione quais quer na playlist.",
    icon: "🎙",
    color: "from-blue-500 to-cyan-600",
  },
  {
    href: "/create/by-albums",
    title: "Por álbuns",
    description:
      "Busque por uma banda e escolha álbuns, ordenados pelos mais ouvidos ou por lançamento.",
    icon: "💿",
    color: "from-emerald-500 to-teal-600",
  },
];

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">Criar playlist</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Escolha um dos modos de busca para montar sua playlist.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {modes.map((mode) => (
          <Link
            key={mode.href}
            href={mode.href}
            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-shadow hover:shadow-lg"
          >
            <span
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${mode.color} text-2xl text-white`}
            >
              {mode.icon}
            </span>
            <h2 className="mb-2 text-lg font-bold group-hover:text-[#A238FF]">
              {mode.title}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {mode.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
