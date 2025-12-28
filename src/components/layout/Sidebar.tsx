import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  Target,
  Heart,
  Briefcase,
  Activity,
  Brain,
  Sparkles,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/helpers';
import Avatar from '../ui/Avatar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Finances', href: '/finances', icon: Wallet },
  { name: 'Objectifs', href: '/goals', icon: Target },
  { name: 'Vie personnelle', href: '/personal', icon: Heart },
  { name: 'Vie professionnelle', href: '/professional', icon: Briefcase },
  { name: 'Santé', href: '/health', icon: Activity },
  { name: 'Psychologie', href: '/psychology', icon: Brain },
  { name: 'Conseiller IA', href: '/advisor', icon: Sparkles },
];

const Sidebar = () => {
  const { user, sidebarOpen, toggleSidebar, darkMode, toggleDarkMode, logout } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <AnimatePresence mode="wait">
          {sidebarOpen ? (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Life Manager
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="logo-mini"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
        >
          {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-xl',
                    isActive
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-100 dark:bg-slate-800'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
                <AnimatePresence mode="wait">
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
            'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800">
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {darkMode ? 'Mode clair' : 'Mode sombre'}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        {/* User profile */}
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-3 rounded-xl mt-1',
            'bg-slate-50 dark:bg-slate-800/50'
          )}
        >
          <Avatar alt={user?.name || 'User'} size="md" />
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 mt-1',
            'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20">
            <LogOut className="w-5 h-5" />
          </div>
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                Déconnexion
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
