import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Plus,
  Smile,
  Frown,
  Meh,
  Heart,
  BookOpen,
  Sparkles,
  Trash2,
  Calendar,
  Zap,
  Sun,
  Cloud,
  CloudRain,
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
  Badge,
  EmptyState,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components/ui';
import { formatDate, generateId, cn, getMoodEmoji, getMoodLabel, getEnergyLabel } from '../utils/helpers';
import { MoodEntry, JournalEntry } from '../types';

const moodOptions = [
  { value: 1, emoji: '😢', label: 'Très mauvais', color: 'bg-red-500' },
  { value: 2, emoji: '😔', label: 'Mauvais', color: 'bg-orange-500' },
  { value: 3, emoji: '😐', label: 'Neutre', color: 'bg-yellow-500' },
  { value: 4, emoji: '🙂', label: 'Bon', color: 'bg-green-400' },
  { value: 5, emoji: '😄', label: 'Excellent', color: 'bg-green-500' },
];

const moodTags = [
  'Travail', 'Famille', 'Amis', 'Sport', 'Fatigue', 'Stress',
  'Relaxation', 'Productif', 'Créatif', 'Anxieux', 'Motivé', 'Triste',
];

const affirmations = [
  "Je suis capable de surmonter tous les défis.",
  "Chaque jour est une nouvelle opportunité.",
  "Je mérite le bonheur et le succès.",
  "Je suis en paix avec moi-même.",
  "Je suis reconnaissant pour tout ce que j'ai.",
  "Je progresse chaque jour vers mes objectifs.",
  "Je suis entouré de personnes qui m'aiment.",
  "Je fais confiance au processus de la vie.",
  "Je suis fort, courageux et confiant.",
  "Aujourd'hui est un jour merveilleux.",
];

