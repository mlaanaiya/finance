import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className,
}: StatCardProps) => {
  const colors = {
    primary: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      icon: 'text-indigo-500',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    secondary: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-500',
      border: 'border-purple-200 dark:border-purple-800',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-500',
      border: 'border-green-200 dark:border-green-800',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      icon: 'text-amber-500',
      border: 'border-amber-200 dark:border-amber-800',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'text-red-500',
      border: 'border-red-200 dark:border-red-800',
    },
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend.value < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-green-500';
    if (trend.value < 0) return 'text-red-500';
    return 'text-slate-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', getTrendColor())}>
              {getTrendIcon()}
              <span className="font-medium">{Math.abs(trend.value)}%</span>
              {trend.label && (
                <span className="text-slate-400 dark:text-slate-500">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-3 rounded-xl', colors[color].bg, colors[color].icon)}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
