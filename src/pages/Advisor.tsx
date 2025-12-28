import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Mic,
  Wallet,
  Target,
  Heart,
  Briefcase,
  Activity,
  Brain,
  RefreshCw,
  Bot,
  User,
  Lightbulb,
  TrendingUp,
  Clock,
  Zap,
  Star,
  MessageCircle,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Input,
} from '../components/ui';
import { cn, formatDate, generateId } from '../utils/helpers';
import { generateAIResponse, getQuickSuggestions } from '../utils/aiService';
import { ChatMessage } from '../types';

const Advisor = () => {
  const {
    profile,
    transactions,
    goals,
    habits,
    healthMetrics,
    moodEntries,
    chatMessages,
    addChatMessage,
    clearChat,
  } = useStore();

  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    addChatMessage(userMessage);
    setMessage('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

    const context = {
      transactions: transactions.map((t) => ({
        type: t.type,
        amount: t.amount,
        category: t.category,
      })),
      goals: goals.map((g) => ({
        title: g.title,
        status: g.status,
        progress: g.progress,
      })),
      habits: habits.map((h) => ({
        name: h.name,
        streak: h.streak,
        completedDates: h.completedDates,
      })),
      healthMetrics: healthMetrics.map((m) => ({
        sleepHours: m.sleepHours,
        steps: m.steps,
        weight: m.weight,
      })),
      moodEntries: moodEntries.map((m) => ({
        mood: m.mood,
        energy: m.energy,
      })),
      profile: profile
        ? {
            lifeGoals: profile.lifeGoals,
            challenges: profile.challenges,
            priorities: profile.priorities,
            financialInfo: profile.financialInfo,
          }
        : null,
    };

    const aiResponse = generateAIResponse(message, context);
    setIsTyping(false);
    addChatMessage(aiResponse);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    inputRef.current?.focus();
  };

  const quickSuggestions = getQuickSuggestions();

  // Calculate life scores
  const calculateScores = () => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    const financeScore = Math.min(100, Math.max(0, 50 + savingsRate));
    const goalsScore = goals.length > 0
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
      : 50;
    const healthScore = healthMetrics.length > 0
      ? Math.min(100, healthMetrics.slice(-7).reduce((sum, m) => {
          let score = 50;
          if (m.sleepHours && m.sleepHours >= 7) score += 25;
          if (m.steps && m.steps >= 8000) score += 25;
          return sum + score;
        }, 0) / Math.min(7, healthMetrics.length))
      : 50;
    const wellbeingScore = moodEntries.length > 0
      ? (moodEntries.slice(-7).reduce((sum, m) => sum + m.mood, 0) / Math.min(7, moodEntries.length)) * 20
      : 50;

    const overall = Math.round((financeScore + goalsScore + healthScore + wellbeingScore) / 4);

    return {
      overall,
      finance: Math.round(financeScore),
      goals: Math.round(goalsScore),
      health: Math.round(healthScore),
      wellbeing: Math.round(wellbeingScore),
    };
  };

  const scores = calculateScores();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
      className="h-[calc(100vh-4rem)] flex flex-col"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            Assistant IA
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Votre coach personnel pour une vie épanouie
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'chat' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('chat')}
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </Button>
          <Button
            variant={activeTab === 'insights' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('insights')}
          >
            <TrendingUp className="w-4 h-4" />
            Insights
          </Button>
        </div>
      </motion.div>

      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Area */}
          <motion.div variants={itemVariants} className="flex-1 flex flex-col min-h-0">
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30">
                      <Bot className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      Bonjour, je suis votre assistant !
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                      Je peux vous aider avec vos finances, objectifs, santé et bien-être.
                      Posez-moi une question ou choisissez un sujet ci-dessous.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                      {quickSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleQuickSuggestion(suggestion)}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                        >
                          <ChevronRight className="w-3 h-3" />
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    <AnimatePresence>
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={cn(
                            'flex gap-4',
                            msg.role === 'user' ? 'flex-row-reverse' : ''
                          )}
                        >
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                              msg.role === 'user'
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                : 'bg-gradient-to-br from-emerald-400 to-cyan-500'
                            )}
                          >
                            {msg.role === 'user' ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <Bot className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div
                            className={cn(
                              'max-w-[80%] p-4 rounded-2xl',
                              msg.role === 'user'
                                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-tl-none'
                            )}
                          >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            <p
                              className={cn(
                                'text-xs mt-2',
                                msg.role === 'user'
                                  ? 'text-white/70'
                                  : 'text-slate-500 dark:text-slate-400'
                              )}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Quick Actions */}
              {chatMessages.length > 0 && (
                <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSuggestion(suggestion)}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium whitespace-nowrap transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                    <button
                      onClick={clearChat}
                      className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Effacer
                    </button>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Posez votre question..."
                      className="w-full px-5 py-3.5 bg-slate-100 dark:bg-slate-800 border-0 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isTyping}
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all',
                      message.trim() && !isTyping
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      ) : (
        /* Insights Tab */
        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Score Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <p className="text-white/80 mb-2">Score de vie global</p>
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-bold">{scores.overall}</span>
                    <span className="text-2xl text-white/80">/100</span>
                  </div>
                  <p className="mt-2 text-white/80">
                    Basé sur vos finances, objectifs, santé et bien-être
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Wallet, label: 'Finances', score: scores.finance },
                    { icon: Target, label: 'Objectifs', score: scores.goals },
                    { icon: Activity, label: 'Santé', score: scores.health },
                    { icon: Brain, label: 'Bien-être', score: scores.wellbeing },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-2">
                        <item.icon className="w-7 h-7" />
                      </div>
                      <p className="text-sm text-white/80">{item.label}</p>
                      <p className="font-bold text-lg">{item.score}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Daily Tips */}
          <motion.div variants={itemVariants}>
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Conseils du jour
                </CardTitle>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <Wallet className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Finances</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Automatisez votre épargne dès réception du salaire pour atteindre vos objectifs plus rapidement.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Santé</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    30 minutes d'activité modérée par jour suffisent pour améliorer significativement votre santé.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Bien-être</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Pratiquez la gratitude quotidienne pour améliorer votre humeur et votre perspective sur la vie.
                  </p>
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
                  Plan recommandé
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
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      Méditation (10 min)
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      Revoir vos objectifs
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-amber-500" />
                      Exercice physique
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Briefcase className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Après-midi</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      Focus sur les priorités
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      Pause et hydratation
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-blue-500" />
                      Réviser les finances
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">Soir</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-500" />
                      Bilan de la journée
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-500" />
                      Préparer demain
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-purple-500" />
                      Déconnexion digitale
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white border-0">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Besoin d'aide personnalisée ?</h3>
                    <p className="text-white/70">Discutez avec votre assistant IA pour des conseils sur mesure</p>
                  </div>
                </div>
                <Button
                  onClick={() => setActiveTab('chat')}
                  className="bg-white text-slate-900 hover:bg-white/90"
                >
                  <Sparkles className="w-4 h-4" />
                  Démarrer une conversation
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Advisor;
