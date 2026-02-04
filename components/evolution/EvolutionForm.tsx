import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { EvolutionRecord } from '../../types';
import { Button } from '../ui/Primitives';

interface EvolutionFormProps {
    studentId: string;
    record?: EvolutionRecord | null;
    onClose: () => void;
    onSave: (record: Partial<EvolutionRecord>) => Promise<void>;
}

export default function EvolutionForm({ studentId, record, onClose, onSave }: EvolutionFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<EvolutionRecord>>({
        student_id: studentId,
        data: new Date().toISOString().split('T')[0],
        descricao: '',
        status: 'Ativo',
        tipo: 'evolucao',
    });

    useEffect(() => {
        if (record) setFormData(record);
    }, [record]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSave(formData);
        setLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in-up">
                <div className="bg-white px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800">
                        {record ? 'Editar Registro' : 'Nova Evolução'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Data</label>
                        <input type="date" required value={formData.data} onChange={(e) => setFormData({ ...formData, data: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Status do Aluno</label>
                        <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none">
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                        {formData.status === 'Inativo' && (
                            <div className="mt-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-start border border-red-100">
                                <AlertCircle size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                                <span>Atenção: Isso mudará o status do cadastro do aluno para <strong>Inativo</strong>.</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Descrição</label>
                        <textarea required value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-slate-400 resize-none outline-none" placeholder="Descreva a evolução ou observação sobre o aluno..." />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar Registro'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}