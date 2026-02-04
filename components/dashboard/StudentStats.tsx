import React from 'react';
import { UserCheck, UserX, Users, UserCircle2 } from 'lucide-react';
import { Student } from '../../types';
import { Card } from '../ui/Primitives';

export default function StudentStats({ students, onFilterSelect, activeFilter }: {
    students: Student[],
    onFilterSelect: (type: string, value: any) => void,
    activeFilter: { type: string, value: any } | null
}) {
    const totalAtivos = students.filter((s) => s.status === 'Ativo').length;
    const totalInativos = students.filter((s) => s.status === 'Inativo').length;
    const totalMeninos = students.filter((s) => s.genero === 'Masculino').length;
    const totalMeninas = students.filter((s) => s.genero === 'Feminino').length;

    const stats = [
        { type: 'status', val: 'Ativo', label: 'Total Ativos', value: totalAtivos, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
        { type: 'status', val: 'Inativo', label: 'Total Inativos', value: totalInativos, icon: UserX, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200' },
        { type: 'genero', val: 'Masculino', label: 'Meninos', value: totalMeninos, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        { type: 'genero', val: 'Feminino', label: 'Meninas', value: totalMeninas, icon: UserCircle2, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    ];

    const isFilterActive = (type: string, value: any) => {
        return activeFilter?.type === type && activeFilter?.value === value;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
                <Card
                    key={stat.label}
                    onClick={() => onFilterSelect(stat.type, stat.val)}
                    className={`p-6 border-t-4 hover:shadow-md transition-all duration-300 ${stat.border.replace('border-', 'border-t-')} ${isFilterActive(stat.type, stat.val) ? 'ring-2 ring-offset-2 ring-slate-200 bg-slate-50' : ''}`}
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                        <div className={`${stat.bg} p-3 rounded-xl`}>
                            <stat.icon className={stat.color} size={24} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}