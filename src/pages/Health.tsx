import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Plus,
  Moon,
  Footprints,
  Droplets,
  Dumbbell,
  Scale,
  Pill,
  Stethoscope,
  Calendar,
  Trash2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
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
  StatCard,
} from '../components/ui';
import { formatDate, generateId, cn } from '../utils/helpers';
import { HealthMetric, Medication, MedicalAppointment } from '../types';

const sleepQualityOptions = [
  { value: 'poor', label: 'Mauvaise' },
  { value: 'fair', label: 'Correcte' },
  { value: 'good', label: 'Bonne' },
  { value: 'excellent', label: 'Excellente' },
];

const exerciseTypes = [
  { value: 'running', label: 'Course' },
  { value: 'walking', label: 'Marche' },
  { value: 'cycling', label: 'Vélo' },
  { value: 'swimming', label: 'Natation' },
  { value: 'gym', label: 'Musculation' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'other', label: 'Autre' },
];

const Health = () => {
  const {
    healthMetrics,
    medications,
    medicalAppointments,
    addHealthMetric,
    addMedication,
    deleteMedication,
    addMedicalAppointment,
    deleteMedicalAppointment,
  } = useStore();

  const [showMetricModal, setShowMetricModal] = useState(false);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayMetric = healthMetrics.find((m) => m.date === today);

  const handleAddMetric = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const metric: HealthMetric = {
      id: generateId(),
      date: formData.get('date') as string,
      weight: parseFloat(formData.get('weight') as string) || undefined,
      sleepHours: parseFloat(formData.get('sleepHours') as string) || undefined,
      sleepQuality: formData.get('sleepQuality') as HealthMetric['sleepQuality'],
      steps: parseInt(formData.get('steps') as string) || undefined,
      waterIntake: parseFloat(formData.get('waterIntake') as string) || undefined,
      exerciseMinutes: parseInt(formData.get('exerciseMinutes') as string) || undefined,
      exerciseType: formData.get('exerciseType') as string,
    };
    addHealthMetric(metric);
    setShowMetricModal(false);
  };

  const handleAddMedication = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const medication: Medication = {
      id: generateId(),
      name: formData.get('name') as string,
      dosage: formData.get('dosage') as string,
      frequency: formData.get('frequency') as string,
      times: (formData.get('times') as string).split(',').map((t) => t.trim()),
    };
    addMedication(medication);
    setShowMedicationModal(false);
  };

  const handleAddAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const appointment: MedicalAppointment = {
      id: generateId(),
      type: formData.get('type') as string,
      doctor: formData.get('doctor') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
    };
    addMedicalAppointment(appointment);
    setShowAppointmentModal(false);
  };

  // Calculate averages
  const recentMetrics = healthMetrics.slice(-7);
  const avgSleep = recentMetrics.length > 0
    ? recentMetrics.reduce((sum, m) => sum + (m.sleepHours || 0), 0) / recentMetrics.filter((m) => m.sleepHours).length
    : 0;
  const avgSteps = recentMetrics.length > 0
    ? recentMetrics.reduce((sum, m) => sum + (m.steps || 0), 0) / recentMetrics.filter((m) => m.steps).length
    : 0;
  const avgWater = recentMetrics.length > 0
    ? recentMetrics.reduce((sum, m) => sum + (m.waterIntake || 0), 0) / recentMetrics.filter((m) => m.waterIntake).length
    : 0;

  const latestWeight = healthMetrics.filter((m) => m.weight).slice(-1)[0]?.weight;
  const previousWeight = healthMetrics.filter((m) => m.weight).slice(-2, -1)[0]?.weight;
  const weightTrend = latestWeight && previousWeight ? latestWeight - previousWeight : 0;

  // Chart data
  const getChartData = () => {
    return healthMetrics
      .slice(-14)
      .map((m) => ({
        date: new Date(m.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
        sommeil: m.sleepHours,
        pas: m.steps ? m.steps / 1000 : null,
        eau: m.waterIntake,
        poids: m.weight,
      }));
  };

  const upcomingAppointments = medicalAppointments
    .filter((a) => new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Santé</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Suivez votre santé physique et vos rendez-vous médicaux
          </p>
        </div>
        <Button onClick={() => setShowMetricModal(true)}>
          <Plus className="w-4 h-4" />
          Ajouter des données
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Sommeil moyen"
          value={`${avgSleep.toFixed(1)}h`}
          icon={<Moon className="w-6 h-6" />}
          color="primary"
        />
        <StatCard
          title="Pas moyens"
          value={avgSteps.toFixed(0)}
          icon={<Footprints className="w-6 h-6" />}
          color="success"
        />
        <StatCard
          title="Eau moyenne"
          value={`${avgWater.toFixed(1)}L`}
          icon={<Droplets className="w-6 h-6" />}
          color="secondary"
        />
        <StatCard
          title="Poids actuel"
          value={latestWeight ? `${latestWeight}kg` : '-'}
          icon={<Scale className="w-6 h-6" />}
          color={weightTrend <= 0 ? 'success' : 'warning'}
          trend={weightTrend !== 0 ? { value: Math.abs(weightTrend), label: 'kg' } : undefined}
        />
      </motion.div>

      {/* Today's Metrics */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Aujourd'hui - {formatDate(new Date())}</CardTitle>
              {!todayMetric && (
                <Button size="sm" onClick={() => setShowMetricModal(true)}>
                  <Plus className="w-4 h-4" />
                  Enregistrer
                </Button>
              )}
            </div>
          </CardHeader>

          {todayMetric ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {todayMetric.sleepHours && (
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Sommeil</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {todayMetric.sleepHours}h
                  </p>
                  {todayMetric.sleepQuality && (
                    <Badge variant="primary" size="sm" className="mt-2">
                      {sleepQualityOptions.find((q) => q.value === todayMetric.sleepQuality)?.label}
                    </Badge>
                  )}
                </div>
              )}

              {todayMetric.steps && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Footprints className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Pas</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {todayMetric.steps.toLocaleString()}
                  </p>
                  <Progress value={(todayMetric.steps / 10000) * 100} color="success" className="mt-2" />
                </div>
              )}

              {todayMetric.waterIntake && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Eau</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {todayMetric.waterIntake}L
                  </p>
                  <Progress value={(todayMetric.waterIntake / 2.5) * 100} color="primary" className="mt-2" />
                </div>
              )}

              {todayMetric.exerciseMinutes && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-5 h-5 text-orange-600" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">Exercice</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {todayMetric.exerciseMinutes}min
                  </p>
                  {todayMetric.exerciseType && (
                    <Badge variant="warning" size="sm" className="mt-2">
                      {exerciseTypes.find((t) => t.value === todayMetric.exerciseType)?.label}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Activity className="w-8 h-8" />}
              title="Pas de données aujourd'hui"
              description="Enregistrez vos données de santé pour suivre votre progression"
              action={{
                label: 'Enregistrer',
                onClick: () => setShowMetricModal(true),
              }}
            />
          )}
        </Card>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="charts">
          <TabsList className="mb-6">
            <TabsTrigger value="charts" icon={<Activity className="w-4 h-4" />}>
              Graphiques
            </TabsTrigger>
            <TabsTrigger value="medications" icon={<Pill className="w-4 h-4" />}>
              Médicaments
            </TabsTrigger>
            <TabsTrigger value="appointments" icon={<Stethoscope className="w-4 h-4" />}>
              Rendez-vous
            </TabsTrigger>
          </TabsList>

          {/* Charts Tab */}
          <TabsContent value="charts">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Sommeil (heures)</CardTitle>
                </CardHeader>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getChartData()}>
                      <defs>
                        <linearGradient id="colorSommeil" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 12]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="sommeil"
                        stroke="#6366f1"
                        fill="url(#colorSommeil)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 pb-4">
                  <CardTitle>Poids (kg)</CardTitle>
                </CardHeader>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="poids"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: '#22c55e', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowMedicationModal(true)}>
                <Plus className="w-4 h-4" />
                Ajouter un médicament
              </Button>
            </div>

            {medications.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Pill className="w-8 h-8" />}
                  title="Aucun médicament"
                  description="Ajoutez vos médicaments pour les suivre"
                  action={{
                    label: 'Ajouter',
                    onClick: () => setShowMedicationModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medications.map((med) => (
                  <Card key={med.id} className="p-6" hover>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                          <Pill className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{med.name}</h3>
                          <Badge variant="secondary" size="sm">{med.dosage}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMedication(med.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{med.frequency}</p>
                    <div className="flex flex-wrap gap-2">
                      {med.times.map((time, i) => (
                        <Badge key={i} variant="outline">{time}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAppointmentModal(true)}>
                <Plus className="w-4 h-4" />
                Nouveau rendez-vous
              </Button>
            </div>

            {medicalAppointments.length === 0 ? (
              <Card className="p-6">
                <EmptyState
                  icon={<Stethoscope className="w-8 h-8" />}
                  title="Aucun rendez-vous"
                  description="Planifiez vos rendez-vous médicaux"
                  action={{
                    label: 'Planifier',
                    onClick: () => setShowAppointmentModal(true),
                  }}
                />
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <Card key={apt.id} className="p-6" hover>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex flex-col items-center justify-center text-green-600">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">{apt.type}</h3>
                          {apt.doctor && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">Dr. {apt.doctor}</p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 dark:text-slate-400">
                            <span>{formatDate(apt.date)}</span>
                            <span>{apt.time}</span>
                            {apt.location && <span>• {apt.location}</span>}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMedicalAppointment(apt.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Metric Modal */}
      <Modal isOpen={showMetricModal} onClose={() => setShowMetricModal(false)} title="Enregistrer des données" size="lg">
        <form onSubmit={handleAddMetric} className="space-y-4">
          <Input name="date" type="date" label="Date" defaultValue={today} required />
          <div className="grid grid-cols-2 gap-4">
            <Input name="sleepHours" type="number" step="0.5" label="Heures de sommeil" placeholder="7.5" />
            <Select name="sleepQuality" label="Qualité du sommeil" options={[{ value: '', label: 'Sélectionner' }, ...sleepQualityOptions]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="steps" type="number" label="Nombre de pas" placeholder="10000" />
            <Input name="waterIntake" type="number" step="0.1" label="Eau (litres)" placeholder="2.0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input name="exerciseMinutes" type="number" label="Exercice (minutes)" placeholder="30" />
            <Select name="exerciseType" label="Type d'exercice" options={[{ value: '', label: 'Sélectionner' }, ...exerciseTypes]} />
          </div>
          <Input name="weight" type="number" step="0.1" label="Poids (kg)" placeholder="70.0" />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowMetricModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>

      {/* Medication Modal */}
      <Modal isOpen={showMedicationModal} onClose={() => setShowMedicationModal(false)} title="Ajouter un médicament">
        <form onSubmit={handleAddMedication} className="space-y-4">
          <Input name="name" label="Nom du médicament" placeholder="Ex: Vitamine D" required />
          <Input name="dosage" label="Dosage" placeholder="Ex: 1000 UI" required />
          <Input name="frequency" label="Fréquence" placeholder="Ex: 1 fois par jour" required />
          <Input name="times" label="Heures de prise (séparées par des virgules)" placeholder="Ex: 08:00, 20:00" required />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowMedicationModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </Modal>

      {/* Appointment Modal */}
      <Modal isOpen={showAppointmentModal} onClose={() => setShowAppointmentModal(false)} title="Nouveau rendez-vous">
        <form onSubmit={handleAddAppointment} className="space-y-4">
          <Input name="type" label="Type de rendez-vous" placeholder="Ex: Consultation générale" required />
          <Input name="doctor" label="Médecin" placeholder="Ex: Martin" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="date" type="date" label="Date" required />
            <Input name="time" type="time" label="Heure" required />
          </div>
          <Input name="location" label="Lieu" placeholder="Ex: Clinique XYZ" />
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowAppointmentModal(false)}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Planifier
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Health;
