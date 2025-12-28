import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Pause,
  Flag,
  Calendar,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  Card,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  Progress,
  CircularProgress,
  Badge,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui';
import { formatDate, generateId, cn, calculatePercentage } from '../utils/helpers';
import { Goal, Milestone, Task } from '../types';

const goalCategories = [
  { value: 'personal', label: 'Personnel' },
  { value: 'professional', label: 'Professionnel' },
  { value: 'health', label: 'Santé' },
  { value: 'finance', label: 'Finance' },
  { value: 'education', label: 'Éducation' },
  { value: 'other', label: 'Autre' },
];

const priorityOptions = [
  { value: 'low', label: 'Basse' },
  { value: 'medium', label: 'Moyenne' },
  { value: 'high', label: 'Haute' },
];

const statusOptions = [
  { value: 'not_started', label: 'Non commencé' },
  { value: 'in_progress', label: 'En cours' },
  { value: 'completed', label: 'Terminé' },
  { value: 'paused', label: 'En pause' },
];

const categoryColors: Record<string, string> = {
  personal: 'from-pink-500 to-rose-500',
  professional: 'from-blue-500 to-indigo-500',
  health: 'from-green-500 to-emerald-500',
  finance: 'from-amber-500 to-orange-500',
  education: 'from-purple-500 to-violet-500',
  other: 'from-slate-500 to-slate-600',
};

