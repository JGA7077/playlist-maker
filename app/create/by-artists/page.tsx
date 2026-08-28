import BandSearchPanel from "@/app/components/BandSearchPanel";

export default function ByArtistsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-40 pt-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Buscar por bandas</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Digite uma ou mais bandas (separadas por vírgula) e informe quantas
          músicas de cada uma deseja.
        </p>
      </div>

      <BandSearchPanel />
    </div>
  );
}
