import { useState, createContext, useContext, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

const Tabs = ({ defaultValue, children, className, onChange }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

const TabsList = ({ children, className }: TabsListProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

const TabsTrigger = ({ value, children, className, icon }: TabsTriggerProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2',
        isActive
          ? 'text-slate-900 dark:text-white'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300',
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-white dark:bg-slate-700 rounded-lg shadow-sm"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
