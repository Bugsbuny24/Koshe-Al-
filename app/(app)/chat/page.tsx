'use client';

import { motion } from 'framer-motion';
import { IntakeChat } from '@/components/chat/IntakeChat';

export default function ChatPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center text-white font-bold shadow-lg shadow-accent-blue/30">
            K
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Koschei Chat</h1>
            <p className="text-slate-500 text-sm">
              İhtiyacını anlat — doğru akışa yönlendirelim
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-blue" />
            Intake → Analiz
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-green" />
            Planlama Motoru
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Teslim Yönetimi
          </div>
        </div>
      </motion.div>

      <IntakeChat />
    </div>
  );
}
