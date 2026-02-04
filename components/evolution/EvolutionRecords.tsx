import React, { useState } from 'react';
import { Plus, Calendar, Award, Edit2, Trash2 } from 'lucide-react';
import { EvolutionRecord } from '../../types';
import { formatDate } from '../../constants';
import { Button, Badge, ConfirmModal } from '../ui/Primitives';
import EvolutionForm from './EvolutionForm';

interface EvolutionRecordsProps {
    studentId: string;
    allRecords: EvolutionRecord[];
    onSaveRecord: (record: Partial<EvolutionRecord>) => Promise<void>;
    onDeleteRecord: (id: string) => void;
}

export default function EvolutionRecords({ studentId, allRecords, onSaveRecord, onDeleteRecord }: EvolutionRecordsProps) {
    const [showForm, setShowForm] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<EvolutionRecord | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const records = allRecords.filter(r => r.student_id === studentId).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Linha do Tempo</h3>
                <Button size="sm" variant="secondary" onClick={() => setShowForm(true)} className="!text-xs border-dashed border-slate-300 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50">
                    <Plus size={14} className="mr-1.5" /> Adicionar Registro
                </Button>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
                {records.length === 0 ? (
                    <div className="ml-8 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 text-sm italic">Nenhum registro de evolução encontrado.</p>
                    </div>
                ) : (
                    records.map((record) => (
                        <div key={record.id} className="ml-8 relative group">
                            <span className={`absolute -left-[41px] top-0 h-5 w-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all
                ${record.tipo === 'mudanca_status' ? 'bg-rose-500 ring-2 ring-rose-100' : record.tipo === 'graduacao' ? 'bg-amber-400 ring-2 ring-amber-100' : 'bg-blue-500 ring-2 ring-blue-100'}
              `}>
                            </span>
                            <div className={`rounded-2xl p-5 border transition-all duration-300 hover:shadow-md
                ${record.tipo === 'graduacao' ? 'bg-gradient-to-br from-amber-50 to-white border-amber-100' :
                                    record.tipo === 'mudanca_status' ? 'bg-gradient-to-br from-rose-50 to-white border-rose-100' :
                                        'bg-white border-slate-100 hover:border-slate-200'}`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                            <Calendar size={12} className="mr-1.5" />{formatDate(record.data)}
                                        </span>
                                        {record.tipo === 'mudanca_status' && (
                                            <span className="bg-rose-100 text-rose-700 text-[10px] uppercase font-bold px-2 py-1 rounded-md">Status Alterado</span>
                                        )}
                                        {record.tipo === 'graduacao' && (
                                            <span className="bg-amber-100 text-amber-800 text-[10px] uppercase font-bold px-2 py-1 rounded-md flex items-center">
                                                <Award size={12} className="mr-1" /> Graduação
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setSelectedRecord(record); setShowForm(true); }} className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-white transition-colors"><Edit2 size={14} /></button>
                                        <button onClick={() => { setDeleteId(record.id!) }} className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="flex items-center mb-3">
                                    <Badge variant={record.status === 'Ativo' ? 'success' : 'danger'}>{record.status}</Badge>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{record.descricao}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showForm && (
                <EvolutionForm
                    studentId={studentId}
                    record={selectedRecord}
                    onClose={() => { setShowForm(false); setSelectedRecord(null); }}
                    onSave={onSaveRecord}
                />
            )}
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => { if (deleteId) onDeleteRecord(deleteId); setDeleteId(null); }}
                title="Excluir Registro"
                message="Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
            />
        </div>
    );
}