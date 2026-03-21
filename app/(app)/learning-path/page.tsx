'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createSupabaseClient } from '@/lib/supabase/client';

const QUIZ_QUESTIONS = [
  {
    id: 'field',
    question: 'Hangi alanda uzmanlaşmak istiyorsunuz?',
    options: ['Web Geliştirme', 'Yapay Zeka', 'Blockchain', 'Mobil', 'Veri Bilimi'],
  },
  {
    id: 'level',
    question: 'Mevcut seviyeniz nedir?',
    options: ['Başlangıç', 'Orta', 'İleri'],
  },
  {
    id: 'time',
    question: 'Günlük ne kadar vakit ayırabilirsiniz?',
    options: ['15 dk', '30 dk', '1 saat', '2+ saat'],
  },
  {
    id: 'goal',
    question: 'Öğrenme hedefiniz nedir?',
    options: ['İş bulmak', 'Proje geliştirmek', 'Merak', 'Sertifika almak'],
  },
  {
    id: 'style',
    question: 'Tercih ettiğiniz öğrenme stili?',
    options: ['Video', 'Okuma', 'Pratik yapma', 'Soru-cevap'],
  },
];

interface LearningPathData {
  courses: string[];
  tips: string[];
  estimatedWeeks: number;
}

export default function LearningPathPage() {
  const { learningPath, setLearningPath, dailyGoal, setDailyGoal } = useStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [pathData, setPathData] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const supabase = createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('learning_preferences')
        .eq('id', user.id)
        .single();
      if (data?.learning_preferences) {
        // Already has preferences - load path
        const res = await fetch('/api/learning-path', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const pathRes = await res.json();
          if (pathRes.learningPath) {
            setLearningPath(pathRes.learningPath);
            setPathData(pathRes.pathData);
          }
        }
      } else {
        setShowQuiz(true);
      }
    };
    loadPreferences();
  }, [setLearningPath]);

  const handleAnswer = (answer: string) => {
    const question = QUIZ_QUESTIONS[currentQuestion];
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    setQuizComplete(true);
    try {
      const supabase = createSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/learning-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (res.ok) {
        const data = await res.json();
        setLearningPath({ courses: data.courses || [], preferences: finalAnswers });
        setPathData(data.pathData);
        setShowQuiz(false);
        // Set daily goal based on time preference
        const timeMap: Record<string, number> = { '15 dk': 15, '30 dk': 30, '1 saat': 60, '2+ saat': 120 };
        setDailyGoal({ target: timeMap[finalAnswers.time] || 30, completed: 0 });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="w-12 h-12 border-2 border-accent-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Kişiselleştirilmiş öğrenme yolunuz hazırlanıyor...</p>
      </div>
    );
  }

  if (showQuiz && !quizComplete) {
    const q = QUIZ_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion) / QUIZ_QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">🎯 Öğrenme Yolum</h1>
            <p className="text-slate-400">Size özel öğrenme yolu oluşturmak için birkaç soru soralım.</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Soru {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
              <span>%{Math.round(progress)}</span>
            </div>
            <div className="h-2 bg-bg-deep rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <Card className="p-8">
                <h2 className="text-xl font-bold text-white mb-6">{q.question}</h2>
                <div className="space-y-3">
                  {q.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      className="w-full text-left px-5 py-4 rounded-xl border border-white/10 text-slate-300 hover:border-accent-blue/40 hover:bg-accent-blue/5 hover:text-white transition-all font-medium"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  // Show learning path
  const path = learningPath;
  if (!path && !pathData) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="text-5xl mb-4">🎯</div>
        <h2 className="text-2xl font-bold text-white mb-3">Öğrenme Yolunuz Hazır Değil</h2>
        <p className="text-slate-400 mb-6">Kişiselleştirilmiş öğrenme yolu için quiz&apos;i tamamlayın.</p>
        <Button onClick={() => { setShowQuiz(true); setCurrentQuestion(0); setAnswers({}); }} variant="primary">
          Quiz&apos;i Başlat
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">🎯 Öğrenme Yolum</h1>
            <p className="text-slate-400 mt-1">Kişiselleştirilmiş öğrenme planınız</p>
          </div>
          <Button
            onClick={() => { setShowQuiz(true); setCurrentQuestion(0); setAnswers({}); setQuizComplete(false); }}
            variant="secondary"
            className="text-sm"
          >
            Yeniden Oluştur
          </Button>
        </div>
      </motion.div>

      {/* Daily Goal Progress */}
      <Card className="p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-medium text-white">Günlük Hedef</span>
          <span className="text-sm text-slate-400">{dailyGoal.completed}/{dailyGoal.target} dakika</span>
        </div>
        <div className="h-3 bg-bg-deep rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-blue to-accent-green rounded-full transition-all"
            style={{ width: `${Math.min(100, (dailyGoal.completed / dailyGoal.target) * 100)}%` }}
          />
        </div>
      </Card>

      {/* Today's Lesson */}
      {path?.courses?.[0] && (
        <Card glow="blue" className="p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">📚</div>
            <div>
              <p className="text-xs text-accent-blue font-medium uppercase tracking-wider">Bugünün Dersi</p>
              <h3 className="font-bold text-white">{path.courses[0]}</h3>
            </div>
          </div>
          <Button onClick={() => window.location.href = '/courses'} variant="primary" className="w-full">
            Derse Başla →
          </Button>
        </Card>
      )}

      {/* Estimated Time */}
      {pathData?.estimatedWeeks && (
        <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-accent-blue">
            ⏱ Tahmini tamamlama süresi: <strong>{pathData.estimatedWeeks} hafta</strong>
          </p>
        </div>
      )}

      {/* Course List */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-white mb-4">Önerilen Kurslar</h2>
        <div className="space-y-3">
          {(path?.courses || []).map((course, i) => (
            <motion.div
              key={course}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="p-4 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-accent-blue/15 border border-accent-blue/20 flex items-center justify-center text-sm font-bold text-accent-blue">
                  {i + 1}
                </div>
                <span className="text-white font-medium flex-1">{course}</span>
                {i === 0 && (
                  <span className="text-xs bg-accent-green/15 text-accent-green border border-accent-green/20 px-2 py-1 rounded-full">
                    Sıradaki
                  </span>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Tips */}
      {pathData?.tips && pathData.tips.length > 0 && (
        <Card className="p-5">
          <h3 className="font-bold text-white mb-3">💡 Kişisel Öneriler</h3>
          <ul className="space-y-2">
            {pathData.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-accent-blue mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
