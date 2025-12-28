import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Plus,
  Calendar,
  Users,
  Flame,
  CheckCircle2,
  Circle,
  Gift,
  Star,
  Trash2,
  Edit3,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  Input,
  Select,
  Badge,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Progress,
} from '../components/ui';
import { formatDate, formatShortDate, generateId, cn, isToday, getWeekDays } from '../utils/helpers';
import { Habit, Event, Relationship } from '../types';

const habitCategories = [
  { value: 'health', label: 'Santé' },
  { value: 'productivity', label: 'Productivité' },
  { value: 'mindfulness', label: 'Pleine conscience' },
  { value: 'social', label: 'Social' },
  { value: 'learning', label: 'Apprentissage' },
  { value: 'other', label: 'Autre' },
];

const habitFrequencies = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
];

const eventTypes = [
  { value: 'birthday', label: 'Anniversaire' },
  { value: 'anniversary', label: 'Célébration' },
  { value: 'appointment', label: 'Rendez-vous' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Autre' },
];

const relationshipTypes = [
  { value: 'family', label: 'Famille' },
  { value: 'friend', label: 'Ami' },
  { value: 'romantic', label: 'Romantique' },
  { value: 'professional', label: 'Professionnel' },
];

const habitColors = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899',
];

const Personal = () => {
  const {
    habits,
    events,
    relationships,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitCompletion,
    addEvent,
    deleteEvent,
    addRelationship,
    deleteRelationship,
  } = useStore();

  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState(habitColors[0]);

  const today = new Date().toISOString().split('T')[0];
  const todayCompletedHabits = habits.filter((h) => h.completedDates.includes(today)).length;
  const habitCompletionRate = habits.length > 0 ? (todayCompletedHabits / habits.length) * 100 : 0;

  // Get week dates
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekDays = getWeekDays();

  const handleAddHabit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const habit: Habit = {
      id: generateId(),
      name: formData.get('name') as string,
      frequency: formData.get('frequency') as Habit['frequency'],
      category: formData.get('category') as Habit['category'],
      streak: 0,
      completedDates: [],
      color: selectedColor,
    };
    addHabit(habit);
    setShowHabitModal(false);
  };

  const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const event: Event = {
      id: generateId(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as Event['type'],
      reminder: true,
    };
    addEvent(event);
    setShowEventModal(false);
  };

  const handleAddRelationship = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const relationship: Relationship = {
      id: generateId(),
      name: formData.get('name') as string,
      type: formData.get('type') as Relationship['type'],
      birthday: formData.get('birthday') as string,
      notes: formData.get('notes') as string,
    };
    addRelationship(relationship);
    setShowRelationshipModal(false);
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vie personnelle</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Habitudes, événements et relations
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Habitudes aujourd'hui</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {todayCompletedHabits}/{habits.length}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
              <Flame className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <Progress value={habitCompletionRate} className="mt-4" color="primary" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Événements à venir</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {upcomingEvents.length}
              </p>
            </div>
            <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
              <Calendar className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Relations</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {relationships.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="habits">
          <TabsList className="mb-6">
            <TabsTrigger value="habits" icon={<Flame className="w-4 h-4" />}>
              Habitudes
            </TabsTrigger>
            <TabsTrigger value="events" icon={<Calendar className="w-4 h-4" />}>
              Événements
            </TabsTrigger>
            <TabsTrigger value="relationships" icon={<Users className="w-4 h-4" />}>
              Relations
            </TabsTrigger>
          </TabsList>

          {/* Habits Tab */}
          <TabsContent value="habits">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowHabitModal(true)}>
                <Plus className="w-4 h-4" />
                Nouvelle habitude
              </Button>
            </div>

            {habits.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Flame className="w-8 h-8" />}
                  title="Aucune habitude"
                  description="Créez des habitudes pour améliorer votre quotidien"
                  action={{
                    label: 'Créer une habitude',
                    onClick: () => setShowHabitModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Habit Tracker Grid */}
                <Card className="p-6 overflow-x-auto">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                    Suivi de la semaine
                  </h3>
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-8 gap-2 mb-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400"></div>
                      {weekDays.map((day, index) => (
                        <div
                          key={day}
                          className={cn(
                            'text-center text-sm font-medium p-2 rounded-lg',
                            isToday(weekDates[index])
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600'
                              : 'text-slate-500 dark:text-slate-400'
                          )}
                        >
                          <div>{day}</div>
                          <div className="text-xs mt-1">{new Date(weekDates[index]).getDate()}</div>
                        </div>
                      ))}
                    </div>

                    {habits.map((habit) => (
                      <div key={habit.id} className="grid grid-cols-8 gap-2 mb-2 items-center">
                        <div className="flex items-center gap-2 pr-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: habit.color }}
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                            {habit.name}
                          </span>
                        </div>
                        {weekDates.map((date) => {
                          const isCompleted = habit.completedDates.includes(date);
                          const isPast = new Date(date) < new Date(today);
                          const isCurrentDay = date === today;

                          return (
                            <button
                              key={date}
                              onClick={() => toggleHabitCompletion(habit.id, date)}
                              className={cn(
                                'w-full aspect-square rounded-lg flex items-center justify-center transition-all',
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isCurrentDay
                                  ? 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                                  : isPast
                                  ? 'bg-red-100 dark:bg-red-900/20'
                                  : 'bg-slate-50 dark:bg-slate-800'
                              )}
                            >
                              {isCompleted && <CheckCircle2 className="w-5 h-5" />}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Habit Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {habits.map((habit) => (
                    <Card key={habit.id} className="p-6" hover>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${habit.color}20` }}
                          >
                            <Flame className="w-5 h-5" style={{ color: habit.color }} />
                          </div>
                          <div>
                            <h3 className="font-medium text-slate-900 dark:text-white">
                              {habit.name}
                            </h3>
                            <Badge variant="secondary" size="sm">
                              {habitFrequencies.find((f) => f.value === habit.frequency)?.label}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHabit(habit.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {habit.streak} jours de suite
                          </span>
                        </div>
                        <button
                          onClick={() => toggleHabitCompletion(habit.id, today)}
                          className={cn(
                            'p-2 rounded-full transition-colors',
                            habit.completedDates.includes(today)
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                          )}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowEventModal(true)}>
                <Plus className="w-4 h-4" />
                Nouvel événement
              </Button>
            </div>

            {events.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Calendar className="w-8 h-8" />}
                  title="Aucun événement"
                  description="Ajoutez des événements pour ne rien oublier"
                  action={{
                    label: 'Ajouter un événement',
                    onClick: () => setShowEventModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((event) => {
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < new Date();

                    return (
                      <Card
                        key={event.id}
                        className={cn('p-6', isPast && 'opacity-60')}
                        hover
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                'w-14 h-14 rounded-xl flex flex-col items-center justify-center',
                                event.type === 'birthday'
                                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600'
                                  : event.type === 'anniversary'
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                              )}
                            >
                              <span className="text-xs font-medium">
                                {eventDate.toLocaleDateString('fr-FR', { month: 'short' })}
                              </span>
                              <span className="text-xl font-bold">{eventDate.getDate()}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium text-slate-900 dark:text-white">
                                  {event.title}
                                </h3>
                                {event.type === 'birthday' && <Gift className="w-4 h-4 text-pink-500" />}
                              </div>
                              {event.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {event.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="secondary" size="sm">
                                  {eventTypes.find((t) => t.value === event.type)?.label}
                                </Badge>
                                {event.time && (
                                  <span className="text-sm text-slate-400">{event.time}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteEvent(event.id)}
                            className="text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            )}
          </TabsContent>

          {/* Relationships Tab */}
          <TabsContent value="relationships">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowRelationshipModal(true)}>
                <Plus className="w-4 h-4" />
                Nouvelle relation
              </Button>
            </div>

            {relationships.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Users className="w-8 h-8" />}
                  title="Aucune relation"
                  description="Ajoutez vos relations importantes"
                  action={{
                    label: 'Ajouter une relation',
                    onClick: () => setShowRelationshipModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relationships.map((rel) => (
                  <Card key={rel.id} className="p-6" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold',
                            rel.type === 'family'
                              ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                              : rel.type === 'friend'
                              ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                              : rel.type === 'romantic'
                              ? 'bg-gradient-to-br from-red-500 to-pink-500'
                              : 'bg-gradient-to-br from-slate-500 to-slate-600'
                          )}
                        >
                          {rel.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-white">{rel.name}</h3>
                          <Badge variant="secondary" size="sm">
                            {relationshipTypes.find((t) => t.value === rel.type)?.label}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteRelationship(rel.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {rel.birthday && (
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <Gift className="w-4 h-4" />
                        {formatDate(rel.birthday)}
                      </div>
                    )}
                    {rel.notes && (
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{rel.notes}</p>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Habit Modal */}
      <Modal isOpen={showHabitModal} onClose={() => setShowHabitModal(false)} title="Nouvelle habitude">
        <form onSubmit={handleAddHabit} className="space-y-4">
          <Input name="name" label="Nom de l'habitude" placeholder="Ex: Méditation" required />
          <div className="grid grid-cols-2 gap-4">
            <Select name="frequency" label="Fréquence" options={habitFrequencies} />
            <Select name="category" label="Catégorie" options={habitCategories} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Couleur
            </label>
            <div className="flex gap-2 flex-wrap">
              {habitColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={cn(
                    'w-8 h-8 rounded-full transition-transform',
                    selectedColor === color && 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowHabitModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Event Modal */}
      <Modal isOpen={showEventModal} onClose={() => setShowEventModal(false)} title="Nouvel événement">
        <form onSubmit={handleAddEvent} className="space-y-4">
          <Input name="title" label="Titre" placeholder="Ex: Anniversaire de Marie" required />
          <Input name="description" label="Description" placeholder="Notes..." />
          <div className="grid grid-cols-2 gap-4">
            <Input name="date" type="date" label="Date" required />
            <Input name="time" type="time" label="Heure" />
          </div>
          <Select name="type" label="Type" options={eventTypes} />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowEventModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Relationship Modal */}
      <Modal isOpen={showRelationshipModal} onClose={() => setShowRelationshipModal(false)} title="Nouvelle relation">
        <form onSubmit={handleAddRelationship} className="space-y-4">
          <Input name="name" label="Nom" placeholder="Ex: Marie Dupont" required />
          <Select name="type" label="Type de relation" options={relationshipTypes} />
          <Input name="birthday" type="date" label="Date d'anniversaire" />
          <Input name="notes" label="Notes" placeholder="Notes personnelles..." />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowRelationshipModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Personal;
