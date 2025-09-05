import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BlochSphere3D from '@/components/BlochSphere';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-8 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-quantum-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-quantum-float" />
      </div>

      {/* Left side - Hero content */}
      <motion.div 
        className="flex-1 max-w-2xl z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1 
          className="text-6xl lg:text-8xl font-bold mb-6 quantum-text-glow"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Quantum
          <br />
          <span className="text-primary">Bloch</span>
          <br />
          Visualizer
        </motion.h1>
        
        <motion.p 
          className="text-xl lg:text-2xl text-muted-foreground mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Explore quantum states in 3D space. Visualize multi-qubit systems,
          simulate quantum circuits, and understand quantum entanglement through
          interactive Bloch spheres.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            variant="quantum"
            size="lg" 
            onClick={() => navigate('/workspace')}
            className="text-xl px-12 py-6 quantum-glow hover:shadow-quantum-accent transition-all duration-300"
          >
            Get Started
          </Button>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-3 gap-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div>
            <div className="text-3xl font-bold text-primary mb-2">3D</div>
            <div className="text-sm text-muted-foreground">Interactive Visualization</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">∞</div>
            <div className="text-sm text-muted-foreground">Multi-Qubit Systems</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">⟨ψ|ψ⟩</div>
            <div className="text-sm text-muted-foreground">Quantum States</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right side - Interactive Bloch Sphere */}
      <motion.div 
        className="flex-1 flex flex-col items-center justify-center lg:max-w-lg mt-12 lg:mt-0"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-gradient-sphere rounded-full blur-2xl opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          <BlochSphere3D 
            vector={{ x: 0.5, y: 0.3, z: 0.8 }}
            purity={0.9}
            size={450}
            showLabels={true}
          />
        </div>
        
        <motion.p 
          className="mt-8 text-center text-muted-foreground text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="text-primary">Click and drag</span> to rotate • <span className="text-accent">Scroll</span> to zoom
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Landing;