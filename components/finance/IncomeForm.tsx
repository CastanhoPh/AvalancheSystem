import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { FinancialIncome } from '../../types';
import { generateId } from '../../constants';
import { Button } from '../ui/Primitives';

interface IncomeFormProps {
    onClose: () => void;
    onSuccess: (income: FinancialIncome) => void;
}

export default function IncomeForm({ onClose, onSuccess }: IncomeFormProps) {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default today
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<'Pix' | 'Cartão' | 'Boleto' | 'Dinheiro'>('Pix');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const newIncome: FinancialIncome = {
                id: generateId(),
                date,
                amount: parseFloat(amount),
                method,
                description,
                created_at: new Date().toISOString()
            };
            onSuccess(newIncome);
            setLoading(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
                <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Nova Entrada</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Registrar recebimento de valor.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Data de Entrada</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="date" 
                                required 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm outline-none font-medium text-slate-700"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Valor (R$)</label>
                        <div className="relative">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                            <input 
                                type="number" 
                                required 
                                step="0.01"
                                min="0"
                                placeholder="0,00"
                                value={amount} 
                                onChange={e => setAmount(e.target.value)} 
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-lg font-bold text-slate-800 outline-none" 
                            />
                        </div>
                    </div>

                     <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Forma de Recebimento</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Pix', 'Dinheiro', 'Cartão', 'Boleto'].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMethod(m as any)}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all
                                        ${method === m 
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm' 
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Descrição (Opcional)</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            rows={3}
                            placeholder="Ex: Mensalidade, Doação, Venda de item..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder-slate-400 resize-none outline-none" 
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" disabled={loading}>
                            {loading ? 'Salvando...' : 'Confirmar Entrada'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}