const Goals = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [expandedGoals, setExpandedGoals] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('all');

  const toggleExpand = (id: string) => {
    setExpandedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal: Goal = {
      id: generateId(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as Goal['category'],
      priority: formData.get('priority') as Goal['priority'],
      status: 'not_started',
      progress: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: formData.get('endDate') as string,
      milestones: [],
      tasks: [],
    };
    addGoal(goal);
    setShowModal(false);
  };

  const handleAddMilestone = (goalId: string) => {
    const title = prompt("Titre de l'étape:");
    if (title) {
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        const newMilestone: Milestone = {
          id: generateId(),
          title,
          completed: false,
        };
        updateGoal(goalId, {
          milestones: [...goal.milestones, newMilestone],
        });
      }
    }
  };

  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const updatedMilestones = goal.milestones.map((m) =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m) => m.completed).length;
      const progress = updatedMilestones.length > 0
        ? (completedCount / updatedMilestones.length) * 100
        : goal.progress;

      updateGoal(goalId, {
        milestones: updatedMilestones,
        progress,
        status: progress === 100 ? 'completed' : goal.status === 'not_started' ? 'in_progress' : goal.status,
      });
    }
  };

  const handleAddTask = (goalId: string) => {
    const title = prompt('Titre de la tâche:');
    if (title) {
      const goal = goals.find((g) => g.id === goalId);
      if (goal) {
        const newTask: Task = {
          id: generateId(),
          title,
          completed: false,
          priority: 'medium',
        };
        updateGoal(goalId, {
          tasks: [...goal.tasks, newTask],
        });
      }
    }
  };

  const handleToggleTask = (goalId: string, taskId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      updateGoal(goalId, {
        tasks: goal.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        ),
      });
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (filter === 'all') return true;
    if (filter === 'active') return goal.status === 'in_progress';
    if (filter === 'completed') return goal.status === 'completed';
    return goal.category === filter;
  });

  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === 'in_progress').length,
    completed: goals.filter((g) => g.status === 'completed').length,
    avgProgress: goals.length > 0
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
      : 0,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Objectifs</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Définissez et suivez vos objectifs personnels et professionnels
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Nouvel objectif
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600">{stats.active}</div>
          <p className="text-sm text-slate-500 dark:text-slate-400">En cours</p>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Terminés</p>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center">
          <CircularProgress value={stats.avgProgress} size={60} color="primary" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Progression moyenne</p>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        {['all', 'active', 'completed', ...goalCategories.map((c) => c.value)].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all'
              ? 'Tous'
              : f === 'active'
              ? 'En cours'
              : f === 'completed'
              ? 'Terminés'
              : goalCategories.find((c) => c.value === f)?.label || f}
          </Button>
        ))}
      </motion.div>

      {/* Goals List */}
      <motion.div variants={itemVariants}>
        {filteredGoals.length === 0 ? (
          <Card className="p-6">
            <EmptyState
              icon={<Target className="w-8 h-8" />}
              title="Aucun objectif"
              description="Créez votre premier objectif pour commencer à suivre votre progression"
              action={{
                label: 'Créer un objectif',
                onClick: () => setShowModal(true),
              }}
            />
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredGoals.map((goal) => {
              const isExpanded = expandedGoals.includes(goal.id);
              const completedMilestones = goal.milestones.filter((m) => m.completed).length;
              const completedTasks = goal.tasks.filter((t) => t.completed).length;

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <Card className="overflow-hidden">
                    <div
                      className={cn(
                        'h-1.5 bg-gradient-to-r',
                        categoryColors[goal.category]
                      )}
                    />
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {goal.title}
                            </h3>
                            <Badge
                              variant={
                                goal.status === 'completed'
                                  ? 'success'
                                  : goal.status === 'in_progress'
                                  ? 'primary'
                                  : goal.status === 'paused'
                                  ? 'warning'
                                  : 'default'
                              }
                            >
                              {statusOptions.find((s) => s.value === goal.status)?.label}
                            </Badge>
                            <Badge
                              variant={
                                goal.priority === 'high'
                                  ? 'danger'
                                  : goal.priority === 'medium'
                                  ? 'warning'
                                  : 'default'
                              }
                            >
                              <Flag className="w-3 h-3 mr-1" />
                              {priorityOptions.find((p) => p.value === goal.priority)?.label}
                            </Badge>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 mb-4">
                            {goal.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {goal.endDate ? formatDate(goal.endDate) : 'Pas de deadline'}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              {completedMilestones}/{goal.milestones.length} étapes
                            </span>
                            <span className="flex items-center gap-1">
                              <Circle className="w-4 h-4" />
                              {completedTasks}/{goal.tasks.length} tâches
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <CircularProgress value={goal.progress} size={60} color="primary" />
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteGoal(goal.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExpand(goal.id)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {/* Milestones */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium text-slate-900 dark:text-white">Étapes</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddMilestone(goal.id)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {goal.milestones.map((milestone) => (
                                    <div
                                      key={milestone.id}
                                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                      onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                                    >
                                      {milestone.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-slate-400" />
                                      )}
                                      <span
                                        className={cn(
                                          'flex-1',
                                          milestone.completed && 'line-through text-slate-400'
                                        )}
                                      >
                                        {milestone.title}
                                      </span>
                                    </div>
                                  ))}
                                  {goal.milestones.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">
                                      Aucune étape définie
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Tasks */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-medium text-slate-900 dark:text-white">Tâches</h4>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleAddTask(goal.id)}
                                  >
                                    <Plus className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {goal.tasks.map((task) => (
                                    <div
                                      key={task.id}
                                      className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                                      onClick={() => handleToggleTask(goal.id, task.id)}
                                    >
                                      {task.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-slate-400" />
                                      )}
                                      <span
                                        className={cn(
                                          'flex-1',
                                          task.completed && 'line-through text-slate-400'
                                        )}
                                      >
                                        {task.title}
                                      </span>
                                    </div>
                                  ))}
                                  {goal.tasks.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">
                                      Aucune tâche définie
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Status Update */}
                            <div className="mt-6 flex flex-wrap gap-2">
                              {statusOptions.map((status) => (
                                <Button
                                  key={status.value}
                                  variant={goal.status === status.value ? 'primary' : 'secondary'}
                                  size="sm"
                                  onClick={() => updateGoal(goal.id, { status: status.value as Goal['status'] })}
                                >
                                  {status.label}
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Add Goal Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nouvel objectif" size="lg">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input name="title" label="Titre" placeholder="Mon objectif" required />
          <Textarea name="description" label="Description" placeholder="Décrivez votre objectif..." rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Select name="category" label="Catégorie" options={goalCategories} />
            <Select name="priority" label="Priorité" options={priorityOptions} />
          </div>
          <Input name="endDate" type="date" label="Date d'échéance" />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              <Sparkles className="w-4 h-4" />
              Créer l'objectif
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Goals;
