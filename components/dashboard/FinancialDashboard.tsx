import React from 'react';
import { TrendingUp, ArrowDownCircle, DollarSign } from 'lucide-react';
import { Card } from '../ui/Primitives';
import { formatCurrency } from '../../constants';

export default function FinancialDashboard({ totalExpenses, totalIncomes }: { totalExpenses: number; totalIncomes: number }) {
    const balance = totalIncomes - totalExpenses;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             {/* Card Entradas */}
             <Card className="p-6 border-l-4 border-l-blue-500 relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-blue-50 to-transparent opacity-50 group-hover:w-40 transition-all duration-500"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Entradas</p>
                        <p className="text-3xl font-extrabold text-blue-600">{formatCurrency(totalIncomes)}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Receitas registradas</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 shadow-sm ring-4 ring-blue-50 group-hover:scale-110 transition-transform duration-300">
                        <TrendingUp size={28} />
                    </div>
                </div>
            </Card>

            {/* Card Saídas */}
            <Card className="p-6 border-l-4 border-l-rose-500 relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-rose-50 to-transparent opacity-50 group-hover:w-40 transition-all duration-500"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Saídas</p>
                        <p className="text-3xl font-extrabold text-rose-600">{formatCurrency(totalExpenses)}</p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Despesas/Notas</p>
                    </div>
                    <div className="bg-rose-100 p-3 rounded-2xl text-rose-600 shadow-sm ring-4 ring-rose-50 group-hover:scale-110 transition-transform duration-300">
                        <ArrowDownCircle size={28} />
                    </div>
                </div>
            </Card>

            {/* Card Saldo */}
            <Card className="p-6 border-l-4 border-l-emerald-500 relative overflow-hidden group hover:shadow-lg transition-all">
                <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-emerald-50 to-transparent opacity-50 group-hover:w-40 transition-all duration-500"></div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Saldo em Caixa</p>
                        <p className={`text-3xl font-extrabold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(balance)}</p>
                        <p className="text-xs text-emerald-600 mt-1 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Atual</p>
                    </div>
                    <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-sm ring-4 ring-emerald-50 group-hover:scale-110 transition-transform duration-300">
                        <DollarSign size={28} />
                    </div>
                </div>
            </Card>
        </div>
    );
}