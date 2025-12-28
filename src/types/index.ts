// User types
export interface User {
  email: string;
  name: string;
  avatar?: string;
}

// Finance types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  recurring?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

// Goals types
export interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'professional' | 'health' | 'finance' | 'education' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  progress: number;
  startDate: string;
  endDate?: string;
  milestones: Milestone[];
  tasks: Task[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
}

// Personal Life types
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'birthday' | 'anniversary' | 'appointment' | 'social' | 'other';
  reminder?: boolean;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'family' | 'friend' | 'romantic' | 'professional';
  lastContact?: string;
  notes?: string;
  birthday?: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  category: 'health' | 'productivity' | 'mindfulness' | 'social' | 'learning' | 'other';
  streak: number;
  completedDates: string[];
  color: string;
}

// Professional Life types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'on_hold';
  deadline?: string;
  progress: number;
  tasks: Task[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  learningResources?: string[];
}

export interface WorkSession {
  id: string;
  project?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  notes?: string;
}

// Health types
export interface HealthMetric {
  id: string;
  date: string;
  weight?: number;
  sleepHours?: number;
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  steps?: number;
  waterIntake?: number;
  exerciseMinutes?: number;
  exerciseType?: string;
  calories?: number;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  notes?: string;
}

export interface MedicalAppointment {
  id: string;
  type: string;
  doctor?: string;
  date: string;
  time: string;
  location?: string;
  notes?: string;
}

// Psychology types
export interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  anxiety: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  tags: string[];
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
  mood?: number;
  gratitude?: string[];
  tags: string[];
}

export interface Affirmation {
  id: string;
  text: string;
  category: string;
  favorite: boolean;
}

// Advice types
export interface Advice {
  id: string;
  category: 'finance' | 'goals' | 'personal' | 'professional' | 'health' | 'psychology';
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  actions?: string[];
}

export interface DailyPlan {
  date: string;
  tasks: PlanTask[];
  focus: string;
  affirmation: string;
}

export interface PlanTask {
  id: string;
  title: string;
  time?: string;
  duration?: number;
  category: string;
  completed: boolean;
}

// App State
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  sidebarOpen: boolean;
  currentView: string;
}

export type CategoryType =
  | 'finance'
  | 'goals'
  | 'personal'
  | 'professional'
  | 'health'
  | 'psychology'
  | 'advisor';
