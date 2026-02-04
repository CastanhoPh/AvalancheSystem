export type BeltColor = 'Sem Faixa' | 'Branca' | 'Cinza' | 'Amarela' | 'Laranja' | 'Verde' | 'Azul' | 'Roxa' | 'Marrom' | 'Preta';

export interface Student {
    id?: string;
    matricula: string;
    nome_completo: string;
    genero: 'Masculino' | 'Feminino';
    data_nascimento: string;
    idade?: number;
    rg?: string;
    cpf?: string;
    data_inscricao?: string;
    status: 'Ativo' | 'Inativo';
    faixa: BeltColor;
    graus: number;
    nome_mae?: string;
    rg_mae?: string;
    cpf_mae?: string;
    telefone_mae?: string;
    nome_pai?: string;
    rg_pai?: string;
    cpf_pai?: string;
    telefone_pai?: string;
    rua?: string;
    bairro?: string;
    cidade?: string;
    cep?: string;
    numero?: string;
    escolaridade?: string;
    escola?: string;
    serie?: string;
    turno?: string;
    doencas?: string[];
    outras_doencas?: string;
    aulas_matriculadas?: string[];
    batizado?: boolean;
    data_batismo?: string;
    created_at?: string;
    updated_at?: string;
    last_modified_by?: string;
}

export interface EvolutionRecord {
    id?: string;
    student_id: string;
    data: string;
    descricao: string;
    status: 'Ativo' | 'Inativo';
    tipo?: 'evolucao' | 'mudanca_status' | 'graduacao';
    created_at?: string;
    updated_at?: string;
}

export interface TransactionItem {
    id?: string;
    transaction_id?: string;
    item_name: string;
    quantity: number;
    unit_value: number;
    final_value: number;
    created_at?: string;
}

// Representa Saídas (Despesas/Notas)
export interface FinancialTransaction {
    id: string;
    transaction_number: string;
    issue_date: string;
    entry_date: string;
    company_name: string;
    invoice_number: string;
    total_value: number;
    created_at: string;
    updated_at: string;
    items?: TransactionItem[];
}

// Representa Entradas (Receitas)
export interface FinancialIncome {
    id: string;
    date: string;
    amount: number;
    method: 'Pix' | 'Cartão' | 'Boleto' | 'Dinheiro';
    description?: string;
    created_at: string;
}