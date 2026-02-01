import React from 'react';
import { AnalysisResult } from '../types';
import { UserCheck, Shield, GraduationCap, Users } from 'lucide-react';

interface Props {
  analysis: AnalysisResult;
}

export const ActionPlan: React.FC<Props> = ({ analysis }) => {
  const getIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'docente': return <GraduationCap className="text-blue-500" size={24} />;
      case 'director': return <Shield className="text-purple-500" size={24} />;
      case 'padres': return <Users className="text-orange-500" size={24} />;
      default: return <UserCheck className="text-green-500" size={24} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {analysis.actionPlan.map((step, idx) => (
        <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="p-2 bg-slate-50 rounded-lg">
              {getIcon(step.role)}
            </div>
            <h3 className="font-bold text-lg text-slate-800">{step.role}</h3>
          </div>
          <ul className="space-y-3">
            {step.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                <span className="min-w-[6px] h-[6px] rounded-full bg-green-500 mt-2"></span>
                {action}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};