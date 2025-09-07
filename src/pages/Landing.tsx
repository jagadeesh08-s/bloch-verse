import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import BlochSphere3D from '@/components/BlochSphere';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
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

      {/* Intro Section */}
      <section className="container mx-auto px-8 py-12">
        <Card className="border-primary/20 quantum-glow">
          <CardHeader>
            <CardTitle>What is the Bloch Sphere?</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            The Bloch sphere is a geometric representation of a single qubit state. Any pure state can be
            represented as a point on the surface, while mixed states lie inside the sphere. The axes correspond
            to the Pauli operators X, Y, and Z, and the vector indicates the qubit’s expectation values.
          </CardContent>
        </Card>
      </section>

      {/* Gates Overview */}
      <section className="container mx-auto px-8 pb-12">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Quantum Gates Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              {["I","X","Y","Z","H","S","T","RX","RY","RZ","CNOT","CZ","SWAP"].map(g => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  k:"I (Identity)", 
                  d:"The Identity gate leaves the quantum state completely unchanged. Matrix: [[1,0],[0,1]]. On the Bloch sphere, this represents no movement - the vector stays at its current position. Essential for quantum circuit timing and as a placeholder operation."
                },
                {
                  k:"X (Pauli-X)", 
                  d:"The Pauli-X gate performs a quantum NOT operation, flipping |0⟩ ↔ |1⟩. Matrix: [[0,1],[1,0]]. On the Bloch sphere, this rotates the vector 180° around the X-axis. Also called a 'bit flip' since it flips the computational basis states."
                },
                {
                  k:"Y (Pauli-Y)", 
                  d:"The Pauli-Y gate performs both a bit flip and phase flip simultaneously. Matrix: [[0,-i],[i,0]]. On the Bloch sphere, this rotates the vector 180° around the Y-axis. It maps |0⟩ → i|1⟩ and |1⟩ → -i|0⟩, combining X and Z operations."
                },
                {
                  k:"Z (Pauli-Z)", 
                  d:"The Pauli-Z gate adds a phase flip to |1⟩ while leaving |0⟩ unchanged. Matrix: [[1,0],[0,-1]]. On the Bloch sphere, this rotates the vector 180° around the Z-axis. It preserves computational basis probabilities but changes quantum phases."
                },
                {
                  k:"H (Hadamard)", 
                  d:"The Hadamard gate creates equal superposition from basis states. Matrix: [[1,1],[1,-1]]/√2. It maps |0⟩ → (|0⟩+|1⟩)/√2 and |1⟩ → (|0⟩-|1⟩)/√2. On the Bloch sphere, it swaps X and Z axes positions, fundamental for quantum algorithms."
                },
                {
                  k:"S (Phase)", 
                  d:"The S gate adds a π/2 (90°) phase rotation around the Z-axis. Matrix: [[1,0],[0,i]]. It maps |1⟩ → i|1⟩. On the Bloch sphere, this rotates the vector 90° around the Z-axis. Also called the √Z gate since S² = Z."
                },
                {
                  k:"T (π/8)", 
                  d:"The T gate adds a π/4 (45°) phase rotation around the Z-axis. Matrix: [[1,0],[0,e^(iπ/4)]]. It maps |1⟩ → e^(iπ/4)|1⟩. On the Bloch sphere, this rotates 45° around Z-axis. Also called √S gate since T² = S, essential for universal quantum computation."
                },
                {
                  k:"RX (X-Rotation)", 
                  d:"Parametric rotation around the X-axis by angle θ. Matrix: [[cos(θ/2),-i*sin(θ/2)],[-i*sin(θ/2),cos(θ/2)]]. On the Bloch sphere, this rotates the vector θ degrees around the X-axis. Fundamental for arbitrary single-qubit rotations and continuous quantum control."
                },
                {
                  k:"RY (Y-Rotation)", 
                  d:"Parametric rotation around the Y-axis by angle θ. Matrix: [[cos(θ/2),-sin(θ/2)],[sin(θ/2),cos(θ/2)]]. On the Bloch sphere, this rotates the vector θ degrees around the Y-axis. Particularly useful for amplitude manipulation without adding complex phases."
                },
                {
                  k:"RZ (Z-Rotation)", 
                  d:"Parametric rotation around the Z-axis by angle θ. Matrix: [[e^(-iθ/2),0],[0,e^(iθ/2)]]. On the Bloch sphere, this rotates the vector θ degrees around the Z-axis. Changes quantum phases while preserving computational basis probabilities."
                },
                {
                  k:"CNOT (Controlled-X)", 
                  d:"Two-qubit gate that flips the target qubit if the control qubit is |1⟩. Matrix: 4×4 with control logic. Essential for creating entanglement between qubits. On dual Bloch spheres, this creates correlations where the target's state depends on the control's measurement."
                },
                {
                  k:"CZ (Controlled-Z)", 
                  d:"Two-qubit gate that applies a Z gate to the target if the control is |1⟩. Matrix: diag([1,1,1,-1]). Symmetric operation - both qubits act as control and target simultaneously. Creates phase entanglement while preserving computational basis states."
                },
                {
                  k:"SWAP", 
                  d:"Two-qubit gate that exchanges the states of two qubits completely. Matrix: [[1,0,0,0],[0,0,1,0],[0,1,0,0],[0,0,0,1]]. On dual Bloch spheres, this literally swaps the vector positions. Useful for quantum routing and circuit optimization."
                },
              ].map((item, idx) => (
                <AccordionItem key={item.k} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left">{item.k}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{item.d}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>

      {/* Libraries Used */}
      <section className="container mx-auto px-8 pb-16">
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle>Libraries & Tech Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                'React', 'Vite', 'TypeScript', 'Tailwind CSS',
                'Three.js', '@react-three/fiber', '@react-three/drei',
                'framer-motion', 'shadcn/ui', 'lucide-react',
                'TanStack Query', 'React Router'
              ].map(lib => (
                <Badge key={lib} variant="outline" className="justify-center py-2">{lib}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default Landing;