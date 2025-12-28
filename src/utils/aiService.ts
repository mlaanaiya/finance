import { ChatMessage, AIAction } from '../types';
import { generateId, formatCurrency } from './helpers';

interface AIContext {
  transactions: { type: string; amount: number; category: string }[];
  goals: { title: string; status: string; progress: number }[];
  habits: { name: string; streak: number; completedDates: string[] }[];
  healthMetrics: { sleepHours?: number; steps?: number; weight?: number }[];
  moodEntries: { mood: number; energy: number }[];
  profile: {
    lifeGoals: string[];
    challenges: string[];
    priorities: string[];
    financialInfo: {
      monthlyIncome?: number;
      monthlyExpenses?: number;
      debts?: { name: string; amount: number }[];
    };
  } | null;
}

const knowledgeBase = {
  finance: {
    budgeting: [
      "La règle 50/30/20 est un excellent point de départ : 50% pour les besoins, 30% pour les envies, 20% pour l'épargne.",
      "Créez un fonds d'urgence couvrant 3-6 mois de dépenses avant d'investir.",
      "Suivez vos dépenses pendant un mois pour identifier les fuites d'argent.",
    ],
    debt: [
      "La méthode avalanche (rembourser les dettes à taux élevé d'abord) minimise les intérêts.",
      "La méthode boule de neige (petites dettes d'abord) donne des victoires rapides pour la motivation.",
      "Consolidez vos dettes si vous pouvez obtenir un taux d'intérêt plus bas.",
    ],
    savings: [
      "Automatisez votre épargne dès réception du salaire.",
      "Commencez petit : même 50€/mois s'accumulent avec le temps.",
      "Utilisez des comptes séparés pour différents objectifs.",
    ],
  },
  goals: {
    setting: [
      "Utilisez la méthode SMART : Spécifique, Mesurable, Atteignable, Réaliste, Temporel.",
      "Décomposez les grands objectifs en étapes plus petites.",
      "Visualisez votre réussite chaque matin.",
    ],
    motivation: [
      "Célébrez chaque petite victoire.",
      "Trouvez un partenaire de responsabilité.",
      "Rappelez-vous votre 'pourquoi' quand la motivation faiblit.",
    ],
  },
  health: {
    sleep: [
      "Visez 7-9 heures de sommeil par nuit.",
      "Maintenez des horaires réguliers, même le week-end.",
      "Évitez les écrans 1h avant le coucher.",
    ],
    exercise: [
      "30 minutes d'activité modérée par jour suffisent.",
      "Trouvez une activité que vous aimez vraiment.",
      "La régularité compte plus que l'intensité.",
    ],
    nutrition: [
      "Buvez au moins 2L d'eau par jour.",
      "Mangez plus de légumes et de protéines.",
      "Préparez vos repas à l'avance pour éviter les mauvais choix.",
    ],
  },
  psychology: {
    stress: [
      "Pratiquez la respiration profonde 5 minutes par jour.",
      "La méditation réduit significativement le stress.",
      "Identifiez vos déclencheurs de stress pour mieux les gérer.",
    ],
    productivity: [
      "Utilisez la technique Pomodoro : 25 min de travail, 5 min de pause.",
      "Faites les tâches difficiles le matin quand l'énergie est haute.",
      "Limitez les distractions : notifications, réseaux sociaux.",
    ],
    wellbeing: [
      "Pratiquez la gratitude quotidienne.",
      "Maintenez des connexions sociales fortes.",
      "Accordez-vous du temps pour les loisirs sans culpabilité.",
    ],
  },
};

function analyzeContext(context: AIContext): string[] {
  const insights: string[] = [];

  // Financial analysis
  const totalIncome = context.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = context.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  if (savingsRate < 10) {
    insights.push(`Votre taux d'épargne est faible (${savingsRate.toFixed(1)}%). Essayons d'identifier des économies possibles.`);
  } else if (savingsRate >= 20) {
    insights.push(`Excellent taux d'épargne de ${savingsRate.toFixed(1)}% ! Vous êtes sur la bonne voie.`);
  }

  // Goals analysis
  const stuckGoals = context.goals.filter(g => g.status === 'in_progress' && g.progress < 25);
  if (stuckGoals.length > 0) {
    insights.push(`${stuckGoals.length} objectif(s) semblent bloqués. Voulez-vous qu'on les examine ensemble ?`);
  }

  // Habits analysis
  const today = new Date().toISOString().split('T')[0];
  const completedToday = context.habits.filter(h => h.completedDates.includes(today)).length;
  if (context.habits.length > 0 && completedToday < context.habits.length / 2) {
    insights.push(`Vous n'avez complété que ${completedToday}/${context.habits.length} habitudes aujourd'hui.`);
  }

  // Health analysis
  const recentSleep = context.healthMetrics.slice(-7).filter(m => m.sleepHours);
  if (recentSleep.length > 0) {
    const avgSleep = recentSleep.reduce((sum, m) => sum + (m.sleepHours || 0), 0) / recentSleep.length;
    if (avgSleep < 7) {
      insights.push(`Votre moyenne de sommeil est de ${avgSleep.toFixed(1)}h. Essayez de viser 7-8h.`);
    }
  }

  // Mood analysis
  const recentMoods = context.moodEntries.slice(-7);
  if (recentMoods.length > 0) {
    const avgMood = recentMoods.reduce((sum, m) => sum + m.mood, 0) / recentMoods.length;
    if (avgMood < 3) {
      insights.push(`Votre humeur semble basse ces derniers jours. Je suis là si vous voulez en parler.`);
    }
  }

  return insights;
}

