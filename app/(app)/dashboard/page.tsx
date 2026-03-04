import Shell from "@/components/Shell";
import ChatClient from "@/components/chat/ChatClient";

export default function DashboardPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="glass p-6">
          <h2 className="text-xl font-semibold">Koshei Teacher — Chat</h2>
          <p className="mt-1 text-white/60 text-sm">
            Dil öğrenme sohbeti. Koshei hataları nazikçe düzeltir, 1 örnek verir, sonra soru sorar.
          </p>
          <div className="mt-6">
            <ChatClient />
          </div>
        </div>
      </div>
    </Shell>
  );
}
