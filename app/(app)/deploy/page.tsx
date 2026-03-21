'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface DeployRecord {
  id: string;
  repo: string;
  url: string;
  status: 'success' | 'building' | 'failed';
  date: string;
}

const MOCK_DEPLOYS: DeployRecord[] = [
  { id: '1', repo: 'my-portfolio', url: 'https://my-portfolio.vercel.app', status: 'success', date: '2 saat önce' },
  { id: '2', repo: 'todo-app', url: 'https://todo-app-xyz.vercel.app', status: 'success', date: '1 gün önce' },
  { id: '3', repo: 'api-service', url: '', status: 'failed', date: '3 gün önce' },
];

const statusConfig = {
  success: { label: 'Yayında', color: 'text-accent-green', bg: 'bg-accent-green/10 border-accent-green/20' },
  building: { label: 'Derleniyor...', color: 'text-pi-gold', bg: 'bg-pi-gold/10 border-pi-gold/20' },
  failed: { label: 'Başarısız', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function DeployPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deploys, setDeploys] = useState<DeployRecord[]>(MOCK_DEPLOYS);

  const handleDeploy = async () => {
    if (!repoUrl.trim()) return;
    setDeploying(true);

    const newDeploy: DeployRecord = {
      id: crypto.randomUUID(),
      repo: repoUrl.split('/').pop() || repoUrl,
      url: '',
      status: 'building',
      date: 'Az önce',
    };

    setDeploys((prev) => [newDeploy, ...prev]);

    // Simulate deploy
    await new Promise((r) => setTimeout(r, 3000));

    setDeploys((prev) =>
      prev.map((d) =>
        d.id === newDeploy.id
          ? { ...d, status: 'success', url: `https://${d.repo}.vercel.app` }
          : d
      )
    );

    setRepoUrl('');
    setDeploying(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">Deploy</h1>
        <p className="text-slate-400 mt-1">GitHub reponuzu Vercel&apos;e tek tıkla deploy edin.</p>
      </motion.div>

      {/* Deploy Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card glow="blue" className="p-6 mb-6">
          <h2 className="font-bold text-white mb-4">Yeni Deploy</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                label="GitHub Repo URL"
                placeholder="https://github.com/kullanici/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                icon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                }
              />
            </div>
            <div className="mt-6">
              <Button onClick={handleDeploy} loading={deploying} disabled={!repoUrl.trim()}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Deploy Et
              </Button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-bg-deep rounded-lg border border-white/5">
            <div className="flex items-start gap-2 text-xs text-slate-400">
              <svg className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Public veya private GitHub repoları desteklenir. Deploy işlemi Vercel altyapısı üzerinden gerçekleşir.</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Deploy History */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="font-bold text-white mb-4">Deploy Geçmişi</h2>
        <div className="space-y-3">
          {deploys.map((deploy, i) => {
            const config = statusConfig[deploy.status];
            return (
              <motion.div
                key={deploy.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-bg-deep border border-white/5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{deploy.repo}</p>
                        {deploy.url ? (
                          <a
                            href={deploy.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent-blue hover:underline"
                          >
                            {deploy.url}
                          </a>
                        ) : (
                          <p className="text-xs text-slate-500">{deploy.date}</p>
                        )}
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${config.bg} ${config.color}`}>
                      {config.label}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
