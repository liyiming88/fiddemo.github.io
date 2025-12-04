import React, { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import PlanningView from './components/PlanningView';
import AdvisorView from './components/AdvisorView';
import { ViewState, FinancialProfile, AssetAllocation } from './types';

const INITIAL_PROFILE: FinancialProfile = {
  currentAge: 35,
  retirementAge: 65,
  currentSavings: 250000,
  annualContribution: 24000,
  riskTolerance: 'Moderate',
  netWorth: 485000,
  monthlyExpenses: 6000
};

const INITIAL_ASSETS: AssetAllocation[] = [
  { name: 'US Stock', value: 55, color: '#125932' }, // Fidelity Green
  { name: 'Intl Stock', value: 25, color: '#1A7D46' }, // Light Green
  { name: 'Bonds', value: 15, color: '#60A5FA' }, // Blue
  { name: 'Cash', value: 5, color: '#9CA3AF' } // Gray
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.DASHBOARD);
  const [profile, setProfile] = useState<FinancialProfile>(INITIAL_PROFILE);
  const [assets] = useState<AssetAllocation[]>(INITIAL_ASSETS);

  const renderContent = () => {
    switch (activeView) {
      case ViewState.DASHBOARD:
        return <DashboardView profile={profile} assets={assets} />;
      case ViewState.PLANNING:
        return <PlanningView profile={profile} setProfile={setProfile} />;
      case ViewState.ADVISOR:
        return <AdvisorView profile={profile} />;
      default:
        return <DashboardView profile={profile} assets={assets} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
