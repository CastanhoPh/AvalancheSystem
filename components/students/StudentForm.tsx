import React, { useState, useEffect } from 'react';
import { X, UserCircle2, BookOpen, Users, Building2 } from 'lucide-react';
import { Student } from '../../types';
import { BELT_STYLES, formatString, generateId } from '../../constants';
import { Button } from '../ui/Primitives';

const InputField = ({ label, required = false, className = "", ...props }: any) => {
    const isLayout = className.includes('col-span');
    return (
        <div className={isLayout ? className : ''}>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
            <input className={`w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm shadow-sm placeholder-slate-400
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500 ${className.includes('bg-') ? '' : 'bg-white'} ${!isLayout ? className : ''}`} {...props} />
        </div>
    );
};

const SelectField = ({ label, required = false, children, ...props }: any) => (
    <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">{label} {required && <span className="text-red-500">*</span>}</label>
        <select className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm shadow-sm
    focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" {...props}>
            {children}
        </select>
    </div>
);

interface StudentFormProps {
    onClose: () => void;
    onSuccess: (student: Student) => void;
    student?: Student | null;
    currentUser: string;
}

export default function StudentForm({ onClose, onSuccess, student, currentUser }: StudentFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Student>>({
        nome_completo: '',
        genero: 'Masculino',
        data_nascimento: '',
        rg: '',
        cpf: '',
        status: 'Ativo',
        faixa: 'Branca',
        graus: 0,
        nome_mae: '',
        rg_mae: '',
        cpf_mae: '',
        telefone_mae: '',
        nome_pai: '',
        rg_pai: '',
        cpf_pai: '',
        telefone_pai: '',
        rua: '',
        bairro: '',
        cidade: '',
        cep: '',
        numero: '',
        escolaridade: '',
        escola: '',
        serie: '',
        turno: '',
        outras_doencas: '',
        doencas: [],
        aulas_matriculadas: [],
        batizado: false,
        data_batismo: '',
    });

    useEffect(() => {
        if (student) {
            setFormData(student);
        }
    }, [student]);

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const idade = formData.data_nascimento ? calculateAge(formData.data_nascimento) : undefined;
            const matricula = student ? student.matricula : Math.floor(1000 + Math.random() * 9000).toString();

            const newStudentData: Student = {
                ...formData,
                id: student?.id || generateId(),
                matricula,
                idade,
                data_inscricao: formData.data_inscricao || new Date().toISOString().split('T')[0],
                last_modified_by: currentUser,
            } as Student;

            onSuccess(newStudentData);
            setLoading(false);
            onClose();
        }, 500);
    };

    const handleCheckboxChange = (field: 'doencas' | 'aulas_matriculadas', value: string) => {
        const currentArray = formData[field] || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];

        setFormData({ ...formData, [field]: newArray });
    };

    // Handler genérico para aplicar máscaras (corrigido para permitir digitação livre)
    const handleMaskChange = (field: keyof Student, maskType: 'cpf' | 'rg' | 'phone' | 'cep') => (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const maskedValue = formatString(rawValue, maskType);
        setFormData({ ...formData, [field]: maskedValue });
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
                <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {student ? 'Editar Aluno' : 'Novo Aluno'}
                        </h2>
                        <p className="text-sm text-slate-500 mt-0.5">Responsável: <span className="font-semibold text-blue-600">{currentUser}</span></p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
                    {/* Dados do Aluno */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <UserCircle2 size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Dados Pessoais</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <InputField label="Nome Completo" required type="text" value={formData.nome_completo} onChange={(e: any) => setFormData({ ...formData, nome_completo: e.target.value })} />
                            </div>
                            <SelectField label="Gênero" required value={formData.genero} onChange={(e: any) => setFormData({ ...formData, genero: e.target.value as 'Masculino' | 'Feminino' })}>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </SelectField>
                            <InputField label="Data de Nascimento" required type="date" value={formData.data_nascimento} onChange={(e: any) => setFormData({ ...formData, data_nascimento: e.target.value })} />
                            <InputField
                                label="RG"
                                type="text"
                                value={formData.rg || ''}
                                onChange={handleMaskChange('rg', 'rg')}
                                placeholder="00.000.000-0"
                                maxLength={13}
                            />
                            <InputField
                                label="CPF"
                                type="text"
                                value={formData.cpf || ''}
                                onChange={handleMaskChange('cpf', 'cpf')}
                                placeholder="000.000.000-00"
                                maxLength={14}
                            />
                            <SelectField label="Status" required value={formData.status} onChange={(e: any) => setFormData({ ...formData, status: e.target.value as 'Ativo' | 'Inativo' })}>
                                <option value="Ativo">Ativo</option>
                                <option value="Inativo">Inativo</option>
                            </SelectField>
                            <SelectField label="Faixa" required value={formData.faixa} onChange={(e: any) => setFormData({ ...formData, faixa: e.target.value })}>
                                {Object.keys(BELT_STYLES).map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </SelectField>
                            <SelectField label="Graus" required value={formData.graus} onChange={(e: any) => setFormData({ ...formData, graus: Number(e.target.value) })}>
                                {[0, 1, 2, 3, 4].map(g => <option key={g} value={g}>{g} Grau(s)</option>)}
                            </SelectField>
                        </div>
                    </section>

                    {/* Informações Espirituais */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                                <BookOpen size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Espiritual</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors md:col-span-2">
                                <input
                                    type="checkbox"
                                    id="batizado"
                                    checked={formData.batizado}
                                    onChange={(e) => setFormData({ ...formData, batizado: e.target.checked })}
                                    className="h-5 w-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
                                />
                                <label htmlFor="batizado" className="text-sm font-medium text-slate-700 cursor-pointer flex-1">
                                    Aluno é batizado?
                                </label>
                            </div>

                            {formData.batizado && (
                                <InputField
                                    label="Data do Batismo"
                                    type="date"
                                    value={formData.data_batismo}
                                    onChange={(e: any) => setFormData({ ...formData, data_batismo: e.target.value })}
                                    className="animate-in fade-in slide-in-from-top-2"
                                />
                            )}
                        </div>
                    </section>

                    {/* Pais */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <Users size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Responsáveis</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <InputField label="Nome da Mãe" value={formData.nome_mae || ''} onChange={(e: any) => setFormData({ ...formData, nome_mae: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="RG Mãe"
                                        value={formData.rg_mae || ''}
                                        onChange={handleMaskChange('rg_mae', 'rg')}
                                        placeholder="00.000.000-0"
                                        maxLength={13}
                                    />
                                    <InputField
                                        label="CPF Mãe"
                                        value={formData.cpf_mae || ''}
                                        onChange={handleMaskChange('cpf_mae', 'cpf')}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                    />
                                </div>
                                <InputField
                                    label="Telefone Mãe"
                                    value={formData.telefone_mae || ''}
                                    onChange={handleMaskChange('telefone_mae', 'phone')}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>
                            <div className="space-y-4">
                                <InputField label="Nome do Pai" value={formData.nome_pai || ''} onChange={(e: any) => setFormData({ ...formData, nome_pai: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField
                                        label="RG Pai"
                                        value={formData.rg_pai || ''}
                                        onChange={handleMaskChange('rg_pai', 'rg')}
                                        placeholder="00.000.000-0"
                                        maxLength={13}
                                    />
                                    <InputField
                                        label="CPF Pai"
                                        value={formData.cpf_pai || ''}
                                        onChange={handleMaskChange('cpf_pai', 'cpf')}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                    />
                                </div>
                                <InputField
                                    label="Telefone Pai"
                                    value={formData.telefone_pai || ''}
                                    onChange={handleMaskChange('telefone_pai', 'phone')}
                                    placeholder="(00) 00000-0000"
                                    maxLength={15}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Endereço */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center space-x-3 mb-6 border-b border-slate-100 pb-4">
                            <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                                <Building2 size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800">Endereço</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputField label="Rua" value={formData.rua || ''} onChange={(e: any) => setFormData({ ...formData, rua: e.target.value })} />
                            </div>
                            <InputField label="Número" value={formData.numero || ''} onChange={(e: any) => setFormData({ ...formData, numero: e.target.value })} />
                            <InputField
                                label="CEP"
                                value={formData.cep || ''}
                                onChange={handleMaskChange('cep', 'cep')}
                                placeholder="00000-000"
                                maxLength={9}
                            />
                            <InputField label="Bairro" value={formData.bairro || ''} onChange={(e: any) => setFormData({ ...formData, bairro: e.target.value })} />
                            <InputField label="Cidade" value={formData.cidade || ''} onChange={(e: any) => setFormData({ ...formData, cidade: e.target.value })} />
                        </div>
                    </section>

                    {/* Outros */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Saúde</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {['Asma', 'Coração', 'Sinusite', 'Rinite Alérgica', 'Pressão Alta', 'Respiratório'].map((doenca) => (
                                    <label key={doenca} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.doencas?.includes(doenca)}
                                            onChange={() => handleCheckboxChange('doencas', doenca)}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-slate-700">{doenca}</span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Aulas Matriculadas</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {['Jiu-jitsu', 'Reforço Escolar', 'Reforço da Vida', 'Inglês'].map((aula) => (
                                    <label key={aula} className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={formData.aulas_matriculadas?.includes(aula)}
                                            onChange={() => handleCheckboxChange('aulas_matriculadas', aula)}
                                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-slate-700">{aula}</span>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>
                </form>

                <div className="bg-white px-8 py-5 border-t border-slate-100 flex justify-end space-x-3 sticky bottom-0 z-10">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Salvando...' : (student ? 'Atualizar Dados' : 'Cadastrar Aluno')}
                    </Button>
                </div>
            </div>
        </div>
    );
}