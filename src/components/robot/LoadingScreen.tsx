import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Loading ring */}
      <div className="relative w-24 h-24 mb-8">
        <motion.div 
          className="absolute inset-0 border-2 border-primary/20 rounded-full"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute inset-0 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute inset-2 border border-primary/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      
      {/* Loading text */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-display text-lg text-foreground tracking-[0.2em] uppercase mb-2">
          Initializing
        </h2>
        <p className="text-xs text-muted-foreground tracking-wider">
          Neural pathways loading...
        </p>
      </motion.div>
      
      {/* Progress bar */}
      <motion.div 
        className="mt-8 w-48 h-[2px] bg-secondary overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-primary to-primary-glow"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </motion.div>
    </motion.div>
  );
};
