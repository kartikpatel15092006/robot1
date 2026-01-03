import { motion } from 'framer-motion';

export const Overlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Vignette effect */}
      <div className="absolute inset-0 vignette" />
      
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline opacity-30" />
      
      {/* Ambient glow at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/10 to-transparent" />
      
      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-primary/30" />
      
      {/* Status indicators */}
      <motion.div 
        className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-display text-xs text-primary/70 tracking-[0.3em] uppercase">
          System Active
        </span>
      </motion.div>
      
      {/* Bottom text */}
      <motion.div 
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p className="font-display text-[10px] text-muted-foreground tracking-[0.5em] uppercase mb-1">
          Move cursor to interact
        </p>
        <p className="text-xs text-primary/50 font-light">
          Neural interface v2.4.1
        </p>
      </motion.div>
      
      {/* Side data streams */}
      <motion.div 
        className="absolute left-6 top-1/2 -translate-y-1/2 space-y-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div 
              className="w-8 h-[2px] bg-gradient-to-r from-primary/60 to-transparent"
              style={{ width: `${20 + Math.random() * 30}px` }}
            />
            <span className="text-[8px] text-muted-foreground font-mono">
              {Math.floor(Math.random() * 100).toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </motion.div>
      
      <motion.div 
        className="absolute right-6 top-1/2 -translate-y-1/2 space-y-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 flex-row-reverse">
            <div 
              className="w-8 h-[2px] bg-gradient-to-l from-primary/60 to-transparent"
              style={{ width: `${20 + Math.random() * 30}px` }}
            />
            <span className="text-[8px] text-muted-foreground font-mono">
              {Math.floor(Math.random() * 100).toString().padStart(2, '0')}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