const Psychology = () => {
  const {
    moodEntries,
    journalEntries,
    addMoodEntry,
    addJournalEntry,
    deleteJournalEntry,
  } = useStore();

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [selectedMood, setSelectedMood] = useState(3);
  const [selectedEnergy, setSelectedEnergy] = useState(3);
  const [selectedAnxiety, setSelectedAnxiety] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dailyAffirmation] = useState(affirmations[Math.floor(Math.random() * affirmations.length)]);

  const today = new Date().toISOString().split('T')[0];
  const todayMood = moodEntries.find((m) => m.date === today);

  const handleAddMood = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const entry: MoodEntry = {
      id: generateId(),
      date: today,
      mood: selectedMood as MoodEntry['mood'],
      energy: selectedEnergy as MoodEntry['energy'],
      anxiety: selectedAnxiety as MoodEntry['anxiety'],
      notes: formData.get('notes') as string,
      tags: selectedTags,
    };
    addMoodEntry(entry);
    setShowMoodModal(false);
    setSelectedTags([]);
  };

  const handleAddJournal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const gratitude = (formData.get('gratitude') as string).split('\n').filter((g) => g.trim());
    const entry: JournalEntry = {
      id: generateId(),
      date: today,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      mood: selectedMood,
      gratitude,
      tags: [],
    };
    addJournalEntry(entry);
    setShowJournalModal(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Calculate mood stats
  const recentMoods = moodEntries.slice(-7);
  const avgMood = recentMoods.length > 0
    ? recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length
    : 0;
  const avgEnergy = recentMoods.length > 0
    ? recentMoods.reduce((sum, m) => sum + m.energy, 0) / recentMoods.length
    : 0;

  // Mood calendar data
  const getMoodForDate = (date: string) => {
    const entry = moodEntries.find((m) => m.date === date);
    return entry?.mood;
  };

  // Get last 30 days
  const getLast30Days = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getMoodIcon = (mood: number) => {
    if (mood >= 4) return <Sun className="w-5 h-5 text-amber-500" />;
    if (mood === 3) return <Cloud className="w-5 h-5 text-slate-400" />;
    return <CloudRain className="w-5 h-5 text-blue-500" />;
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Psychologie</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Suivez votre humeur et votre bien-être mental
          </p>
        </div>
      </motion.div>

      {/* Daily Affirmation */}
      <motion.div variants={itemVariants}>
        <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">Affirmation du jour</p>
              <p className="text-xl font-medium">"{dailyAffirmation}"</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Mood Entry */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Comment vous sentez-vous aujourd'hui ?</CardTitle>
              {todayMood && (
                <Badge variant="success">
                  Enregistré: {getMoodEmoji(todayMood.mood)}
                </Badge>
              )}
            </div>
          </CardHeader>

          {!todayMood ? (
            <div className="flex flex-wrap justify-center gap-4">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMood(option.value);
                    setShowMoodModal(true);
                  }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-4xl">{option.emoji}</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{option.label}</span>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-3xl mb-2">{getMoodEmoji(todayMood.mood)}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Humeur</p>
                <p className="font-medium text-slate-900 dark:text-white">{getMoodLabel(todayMood.mood)}</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Zap className="w-8 h-8 mx-auto mb-2 text-amber-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Énergie</p>
                <p className="font-medium text-slate-900 dark:text-white">{getEnergyLabel(todayMood.energy)}</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <Brain className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Anxiété</p>
                <p className="font-medium text-slate-900 dark:text-white">{todayMood.anxiety}/5</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Humeur moyenne (7j)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {avgMood.toFixed(1)}/5
              </p>
            </div>
            <div className="text-3xl">{getMoodEmoji(Math.round(avgMood) || 3)}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Énergie moyenne (7j)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {avgEnergy.toFixed(1)}/5
              </p>
            </div>
            <Zap className="w-8 h-8 text-amber-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Entrées journal</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {journalEntries.length}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-indigo-500" />
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="mood">
          <TabsList className="mb-6">
            <TabsTrigger value="mood" icon={<Smile className="w-4 h-4" />}>
              Suivi d'humeur
            </TabsTrigger>
            <TabsTrigger value="journal" icon={<BookOpen className="w-4 h-4" />}>
              Journal
            </TabsTrigger>
          </TabsList>

          {/* Mood Tab */}
          <TabsContent value="mood">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle>Calendrier d'humeur (30 derniers jours)</CardTitle>
              </CardHeader>

              <div className="grid grid-cols-7 gap-2">
                {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                  <div key={i} className="text-center text-xs text-slate-500 dark:text-slate-400 pb-2">
                    {day}
                  </div>
                ))}
                {getLast30Days().map((date) => {
                  const mood = getMoodForDate(date);
                  const isToday = date === today;

                  return (
                    <motion.div
                      key={date}
                      whileHover={{ scale: 1.1 }}
                      className={cn(
                        'aspect-square rounded-lg flex items-center justify-center text-sm cursor-pointer transition-colors',
                        isToday && 'ring-2 ring-indigo-500',
                        mood
                          ? moodOptions[mood - 1].color
                          : 'bg-slate-100 dark:bg-slate-800'
                      )}
                      title={`${formatDate(date)}${mood ? ` - ${getMoodLabel(mood)}` : ''}`}
                    >
                      {mood ? (
                        <span className="text-white text-xs">{new Date(date).getDate()}</span>
                      ) : (
                        <span className="text-slate-400 text-xs">{new Date(date).getDate()}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                {moodOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-2">
                    <div className={cn('w-4 h-4 rounded', option.color)} />
                    <span className="text-xs text-slate-500 dark:text-slate-400">{option.emoji}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Mood Entries */}
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Entrées récentes</h3>
              {moodEntries.length === 0 ? (
                <Card className="p-6">
                  <EmptyState
                    icon={<Smile className="w-8 h-8" />}
                    title="Aucune entrée d'humeur"
                    description="Commencez à suivre votre humeur quotidienne"
                  />
                </Card>
              ) : (
                moodEntries.slice(-5).reverse().map((entry) => (
                  <Card key={entry.id} className="p-6" hover>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{getMoodEmoji(entry.mood)}</div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {formatDate(entry.date)}
                          </p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                            <span>Énergie: {entry.energy}/5</span>
                            <span>Anxiété: {entry.anxiety}/5</span>
                          </div>
                          {entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entry.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                              ))}
                            </div>
                          )}
                          {entry.notes && (
                            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {getMoodIcon(entry.mood)}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Journal Tab */}
          <TabsContent value="journal">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowJournalModal(true)}>
                <Plus className="w-4 h-4" />
                Nouvelle entrée
              </Button>
            </div>

            {journalEntries.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<BookOpen className="w-8 h-8" />}
                  title="Aucune entrée de journal"
                  description="Écrivez vos pensées et réflexions quotidiennes"
                  action={{
                    label: 'Écrire',
                    onClick: () => setShowJournalModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                {journalEntries.slice().reverse().map((entry) => (
                  <Card key={entry.id} className="p-6" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {entry.title || 'Sans titre'}
                          </h3>
                          {entry.mood && (
                            <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteJournalEntry(entry.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                      {entry.content}
                    </p>

                    {entry.gratitude && entry.gratitude.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
                          <Heart className="w-4 h-4 text-pink-500" />
                          Gratitudes
                        </p>
                        <ul className="space-y-1">
                          {entry.gratitude.map((g, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-300">
                              • {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Mood Modal */}
      <Modal isOpen={showMoodModal} onClose={() => setShowMoodModal(false)} title="Enregistrer votre humeur" size="lg">
        <form onSubmit={handleAddMood} className="space-y-6">
          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Humeur
            </label>
            <div className="flex justify-between">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                    selectedMood === option.value
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <span className="text-3xl">{option.emoji}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Niveau d'énergie: {selectedEnergy}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={selectedEnergy}
              onChange={(e) => setSelectedEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Anxiety Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Niveau d'anxiété: {selectedAnxiety}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={selectedAnxiety}
              onChange={(e) => setSelectedAnxiety(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Tags (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {moodTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedTags.includes(tag)
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <Textarea name="notes" label="Notes (optionnel)" placeholder="Comment s'est passée votre journée ?" rows={3} />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowMoodModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Journal Modal */}
      <Modal isOpen={showJournalModal} onClose={() => setShowJournalModal(false)} title="Nouvelle entrée de journal" size="lg">
        <form onSubmit={handleAddJournal} className="space-y-4">
          <Input name="title" label="Titre (optionnel)" placeholder="Titre de l'entrée" />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Humeur
            </label>
            <div className="flex justify-between">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedMood(option.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                    selectedMood === option.value
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  )}
                >
                  <span className="text-2xl">{option.emoji}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <Textarea name="content" label="Contenu" placeholder="Écrivez vos pensées..." rows={6} required />

          <Textarea
            name="gratitude"
            label="Gratitudes (une par ligne)"
            placeholder="De quoi êtes-vous reconnaissant aujourd'hui ?"
            rows={3}
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowJournalModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              <BookOpen className="w-4 h-4" />
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Psychology;
