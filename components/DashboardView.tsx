import React from 'react';
import { FinancialProfile, AssetAllocation } from '../types';
import { TrendingUp, Wallet, PieChart, ArrowUpRight, DollarSign } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
  profile: FinancialProfile;
  assets: AssetAllocation[];
}

const StatCard: React.FC<{ title: string; value: string; trend?: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      {trend && (
        <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
          <ArrowUpRight size={14} className="mr-1" />
          {trend}
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const DashboardView: React.FC<DashboardProps> = ({ profile, assets }) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Net Worth" 
          value={`$${profile.netWorth.toLocaleString()}`} 
          trend="+12.5% YTD" 
          icon={Wallet} 
          color="bg-fidelity text-fidelity" 
        />
        <StatCard 
          title="Investable Assets" 
          value={`$${profile.currentSavings.toLocaleString()}`} 
          trend="+8.2% YTD" 
          icon={TrendingUp} 
          color="bg-blue-600 text-blue-600" 
        />
        <StatCard 
          title="Monthly Savings" 
          value={`$${(profile.annualContribution / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          icon={DollarSign} 
          color="bg-emerald-500 text-emerald-500" 
        />
        <StatCard 
          title="Risk Profile" 
          value={profile.riskTolerance} 
          icon={PieChart} 
          color="bg-purple-600 text-purple-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Allocation */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Asset Allocation</h3>
            <button className="text-fidelity text-sm font-medium hover:underline">Rebalance</button>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={assets}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assets.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals / Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Financial Wellness</h3>
          
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Retirement Goal</span>
                <span className="text-fidelity font-bold">78%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-fidelity h-2.5 rounded-full" style={{ width: '78%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">On track to retire by age {profile.retirementAge}</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Emergency Fund</span>
                <span className="text-yellow-600 font-bold">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">3 months of expenses saved (Goal: 6 months)</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <button className="w-full py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors border border-gray-200">
                View All Goals
             </button>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Mockup */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
             <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-gray-100">
            {[
                { date: 'Oct 24', desc: 'Deposit - Fidelity Brokerage', amount: '+$2,500.00' },
                { date: 'Oct 22', desc: 'Dividend Payment - SPY', amount: '+$124.50' },
                { date: 'Oct 15', desc: 'Transfer to Checking', amount: '-$1,200.00' },
            ].map((t, i) => (
                <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{t.desc}</p>
                        <p className="text-xs text-gray-500">{t.date}</p>
                    </div>
                    <span className={`text-sm font-semibold ${t.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>{t.amount}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
