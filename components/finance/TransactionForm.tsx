import React, { useState, useEffect } from 'react';
import { X, Wallet, Plus, Trash2 } from 'lucide-react';
import { FinancialTransaction, TransactionItem } from '../../types';
import { generateId, formatCurrency } from '../../constants';
import { Button } from '../ui/Primitives';

interface FormItem extends Omit<TransactionItem, 'id' | 'transaction_id' | 'created_at'> {
    tempId: string;
}

interface TransactionFormProps {
    onClose: () => void;
    onSuccess: (transaction: FinancialTransaction) => void;
    transaction?: FinancialTransaction | null;
}

export default function TransactionForm({ onClose, onSuccess, transaction }: TransactionFormProps) {
    const [loading, setLoading] = useState(false);
    const [issueDate, setIssueDate] = useState('');
    const [entryDate, setEntryDate] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [items, setItems] = useState<FormItem[]>([{ tempId: '1', item_name: '', quantity: 0, unit_value: 0, final_value: 0 }]);

    useEffect(() => {
        if (transaction) {
            setIssueDate(transaction.issue_date);
            setEntryDate(transaction.entry_date);
            setCompanyName(transaction.company_name);
            setInvoiceNumber(transaction.invoice_number);
            if (transaction.items) {
                setItems(transaction.items.map((item, idx) => ({ ...item, tempId: String(idx) })));
            }
        }
    }, [transaction]);

    const calculateTotal = () => items.reduce((sum, item) => sum + Number(item.final_value), 0);

    const updateItem = (tempId: string, field: keyof FormItem, value: string | number) => {
        setItems(items.map(item => {
            if (item.tempId === tempId) {
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unit_value') {
                    updated.final_value = Number(updated.quantity) * Number(updated.unit_value);
                }
                return updated;
            }
            return item;
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const newTransaction: FinancialTransaction = {
                id: transaction?.id || generateId(),
                transaction_number: transaction?.transaction_number || Math.floor(1000 + Math.random() * 9000).toString(),
                issue_date: issueDate,
                entry_date: entryDate,
                company_name: companyName,
                invoice_number: invoiceNumber,
                total_value: calculateTotal(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                items: items.map(({ tempId, ...rest }) => ({ ...rest, id: generateId() }))
            };
            onSuccess(newTransaction);
            setLoading(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{transaction ? 'Editar Movimentação' : 'Nova Movimentação'}</h2>
                        <p className="text-sm text-slate-500 mt-0.5">Detalhes da nota fiscal e itens.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Data de Emissão</label><input type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Data de Entrada</label><input type="date" required value={entryDate} onChange={e => setEntryDate(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Empresa</label><input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nome da empresa" /></div>
                        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Nº Nota</label><input type="text" required value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="000.000.000" /></div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center"><Wallet size={18} className="mr-2 text-slate-500" /> Itens da Nota</h3>
                            <Button size="sm" variant="secondary" onClick={() => setItems([...items, { tempId: generateId(), item_name: '', quantity: 0, unit_value: 0, final_value: 0 }])}>
                                <Plus size={16} className="mr-1" /> Adicionar Item
                            </Button>
                        </div>
                        <div className="space-y-3">
                            {items.map(item => (
                                <div key={item.tempId} className="grid grid-cols-12 gap-3 items-end p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                    <div className="col-span-5">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Item</label>
                                        <input placeholder="Descrição do item" value={item.item_name} onChange={e => updateItem(item.tempId, 'item_name', e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Qtd</label>
                                        <input type="number" value={item.quantity} onChange={e => updateItem(item.tempId, 'quantity', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 text-center" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Unitário</label>
                                        <input type="number" value={item.unit_value} onChange={e => updateItem(item.tempId, 'unit_value', Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500 text-right" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs font-medium text-slate-500 mb-1 block">Total</label>
                                        <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-right font-medium text-slate-700">
                                            {formatCurrency(item.final_value)}
                                        </div>
                                    </div>
                                    <div className="col-span-1 flex justify-center pb-2">
                                        {items.length > 1 && (
                                            <button type="button" onClick={() => setItems(items.filter(i => i.tempId !== item.tempId))} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end items-center">
                            <div className="text-right">
                                <span className="text-sm text-slate-500 mr-3">Valor Total da Nota</span>
                                <span className="text-2xl font-bold text-slate-800">{formatCurrency(calculateTotal())}</span>
                            </div>
                        </div>
                    </div>
                </form>

                <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-end space-x-3 sticky bottom-0 z-10">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>{loading ? 'Salvando...' : 'Salvar Nota'}</Button>
                </div>
            </div>
        </div>
    );
}