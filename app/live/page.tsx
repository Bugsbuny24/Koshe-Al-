import LiveClient from "@/components/live/LiveClient";

export default function LivePage() {
  return (
    <main className="min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl">
        <LiveClient />
      </div>
    </main>
  );
}
