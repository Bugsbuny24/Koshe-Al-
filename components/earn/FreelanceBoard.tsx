'use client';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';

interface FreelanceJob {
  id: string;
  title: string;
  budget_pi: number;
  category: string;
  status: string;
}

const MOCK_JOBS: FreelanceJob[] = [
  { id: '1', title: 'Pi Network için Landing Page', budget_pi: 10, category: 'Web', status: 'open' },
  { id: '2', title: 'React Native Uygulama Geliştirme', budget_pi: 50, category: 'Mobile', status: 'open' },
  { id: '3', title: 'AI Chatbot Entegrasyonu', budget_pi: 25, category: 'AI', status: 'open' },
];

export function FreelanceBoard() {
  const [jobs] = useState<FreelanceJob[]>(MOCK_JOBS);

  return (
    <div>
      <h2 className="font-semibold mb-4">Freelance İlanlar</h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="flex items-center justify-between rounded-xl border border-[rgba(240,165,0,0.12)] bg-[#111116] p-4 hover:bg-[#16161E] transition-colors"
          >
            <div>
              <div className="font-medium">{job.title}</div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="default">{job.category}</Badge>
                <Badge variant="green">{job.status}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#F0A500]">{job.budget_pi} Pi</div>
              <button className="mt-1 text-xs text-[#8A8680] hover:text-[#F0A500] transition-colors">
                Başvur →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
