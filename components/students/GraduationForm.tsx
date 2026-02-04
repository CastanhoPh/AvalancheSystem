import React, { useState } from 'react';
import { Award, X } from 'lucide-react';
import { Student, BeltColor } from '../../types';
import { BELT_ORDER } from '../../constants';
import { Button } from '../ui/Primitives';
import { BeltBadge } from '../ui/BeltBadge';

interface GraduationFormProps {
    student: Student;
    onClose: () => void;
    onConfirm: (newBelt: BeltColor, newDegrees: number, date: string, obs: string) => void;
}

export default function GraduationForm({ student, onClose, onConfirm }: GraduationFormProps) {
    const [newBelt, setNewBelt] = useState<BeltColor>(student.faixa);
    const [newDegrees, setNewDegrees] = useState<number>(student.graus);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [obs, setObs] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(newBelt, newDegrees, date, obs);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-slide-up">
                <div className="bg-slate-900 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center text-white space-x-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Award size={20} className="text-yellow-400" />
                        </div>
                        <h2 className="text-lg font-bold">Graduar Aluno</h2>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">
                            {student.nome_completo.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Aluno</p>
                            <p className="font-bold text-slate-900">{student.nome_completo}</p>
                            <div className="flex items-center mt-1 text-xs">
                                <span className="text-slate-500 mr-2">Atual:</span>
                                <BeltBadge color={student.faixa} degrees={student.graus} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Nova Faixa</label>
                            <select
                                value={newBelt}
                                onChange={(e) => setNewBelt(e.target.value as BeltColor)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                            >
                                {BELT_ORDER.map(belt => (
                                    <option key={belt} value={belt}>{belt}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Novos Graus</label>
                            <select
                                value={newDegrees}
                                onChange={(e) => setNewDegrees(Number(e.target.value))}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                            >
                                {[0, 1, 2, 3, 4].map(d => (
                                    <option key={d} value={d}>{d} Grau(s)</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Data da Graduação</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Observações</label>
                        <textarea
                            rows={3}
                            value={obs}
                            onChange={(e) => setObs(e.target.value)}
                            placeholder="Ex: Exame de faixa realizado com sucesso..."
                            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                        <Button variant="primary" type="submit" className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20">
                            Confirmar Graduação
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}