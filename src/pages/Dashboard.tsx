import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Wallet,
  Target,
  Heart,
  Briefcase,
  Activity,
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Calendar,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../store/useStore';
import { Card, CardContent, CardHeader, CardTitle, StatCard, Progress, Badge } from '../components/ui';
import { getGreeting, formatCurrency, formatDate, getMoodEmoji } from '../utils/helpers';

const Dashboard = () => {
  const {
    user,
    transactions,
    goals,
    habits,
    healthMetrics,
    moodEntries,
    projects,
  } = useStore();

  // Calculate stats
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const activeGoals = goals.filter((g) => g.status === 'in_progress').length;
  const completedGoals = goals.filter((g) => g.status === 'completed').length;

  const todayHabits = habits.filter((h) => {
    const today = new Date().toISOString().split('T')[0];
    return h.completedDates.includes(today);
  }).length;

  const latestMood = moodEntries[moodEntries.length - 1];
  const latestHealth = healthMetrics[healthMetrics.length - 1];

  // Mock chart data
  const financialChartData = [
    { name: 'Jan', revenus: 4000, depenses: 2400 },
    { name: 'Fév', revenus: 3000, depenses: 1398 },
    { name: 'Mar', revenus: 2000, depenses: 9800 },
    { name: 'Avr', revenus: 2780, depenses: 3908 },
    { name: 'Mai', revenus: 1890, depenses: 4800 },
    { name: 'Juin', revenus: 2390, depenses: 3800 },
  ];

  const categoryData = [
    { name: 'Finances', value: 30, color: '#6366f1' },
    { name: 'Santé', value: 25, color: '#22c55e' },
    { name: 'Carrière', value: 20, color: '#3b82f6' },
    { name: 'Personnel', value: 15, color: '#ec4899' },
    { name: 'Bien-être', value: 10, color: '#f59e0b' },
  ];

  const quickStats = [
    {
      title: 'Balance',
      value: formatCurrency(balance),
      icon: <Wallet className="w-6 h-6" />,
      color: balance >= 0 ? 'success' : 'danger',
      trend: { value: 12, label: 'vs mois dernier' },
    },
    {
      title: 'Objectifs actifs',
      value: activeGoals.toString(),
      icon: <Target className="w-6 h-6" />,
      color: 'primary',
      trend: { value: completedGoals, label: 'complétés' },
    },
    {
      title: "Habitudes aujourd'hui",
      value: `${todayHabits}/${habits.length}`,
      icon: <CheckCircle2 className="w-6 h-6" />,
      color: 'secondary',
    },
    {
      title: 'Projets en cours',
      value: projects.filter((p) => p.status === 'active').length.toString(),
      icon: <Briefcase className="w-6 h-6" />,
      color: 'warning',
    },
  ];

  const modules = [
    {
      title: 'Finances',
      description: 'Gérez vos revenus, dépenses et objectifs financiers',
      icon: <Wallet className="w-8 h-8" />,
      href: '/finances',
      color: 'from-indigo-500 to-indigo-600',
      stats: `${formatCurrency(balance)} de balance`,
    },
    {
      title: 'Objectifs',
      description: 'Suivez vos objectifs personnels et professionnels',
      icon: <Target className="w-8 h-8" />,
      href: '/goals',
      color: 'from-purple-500 to-purple-600',
      stats: `${activeGoals} objectifs actifs`,
    },
    {
      title: 'Vie personnelle',
      description: 'Habitudes, événements et relations',
      icon: <Heart className="w-8 h-8" />,
      href: '/personal',
      color: 'from-pink-500 to-pink-600',
      stats: `${habits.length} habitudes suivies`,
    },
    {
      title: 'Vie professionnelle',
      description: 'Projets, compétences et productivité',
      icon: <Briefcase className="w-8 h-8" />,
      href: '/professional',
      color: 'from-blue-500 to-blue-600',
      stats: `${projects.length} projets`,
    },
    {
      title: 'Santé',
      description: 'Suivi de votre santé physique',
      icon: <Activity className="w-8 h-8" />,
      href: '/health',
      color: 'from-green-500 to-green-600',
      stats: latestHealth ? `${latestHealth.sleepHours || 0}h de sommeil` : 'Aucune donnée',
    },
    {
      title: 'Psychologie',
      description: 'Humeur, journal et bien-être mental',
      icon: <Brain className="w-8 h-8" />,
      href: '/psychology',
      color: 'from-amber-500 to-amber-600',
      stats: latestMood ? `Humeur: ${getMoodEmoji(latestMood.mood)}` : 'Aucune entrée',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Voici un aperçu de votre vie aujourd'hui - {formatDate(new Date())}
          </p>
        </div>
        <Link
          to="/advisor"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
        >
          <Sparkles className="w-5 h-5" />
          <span>Conseils personnalisés</span>
        </Link>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color as 'primary' | 'secondary' | 'success' | 'warning' | 'danger'}
            trend={stat.trend}
          />
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Chart */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Évolution financière</CardTitle>
              <Badge variant="primary">6 derniers mois</Badge>
            </div>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financialChartData}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenus"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorRevenus)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="depenses"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorDepenses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Distribution */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-lg">Répartition des objectifs</CardTitle>
          </CardHeader>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="font-medium text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Modules Grid */}
      <motion.div variants={itemVariants}>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link to={module.href}>
                <Card className="p-6 h-full hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${module.color} text-white shadow-lg`}
                    >
                      {module.icon}
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                    {module.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {module.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                      {module.stats}
                    </p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Obtenez des conseils personnalisés</h3>
                <p className="text-white/80">
                  Notre IA analyse vos données pour vous guider vers vos objectifs
                </p>
              </div>
            </div>
            <Link
              to="/advisor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-white/90 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              Voir mes conseils
            </Link>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
