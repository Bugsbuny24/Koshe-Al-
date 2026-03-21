import { create } from 'zustand';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  is_admin: boolean;
  created_at: string;
}

export interface Quota {
  plan_id: string;
  credits_remaining: number;
  is_active: boolean;
  plan_expires_at: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  feature?: string;
  created_at?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  created_at: string;
}

export interface AudioCache {
  text: string;
  audioUrl: string;
}

export interface LearningPath {
  courses: string[];
  preferences: Record<string, string>;
}

export interface DailyGoal {
  target: number;
  completed: number;
}

interface AppState {
  // User
  profile: Profile | null;
  quota: Quota | null;
  setProfile: (p: Profile | null) => void;
  setQuota: (q: Quota | null) => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (m: ChatMessage) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setMessages: (msgs: ChatMessage[]) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Loading
  isLoading: boolean;
  setLoading: (v: boolean) => void;

  // Generated Images
  generatedImages: GeneratedImage[];
  setGeneratedImages: (images: GeneratedImage[]) => void;
  addGeneratedImage: (image: GeneratedImage) => void;

  // TTS Audio Cache
  audioCache: AudioCache[];
  addAudioCache: (entry: AudioCache) => void;

  // Learning Path
  learningPath: LearningPath | null;
  setLearningPath: (path: LearningPath | null) => void;

  // Daily Goal
  dailyGoal: DailyGoal;
  setDailyGoal: (goal: DailyGoal) => void;
}

export const useStore = create<AppState>((set) => ({
  profile: null,
  quota: null,
  setProfile: (profile) => set({ profile }),
  setQuota: (quota) => set({ quota }),

  messages: [],
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  updateLastMessage: (content) =>
    set((s) => {
      const msgs = [...s.messages];
      if (msgs.length > 0) msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
      return { messages: msgs };
    }),
  clearMessages: () => set({ messages: [] }),
  setMessages: (messages) => set({ messages }),

  sidebarOpen: true,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),

  generatedImages: [],
  setGeneratedImages: (generatedImages) => set({ generatedImages }),
  addGeneratedImage: (image) => set((s) => ({ generatedImages: [image, ...s.generatedImages] })),

  audioCache: [],
  addAudioCache: (entry) => set((s) => ({ audioCache: [...s.audioCache, entry] })),

  learningPath: null,
  setLearningPath: (learningPath) => set({ learningPath }),

  dailyGoal: { target: 30, completed: 0 },
  setDailyGoal: (dailyGoal) => set({ dailyGoal }),
}));