function detectIntent(message: string): { category: string; topic: string; needsAction: boolean } {
  const lowerMessage = message.toLowerCase();

  // Finance intents
  if (lowerMessage.includes('argent') || lowerMessage.includes('budget') || lowerMessage.includes('épargne') ||
      lowerMessage.includes('dépense') || lowerMessage.includes('dette') || lowerMessage.includes('économie') ||
      lowerMessage.includes('euro') || lowerMessage.includes('€') || lowerMessage.includes('salaire')) {
    if (lowerMessage.includes('dette') || lowerMessage.includes('rembourser')) {
      return { category: 'finance', topic: 'debt', needsAction: true };
    }
    if (lowerMessage.includes('épargne') || lowerMessage.includes('économiser') || lowerMessage.includes('mettre de côté')) {
      return { category: 'finance', topic: 'savings', needsAction: true };
    }
    return { category: 'finance', topic: 'budgeting', needsAction: false };
  }

  // Goals intents
  if (lowerMessage.includes('objectif') || lowerMessage.includes('but') || lowerMessage.includes('réussir') ||
      lowerMessage.includes('atteindre') || lowerMessage.includes('motivation')) {
    return { category: 'goals', topic: 'setting', needsAction: lowerMessage.includes('créer') || lowerMessage.includes('ajouter') };
  }

  // Health intents
  if (lowerMessage.includes('sommeil') || lowerMessage.includes('dormir') || lowerMessage.includes('fatigue')) {
    return { category: 'health', topic: 'sleep', needsAction: false };
  }
  if (lowerMessage.includes('sport') || lowerMessage.includes('exercice') || lowerMessage.includes('musculation') ||
      lowerMessage.includes('courir') || lowerMessage.includes('gym')) {
    return { category: 'health', topic: 'exercise', needsAction: false };
  }
  if (lowerMessage.includes('manger') || lowerMessage.includes('régime') || lowerMessage.includes('nutrition') ||
      lowerMessage.includes('poids') || lowerMessage.includes('eau')) {
    return { category: 'health', topic: 'nutrition', needsAction: false };
  }

  // Psychology intents
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxieux') || lowerMessage.includes('angoisse') ||
      lowerMessage.includes('pression')) {
    return { category: 'psychology', topic: 'stress', needsAction: false };
  }
  if (lowerMessage.includes('productif') || lowerMessage.includes('concentration') || lowerMessage.includes('focus') ||
      lowerMessage.includes('procrastination') || lowerMessage.includes('travail')) {
    return { category: 'psychology', topic: 'productivity', needsAction: false };
  }
  if (lowerMessage.includes('heureux') || lowerMessage.includes('bonheur') || lowerMessage.includes('bien-être') ||
      lowerMessage.includes('triste') || lowerMessage.includes('déprime')) {
    return { category: 'psychology', topic: 'wellbeing', needsAction: false };
  }

  // Default
  return { category: 'general', topic: 'general', needsAction: false };
}

function generateActions(intent: { category: string; topic: string; needsAction: boolean }, message: string): AIAction[] {
  const actions: AIAction[] = [];

  // Parse amounts if mentioned
  const amountMatch = message.match(/(\d+(?:[.,]\d+)?)\s*(?:€|euros?)/i);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : undefined;

  if (intent.needsAction) {
    if (intent.category === 'finance' && intent.topic === 'debt') {
      actions.push({
        type: 'create_goal',
        data: {
          title: 'Rembourser ma dette',
          category: 'finance',
          priority: 'high',
          targetAmount: amount,
        },
        executed: false,
      });
    }
    if (intent.category === 'finance' && intent.topic === 'savings' && amount) {
      actions.push({
        type: 'create_budget',
        data: {
          category: 'savings',
          limit: amount,
          period: 'monthly',
        },
        executed: false,
      });
    }
    if (intent.category === 'goals') {
      actions.push({
        type: 'create_goal',
        data: {
          title: 'Nouvel objectif',
          category: 'personal',
        },
        executed: false,
      });
    }
  }

  return actions;
}

