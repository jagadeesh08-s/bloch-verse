import React from 'react';
import { motion } from 'framer-motion';
import { Grip } from 'lucide-react';

export interface GateProps {
  name: string;
  type: 'single' | 'double';
  color: string;
  symbol: string;
  description: string;
}

export const QUANTUM_GATES: GateProps[] = [
  // Pauli Gates
  { name: 'I', type: 'single', color: 'bg-gray-500', symbol: 'I', description: 'Identity' },
  { name: 'X', type: 'single', color: 'bg-red-500', symbol: 'X', description: 'Pauli-X (NOT)' },
  { name: 'Y', type: 'single', color: 'bg-green-500', symbol: 'Y', description: 'Pauli-Y' },
  { name: 'Z', type: 'single', color: 'bg-blue-500', symbol: 'Z', description: 'Pauli-Z' },
  
  // Hadamard and Phase Gates
  { name: 'H', type: 'single', color: 'bg-purple-500', symbol: 'H', description: 'Hadamard' },
  { name: 'S', type: 'single', color: 'bg-pink-500', symbol: 'S', description: 'Phase (S)' },
  { name: 'T', type: 'single', color: 'bg-indigo-500', symbol: 'T', description: 'T Gate' },
  
  // Rotation Gates
  { name: 'RX', type: 'single', color: 'bg-orange-500', symbol: 'Rx', description: 'Rotation-X' },
  { name: 'RY', type: 'single', color: 'bg-teal-500', symbol: 'Ry', description: 'Rotation-Y' },
  { name: 'RZ', type: 'single', color: 'bg-cyan-500', symbol: 'Rz', description: 'Rotation-Z' },
  
  // Two-Qubit Gates
  { name: 'CNOT', type: 'double', color: 'bg-amber-500', symbol: '⊕', description: 'Controlled-X' },
  { name: 'CZ', type: 'double', color: 'bg-emerald-500', symbol: '●Z', description: 'Controlled-Z' },
  { name: 'SWAP', type: 'double', color: 'bg-rose-500', symbol: '⤫', description: 'Swap' },
];

interface QuantumGateBlockProps {
  gate: GateProps;
  onDragStart?: (gate: GateProps) => void;
  className?: string;
}

export const QuantumGateBlock: React.FC<QuantumGateBlockProps> = ({ 
  gate, 
  onDragStart,
  className = ''
}) => {
  return (
    <motion.div
      className={`${className} cursor-grab active:cursor-grabbing`}
      draggable
      onDragStart={() => onDragStart?.(gate)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`
        relative p-3 rounded-lg border-2 border-primary/20 
        bg-card/50 backdrop-blur-sm hover:border-primary/40
        transition-all duration-200 group quantum-glow
      `}>
        {/* Drag handle */}
        <div className="absolute top-1 right-1 opacity-50 group-hover:opacity-100 transition-opacity">
          <Grip className="w-3 h-3 text-muted-foreground" />
        </div>
        
        {/* Gate visualization */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`
            w-12 h-12 rounded-md ${gate.color} 
            flex items-center justify-center text-white font-bold text-lg
            shadow-lg relative overflow-hidden
          `}>
            {/* Gate symbol */}
            <span className="relative z-10">{gate.symbol}</span>
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Gate info */}
          <div className="text-center">
            <div className="text-sm font-semibold text-primary">{gate.name}</div>
            <div className="text-xs text-muted-foreground">{gate.description}</div>
            <div className="text-xs text-accent mt-1">
              {gate.type === 'single' ? '1-qubit' : '2-qubit'}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QuantumGateBlock;