import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Play, Home, Code, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BlochSphere3D from '@/components/BlochSphere';
import CircuitBuilder from '@/components/CircuitBuilder';
import { 
  simulateCircuit, 
  EXAMPLE_CIRCUITS,
  AVAILABLE_GATES,
  SINGLE_QUBIT_GATES,
  TWO_QUBIT_GATES,
  type QuantumCircuit, 
  type DensityMatrix 
} from '@/utils/quantumSimulation';

const Workspace: React.FC = () => {
  const navigate = useNavigate();
  const [circuitCode, setCircuitCode] = useState('');
  const [reducedStates, setReducedStates] = useState<DensityMatrix[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string>('');
  const [numQubits, setNumQubits] = useState(2);
  const [currentCircuit, setCurrentCircuit] = useState<any>(null);

  const handleExampleSelect = (example: string) => {
    if (example && EXAMPLE_CIRCUITS[example as keyof typeof EXAMPLE_CIRCUITS]) {
      setSelectedExample(example);
      const circuit = EXAMPLE_CIRCUITS[example as keyof typeof EXAMPLE_CIRCUITS];
      const codeString = `{
  "numQubits": ${circuit.numQubits},
  "gates": [
${circuit.gates.map(gate => `    {"name": "${gate.name}", "qubits": [${gate.qubits.join(', ')}]}`).join(',\n')}
  ]
}`;
      setCircuitCode(codeString);
      toast(`Loaded example: ${example}`);
    }
  };

  const handleCircuitChange = (circuit: any) => {
    setCurrentCircuit(circuit);
    setNumQubits(circuit.numQubits);
    setCircuitCode(JSON.stringify(circuit, null, 2));
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    
    try {
      let circuit: QuantumCircuit;
      
      if (currentCircuit) {
        circuit = currentCircuit;
      } else if (selectedExample && EXAMPLE_CIRCUITS[selectedExample as keyof typeof EXAMPLE_CIRCUITS]) {
        circuit = EXAMPLE_CIRCUITS[selectedExample as keyof typeof EXAMPLE_CIRCUITS];
      } else {
        circuit = JSON.parse(circuitCode);
      }
      
      const states = simulateCircuit(circuit);
      setReducedStates(states);
      
      toast(`✨ Simulation complete! Generated ${states.length} qubit states`);
    } catch (error) {
      console.error('Simulation error:', error);
      toast('Error: Invalid circuit format. Please check your JSON.');
    }
    
    setIsSimulating(false);
  };

  const handleExport = () => {
    if (reducedStates.length === 0) {
      toast('No simulation results to export');
      return;
    }

    const exportData = {
      timestamp: new Date().toISOString(),
      numQubits: reducedStates.length,
      reducedStates: reducedStates.map((state, i) => ({
        qubit: i,
        purity: state.purity,
        blochVector: state.blochVector,
        densityMatrix: state.matrix
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_states_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast('🎯 Quantum states exported successfully!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <motion.header 
        className="border-b border-primary/20 bg-card/50 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="hover:bg-primary/10"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <h1 className="text-2xl font-bold quantum-text-glow">
              Quantum Workspace
            </h1>
          </div>
          
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={reducedStates.length === 0}
            className="border-accent/30 hover:bg-accent/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Results
          </Button>
        </div>
      </motion.header>

      {/* Main workspace */}
      <div className="flex-1 container mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left side - Circuit Builder */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="quantum-glow border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-quantum-pulse" />
                Quantum Circuit Builder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visual" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="visual" className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Visual Builder
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Code Editor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="visual" className="space-y-4">
                  <CircuitBuilder
                    onCircuitChange={handleCircuitChange}
                    numQubits={numQubits}
                    onQubitCountChange={setNumQubits}
                  />
                </TabsContent>

                <TabsContent value="code" className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Example Circuits
                    </label>
                    <Select onValueChange={handleExampleSelect} value={selectedExample}>
                      <SelectTrigger className="bg-input border-primary/20">
                        <SelectValue placeholder="Load an example circuit..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(EXAMPLE_CIRCUITS).map(name => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Available Gates
                    </label>
                    <div className="mb-3 p-3 bg-muted/20 rounded-md text-xs">
                      <div className="mb-2">
                        <span className="font-semibold text-primary">Single-qubit:</span> {SINGLE_QUBIT_GATES.join(', ')}
                      </div>
                      <div>
                        <span className="font-semibold text-accent">Two-qubit:</span> {TWO_QUBIT_GATES.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Circuit JSON
                    </label>
                    <Textarea
                      value={circuitCode}
                      onChange={(e) => setCircuitCode(e.target.value)}
                      placeholder={`{
  "numQubits": 2,
  "gates": [
    {"name": "H", "qubits": [0]},
    {"name": "CNOT", "qubits": [0, 1]}
  ]
}`}
                      className="h-64 font-mono text-sm bg-input border-primary/20 resize-none"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <Button 
                variant="quantum"
                onClick={handleSimulate}
                disabled={isSimulating || (!circuitCode.trim() && !currentCircuit)}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? 'Simulating...' : 'Compute Reduced States'}
              </Button>
            </CardContent>
          </Card>

          {/* Circuit info */}
          {reducedStates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent">Simulation Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Qubits:</span>
                      <div className="text-lg font-bold">{reducedStates.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Avg Purity:</span>
                      <div className="text-lg font-bold">
                        {(reducedStates.reduce((sum, s) => sum + s.purity, 0) / reducedStates.length).toFixed(3)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Right side - Bloch spheres grid */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {reducedStates.length === 0 ? (
            <Card className="border-muted/20 h-full flex items-center justify-center">
              <CardContent className="text-center p-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 animate-quantum-pulse" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Ready for Quantum Simulation</h3>
                <p className="text-muted-foreground">
                  Load an example circuit or write your own to visualize quantum states on the Bloch sphere
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reducedStates.map((state, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="border-primary/20 quantum-sphere-glow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-center text-primary">
                        Qubit {index}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <BlochSphere3D
                          vector={state.blochVector}
                          purity={state.purity}
                          size={250}
                          showLabels={false}
                          showAngles={true}
                        />
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Purity:</span>
                          <span className="font-mono">{state.purity.toFixed(3)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-red-400">X: {state.blochVector.x.toFixed(2)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-green-400">Y: {state.blochVector.y.toFixed(2)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400">Z: {state.blochVector.z.toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div className="text-center">
                            <div className="text-cyan-400">θ: {(Math.acos(Math.abs(state.blochVector.z)) * 180 / Math.PI).toFixed(1)}°</div>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-400">φ: {(Math.atan2(state.blochVector.y, state.blochVector.x) * 180 / Math.PI).toFixed(1)}°</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Workspace;