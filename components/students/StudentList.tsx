import React, { useState } from 'react';
import { Filter, Search, Droplets, Eye, Edit2, Trash2 } from 'lucide-react';
import { Student } from '../../types';
import { Card, ConfirmModal, Badge } from '../ui/Primitives';
import { BeltBadge } from '../ui/BeltBadge';

interface StudentListProps {
    students: Student[];
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
    onView: (student: Student) => void;
    searchTerm: string;
    activeFilter: { type: string, value: any } | null;
    onClearFilter: () => void;
}

export default function StudentList({ students, onEdit, onDelete, onView, searchTerm, activeFilter, onClearFilter }: StudentListProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const filteredStudents = students.filter((student) => {
        // 1. Text Search
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            student.nome_completo.toLowerCase().includes(searchLower) ||
            (student.cpf && student.cpf.toLowerCase().includes(searchLower)) ||
            student.matricula.toLowerCase().includes(searchLower);

        // 2. Active Filter
        if (!matchesSearch) return false;
        if (!activeFilter) return true;

        if (activeFilter.type === 'status') return student.status === activeFilter.value;
        if (activeFilter.type === 'genero') return student.genero === activeFilter.value;
        if (activeFilter.type === 'faixa') return student.faixa === activeFilter.value;
        if (activeFilter.type === 'matricula_mes') {
            if (!student.data_inscricao) return false;
            const d = new Date(student.data_inscricao);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        // Novo Filtro para Batismo
        if (activeFilter.type === 'batizado') {
            if (activeFilter.value === 'Sim') return student.batizado === true;
            if (activeFilter.value === 'Não') return !student.batizado;
        }

        return true;
    });

    return (
        <div className="space-y-4">
            {activeFilter && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl animate-fade-in">
                    <div className="flex items-center text-blue-800">
                        <div className="bg-blue-200 p-1.5 rounded-lg mr-3">
                            <Filter size={16} />
                        </div>
                        <span className="font-medium">Filtrando por: <strong className="ml-1">{activeFilter.value === 'matricula_mes' ? 'Novas Matrículas' : activeFilter.value}</strong></span>
                        <span className="ml-3 text-xs bg-white text-blue-600 px-2.5 py-0.5 rounded-full font-bold shadow-sm">{filteredStudents.length} encontrado(s)</span>
                    </div>
                    <button onClick={onClearFilter} className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        Limpar Filtro
                    </button>
                </div>
            )}

            <Card className="overflow-hidden border-0 shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Aluno</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Faixa</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Grau</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {filteredStudents.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-16 text-center text-slate-400 italic">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search size={48} className="text-slate-200 mb-4" />
                                        <p>Nenhum aluno encontrado com os filtros atuais.</p>
                                    </div>
                                </td></tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm mr-4 border border-slate-200 shadow-sm relative">
                                                    {student.nome_completo.charAt(0)}
                                                    {student.batizado && (
                                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                            <div className="bg-violet-100 text-violet-600 rounded-full p-0.5" title="Batizado">
                                                                <Droplets size={10} fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-900">{student.nome_completo}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{student.idade ? `${student.idade} anos` : '-'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono bg-slate-50/30 w-32 text-center rounded-lg my-2 mx-4">
                                            {student.matricula}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                            <BeltBadge color={student.faixa} degrees={student.graus} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 text-center font-bold">
                                            {student.faixa !== 'Sem Faixa' ? `${student.graus}º` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant={student.status === 'Ativo' ? 'success' : 'danger'}>{student.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-1 opacity-60 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => onView(student)} className="text-slate-400 hover:text-blue-600 bg-transparent hover:bg-blue-50 p-2 rounded-lg transition-all" title="Ver Detalhes">
                                                    <Eye size={18} />
                                                </button>
                                                <button onClick={() => onEdit(student)} className="text-slate-400 hover:text-amber-600 bg-transparent hover:bg-amber-50 p-2 rounded-lg transition-all" title="Editar">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => setDeleteId(student.id!)} className="text-slate-400 hover:text-red-600 bg-transparent hover:bg-red-50 p-2 rounded-lg transition-all" title="Excluir">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => { if (deleteId) onDelete(deleteId); setDeleteId(null); }}
                title="Excluir Aluno"
                message="Tem certeza que deseja excluir este aluno? Todos os registros relacionados também serão apagados."
            />
        </div>
    );
}