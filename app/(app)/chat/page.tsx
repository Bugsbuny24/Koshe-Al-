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
            <h1 className="text-2xl font-black text-white">Koschei</h1>
            <p className="text-slate-500 text-sm">
              İhtiyacını anlat — seni doğru akışa yönlendirelim
            </p>
          </div>
        </div>
      </motion.div>

      <IntakeChat />
    </div>
  );
}
