import React, { useMemo } from 'react';
import { FinancialProfile, ProjectionPoint } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Sliders, HelpCircle } from 'lucide-react';

interface PlanningViewProps {
  profile: FinancialProfile;
  setProfile: (p: FinancialProfile) => void;
}

const PlanningView: React.FC<PlanningViewProps> = ({ profile, setProfile }) => {
  
  // Calculate projection data based on inputs
  const projectionData = useMemo(() => {
    const data: ProjectionPoint[] = [];
    let currentSavings = profile.currentSavings;
    let conservative = currentSavings;
    let moderate = currentSavings;
    let aggressive = currentSavings;
    
    // Simple projection logic for demo purposes
    // Conservative: 4%, Moderate: 7%, Aggressive: 10%
    const yearsToProject = 40; // up to age + 40
    
    for (let i = 0; i <= yearsToProject; i++) {
      const age = profile.currentAge + i;
      
      // Stop contributions after retirement
      const isWorking = age < profile.retirementAge;
      const annualContrib = isWorking ? profile.annualContribution : 0;
      const withdrawal = isWorking ? 0 : profile.monthlyExpenses * 12;

      // Compound interest
      conservative = conservative * 1.04 + annualContrib - withdrawal;
      moderate = moderate * 1.07 + annualContrib - withdrawal;
      aggressive = aggressive * 1.10 + annualContrib - withdrawal;
      
      data.push({
        age,
        conservative: Math.max(0, Math.round(conservative)),
        moderate: Math.max(0, Math.round(moderate)),
        aggressive: Math.max(0, Math.round(aggressive)),
        target: 2000000 // Arbitrary target line
      });
    }
    return data;
  }, [profile]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Chart Area */}
      <div className="lg:col-span-2 flex flex-col space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex-1 min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Retirement Projection</h2>
              <p className="text-sm text-gray-500">Projected portfolio value over time based on risk profiles.</p>
            </div>
             <div className="flex space-x-2">
                <span className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 bg-emerald-100 border border-emerald-500 rounded-sm mr-1"></span> Conservative
                </span>
                 <span className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm mr-1"></span> Moderate
                </span>
                 <span className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 bg-emerald-800 rounded-sm mr-1"></span> Aggressive
                </span>
            </div>
          </div>
          
          <div className="flex-1 w-full">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={projectionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorModerate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#125932" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#125932" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="age" tick={{fill: '#6B7280', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis 
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <Tooltip 
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                    labelFormatter={(label) => `Age: ${label}`}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="conservative" stackId="1" stroke="#A7F3D0" fill="none" strokeWidth={2} name="Conservative" />
                <Area type="monotone" dataKey="aggressive" stackId="2" stroke="#064E3B" fill="none" strokeWidth={2} name="Aggressive" />
                <Area type="monotone" dataKey="moderate" stackId="3" stroke="#125932" fill="url(#colorModerate)" strokeWidth={3} name="Moderate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
             <Sliders className="text-fidelity" size={20} />
             <h3 className="text-lg font-bold text-gray-800">Plan Inputs</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Retirement Age</label>
                <span className="text-sm font-bold text-fidelity">{profile.retirementAge}</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="80" 
                value={profile.retirementAge}
                onChange={(e) => setProfile({...profile, retirementAge: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fidelity"
              />
            </div>

            <div>
               <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Annual Contribution</label>
                <span className="text-sm font-bold text-fidelity">${profile.annualContribution.toLocaleString()}</span>
              </div>
               <input 
                type="range" 
                min="0" 
                max="100000" 
                step="1000"
                value={profile.annualContribution}
                onChange={(e) => setProfile({...profile, annualContribution: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fidelity"
              />
            </div>

            <div>
               <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Monthly Retirement Spend (Est.)</label>
                <span className="text-sm font-bold text-fidelity">${profile.monthlyExpenses.toLocaleString()}</span>
              </div>
               <input 
                type="range" 
                min="2000" 
                max="20000" 
                step="500"
                value={profile.monthlyExpenses}
                onChange={(e) => setProfile({...profile, monthlyExpenses: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-fidelity"
              />
            </div>
            
            <div className="pt-4 border-t border-gray-100">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Risk Tolerance</label>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['Conservative', 'Moderate', 'Aggressive'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setProfile({...profile, riskTolerance: level as any})}
                            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                                profile.riskTolerance === level 
                                ? 'bg-white text-fidelity shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
            <div className="flex items-start space-x-3">
                <HelpCircle className="text-emerald-700 mt-1 flex-shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-emerald-900 mb-1">Advisor Insight</h4>
                    <p className="text-sm text-emerald-800">
                        Based on your inputs, increasing your annual contribution by $5,000 could improve your retirement probability score by 12%.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlanningView;
