'use client';
import { AIBuilder } from '@/components/build/AIBuilder';

export default function BuildPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Builder</h1>
        <p className="text-[#8A8680]">AI ile uygulama ve web sitesi oluştur</p>
      </div>
      <AIBuilder />
    </div>
  );
}
