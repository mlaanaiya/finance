import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PiggyBank,
  CreditCard,
  MoreVertical,
  Trash2,
  Edit3,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useStore } from '../store/useStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Modal,
  Input,
  Select,
  StatCard,
  Progress,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  EmptyState,
} from '../components/ui';
import { formatCurrency, formatDate, generateId, cn } from '../utils/helpers';
import { Transaction, Budget, FinancialGoal } from '../types';

const expenseCategories = [
  { value: 'housing', label: 'Logement' },
  { value: 'food', label: 'Alimentation' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Factures' },
  { value: 'entertainment', label: 'Loisirs' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Santé' },
  { value: 'education', label: 'Éducation' },
  { value: 'other', label: 'Autre' },
];

const incomeCategories = [
  { value: 'salary', label: 'Salaire' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investissement' },
  { value: 'gift', label: 'Cadeau' },
  { value: 'other', label: 'Autre' },
];

const Finances = () => {
  const {
    transactions,
    budgets,
    financialGoals,
    addTransaction,
    deleteTransaction,
    addBudget,
    deleteBudget,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
  } = useStore();

  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate stats
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  // Monthly data for chart
  const getMonthlyData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months.map((name, index) => {
      const monthTransactions = transactions.filter((t) => {
        const date = new Date(t.date);
        return date.getMonth() === index;
      });
      return {
        name,
        revenus: monthTransactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
        depenses: monthTransactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
      };
    });
  };

  // Category spending
  const getCategorySpending = () => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category: expenseCategories.find((c) => c.value === category)?.label || category,
      amount,
    }));
  };

  const handleAddTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const transaction: Transaction = {
      id: generateId(),
      type: transactionType,
      amount: parseFloat(formData.get('amount') as string),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
    };
    addTransaction(transaction);
    setShowTransactionModal(false);
  };

  const handleAddBudget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const budget: Budget = {
      id: generateId(),
      category: formData.get('category') as string,
      limit: parseFloat(formData.get('limit') as string),
      spent: 0,
      period: formData.get('period') as 'weekly' | 'monthly' | 'yearly',
    };
    addBudget(budget);
    setShowBudgetModal(false);
  };

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal: FinancialGoal = {
      id: generateId(),
      name: formData.get('name') as string,
      targetAmount: parseFloat(formData.get('targetAmount') as string),
      currentAmount: parseFloat(formData.get('currentAmount') as string) || 0,
      deadline: formData.get('deadline') as string,
      color: '#6366f1',
    };
    addFinancialGoal(goal);
    setShowGoalModal(false);
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Finances</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Gérez vos revenus, dépenses et objectifs financiers
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { setTransactionType('income'); setShowTransactionModal(true); }}>
            <ArrowUpRight className="w-4 h-4" />
            Revenu
          </Button>
          <Button onClick={() => { setTransactionType('expense'); setShowTransactionModal(true); }}>
            <Plus className="w-4 h-4" />
            Dépense
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Balance totale"
          value={formatCurrency(balance)}
          icon={<Wallet className="w-6 h-6" />}
          color={balance >= 0 ? 'success' : 'danger'}
          trend={{ value: 8.2, label: 'vs mois dernier' }}
        />
        <StatCard
          title="Revenus"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Dépenses"
          value={formatCurrency(totalExpenses)}
          icon={<TrendingDown className="w-6 h-6" />}
          color="danger"
        />
        <StatCard
          title="Taux d'épargne"
          value={`${savingsRate.toFixed(1)}%`}
          icon={<PiggyBank className="w-6 h-6" />}
          color="primary"
        />
      </motion.div>

      {/* Tabs Content */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="transactions">
          <TabsList className="mb-6">
            <TabsTrigger value="transactions" icon={<CreditCard className="w-4 h-4" />}>
              Transactions
            </TabsTrigger>
            <TabsTrigger value="budgets" icon={<Wallet className="w-4 h-4" />}>
              Budgets
            </TabsTrigger>
            <TabsTrigger value="goals" icon={<Target className="w-4 h-4" />}>
              Objectifs
            </TabsTrigger>
            <TabsTrigger value="analytics" icon={<TrendingUp className="w-4 h-4" />}>
              Analyses
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher une transaction..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                  />
                </div>
                <Button variant="secondary">
                  <Filter className="w-4 h-4" />
                  Filtrer
                </Button>
              </div>

              {filteredTransactions.length === 0 ? (
                <EmptyState
                  icon={<CreditCard className="w-8 h-8" />}
                  title="Aucune transaction"
                  description="Ajoutez votre première transaction pour commencer à suivre vos finances"
                  action={{
                    label: 'Ajouter une transaction',
                    onClick: () => setShowTransactionModal(true),
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {filteredTransactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-xl flex items-center justify-center',
                              transaction.type === 'income'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-600'
                            )}
                          >
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="w-6 h-6" />
                            ) : (
                              <ArrowDownRight className="w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {(transaction.type === 'income' ? incomeCategories : expenseCategories).find(
                                (c) => c.value === transaction.category
                              )?.label || transaction.category}{' '}
                              • {formatDate(transaction.date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={cn(
                              'text-lg font-semibold',
                              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            )}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTransaction(transaction.id)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowBudgetModal(true)}>
                <Plus className="w-4 h-4" />
                Nouveau budget
              </Button>
            </div>
            {budgets.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Wallet className="w-8 h-8" />}
                  title="Aucun budget"
                  description="Créez des budgets pour mieux contrôler vos dépenses"
                  action={{
                    label: 'Créer un budget',
                    onClick: () => setShowBudgetModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {budgets.map((budget) => {
                  const spent = transactions
                    .filter((t) => t.type === 'expense' && t.category === budget.category)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const percentage = (spent / budget.limit) * 100;
                  const isOverBudget = percentage > 100;

                  return (
                    <Card key={budget.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {expenseCategories.find((c) => c.value === budget.category)?.label ||
                              budget.category}
                          </h3>
                          <Badge variant={budget.period === 'monthly' ? 'primary' : 'secondary'}>
                            {budget.period === 'monthly' ? 'Mensuel' : budget.period === 'weekly' ? 'Hebdomadaire' : 'Annuel'}
                          </Badge>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteBudget(budget.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 dark:text-slate-400">
                            {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                          </span>
                          <span
                            className={cn(
                              'font-medium',
                              isOverBudget ? 'text-red-500' : 'text-green-500'
                            )}
                          >
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(percentage, 100)}
                          color={isOverBudget ? 'danger' : percentage > 80 ? 'warning' : 'success'}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowGoalModal(true)}>
                <Plus className="w-4 h-4" />
                Nouvel objectif
              </Button>
            </div>
            {financialGoals.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Target className="w-8 h-8" />}
                  title="Aucun objectif financier"
                  description="Définissez des objectifs d'épargne pour atteindre vos rêves"
                  action={{
                    label: 'Créer un objectif',
                    onClick: () => setShowGoalModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {financialGoals.map((goal) => {
                  const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                  const remaining = goal.targetAmount - goal.currentAmount;

                  return (
                    <Card key={goal.id} className="p-6" hover>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{goal.name}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Échéance: {formatDate(goal.deadline)}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteFinancialGoal(goal.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-center my-6">
                        <p className="text-3xl font-bold text-slate-900 dark:text-white">
                          {formatCurrency(goal.currentAmount)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          sur {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                      <Progress value={percentage} showLabel color="primary" />
                      <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                        Reste {formatCurrency(remaining)} à épargner
                      </p>
                      <Button
                        variant="secondary"
                        className="w-full mt-4"
                        onClick={() => {
                          const amount = prompt('Montant à ajouter:');
                          if (amount) {
                            updateFinancialGoal(goal.id, {
                              currentAmount: goal.currentAmount + parseFloat(amount),
                            });
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter des fonds
                      </Button>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Évolution mensuelle</CardTitle>
                </CardHeader>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getMonthlyData()}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDep" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenus" stroke="#22c55e" fill="url(#colorRev)" />
                      <Area type="monotone" dataKey="depenses" stroke="#ef4444" fill="url(#colorDep)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Dépenses par catégorie</CardTitle>
                </CardHeader>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getCategorySpending()} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={12} />
                      <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={12} width={100} />
                      <Tooltip />
                      <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Transaction Modal */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title={transactionType === 'income' ? 'Ajouter un revenu' : 'Ajouter une dépense'}
      >
        <form onSubmit={handleAddTransaction} className="space-y-4">
          <Input name="amount" type="number" step="0.01" label="Montant (MAD)" placeholder="0.00" required />
          <Select
            name="category"
            label="Catégorie"
            options={transactionType === 'income' ? incomeCategories : expenseCategories}
          />
          <Input name="description" label="Description" placeholder="Description de la transaction" required />
          <Input name="date" type="date" label="Date" defaultValue={new Date().toISOString().split('T')[0]} required />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowTransactionModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Budget Modal */}
      <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} title="Créer un budget">
        <form onSubmit={handleAddBudget} className="space-y-4">
          <Select name="category" label="Catégorie" options={expenseCategories} />
          <Input name="limit" type="number" step="0.01" label="Limite (MAD)" placeholder="0.00" required />
          <Select
            name="period"
            label="Période"
            options={[
              { value: 'weekly', label: 'Hebdomadaire' },
              { value: 'monthly', label: 'Mensuel' },
              { value: 'yearly', label: 'Annuel' },
            ]}
          />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowBudgetModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Créer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Goal Modal */}
      <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Nouvel objectif financier">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <Input name="name" label="Nom de l'objectif" placeholder="Ex: Voyage au Japon" required />
          <Input name="targetAmount" type="number" step="0.01" label="Montant cible (MAD)" placeholder="0.00" required />
          <Input name="currentAmount" type="number" step="0.01" label="Montant actuel (MAD)" placeholder="0.00" />
          <Input name="deadline" type="date" label="Date d'échéance" required />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowGoalModal(false)}>
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

export default Finances;
