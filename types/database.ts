export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: 'pioneer' | 'instructor' | 'admin';
  is_premium: boolean;
  native_language: string | null;
  target_language: string | null;
  learning_stage: string | null;
  difficulty_level: string | null;
  alphabet_progress: number;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  pending_balance: number;
  total_earned: number;
  total_spent: number;
  currency: string;
}

export interface UserQuota {
  id: string;
  user_id: string;
  tier: 'free' | 'pro' | 'ultra';
  plan: string;
  credits_remaining: number;
  is_active: boolean;
}

export interface PiPayment {
  id: string;
  user_id: string;
  payment_id: string;
  txid: string | null;
  amount: number;
  memo: string | null;
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  payment_type: 'course' | 'subscription' | 'module' | 'freelance';
  reference_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  prompt: string | null;
  generated_code: Record<string, unknown> | null;
  tech_stack: string[];
  is_deployed: boolean;
  deploy_url: string | null;
  is_published: boolean;
  price_pi: number;
  created_at: string;
  updated_at: string;
}

export interface FreelanceJob {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  budget_pi: number | null;
  category: string | null;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  deadline: string | null;
  created_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  language: string;
  voice: string | null;
  persona_prompt: string | null;
  avatar_url: string | null;
  is_active: boolean;
}

export interface Certificate {
  id: string;
  course_id: string;
  language_code: string;
  level: string;
  title: string;
  image_url: string | null;
  issued_at: string;
}
