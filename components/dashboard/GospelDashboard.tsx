import React from 'react';
import { Users, Droplets, Heart } from 'lucide-react';
import { Student } from '../../types';

export default function GospelDashboard({ students, onFilterSelect, activeFilter }: {
    students: Student[],
    onFilterSelect: (type: string, value: any) => void,
    activeFilter: { type: string, value: any } | null
}) {
    const totalStudents = students.length;
    const baptizedCount = students.filter(s => s.batizado).length;
    const notBaptizedCount = totalStudents - baptizedCount;

    const baptizedPercentage = totalStudents > 0 ? ((baptizedCount / totalStudents) * 100).toFixed(1) : "0";
    const notBaptizedPercentage = totalStudents > 0 ? ((notBaptizedCount / totalStudents) * 100).toFixed(1) : "0";

    const isFilterActive = (type: string, value: any) => {
        return activeFilter?.type === type && activeFilter?.value === value;
    };

    return (
        <div className="mb-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total de Alunos</p>
                        <p className="text-3xl font-extrabold text-slate-900">{totalStudents}</p>
                    </div>
                    <div className="bg-slate-100 p-3 rounded-xl text-slate-600">
                        <Users size={24} />
                    </div>
                </div>

                {/* Batizados */}
                <div
                    onClick={() => onFilterSelect('batizado', 'Sim')}
                    className={`cursor-pointer rounded-2xl p-6 shadow-sm border flex items-center justify-between transition-all hover:shadow-md
                   ${isFilterActive('batizado', 'Sim') ? 'bg-violet-50 border-violet-200 ring-2 ring-violet-200' : 'bg-white border-slate-100'}`}
                >
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                            <span className={`w-2 h-2 rounded-full bg-emerald-500 mr-2`}></span>
                            Batizados
                        </p>
                        <p className="text-3xl font-extrabold text-slate-900">{baptizedCount}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">{baptizedPercentage}% do total</p>
                    </div>
                    <div className="bg-violet-100 p-3 rounded-xl text-violet-600">
                        <Droplets size={24} fill="currentColor" className="opacity-80" />
                    </div>
                </div>

                {/* Não Batizados */}
                <div
                    onClick={() => onFilterSelect('batizado', 'Não')}
                    className={`cursor-pointer rounded-2xl p-6 shadow-sm border flex items-center justify-between transition-all hover:shadow-md
                   ${isFilterActive('batizado', 'Não') ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-200' : 'bg-white border-slate-100'}`}
                >
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center">
                            <span className={`w-2 h-2 rounded-full bg-orange-400 mr-2`}></span>
                            Não Batizados
                        </p>
                        <p className="text-3xl font-extrabold text-slate-900">{notBaptizedCount}</p>
                        <p className="text-xs font-bold text-orange-600 mt-1 bg-orange-50 inline-block px-2 py-0.5 rounded-full">{notBaptizedPercentage}% do total</p>
                    </div>
                    <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
                        <Heart size={24} />
                    </div>
                </div>
            </div>

            {/* Visual Bar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-4">Distribuição do Projeto</h3>
                <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                        className="h-full bg-violet-500 hover:bg-violet-600 transition-colors relative group"
                        style={{ width: `${baptizedPercentage}%` }}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Batizados: {baptizedCount}
                        </div>
                    </div>
                    <div
                        className="h-full bg-orange-300 hover:bg-orange-400 transition-colors relative group"
                        style={{ width: `${notBaptizedPercentage}%` }}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Não Batizados: {notBaptizedCount}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-violet-500 mr-2"></div>Batizados ({baptizedPercentage}%)</div>
                    <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-300 mr-2"></div>Não Batizados ({notBaptizedPercentage}%)</div>
                </div>
            </div>
        </div>
    );
}