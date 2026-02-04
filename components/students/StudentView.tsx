import React from 'react';
import { X, UserCircle2, BookOpen, Users, Building2, Award, AlertCircle, ArrowUpCircle, Droplets, CheckCircle2 } from 'lucide-react';
import { Student, EvolutionRecord } from '../../types';
import { formatDate } from '../../constants';
import { Card, Badge, Button } from '../ui/Primitives';
import { BeltBadge } from '../ui/BeltBadge';
import EvolutionRecords from '../evolution/EvolutionRecords';

interface StudentViewProps {
    student: Student;
    onClose: () => void;
    allRecords: EvolutionRecord[];
    onSaveRecord: (record: Partial<EvolutionRecord>) => Promise<void>;
    onDeleteRecord: (id: string) => void;
    onPromote: () => void;
}

export default function StudentView({ student, onClose, allRecords, onSaveRecord, onDeleteRecord, onPromote }: StudentViewProps) {
    const DataRow = ({ label, value }: { label: string, value: string | React.ReactNode }) => (
        <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-3 rounded-lg transition-colors">
            <span className="text-sm font-medium text-slate-500">{label}</span>
            <span className="text-sm font-semibold text-slate-800 mt-1 sm:mt-0 text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
            <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
                <div className="bg-white px-8 py-6 border-b border-slate-100 flex items-start justify-between sticky top-0 z-10">
                    <div className="flex items-center space-x-5">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 flex items-center justify-center text-3xl font-bold text-white">
                            {student.nome_completo.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{student.nome_completo}</h2>
                            <div className="flex items-center space-x-3 mt-2">
                                <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">#{student.matricula}</span>
                                <Badge variant={student.status === 'Ativo' ? 'success' : 'danger'}>{student.status}</Badge>
                                <BeltBadge color={student.faixa} degrees={student.graus} />
                                <button onClick={onPromote} className="text-xs bg-yellow-50 text-yellow-700 hover:bg-yellow-100 px-2.5 py-0.5 rounded-full border border-yellow-200 flex items-center transition-all hover:shadow-sm font-medium ml-2">
                                    <ArrowUpCircle size={14} className="mr-1.5" /> Graduar
                                </button>
                                {student.batizado && (
                                    <span className="text-xs bg-violet-50 text-violet-700 hover:bg-violet-100 px-2.5 py-0.5 rounded-full border border-violet-200 flex items-center transition-all hover:shadow-sm font-medium ml-2 cursor-default">
                                        <Droplets size={14} className="mr-1.5" /> Batizado
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center pb-4 border-b border-slate-50">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mr-3">
                                        <UserCircle2 size={20} />
                                    </div>
                                    Informações Pessoais
                                </h3>
                                <div className="space-y-1">
                                    <DataRow label="Idade" value={`${student.idade || '?'} anos`} />
                                    <DataRow label="Gênero" value={student.genero} />
                                    <DataRow label="Nascimento" value={new Date(student.data_nascimento).toLocaleDateString('pt-BR')} />
                                    <DataRow label="CPF" value={student.cpf} />
                                    <DataRow label="RG" value={student.rg} />
                                    <DataRow label="Última alteração por" value={student.last_modified_by} />
                                </div>
                            </Card>

                            {/* Cartão de Espiritualidade */}
                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center pb-4 border-b border-slate-50">
                                    <div className="bg-violet-100 p-2 rounded-lg text-violet-600 mr-3">
                                        <BookOpen size={20} />
                                    </div>
                                    Vida Espiritual
                                </h3>
                                <div className="space-y-1">
                                    <DataRow label="Batizado" value={student.batizado ? <span className="text-emerald-600 font-bold flex items-center justify-end"><CheckCircle2 size={16} className="mr-1" /> Sim</span> : <span className="text-slate-400">Não</span>} />
                                    {student.batizado && <DataRow label="Data do Batismo" value={formatDate(student.data_batismo || '')} />}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center pb-4 border-b border-slate-50">
                                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                                        <Users size={20} />
                                    </div>
                                    Família e Contato
                                </h3>
                                <div className="space-y-6">
                                    {student.nome_mae && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mãe</p>
                                            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                                                <DataRow label="Nome" value={student.nome_mae} />
                                                <DataRow label="Telefone" value={student.telefone_mae} />
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <DataRow label="RG" value={student.rg_mae || '-'} />
                                                    <DataRow label="CPF" value={student.cpf_mae || '-'} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {student.nome_pai && (
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pai</p>
                                            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                                                <DataRow label="Nome" value={student.nome_pai} />
                                                <DataRow label="Telefone" value={student.telefone_pai} />
                                                <div className="grid grid-cols-2 gap-4 mt-2">
                                                    <DataRow label="RG" value={student.rg_pai || '-'} />
                                                    <DataRow label="CPF" value={student.cpf_pai || '-'} />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center pb-4 border-b border-slate-50">
                                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600 mr-3">
                                        <Building2 size={20} />
                                    </div>
                                    Localização
                                </h3>
                                <div className="space-y-1">
                                    <DataRow label="Rua" value={student.rua} />
                                    <DataRow label="Número" value={student.numero} />
                                    <DataRow label="Bairro" value={student.bairro} />
                                    <DataRow label="Cidade" value={student.cidade} />
                                    <DataRow label="CEP" value={student.cep} />
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Evolution & Tags */}
                        <div className="space-y-8">
                            <Card className="p-6">
                                <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider border-b border-slate-50 pb-4">Aulas & Saúde</h3>

                                <div className="mb-8">
                                    <p className="text-xs font-bold text-slate-500 mb-3 flex items-center"><Award size={14} className="mr-1.5" /> Aulas Matriculadas</p>
                                    <div className="flex flex-wrap gap-2">
                                        {student.aulas_matriculadas?.map(aula => (
                                            <span key={aula} className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-lg font-bold border border-blue-100">{aula}</span>
                                        )) || <span className="text-slate-400 text-sm italic">Nenhuma aula registrada</span>}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-500 mb-3 flex items-center"><AlertCircle size={14} className="mr-1.5" /> Condições de Saúde</p>
                                    <div className="flex flex-wrap gap-2">
                                        {student.doencas?.map(doenca => (
                                            <span key={doenca} className="bg-rose-50 text-rose-700 text-xs px-3 py-1.5 rounded-lg font-bold border border-rose-100">{doenca}</span>
                                        )) || <span className="text-slate-400 text-sm italic">Nenhuma condição registrada</span>}
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 bg-white overflow-hidden">
                                <EvolutionRecords studentId={student.id!} allRecords={allRecords} onSaveRecord={onSaveRecord} onDeleteRecord={onDeleteRecord} />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}