export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  PLANNING = 'PLANNING',
  ADVISOR = 'ADVISOR',
}

export interface FinancialProfile {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  netWorth: number;
  monthlyExpenses: number;
}

export interface AssetAllocation {
  name: string;
  value: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface ProjectionPoint {
  age: number;
  conservative: number;
  moderate: number;
  aggressive: number;
  target: number;
}
