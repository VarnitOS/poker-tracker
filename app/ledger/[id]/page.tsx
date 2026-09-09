export default function LedgerSessionPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold">Session {params.id}</h1>
      <p className="mt-2 text-gray-400">Session view coming soon.</p>
    </main>
  );
}
