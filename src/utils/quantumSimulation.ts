// Quantum simulation utilities for multi-qubit systems

export interface QuantumGate {
  name: string;
  matrix: number[][];
  qubits: number[];
}

export interface QuantumCircuit {
  numQubits: number;
  gates: QuantumGate[];
}

export interface DensityMatrix {
  matrix: number[][];
  purity: number;
  blochVector: { x: number; y: number; z: number };
}

// Pauli matrices
export const PAULI = {
  I: [[1, 0], [0, 1]],
  X: [[0, 1], [1, 0]], 
  Y: [[0, -1], [1, 0]], // imaginary i = 1 for simplification
  Z: [[1, 0], [0, -1]]
};

// Common quantum gates
export const GATES = {
  H: [
    [1/Math.sqrt(2), 1/Math.sqrt(2)],
    [1/Math.sqrt(2), -1/Math.sqrt(2)]
  ],
  X: PAULI.X,
  Y: PAULI.Y,
  Z: PAULI.Z,
  CNOT: [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
    [0, 0, 1, 0]
  ]
};

// Matrix operations
export const matrixMultiply = (A: number[][], B: number[][]): number[][] => {
  const rows = A.length;
  const cols = B[0].length;
  const result = Array(rows).fill(0).map(() => Array(cols).fill(0));
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < B.length; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
};

export const tensorProduct = (A: number[][], B: number[][]): number[][] => {
  const m = A.length;
  const n = A[0].length;
  const p = B.length;
  const q = B[0].length;
  
  const result = Array(m * p).fill(0).map(() => Array(n * q).fill(0));
  
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < p; k++) {
        for (let l = 0; l < q; l++) {
          result[i * p + k][j * q + l] = A[i][j] * B[k][l];
        }
      }
    }
  }
  return result;
};

export const trace = (matrix: number[][]): number => {
  let tr = 0;
  for (let i = 0; i < matrix.length; i++) {
    tr += matrix[i][i];
  }
  return tr;
};

export const matrixTrace = (matrix: number[][]): number => {
  return trace(matrixMultiply(matrix, matrix));
};

// Create initial state |00...0⟩
export const createInitialState = (numQubits: number): number[][] => {
  const dim = Math.pow(2, numQubits);
  const state = Array(dim).fill(0).map(() => Array(dim).fill(0));
  state[0][0] = 1; // |0⟩⟨0| ⊗ |0⟩⟨0| ⊗ ...
  return state;
};

// Apply a gate to the quantum state
export const applyGate = (state: number[][], gate: QuantumGate, numQubits: number): number[][] => {
  // For simplicity, implement single-qubit gates and CNOT
  if (gate.qubits.length === 1) {
    return applySingleQubitGate(state, gate.matrix, gate.qubits[0], numQubits);
  } else if (gate.name === 'CNOT' && gate.qubits.length === 2) {
    return applyCNOTGate(state, gate.qubits[0], gate.qubits[1], numQubits);
  }
  return state;
};

const applySingleQubitGate = (state: number[][], gateMatrix: number[][], qubit: number, numQubits: number): number[][] => {
  // Build the full gate matrix by tensor product
  let fullGate: number[][] = [[1]]; // Start with 1x1 identity
  
  for (let i = 0; i < numQubits; i++) {
    const currentGate = i === qubit ? gateMatrix : PAULI.I;
    fullGate = tensorProduct(fullGate, currentGate);
  }
  
  // Apply: U ρ U†
  const newState = matrixMultiply(fullGate, state);
  return matrixMultiply(newState, transpose(fullGate));
};

const applyCNOTGate = (state: number[][], control: number, target: number, numQubits: number): number[][] => {
  // Simplified CNOT implementation - would need proper tensor product construction
  return matrixMultiply(GATES.CNOT, matrixMultiply(state, transpose(GATES.CNOT)));
};

const transpose = (matrix: number[][]): number[][] => {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
};

// Compute partial trace to get reduced density matrix
export const partialTrace = (fullState: number[][], qubitToKeep: number, numQubits: number): DensityMatrix => {
  const dim = 2; // Single qubit dimension
  const reducedMatrix = Array(dim).fill(0).map(() => Array(dim).fill(0));
  
  // Simplified partial trace - trace out all qubits except the one to keep
  const totalDim = Math.pow(2, numQubits);
  const stride = Math.pow(2, numQubits - qubitToKeep - 1);
  
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      let sum = 0;
      for (let k = 0; k < totalDim / dim; k++) {
        const row = i * stride + k * (stride * 2);
        const col = j * stride + k * (stride * 2);
        if (row < totalDim && col < totalDim) {
          sum += fullState[row][col];
        }
      }
      reducedMatrix[i][j] = sum;
    }
  }
  
  // Calculate purity and Bloch vector
  const purity = Math.sqrt(matrixTrace(reducedMatrix));
  const blochVector = calculateBlochVector(reducedMatrix);
  
  return {
    matrix: reducedMatrix,
    purity: Math.min(purity, 1),
    blochVector
  };
};

export const calculateBlochVector = (densityMatrix: number[][]): { x: number; y: number; z: number } => {
  // Calculate expectation values ⟨σᵢ⟩ = Tr(ρ σᵢ)
  const x = trace(matrixMultiply(densityMatrix, PAULI.X));
  const y = trace(matrixMultiply(densityMatrix, PAULI.Y));
  const z = trace(matrixMultiply(densityMatrix, PAULI.Z));
  
  return { x: x || 0, y: y || 0, z: z || 0 };
};

// Simulate the full circuit
export const simulateCircuit = (circuit: QuantumCircuit): DensityMatrix[] => {
  let state = createInitialState(circuit.numQubits);
  
  // Apply gates sequentially
  for (const gate of circuit.gates) {
    state = applyGate(state, gate, circuit.numQubits);
  }
  
  // Compute reduced density matrices for each qubit
  const reducedStates: DensityMatrix[] = [];
  for (let i = 0; i < circuit.numQubits; i++) {
    reducedStates.push(partialTrace(state, i, circuit.numQubits));
  }
  
  return reducedStates;
};

// Example circuits
export const EXAMPLE_CIRCUITS = {
  'Bell State': {
    numQubits: 2,
    gates: [
      { name: 'H', matrix: GATES.H, qubits: [0] },
      { name: 'CNOT', matrix: GATES.CNOT, qubits: [0, 1] }
    ]
  },
  'GHZ State (3-qubit)': {
    numQubits: 3,
    gates: [
      { name: 'H', matrix: GATES.H, qubits: [0] },
      { name: 'CNOT', matrix: GATES.CNOT, qubits: [0, 1] },
      { name: 'CNOT', matrix: GATES.CNOT, qubits: [0, 2] }
    ]
  },
  'Random Mixed State': {
    numQubits: 2,
    gates: [
      { name: 'H', matrix: GATES.H, qubits: [0] },
      { name: 'Y', matrix: GATES.Y, qubits: [1] },
      { name: 'CNOT', matrix: GATES.CNOT, qubits: [0, 1] }
    ]
  }
};
