import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Minus } from 'lucide-react';
import { QuantumGateBlock, QUANTUM_GATES, type GateProps } from './QuantumGate';
import { toast } from 'sonner';

interface CircuitGate {
  id: string;
  gate: GateProps;
  qubits: number[];
  position: number;
}

interface CircuitBuilderProps {
  onCircuitChange: (circuit: any) => void;
  numQubits: number;
  onQubitCountChange: (count: number) => void;
}

export const CircuitBuilder: React.FC<CircuitBuilderProps> = ({
  onCircuitChange,
  numQubits,
  onQubitCountChange
}) => {
  const [circuitGates, setCircuitGates] = useState<CircuitGate[]>([]);
  const [draggedGate, setDraggedGate] = useState<GateProps | null>(null);
  const [selectedQubit, setSelectedQubit] = useState<number>(0);

  const handleDragStart = useCallback((gate: GateProps) => {
    setDraggedGate(gate);
  }, []);

  const handleDrop = useCallback((position: number) => {
    if (!draggedGate) return;

    let qubits: number[] = [];
    
    if (draggedGate.type === 'single') {
      qubits = [selectedQubit];
    } else {
      // For two-qubit gates, use selected qubit as control and next as target
      if (selectedQubit < numQubits - 1) {
        qubits = [selectedQubit, selectedQubit + 1];
      } else {
        toast('Cannot place two-qubit gate: not enough qubits available');
        return;
      }
    }

    const newGate: CircuitGate = {
      id: `gate_${Date.now()}_${Math.random()}`,
      gate: draggedGate,
      qubits,
      position
    };

    setCircuitGates(prev => [...prev, newGate]);
    setDraggedGate(null);
    
    // Update circuit
    const newCircuit = {
      numQubits,
      gates: [...circuitGates, newGate].map(g => ({
        name: g.gate.name,
        qubits: g.qubits
      }))
    };
    
    onCircuitChange(newCircuit);
    toast(`Added ${draggedGate.name} gate to circuit`);
  }, [draggedGate, selectedQubit, numQubits, circuitGates, onCircuitChange]);

  const removeGate = useCallback((gateId: string) => {
    setCircuitGates(prev => {
      const updated = prev.filter(g => g.id !== gateId);
      const newCircuit = {
        numQubits,
        gates: updated.map(g => ({
          name: g.gate.name,
          qubits: g.qubits
        }))
      };
      onCircuitChange(newCircuit);
      return updated;
    });
    toast('Gate removed from circuit');
  }, [numQubits, onCircuitChange]);

  const clearCircuit = useCallback(() => {
    setCircuitGates([]);
    onCircuitChange({ numQubits, gates: [] });
    toast('Circuit cleared');
  }, [numQubits, onCircuitChange]);

  return (
    <div className="space-y-6">
      {/* Gate Palette */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full animate-quantum-pulse" />
            Quantum Gate Palette
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {QUANTUM_GATES.map(gate => (
              <QuantumGateBlock
                key={gate.name}
                gate={gate}
                onDragStart={handleDragStart}
                className="h-full"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Circuit Configuration */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Circuit Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Number of Qubits:</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQubitCountChange(Math.max(1, numQubits - 1))}
                disabled={numQubits <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={numQubits}
                onChange={(e) => onQubitCountChange(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center"
                min={1}
                max={6}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onQubitCountChange(Math.min(6, numQubits + 1))}
                disabled={numQubits >= 6}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Target Qubit:</label>
            <div className="flex gap-1">
              {Array.from({ length: numQubits }, (_, i) => (
                <Button
                  key={i}
                  variant={selectedQubit === i ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedQubit(i)}
                  className="w-8 h-8 p-0"
                >
                  {i}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Circuit Canvas */}
      <Card className="border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Circuit Canvas</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearCircuit}
            disabled={circuitGates.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </CardHeader>
        <CardContent>
          <div className="min-h-32 border-2 border-dashed border-muted rounded-lg p-4">
            {circuitGates.length === 0 ? (
              <div 
                className="h-full flex items-center justify-center text-muted-foreground"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleDrop(0); }}
              >
                Drag quantum gates here to build your circuit
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from({ length: numQubits }, (_, qubitIndex) => (
                  <div key={qubitIndex} className="flex items-center gap-2">
                    <Badge variant="outline" className="w-12 text-center">
                      |{qubitIndex}⟩
                    </Badge>
                    <div 
                      className="flex-1 h-12 border-t-2 border-primary/40 relative flex items-center gap-2"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); handleDrop(qubitIndex); }}
                    >
                      <AnimatePresence>
                        {circuitGates
                          .filter(gate => gate.qubits.includes(qubitIndex))
                          .map(gate => (
                            <motion.div
                              key={gate.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className={`
                                relative flex items-center justify-center
                                ${gate.gate.type === 'single' ? 'w-8 h-8' : 'w-12 h-8'}
                                ${gate.gate.color} rounded text-white font-bold text-sm
                                cursor-pointer hover:opacity-80 transition-opacity
                              `}
                              onClick={() => removeGate(gate.id)}
                              title={`Click to remove ${gate.gate.name}`}
                            >
                              {gate.gate.symbol}
                              {gate.gate.type === 'double' && gate.qubits[0] === qubitIndex && (
                                <div className="absolute top-full w-px h-12 bg-primary/60" />
                              )}
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Circuit Summary */}
          {circuitGates.length > 0 && (
            <div className="mt-4 p-3 bg-muted/20 rounded-lg">
              <div className="text-sm font-medium mb-2">Circuit Gates:</div>
              <div className="flex flex-wrap gap-2">
                {circuitGates.map(gate => (
                  <Badge key={gate.id} variant="secondary" className="text-xs">
                    {gate.gate.name}({gate.qubits.join(',')})
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CircuitBuilder;