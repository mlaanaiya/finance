import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Wallet,
  Target,
  Heart,
  Briefcase,
  Activity,
  Brain,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Clock,
  Zap,
  Star,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui';
import { formatCurrency, formatDate, cn } from '../utils/helpers';
import { Advice } from '../types';

const categoryIcons = {
  finance: Wallet,
  goals: Target,
  personal: Heart,
  professional: Briefcase,
  health: Activity,
  psychology: Brain,
};

const categoryColors = {
  finance: 'from-indigo-500 to-blue-500',
  goals: 'from-purple-500 to-violet-500',
  personal: 'from-pink-500 to-rose-500',
  professional: 'from-blue-500 to-cyan-500',
  health: 'from-green-500 to-emerald-500',
  psychology: 'from-amber-500 to-orange-500',
};

const Advisor = () => {
  const {
    user,
    transactions,
    goals,
    habits,
    projects,
    healthMetrics,
    moodEntries,
    financialGoals,
    budgets,
  } = useStore();

  const [advice, setAdvice] = useState<Advice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyPlan, setDailyPlan] = useState<{
    morning: string[];
    afternoon: string[];
    evening: string[];
  }>({
    morning: [],
    afternoon: [],
    evening: [],
  });

  // Generate personalized advice based on user data
  const generateAdvice = () => {
    setLoading(true);
    const newAdvice: Advice[] = [];

    // Finance advice
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    if (savingsRate < 20) {
      newAdvice.push({
        id: '1',
        category: 'finance',
        title: 'Augmentez votre taux d\'épargne',
        content: `Votre taux d'épargne actuel est de ${savingsRate.toFixed(1)}%. Visez au moins 20% pour une santé financière optimale.`,
        priority: 'high',
        actionable: true,
        actions: [
          'Identifiez 3 dépenses non-essentielles à réduire',
          'Mettez en place un virement automatique vers l\'épargne',
          'Utilisez la règle 50/30/20 pour votre budget',
        ],
      });
    }

    if (budgets.length === 0) {
      newAdvice.push({
        id: '2',
        category: 'finance',
        title: 'Créez des budgets par catégorie',
        content: 'Vous n\'avez pas encore de budget défini. Les budgets vous aident à contrôler vos dépenses.',
        priority: 'medium',
        actionable: true,
        actions: [
          'Analysez vos dépenses des 3 derniers mois',
          'Définissez un budget pour chaque catégorie',
          'Révisez vos budgets chaque mois',
        ],
      });
    }

    if (financialGoals.length === 0) {
      newAdvice.push({
        id: '3',
        category: 'finance',
        title: 'Définissez des objectifs d\'épargne',
        content: 'Avoir des objectifs financiers clairs vous motivera à épargner davantage.',
        priority: 'medium',
        actionable: true,
        actions: [
          'Listez vos projets à court, moyen et long terme',
          'Estimez le montant nécessaire pour chaque projet',
          'Créez un objectif d\'épargne pour chaque projet',
        ],
      });
    }

    // Goals advice
    const activeGoals = goals.filter((g) => g.status === 'in_progress');
    const stuckGoals = activeGoals.filter((g) => g.progress < 25);

    if (stuckGoals.length > 0) {
      newAdvice.push({
        id: '4',
        category: 'goals',
        title: 'Débloquez vos objectifs en pause',
        content: `${stuckGoals.length} objectif(s) semblent stagner. Analysez les obstacles et ajustez votre approche.`,
        priority: 'high',
        actionable: true,
        actions: [
          'Identifiez le premier petit pas pour chaque objectif',
          'Décomposez les objectifs en tâches plus petites',
          'Bloquez du temps dédié dans votre agenda',
        ],
      });
    }

    if (goals.length === 0) {
      newAdvice.push({
        id: '5',
        category: 'goals',
        title: 'Définissez vos objectifs de vie',
        content: 'Des objectifs clairs donnent une direction à votre vie. Commencez par vos priorités.',
        priority: 'high',
        actionable: true,
        actions: [
          'Réfléchissez à ce que vous voulez accomplir cette année',
          'Utilisez la méthode SMART pour formuler vos objectifs',
          'Priorisez vos 3 objectifs les plus importants',
        ],
      });
    }

    // Personal life advice
    const today = new Date().toISOString().split('T')[0];
    const completedHabitsToday = habits.filter((h) => h.completedDates.includes(today)).length;
    const habitCompletionRate = habits.length > 0 ? (completedHabitsToday / habits.length) * 100 : 0;

    if (habits.length > 0 && habitCompletionRate < 50) {
      newAdvice.push({
        id: '6',
        category: 'personal',
        title: 'Renforcez vos habitudes',
        content: `Seulement ${completedHabitsToday}/${habits.length} habitudes complétées aujourd'hui. La régularité est la clé.`,
        priority: 'medium',
        actionable: true,
        actions: [
          'Commencez par une seule habitude et maîtrisez-la',
          'Associez une nouvelle habitude à une existante',
          'Créez des rappels pour vos habitudes',
        ],
      });
    }

    if (habits.length === 0) {
      newAdvice.push({
        id: '7',
        category: 'personal',
        title: 'Instaurez des habitudes positives',
        content: 'Les habitudes quotidiennes construisent votre vie. Commencez petit mais régulier.',
        priority: 'medium',
        actionable: true,
        actions: [
          'Choisissez une habitude simple (méditation 5 min, lecture...)',
          'Pratiquez-la à la même heure chaque jour',
          'Célébrez chaque jour de pratique',
        ],
      });
    }

    // Professional advice
    const activeProjects = projects.filter((p) => p.status === 'active');

    if (activeProjects.length > 5) {
      newAdvice.push({
        id: '8',
        category: 'professional',
        title: 'Réduisez votre charge de travail',
        content: `Vous avez ${activeProjects.length} projets actifs. Trop de projets simultanés diminue votre efficacité.`,
        priority: 'high',
        actionable: true,
        actions: [
          'Priorisez vos 3 projets les plus importants',
          'Déléguez ou reportez les projets moins urgents',
          'Terminez un projet avant d\'en commencer un nouveau',
        ],
      });
    }

    if (projects.length === 0) {
      newAdvice.push({
        id: '9',
        category: 'professional',
        title: 'Structurez vos projets',
        content: 'Organiser votre travail en projets améliore votre productivité et votre suivi.',
        priority: 'low',
        actionable: true,
        actions: [
          'Listez vos projets actuels',
          'Définissez des échéances réalistes',
          'Découpez chaque projet en tâches',
        ],
      });
    }

    // Health advice
    const recentMetrics = healthMetrics.slice(-7);
    const avgSleep = recentMetrics.length > 0
      ? recentMetrics.reduce((sum, m) => sum + (m.sleepHours || 0), 0) / recentMetrics.filter(m => m.sleepHours).length
      : 0;

    if (avgSleep > 0 && avgSleep < 7) {
      newAdvice.push({
        id: '10',
        category: 'health',
        title: 'Améliorez votre sommeil',
        content: `Votre moyenne de sommeil est de ${avgSleep.toFixed(1)}h. Visez 7-9h pour une santé optimale.`,
        priority: 'high',
        actionable: true,
        actions: [
          'Établissez une routine de coucher régulière',
          'Évitez les écrans 1h avant de dormir',
          'Créez un environnement de sommeil optimal',
        ],
      });
    }

    if (healthMetrics.length === 0) {
      newAdvice.push({
        id: '11',
        category: 'health',
        title: 'Suivez vos métriques de santé',
        content: 'Le suivi de votre santé vous aide à identifier des patterns et améliorer votre bien-être.',
        priority: 'medium',
        actionable: true,
        actions: [
          'Enregistrez votre sommeil quotidiennement',
          'Suivez votre activité physique',
          'Notez votre hydratation',
        ],
      });
    }

    // Psychology advice
    const recentMoods = moodEntries.slice(-7);
    const avgMood = recentMoods.length > 0
      ? recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length
      : 0;

    if (avgMood > 0 && avgMood < 3) {
      newAdvice.push({
        id: '12',
        category: 'psychology',
        title: 'Prenez soin de votre santé mentale',
        content: 'Votre humeur moyenne récente semble basse. C\'est important d\'y prêter attention.',
        priority: 'high',
        actionable: true,
        actions: [
          'Identifiez les sources de stress ou de tristesse',
          'Pratiquez une activité qui vous fait du bien',
          'Parlez à quelqu\'un de confiance si nécessaire',
        ],
      });
    }

    if (moodEntries.length === 0) {
      newAdvice.push({
        id: '13',
        category: 'psychology',
        title: 'Suivez votre humeur',
        content: 'Le suivi de votre humeur vous aide à comprendre vos patterns émotionnels.',
        priority: 'medium',
        actionable: true,
        actions: [
          'Enregistrez votre humeur chaque soir',
          'Notez les événements qui influencent votre humeur',
          'Identifiez vos déclencheurs positifs et négatifs',
        ],
      });
    }

    // Positive reinforcement
    if (savingsRate >= 20) {
      newAdvice.push({
        id: '14',
        category: 'finance',
        title: 'Excellent taux d\'épargne !',
        content: `Votre taux d'épargne de ${savingsRate.toFixed(1)}% est excellent. Continuez ainsi !`,
        priority: 'low',
        actionable: false,
      });
    }

    setAdvice(newAdvice.sort((a, b) => {
      const priority = { high: 0, medium: 1, low: 2 };
      return priority[a.priority] - priority[b.priority];
    }));

    // Generate daily plan
    setDailyPlan({
      morning: [
        'Méditation ou exercices de respiration (10 min)',
        'Revoir vos objectifs du jour',
        habits.find(h => h.category === 'health')?.name || 'Exercice physique (30 min)',
      ],
      afternoon: [
        activeProjects[0]?.name ? `Travailler sur: ${activeProjects[0].name}` : 'Focus sur votre projet principal',
        'Pause et hydratation',
        'Réviser vos tâches prioritaires',
      ],
      evening: [
        'Bilan de la journée',
        'Préparation du lendemain',
        'Moment de détente et déconnexion',
      ],
    });

    setTimeout(() => setLoading(false), 1000);
  };

  useEffect(() => {
    generateAdvice();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const priorityColors = {
    high: 'border-l-red-500 bg-red-50 dark:bg-red-900/10',
    medium: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10',
    low: 'border-l-green-500 bg-green-50 dark:bg-green-900/10',
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            Conseiller IA
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Conseils personnalisés basés sur vos données
          </p>
        </div>
        <Button onClick={generateAdvice} variant="secondary">
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          Actualiser
        </Button>
      </motion.div>

      {/* Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-white/80 mb-2">Score de vie global</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold">72</span>
                <span className="text-2xl text-white/80">/100</span>
              </div>
              <p className="mt-2 text-white/80">
                Basé sur vos finances, objectifs, santé et bien-être
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Wallet className="w-8 h-8" />
                </div>
                <p className="text-sm text-white/80">Finances</p>
                <p className="font-bold">68%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Activity className="w-8 h-8" />
                </div>
                <p className="text-sm text-white/80">Santé</p>
                <p className="font-bold">75%</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Brain className="w-8 h-8" />
                </div>
                <p className="text-sm text-white/80">Bien-être</p>
                <p className="font-bold">70%</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Daily Plan */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Plan de la journée
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Matin</h4>
              </div>
              <ul className="space-y-2">
                {dailyPlan.morning.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Après-midi</h4>
              </div>
              <ul className="space-y-2">
                {dailyPlan.afternoon.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 dark:text-white">Soir</h4>
              </div>
              <ul className="space-y-2">
                {dailyPlan.evening.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Advice Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all">
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="all" icon={<Sparkles className="w-4 h-4" />}>
              Tous
            </TabsTrigger>
            <TabsTrigger value="finance" icon={<Wallet className="w-4 h-4" />}>
              Finances
            </TabsTrigger>
            <TabsTrigger value="goals" icon={<Target className="w-4 h-4" />}>
              Objectifs
            </TabsTrigger>
            <TabsTrigger value="health" icon={<Activity className="w-4 h-4" />}>
              Santé
            </TabsTrigger>
            <TabsTrigger value="psychology" icon={<Brain className="w-4 h-4" />}>
              Bien-être
            </TabsTrigger>
          </TabsList>

          {['all', 'finance', 'goals', 'personal', 'professional', 'health', 'psychology'].map((tab) => (
            <TabsContent key={tab} value={tab}>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-slate-500">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyse en cours...
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {advice
                    .filter((a) => tab === 'all' || a.category === tab)
                    .map((item) => {
                      const Icon = categoryIcons[item.category];
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <Card
                            className={cn(
                              'p-6 border-l-4',
                              priorityColors[item.priority]
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={cn(
                                  'p-3 rounded-xl bg-gradient-to-br text-white shrink-0',
                                  categoryColors[item.category]
                                )}
                              >
                                <Icon className="w-6 h-6" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-slate-900 dark:text-white">
                                    {item.title}
                                  </h3>
                                  <Badge
                                    variant={
                                      item.priority === 'high'
                                        ? 'danger'
                                        : item.priority === 'medium'
                                        ? 'warning'
                                        : 'success'
                                    }
                                    size="sm"
                                  >
                                    {item.priority === 'high'
                                      ? 'Prioritaire'
                                      : item.priority === 'medium'
                                      ? 'Important'
                                      : 'Info'}
                                  </Badge>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 mb-4">
                                  {item.content}
                                </p>
                                {item.actions && item.actions.length > 0 && (
                                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                      <Lightbulb className="w-4 h-4 text-amber-500" />
                                      Actions recommandées
                                    </p>
                                    <ul className="space-y-2">
                                      {item.actions.map((action, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                                        >
                                          <ArrowRight className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                          {action}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  {advice.filter((a) => tab === 'all' || a.category === tab).length === 0 && (
                    <Card className="p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        Tout est en ordre !
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400">
                        Aucune recommandation pour cette catégorie. Continuez comme ça !
                      </p>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </motion.div>

      {/* Weekly Focus */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Focus de la semaine
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Objectif principal</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {goals.filter((g) => g.status === 'in_progress')[0]?.title ||
                  'Définissez un objectif prioritaire'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Habitude à renforcer</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {habits[0]?.name || 'Créez votre première habitude'}
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <h4 className="font-medium text-slate-900 dark:text-white mb-2">Conseil santé</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visez 7-8h de sommeil chaque nuit
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Advisor;
