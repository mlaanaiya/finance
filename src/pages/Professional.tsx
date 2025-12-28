import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Plus,
  FolderKanban,
  GraduationCap,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  Circle,
  Trash2,
  BarChart3,
  Timer,
  Zap,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  Progress,
  Badge,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  CircularProgress,
} from '../components/ui';
import { formatDate, generateId, cn } from '../utils/helpers';
import { Project, Skill, WorkSession, Task } from '../types';

const projectStatuses = [
  { value: 'planning', label: 'Planification' },
  { value: 'active', label: 'Actif' },
  { value: 'completed', label: 'Terminé' },
  { value: 'on_hold', label: 'En pause' },
];

const skillLevels = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
  { value: 'expert', label: 'Expert' },
];

const skillCategories = [
  { value: 'programming', label: 'Programmation' },
  { value: 'design', label: 'Design' },
  { value: 'management', label: 'Management' },
  { value: 'communication', label: 'Communication' },
  { value: 'language', label: 'Langues' },
  { value: 'other', label: 'Autre' },
];

const Professional = () => {
  const {
    projects,
    skills,
    workSessions,
    addProject,
    updateProject,
    deleteProject,
    addSkill,
    updateSkill,
    deleteSkill,
    addWorkSession,
    updateWorkSession,
  } = useStore();

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerStart, setTimerStart] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer logic
  const startTimer = (projectId?: string) => {
    setActiveTimer(projectId || 'general');
    setTimerStart(new Date());
    setElapsedTime(0);

    const interval = setInterval(() => {
      if (timerStart) {
        setElapsedTime(Math.floor((new Date().getTime() - timerStart.getTime()) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  };

  const stopTimer = () => {
    if (timerStart && activeTimer) {
      const session: WorkSession = {
        id: generateId(),
        project: activeTimer === 'general' ? undefined : activeTimer,
        startTime: timerStart.toISOString(),
        endTime: new Date().toISOString(),
        duration: Math.floor((new Date().getTime() - timerStart.getTime()) / 60000),
      };
      addWorkSession(session);
    }
    setActiveTimer(null);
    setTimerStart(null);
    setElapsedTime(0);
  };

  const formatTimer = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const project: Project = {
      id: generateId(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as Project['status'],
      deadline: formData.get('deadline') as string,
      progress: 0,
      tasks: [],
    };
    addProject(project);
    setShowProjectModal(false);
  };

  const handleAddSkill = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const skill: Skill = {
      id: generateId(),
      name: formData.get('name') as string,
      level: formData.get('level') as Skill['level'],
      category: formData.get('category') as string,
    };
    addSkill(skill);
    setShowSkillModal(false);
  };

  const handleAddTask = (projectId: string) => {
    const title = prompt('Titre de la tâche:');
    if (title) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        const newTask: Task = {
          id: generateId(),
          title,
          completed: false,
          priority: 'medium',
        };
        updateProject(projectId, {
          tasks: [...project.tasks, newTask],
        });
      }
    }
  };

  const handleToggleTask = (projectId: string, taskId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const updatedTasks = project.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const progress = updatedTasks.length > 0 ? (completedCount / updatedTasks.length) * 100 : 0;

      updateProject(projectId, {
        tasks: updatedTasks,
        progress,
        status: progress === 100 ? 'completed' : project.status === 'planning' ? 'active' : project.status,
      });
    }
  };

  // Calculate stats
  const totalWorkMinutes = workSessions.reduce((sum, s) => sum + s.duration, 0);
  const totalWorkHours = Math.floor(totalWorkMinutes / 60);
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  const getLevelProgress = (level: Skill['level']) => {
    const levels = { beginner: 25, intermediate: 50, advanced: 75, expert: 100 };
    return levels[level];
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vie professionnelle</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Projets, compétences et productivité
          </p>
        </div>
      </motion.div>

      {/* Timer Card */}
      <motion.div variants={itemVariants}>
        <Card className={cn(
          'p-6',
          activeTimer && 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0'
        )}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                'p-4 rounded-2xl',
                activeTimer ? 'bg-white/20' : 'bg-indigo-100 dark:bg-indigo-900/30'
              )}>
                <Timer className={cn('w-8 h-8', activeTimer ? 'text-white' : 'text-indigo-600')} />
              </div>
              <div>
                <h3 className={cn(
                  'text-lg font-semibold',
                  activeTimer ? 'text-white' : 'text-slate-900 dark:text-white'
                )}>
                  {activeTimer ? 'Session en cours' : 'Chronomètre de travail'}
                </h3>
                <p className={cn(
                  'text-3xl font-bold font-mono',
                  activeTimer ? 'text-white' : 'text-slate-900 dark:text-white'
                )}>
                  {formatTimer(elapsedTime)}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              {activeTimer ? (
                <Button
                  variant="secondary"
                  onClick={stopTimer}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Pause className="w-4 h-4" />
                  Arrêter
                </Button>
              ) : (
                <Button onClick={() => startTimer()}>
                  <Play className="w-4 h-4" />
                  Démarrer
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Projets actifs</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{activeProjects}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Heures travaillées</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalWorkHours}h</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Compétences</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{skills.length}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="projects">
          <TabsList className="mb-6">
            <TabsTrigger value="projects" icon={<FolderKanban className="w-4 h-4" />}>
              Projets
            </TabsTrigger>
            <TabsTrigger value="skills" icon={<GraduationCap className="w-4 h-4" />}>
              Compétences
            </TabsTrigger>
            <TabsTrigger value="productivity" icon={<BarChart3 className="w-4 h-4" />}>
              Productivité
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowProjectModal(true)}>
                <Plus className="w-4 h-4" />
                Nouveau projet
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<FolderKanban className="w-8 h-8" />}
                  title="Aucun projet"
                  description="Créez votre premier projet pour organiser votre travail"
                  action={{
                    label: 'Créer un projet',
                    onClick: () => setShowProjectModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => {
                  const completedTasks = project.tasks.filter((t) => t.completed).length;

                  return (
                    <Card key={project.id} className="p-6" hover>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {project.name}
                            </h3>
                            <Badge
                              variant={
                                project.status === 'completed'
                                  ? 'success'
                                  : project.status === 'active'
                                  ? 'primary'
                                  : project.status === 'on_hold'
                                  ? 'warning'
                                  : 'secondary'
                              }
                            >
                              {projectStatuses.find((s) => s.value === project.status)?.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            {project.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!activeTimer && project.status === 'active' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startTimer(project.id)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteProject(project.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">
                            Progression: {completedTasks}/{project.tasks.length} tâches
                          </span>
                          <span className="font-medium text-slate-900 dark:text-white">
                            {project.progress.toFixed(0)}%
                          </span>
                        </div>
                        <Progress value={project.progress} color="primary" />

                        {project.deadline && (
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Échéance: {formatDate(project.deadline)}
                          </p>
                        )}
                      </div>

                      {/* Tasks */}
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Tâches
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddTask(project.id)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {project.tasks.map((task) => (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(project.id, task.id)}
                              className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                              <span
                                className={cn(
                                  'text-sm',
                                  task.completed && 'line-through text-slate-400'
                                )}
                              >
                                {task.title}
                              </span>
                            </div>
                          ))}
                          {project.tasks.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-2">
                              Aucune tâche
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowSkillModal(true)}>
                <Plus className="w-4 h-4" />
                Nouvelle compétence
              </Button>
            </div>

            {skills.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<GraduationCap className="w-8 h-8" />}
                  title="Aucune compétence"
                  description="Ajoutez vos compétences pour suivre votre évolution"
                  action={{
                    label: 'Ajouter une compétence',
                    onClick: () => setShowSkillModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <Card key={skill.id} className="p-6" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {skill.name}
                        </h3>
                        <Badge variant="secondary" size="sm">
                          {skillCategories.find((c) => c.value === skill.category)?.label}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSkill(skill.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {skillLevels.find((l) => l.value === skill.level)?.label}
                      </span>
                      <CircularProgress
                        value={getLevelProgress(skill.level)}
                        size={50}
                        strokeWidth={4}
                        color="primary"
                      />
                    </div>

                    <div className="flex gap-1">
                      {skillLevels.map((level, index) => (
                        <button
                          key={level.value}
                          onClick={() => updateSkill(skill.id, { level: level.value as Skill['level'] })}
                          className={cn(
                            'flex-1 h-2 rounded-full transition-colors',
                            getLevelProgress(skill.level) >= (index + 1) * 25
                              ? 'bg-indigo-500'
                              : 'bg-slate-200 dark:bg-slate-700'
                          )}
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Productivity Tab */}
          <TabsContent value="productivity">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Sessions de travail récentes</CardTitle>
              </CardHeader>

              {workSessions.length === 0 ? (
                <EmptyState
                  icon={<Clock className="w-8 h-8" />}
                  title="Aucune session"
                  description="Utilisez le chronomètre pour enregistrer vos sessions de travail"
                />
              ) : (
                <div className="space-y-3">
                  {workSessions
                    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                    .slice(0, 10)
                    .map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                            <Clock className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {session.project
                                ? projects.find((p) => p.id === session.project)?.name || 'Projet inconnu'
                                : 'Session générale'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {formatDate(session.startTime)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {Math.floor(session.duration / 60)}h {session.duration % 60}min
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Project Modal */}
      <Modal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} title="Nouveau projet">
        <form onSubmit={handleAddProject} className="space-y-4">
          <Input name="name" label="Nom du projet" placeholder="Mon projet" required />
          <Textarea name="description" label="Description" placeholder="Description du projet..." rows={3} />
          <div className="grid grid-cols-2 gap-4">
            <Select name="status" label="Statut" options={projectStatuses} />
            <Input name="deadline" type="date" label="Échéance" />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowProjectModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Skill Modal */}
      <Modal isOpen={showSkillModal} onClose={() => setShowSkillModal(false)} title="Nouvelle compétence">
        <form onSubmit={handleAddSkill} className="space-y-4">
          <Input name="name" label="Compétence" placeholder="Ex: React, Python, Leadership..." required />
          <div className="grid grid-cols-2 gap-4">
            <Select name="level" label="Niveau" options={skillLevels} />
            <Select name="category" label="Catégorie" options={skillCategories} />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowSkillModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Professional;
