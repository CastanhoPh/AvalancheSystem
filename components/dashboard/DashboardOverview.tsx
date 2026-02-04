import React from 'react';
import { TrendingUp, Calendar, UserCheck, Award } from 'lucide-react';
import { Student } from '../../types';
import { BELT_ORDER, BELT_STYLES } from '../../constants';

export default function DashboardOverview({ students, onFilterSelect, activeFilter }: {
    students: Student[],
    onFilterSelect: (type: string, value: any) => void,
    activeFilter: { type: string, value: any } | null
}) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const newEnrollments = students.filter(s => {
        if (!s.data_inscricao) return false;
        const d = new Date(s.data_inscricao);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const isFilterActive = (type: string, value: any) => {
        return activeFilter?.type === type && activeFilter?.value === value;
    };

    return (
        <div className="mb-10 space-y-8">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* New Enrollments Card */}
                <div
                    onClick={() => onFilterSelect('matricula_mes', 'atual')}
                    className={`cursor-pointer bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg shadow-blue-900/10 p-6 flex flex-col justify-between relative overflow-hidden group transition-all transform hover:-translate-y-1 ${isFilterActive('matricula_mes', 'atual') ? 'ring-4 ring-blue-200' : ''}`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={80} />
                    </div>
                    <div>
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Novas Matrículas</p>
                        <div className="flex items-baseline mt-2">
                            <p className="text-4xl font-bold text-white">+{newEnrollments}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center text-blue-100 text-xs">
                        <Calendar size={14} className="mr-1.5" />
                        <span>Neste mês atual</span>
                    </div>
                </div>

                {/* Belt Summary */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {BELT_ORDER.map((belt) => {
                        const count = students.filter(s => s.faixa === belt && s.status === 'Ativo').length;
                        const style = BELT_STYLES[belt] || BELT_STYLES['Branca']; // Fallback

                        return (
                            <div
                                key={belt}
                                onClick={() => onFilterSelect('faixa', belt)}
                                className={`cursor-pointer bg-white rounded-xl border p-4 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:border-slate-300 group
                    ${isFilterActive('faixa', belt) ? 'ring-2 ring-blue-500 border-transparent bg-blue-50/50' : 'border-slate-100'}
                 `}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-3 ${style.bg} ${style.border} border`}>
                                    {belt === 'Sem Faixa' ? <UserCheck size={16} className={style.icon} /> : <Award size={16} className={style.icon} />}
                                </div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{belt === 'Sem Faixa' ? 'Sem Faixa' : `Faixa ${belt}`}</p>
                                <p className="text-2xl font-bold text-slate-800 mt-1 group-hover:scale-110 transition-transform">{count}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}