import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-12 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Poker Tracker</h1>
        <p className="mt-2 text-gray-400">Two tools. One app.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link
          href="/tracker"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-8 transition-colors hover:border-green-500"
        >
          <span className="text-2xl">📈</span>
          <h2 className="text-xl font-semibold">Stat Tracker</h2>
          <p className="text-sm text-gray-400">
            Log your cash game sessions. Track lifetime profit, hourly rate, and win rate with charts.
          </p>
        </Link>

        <Link
          href="/ledger"
          className="group flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-900 p-8 transition-colors hover:border-blue-500"
        >
          <span className="text-2xl">🏦</span>
          <h2 className="text-xl font-semibold">Buy-In Ledger</h2>
          <p className="text-sm text-gray-400">
            Track buy-ins at the table. Settle up at the end with a shareable summary link.
          </p>
        </Link>
      </div>
    </main>
  );
}
