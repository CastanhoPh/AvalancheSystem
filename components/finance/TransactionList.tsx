import React, { useState } from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { formatCurrency, formatDate } from '../../constants';
import { Card, ConfirmModal } from '../ui/Primitives';

export default function TransactionList({ transactions, onEdit, onDelete, onView, searchTerm }: {
    transactions: FinancialTransaction[],
    onEdit: (t: FinancialTransaction) => void,
    onDelete: (id: string) => void,
    onView: (t: FinancialTransaction) => void,
    searchTerm: string
}) {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filtered = transactions.filter(t =>
        t.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.invoice_number.includes(searchTerm) ||
        t.transaction_number.includes(searchTerm)
    );

    return (
        <Card className="overflow-hidden border-0 shadow-md">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-rose-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-rose-700 tracking-wider">Movimentação</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-rose-700 tracking-wider">Data</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-rose-700 tracking-wider">Empresa</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-rose-700 tracking-wider">Valor</th>
                            <th className="px-6 py-4 text-center text-xs font-semibold uppercase text-rose-700 tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {filtered.length === 0 ? <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">Nenhuma movimentação encontrada.</td></tr> :
                            filtered.map(t => (
                                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-xs font-bold border border-blue-100 font-mono">#{t.transaction_number}</span>
                                            <span className="ml-3 text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{t.invoice_number}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(t.issue_date)}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{t.company_name}</td>
                                    <td className="px-6 py-4 text-right text-sm font-bold text-rose-600">-{formatCurrency(t.total_value)}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button onClick={() => onView(t)} className="text-slate-400 hover:text-blue-600 bg-transparent hover:bg-blue-50 p-2 rounded-lg transition-all"><Eye size={16} /></button>
                                            <button onClick={() => onEdit(t)} className="text-slate-400 hover:text-amber-600 bg-transparent hover:bg-amber-50 p-2 rounded-lg transition-all"><Edit2 size={16} /></button>
                                            <button onClick={() => setDeleteId(t.id)} className="text-slate-400 hover:text-red-600 bg-transparent hover:bg-red-50 p-2 rounded-lg transition-all"><Trash2 size={16} /></button>
                                        </div>
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
                title="Excluir Movimentação"
                message="Tem certeza que deseja excluir esta movimentação financeira?"
            />
        </Card>
    );
}