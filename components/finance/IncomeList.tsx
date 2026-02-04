import React, { useState } from 'react';
import { TrendingUp, Trash2 } from 'lucide-react';
import { FinancialIncome } from '../../types';
import { formatCurrency, formatDate } from '../../constants';
import { Card, ConfirmModal } from '../ui/Primitives';

export default function IncomeList({ incomes, onDelete }: { incomes: FinancialIncome[], onDelete: (id: string) => void }) {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    return (
        <Card className="overflow-hidden border-0 shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-emerald-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-emerald-700 tracking-wider">Descrição</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-emerald-700 tracking-wider">Data</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-emerald-700 tracking-wider">Forma Pagto</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-emerald-700 tracking-wider">Valor</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-emerald-700 tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {incomes.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">Nenhuma entrada registrada.</td></tr> :
                            incomes.map(inc => (
                                <tr key={inc.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg mr-3"><TrendingUp size={14} /></span>
                                            <span className="text-sm font-medium text-slate-800">{inc.description || 'Sem descrição'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(inc.date)}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold border border-slate-200">{inc.method}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-emerald-600">+{formatCurrency(inc.amount)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => setDeleteId(inc.id)} className="text-slate-400 hover:text-red-600 bg-transparent hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => { if (deleteId) onDelete(deleteId); setDeleteId(null); }}
                title="Excluir Entrada"
                message="Tem certeza que deseja excluir este registro de entrada?"
            />
        </Card>
    );
}