export function generateAIResponse(userMessage: string, context: AIContext): ChatMessage {
  const intent = detectIntent(userMessage);
  const insights = analyzeContext(context);
  const actions = generateActions(intent, userMessage);

  let response = '';

  // Greeting detection
  const lowerMessage = userMessage.toLowerCase();
  if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello') || lowerMessage.includes('coucou')) {
    response = `Bonjour ! 👋 Je suis votre assistant personnel de gestion de vie. Comment puis-je vous aider aujourd'hui ?\n\n`;
    if (insights.length > 0) {
      response += `Voici ce que j'ai remarqué :\n${insights.map(i => `• ${i}`).join('\n')}`;
    }
  }
  // Help request
  else if (lowerMessage.includes('aide') || lowerMessage.includes('help') || lowerMessage.includes('que peux-tu faire')) {
    response = `Je peux vous aider avec plusieurs aspects de votre vie :\n\n` +
      `💰 **Finances** - Budget, épargne, dettes, objectifs financiers\n` +
      `🎯 **Objectifs** - Définir, suivre et atteindre vos buts\n` +
      `❤️ **Vie personnelle** - Habitudes, relations, événements\n` +
      `💼 **Carrière** - Projets, compétences, productivité\n` +
      `🏃 **Santé** - Sommeil, exercice, nutrition\n` +
      `🧠 **Bien-être mental** - Stress, motivation, bonheur\n\n` +
      `Posez-moi une question ou parlez-moi de vos préoccupations !`;
  }
  // Specific topic responses
  else if (intent.category !== 'general') {
    const categoryKnowledge = knowledgeBase[intent.category as keyof typeof knowledgeBase];
    if (categoryKnowledge) {
      const topicKnowledge = categoryKnowledge[intent.topic as keyof typeof categoryKnowledge] as string[] | undefined;
      if (topicKnowledge && Array.isArray(topicKnowledge)) {
        const randomTips = [...topicKnowledge].sort(() => 0.5 - Math.random()).slice(0, 2);

        response = `Je comprends que vous vous intéressez à ${
          intent.topic === 'budgeting' ? 'la gestion du budget' :
          intent.topic === 'debt' ? 'le remboursement des dettes' :
          intent.topic === 'savings' ? "l'épargne" :
          intent.topic === 'sleep' ? 'le sommeil' :
          intent.topic === 'exercise' ? "l'exercice physique" :
          intent.topic === 'nutrition' ? 'la nutrition' :
          intent.topic === 'stress' ? 'la gestion du stress' :
          intent.topic === 'productivity' ? 'la productivité' :
          intent.topic === 'wellbeing' ? 'le bien-être' :
          intent.topic === 'setting' ? 'la définition d\'objectifs' :
          intent.topic === 'motivation' ? 'la motivation' : 'ce sujet'
        }.\n\n`;

        response += `Voici quelques conseils :\n${randomTips.map((t: string) => `• ${t}`).join('\n')}\n\n`;

        // Add contextual insights
        if (intent.category === 'finance' && context.profile?.financialInfo) {
          const { monthlyIncome, monthlyExpenses } = context.profile.financialInfo;
          if (monthlyIncome && monthlyExpenses) {
            const savings = monthlyIncome - monthlyExpenses;
            response += `D'après vos données, vous avez un surplus mensuel de ${formatCurrency(savings)}. `;
            if (savings > 0) {
              response += `C'est une bonne base pour atteindre vos objectifs !`;
            } else {
              response += `Nous devrions analyser vos dépenses pour trouver des économies.`;
            }
          }
        }

        if (actions.length > 0) {
          response += `\n\nVoulez-vous que je crée un objectif ou un budget pour vous aider ?`;
        }
      }
    }
  }
  // General conversation
  else {
    response = `Je comprends. Pouvez-vous me donner plus de détails sur ce qui vous préoccupe ?\n\n` +
      `Je peux vous aider avec :\n` +
      `• Vos finances et votre budget\n` +
      `• Vos objectifs de vie\n` +
      `• Votre santé et bien-être\n` +
      `• Votre productivité\n\n` +
      `N'hésitez pas à me poser des questions spécifiques !`;
  }

  // Add encouragement sometimes
  if (Math.random() > 0.7) {
    const encouragements = [
      "\n\n💪 Vous êtes sur la bonne voie !",
      "\n\n✨ Chaque petit pas compte !",
      "\n\n🌟 Je crois en vous !",
    ];
    response += encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  return {
    id: generateId(),
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
    actions: actions.length > 0 ? actions : undefined,
  };
}

export function getQuickSuggestions(): string[] {
  return [
    "Comment économiser plus ?",
    "Aide-moi à définir un objectif",
    "Conseils pour mieux dormir",
    "Comment gérer mon stress ?",
    "Analyse mes finances",
    "Quelles habitudes adopter ?",
  ];
}
