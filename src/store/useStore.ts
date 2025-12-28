import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Transaction,
  Budget,
  FinancialGoal,
  Goal,
  Habit,
  Event,
  Relationship,
  Project,
  Skill,
  WorkSession,
  HealthMetric,
  MoodEntry,
  JournalEntry,
  Medication,
  MedicalAppointment,
} from '../types';

interface Store {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // UI
  darkMode: boolean;
  sidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Finance
  transactions: Transaction[];
  budgets: Budget[];
  financialGoals: FinancialGoal[];
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addFinancialGoal: (goal: FinancialGoal) => void;
  updateFinancialGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  deleteFinancialGoal: (id: string) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;

  // Personal Life
  habits: Habit[];
  events: Event[];
  relationships: Relationship[];
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, habit: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (id: string, date: string) => void;
  addEvent: (event: Event) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  addRelationship: (relationship: Relationship) => void;
  updateRelationship: (id: string, relationship: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;

  // Professional
  projects: Project[];
  skills: Skill[];
  workSessions: WorkSession[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addWorkSession: (session: WorkSession) => void;
  updateWorkSession: (id: string, session: Partial<WorkSession>) => void;

  // Health
  healthMetrics: HealthMetric[];
  medications: Medication[];
  medicalAppointments: MedicalAppointment[];
  addHealthMetric: (metric: HealthMetric) => void;
  updateHealthMetric: (id: string, metric: Partial<HealthMetric>) => void;
  addMedication: (medication: Medication) => void;
  updateMedication: (id: string, medication: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  addMedicalAppointment: (appointment: MedicalAppointment) => void;
  updateMedicalAppointment: (id: string, appointment: Partial<MedicalAppointment>) => void;
  deleteMedicalAppointment: (id: string) => void;

  // Psychology
  moodEntries: MoodEntry[];
  journalEntries: JournalEntry[];
  addMoodEntry: (entry: MoodEntry) => void;
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;
}

const VALID_EMAIL = 'mlaanaiya@gmail.com';
const VALID_PASSWORD = 'GREFFEABOHLA022025';

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      isAuthenticated: false,
      login: (email: string, password: string) => {
        if (email === VALID_EMAIL && password === VALID_PASSWORD) {
          set({
            user: {
              email,
              name: 'Mohamed Laanaiya',
              avatar: undefined,
            },
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      // UI
      darkMode: true,
      sidebarOpen: true,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Finance
      transactions: [],
      budgets: [],
      financialGoals: [],
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),
      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      addBudget: (budget) =>
        set((state) => ({ budgets: [...state.budgets, budget] })),
      updateBudget: (id, budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) => (b.id === id ? { ...b, ...budget } : b)),
        })),
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),
      addFinancialGoal: (goal) =>
        set((state) => ({ financialGoals: [...state.financialGoals, goal] })),
      updateFinancialGoal: (id, goal) =>
        set((state) => ({
          financialGoals: state.financialGoals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        })),
      deleteFinancialGoal: (id) =>
        set((state) => ({
          financialGoals: state.financialGoals.filter((g) => g.id !== id),
        })),

      // Goals
      goals: [],
      addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...goal } : g)),
        })),
      deleteGoal: (id) =>
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),

      // Personal Life
      habits: [],
      events: [],
      relationships: [],
      addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
      updateHabit: (id, habit) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...habit } : h)),
        })),
      deleteHabit: (id) =>
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) })),
      toggleHabitCompletion: (id, date) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === id) {
              const completedDates = h.completedDates.includes(date)
                ? h.completedDates.filter((d) => d !== date)
                : [...h.completedDates, date];
              return { ...h, completedDates, streak: completedDates.length };
            }
            return h;
          }),
        })),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (id, event) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...event } : e)),
        })),
      deleteEvent: (id) =>
        set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
      addRelationship: (relationship) =>
        set((state) => ({ relationships: [...state.relationships, relationship] })),
      updateRelationship: (id, relationship) =>
        set((state) => ({
          relationships: state.relationships.map((r) =>
            r.id === id ? { ...r, ...relationship } : r
          ),
        })),
      deleteRelationship: (id) =>
        set((state) => ({
          relationships: state.relationships.filter((r) => r.id !== id),
        })),

      // Professional
      projects: [],
      skills: [],
      workSessions: [],
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, project) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...project } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
      updateSkill: (id, skill) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
        })),
      deleteSkill: (id) =>
        set((state) => ({ skills: state.skills.filter((s) => s.id !== id) })),
      addWorkSession: (session) =>
        set((state) => ({ workSessions: [...state.workSessions, session] })),
      updateWorkSession: (id, session) =>
        set((state) => ({
          workSessions: state.workSessions.map((s) =>
            s.id === id ? { ...s, ...session } : s
          ),
        })),

      // Health
      healthMetrics: [],
      medications: [],
      medicalAppointments: [],
      addHealthMetric: (metric) =>
        set((state) => ({ healthMetrics: [...state.healthMetrics, metric] })),
      updateHealthMetric: (id, metric) =>
        set((state) => ({
          healthMetrics: state.healthMetrics.map((m) =>
            m.id === id ? { ...m, ...metric } : m
          ),
        })),
      addMedication: (medication) =>
        set((state) => ({ medications: [...state.medications, medication] })),
      updateMedication: (id, medication) =>
        set((state) => ({
          medications: state.medications.map((m) =>
            m.id === id ? { ...m, ...medication } : m
          ),
        })),
      deleteMedication: (id) =>
        set((state) => ({ medications: state.medications.filter((m) => m.id !== id) })),
      addMedicalAppointment: (appointment) =>
        set((state) => ({
          medicalAppointments: [...state.medicalAppointments, appointment],
        })),
      updateMedicalAppointment: (id, appointment) =>
        set((state) => ({
          medicalAppointments: state.medicalAppointments.map((a) =>
            a.id === id ? { ...a, ...appointment } : a
          ),
        })),
      deleteMedicalAppointment: (id) =>
        set((state) => ({
          medicalAppointments: state.medicalAppointments.filter((a) => a.id !== id),
        })),

      // Psychology
      moodEntries: [],
      journalEntries: [],
      addMoodEntry: (entry) =>
        set((state) => ({ moodEntries: [...state.moodEntries, entry] })),
      addJournalEntry: (entry) =>
        set((state) => ({ journalEntries: [...state.journalEntries, entry] })),
      updateJournalEntry: (id, entry) =>
        set((state) => ({
          journalEntries: state.journalEntries.map((e) =>
            e.id === id ? { ...e, ...entry } : e
          ),
        })),
      deleteJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'life-manager-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        darkMode: state.darkMode,
        transactions: state.transactions,
        budgets: state.budgets,
        financialGoals: state.financialGoals,
        goals: state.goals,
        habits: state.habits,
        events: state.events,
        relationships: state.relationships,
        projects: state.projects,
        skills: state.skills,
        workSessions: state.workSessions,
        healthMetrics: state.healthMetrics,
        medications: state.medications,
        medicalAppointments: state.medicalAppointments,
        moodEntries: state.moodEntries,
        journalEntries: state.journalEntries,
      }),
    }
  )
);
