export function LeaderboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="rounded-card bg-surface p-8">
        <h1 className="m-0 mb-2 font-display text-2xl font-bold text-text">Ranking global</h1>
        <p className="m-0 text-sm text-text-secondary">Fase 6: tabla de posiciones leída desde Supabase.</p>
      </div>
    </main>
  )
}
