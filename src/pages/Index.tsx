import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RobotScene } from '@/components/robot/RobotScene';
import { Overlay } from '@/components/robot/Overlay';
import { LoadingScreen } from '@/components/robot/LoadingScreen';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
      
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        {/* 3D Robot Scene */}
        <RobotScene />
        
        {/* UI Overlay */}
        <Overlay />
      </motion.div>
    </main>
  );
};

export default Index;
