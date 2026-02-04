import React, { useState } from 'react';
import { Receipt, X, FileText, Download } from 'lucide-react';
import { FinancialTransaction } from '../../types';
import { formatCurrency } from '../../constants';
import { Button, Notification } from '../ui/Primitives';

export default function TransactionView({ transaction, onClose }: { transaction: FinancialTransaction, onClose: () => void }) {
    const [showDownloadMsg, setShowDownloadMsg] = useState(false);

    const handleDownload = () => {
        setShowDownloadMsg(true);
        setTimeout(() => setShowDownloadMsg(false), 3000);
    };

    // Função local para formatar data
    const formatDateView = (dateString: string) => {
        if (!dateString) return '-';
        if (dateString.includes('-')) {
            const parts = dateString.split('-');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-slate-800 px-8 py-6 text-white flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                            <Receipt size={24} className="text-blue-200" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Movimentação #{transaction.transaction_number}</h2>
                            <p className="text-blue-200 text-sm">{transaction.company_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"><X size={24} /></button>
                </div>

                <div className="p-8 bg-slate-50/50 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nota Fiscal</p>
                            <p className="text-lg font-semibold text-slate-800">{transaction.invoice_number}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Datas</p>
                            <div className="flex justify-between text-sm">
                                <div><span className="text-slate-500">Emissão:</span> <span className="font-medium text-slate-700">{formatDateView(transaction.issue_date)}</span></div>
                                <div><span className="text-slate-500">Entrada:</span> <span className="font-medium text-slate-700">{formatDateView(transaction.entry_date)}</span></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-8">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 flex items-center text-sm uppercase tracking-wide"><FileText size={16} className="mr-2" /> Itens Detalhados</h3>
                        </div>
                        <table className="w-full">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Item</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-slate-500">Qtd</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">Unitário</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {transaction.items?.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-3 text-sm text-slate-700">{item.item_name}</td>
                                        <td className="px-6 py-3 text-center text-sm text-slate-600">{item.quantity}</td>
                                        <td className="px-6 py-3 text-right text-sm text-slate-600">{formatCurrency(item.unit_value)}</td>
                                        <td className="px-6 py-3 text-right text-sm font-semibold text-slate-800">{formatCurrency(item.final_value)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-slate-50 border-t border-slate-200">
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase">Valor Total</td>
                                    <td className="px-6 py-4 text-right text-xl font-bold text-emerald-600">{formatCurrency(transaction.total_value)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <Button variant="secondary" onClick={onClose}>Fechar Visualização</Button>
                        <Button variant="primary" onClick={handleDownload} className="flex items-center">
                            <Download size={18} className="mr-2" /> Baixar PDF
                        </Button>
                    </div>
                </div>
            </div>
            {showDownloadMsg && <Notification message="Download do PDF iniciado..." onClose={() => setShowDownloadMsg(false)} />}
        </div>
    );
}