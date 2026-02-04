import { BeltColor, Student, EvolutionRecord, FinancialTransaction, FinancialIncome } from './types';

// --- CONSTANTS ---

export const BELT_STYLES: Record<string, { bg: string, text: string, border: string, icon: string }> = {
    'Sem Faixa': { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200', icon: 'text-slate-400' },
    'Branca': { bg: 'bg-white', text: 'text-slate-700', border: 'border-slate-200', icon: 'text-slate-400' },
    'Cinza': { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300', icon: 'text-slate-500' },
    'Amarela': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-500' },
    'Laranja': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-500' },
    'Verde': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'text-emerald-500' },
    'Azul': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' },
    'Roxa': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'text-purple-500' },
    'Marrom': { bg: 'bg-amber-900/10', text: 'text-amber-900', border: 'border-amber-900/20', icon: 'text-amber-800' },
    'Preta': { bg: 'bg-slate-900', text: 'text-white', border: 'border-slate-800', icon: 'text-red-500' }
};

export const BELT_ORDER: BeltColor[] = ['Sem Faixa', 'Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'];

// --- HELPERS ---

export const formatString = (value: string, maskType: 'cpf' | 'rg' | 'phone' | 'cep') => {
    if (!value) return '';
    let v = value.replace(/\D/g, '');

    if (maskType === 'cpf') {
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
        if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        return v;
    }

    if (maskType === 'rg') {
        if (v.length > 9) v = v.slice(0, 9);
        if (v.length > 8) return v.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
        if (v.length > 5) return v.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
        if (v.length > 2) return v.replace(/(\d{2})(\d{1,3})/, '$1.$2');
        return v;
    }

    if (maskType === 'phone') {
        if (v.length > 11) v = v.slice(0, 11);
        if (v.length > 10) return v.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
        if (v.length > 6) return v.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        if (v.length > 2) return v.replace(/^(\d\d)(\d{0,5})/, '($1) $2');
        return v.replace(/^(\d*)/, '($1');
    }

    if (maskType === 'cep') {
        if (v.length > 8) v = v.slice(0, 8);
        if (v.length > 5) return v.replace(/^(\d{5})(\d)/, '$1-$2');
        return v;
    }
    return value;
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return new Date(dateString).toLocaleDateString('pt-BR');
};

// --- MOCK DATA ---

export const MOCK_STUDENTS: Student[] = [
    {
        id: '1',
        matricula: '0001',
        nome_completo: 'João Silva',
        genero: 'Masculino',
        data_nascimento: '2010-05-15',
        idade: 13,
        status: 'Ativo',
        faixa: 'Amarela',
        graus: 2,
        data_inscricao: '2023-01-10',
        aulas_matriculadas: ['Jiu-jitsu', 'Reforço Escolar'],
        doencas: [],
        batizado: true,
        data_batismo: '2022-05-20',
        nome_mae: 'Maria Silva',
        telefone_mae: '(11) 99999-9999',
        rua: 'Rua das Flores',
        numero: '123',
        cep: '01001-000',
        bairro: 'Centro',
        cidade: 'São Paulo'
    },
    {
        id: '2',
        matricula: '0002',
        nome_completo: 'Ana Santos',
        genero: 'Feminino',
        data_nascimento: '2012-08-20',
        idade: 11,
        status: 'Ativo',
        faixa: 'Cinza',
        graus: 4,
        data_inscricao: '2023-02-15',
        aulas_matriculadas: ['Jiu-jitsu', 'Inglês'],
        doencas: ['Rinite Alérgica'],
        batizado: false,
        nome_pai: 'Carlos Santos',
        telefone_pai: '(11) 88888-8888',
        rua: 'Av. Paulista',
        numero: '1000',
        cep: '01310-100',
        bairro: 'Jardins',
        cidade: 'São Paulo'
    },
    {
        id: '3',
        matricula: '0003',
        nome_completo: 'Pedro Oliveira',
        genero: 'Masculino',
        data_nascimento: '2008-03-10',
        idade: 15,
        status: 'Inativo',
        faixa: 'Branca',
        graus: 0,
        data_inscricao: '2022-11-05',
        aulas_matriculadas: ['Jiu-jitsu'],
        doencas: [],
        batizado: true,
        data_batismo: '2021-12-10',
        bairro: 'Vila Madalena',
        cidade: 'São Paulo'
    },
    {
        id: '4',
        matricula: '0004',
        nome_completo: 'Mariana Costa',
        genero: 'Feminino',
        data_nascimento: '2014-06-12',
        idade: 9,
        status: 'Ativo',
        faixa: 'Sem Faixa',
        graus: 0,
        data_inscricao: '2023-05-10',
        aulas_matriculadas: ['Reforço Escolar'],
        doencas: [],
        batizado: false,
        bairro: 'Moema',
        cidade: 'São Paulo'
    }
];

export const MOCK_EVOLUTION_RECORDS: EvolutionRecord[] = [
    {
        id: '101',
        student_id: '1',
        data: '2023-06-15',
        descricao: 'Aluno demonstrou grande evolução na técnica de guarda.',
        status: 'Ativo',
        tipo: 'evolucao'
    }
];

export const MOCK_TRANSACTIONS: FinancialTransaction[] = [
    {
        id: 't1',
        transaction_number: '0001',
        issue_date: '2023-10-01',
        entry_date: '2023-10-02',
        company_name: 'Kimonos KVRA',
        invoice_number: 'NF-123456',
        total_value: 450.00,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
            { id: 'i1', item_name: 'Kimono Branco A1 (Doação)', quantity: 1, unit_value: 450.00, final_value: 450.00 }
        ]
    },
    {
        id: 't2',
        transaction_number: '0002',
        issue_date: '2023-10-05',
        entry_date: '2023-10-06',
        company_name: 'Papelaria Central',
        invoice_number: 'NF-987654',
        total_value: 120.50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [
            { id: 'i2', item_name: 'Cadernos para Reforço', quantity: 10, unit_value: 10.00, final_value: 100.00 },
            { id: 'i3', item_name: 'Canetas', quantity: 5, unit_value: 4.10, final_value: 20.50 }
        ]
    }
];

export const MOCK_INCOMES: FinancialIncome[] = [
    {
        id: 'inc1',
        date: '2023-10-01',
        amount: 150.00,
        method: 'Pix',
        description: 'Mensalidade João Silva',
        created_at: new Date().toISOString()
    },
    {
        id: 'inc2',
        date: '2023-10-03',
        amount: 200.00,
        method: 'Dinheiro',
        description: 'Doação Anônima',
        created_at: new Date().toISOString()
    }
];