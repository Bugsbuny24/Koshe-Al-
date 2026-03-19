export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profil</h1>
        <p className="text-[#8A8680]">Sertifikalar, rozetler ve koleksiyonlar</p>
      </div>

      <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[rgba(240,165,0,0.2)] flex items-center justify-center text-2xl">
            🪐
          </div>
          <div>
            <div className="font-semibold">Pioneer</div>
            <div className="text-sm text-[#8A8680]">@pioneer</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Sertifikalar</h2>
        <div className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-8 text-center text-[#8A8680]">
          Henüz sertifika yok. Bir kursu tamamla!
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Başarılar</h2>
        <div className="grid grid-cols-4 gap-3">
          {['🌟', '🏆', '🎯', '🔥'].map((badge, i) => (
            <div
              key={i}
              className="rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4 text-center opacity-30"
            >
              <div className="text-3xl">{badge}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
