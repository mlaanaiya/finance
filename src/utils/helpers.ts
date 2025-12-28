import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('fr-FR', options || defaultOptions).format(
    typeof date === 'string' ? new Date(date) : date
  );
}

export function formatShortDate(date: string | Date): string {
  return formatDate(date, { month: 'short', day: 'numeric' });
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(typeof date === 'string' ? new Date(date) : date);
}

export function getRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat('fr', { numeric: 'auto' });
  const now = new Date();
  const target = typeof date === 'string' ? new Date(date) : date;
  const diffInSeconds = Math.floor((target.getTime() - now.getTime()) / 1000);

  const intervals: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      return rtf.format(diffInSeconds > 0 ? count : -count, interval.unit);
    }
  }

  return rtf.format(0, 'second');
}

export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(Math.round((current / total) * 100), 100);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getWeekDays(): string[] {
  return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
}

export function getMonthName(month: number): string {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[month];
}

export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

export function isToday(date: Date | string): boolean {
  return isSameDay(date, new Date());
}

export const categoryColors: Record<string, string> = {
  finance: '#6366f1',
  goals: '#8b5cf6',
  personal: '#ec4899',
  professional: '#3b82f6',
  health: '#22c55e',
  psychology: '#f59e0b',
  education: '#14b8a6',
  other: '#64748b',
};

export const categoryIcons: Record<string, string> = {
  finance: 'Wallet',
  goals: 'Target',
  personal: 'Heart',
  professional: 'Briefcase',
  health: 'Activity',
  psychology: 'Brain',
  education: 'GraduationCap',
  other: 'MoreHorizontal',
};

export function getMoodEmoji(mood: number): string {
  const emojis = ['😢', '😔', '😐', '🙂', '😄'];
  return emojis[mood - 1] || '😐';
}

export function getMoodLabel(mood: number): string {
  const labels = ['Très mauvais', 'Mauvais', 'Neutre', 'Bon', 'Excellent'];
  return labels[mood - 1] || 'Neutre';
}

export function getEnergyLabel(energy: number): string {
  const labels = ['Épuisé', 'Fatigué', 'Normal', 'Énergique', 'Très énergique'];
  return labels[energy - 1] || 'Normal';
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
