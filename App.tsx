import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    LayoutDashboard,
    Users,
    Wallet,
    BookOpen,
    Menu,
    X,
    LogOut,
    Search,
    TrendingUp,
    ArrowDownCircle,
    Plus
} from 'lucide-react';
import { Button } from './components/ui/Primitives';

import { Student, EvolutionRecord, FinancialTransaction, FinancialIncome, BeltColor } from './types';
import { generateId, MOCK_STUDENTS, MOCK_EVOLUTION_RECORDS, MOCK_TRANSACTIONS, MOCK_INCOMES } from './constants';

import LoginPage from './components/auth/LoginPage';
import DashboardOverview from './components/dashboard/DashboardOverview';
import StudentList from './components/students/StudentList';
import StudentStats from './components/dashboard/StudentStats';
import StudentForm from './components/students/StudentForm';
import StudentView from './components/students/StudentView';
import GraduationForm from './components/students/GraduationForm';
import FinancialDashboard from './components/dashboard/FinancialDashboard';
import TransactionList from './components/finance/TransactionList';
import TransactionForm from './components/finance/TransactionForm';
import IncomeForm from './components/finance/IncomeForm';
import IncomeList from './components/finance/IncomeList';
import TransactionView from './components/finance/TransactionView';
import GospelDashboard from './components/dashboard/GospelDashboard';

export default function App() {
    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<'dashboard' | 'students' | 'finance' | 'gospel'>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // State for Students
    const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
    const [studentSearch, setStudentSearch] = useState('');
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [showGraduationForm, setShowGraduationForm] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [viewStudent, setViewStudent] = useState<Student | null>(null);
    const [activeFilter, setActiveFilter] = useState<{ type: string, value: any } | null>(null);

    // State for Evolution Records
    const [evolutionRecords, setEvolutionRecords] = useState<EvolutionRecord[]>(MOCK_EVOLUTION_RECORDS);

    // State for Finance
    const [transactions, setTransactions] = useState<FinancialTransaction[]>(MOCK_TRANSACTIONS);
    const [incomes, setIncomes] = useState<FinancialIncome[]>(MOCK_INCOMES);
    const [financeSearch, setFinanceSearch] = useState('');
    const [financeTab, setFinanceTab] = useState<'incomes' | 'expenses'>('expenses');
    
    // Modals Financeiro
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [showIncomeForm, setShowIncomeForm] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
    const [viewTransaction, setViewTransaction] = useState<FinancialTransaction | null>(null);

    // --- Handlers ---
    const handleLogin = (user: string) => setCurrentUser(user);
    const handleLogout = () => setCurrentUser(null);

    const handleNavigation = (view: 'dashboard' | 'students' | 'finance' | 'gospel') => {
        setCurrentView(view);
        setIsSidebarOpen(false); // Close sidebar on mobile when navigating
    }

    const handleSaveStudent = (studentData: Student) => {
        const isEdit = !!selectedStudent;
        if (isEdit) {
            if (selectedStudent.status !== 'Inativo' && studentData.status === 'Inativo') {
                const newRecord: EvolutionRecord = {
                    id: generateId(),
                    student_id: studentData.id!,
                    data: new Date().toISOString().split('T')[0],
                    descricao: `Status alterado para Inativo via edição de cadastro por ${currentUser}.`,
                    status: 'Inativo',
                    tipo: 'mudanca_status',
                    created_at: new Date().toISOString()
                };
                setEvolutionRecords(prev => [newRecord, ...prev]);
            }
            setStudents(students.map(s => s.id === studentData.id ? studentData : s));
        } else {
            setStudents([studentData, ...students]);
        }
    };
    const handleDeleteStudent = (id: string) => {
        setStudents(students.filter(s => s.id !== id));
        setEvolutionRecords(evolutionRecords.filter(r => r.student_id !== id));
    };
    const handleSaveEvolutionRecord = async (record: Partial<EvolutionRecord>) => {
        if (record.id) {
            setEvolutionRecords(evolutionRecords.map(r => r.id === record.id ? { ...r, ...record } as EvolutionRecord : r));
        } else {
            const newRecord = { ...record, id: generateId() } as EvolutionRecord;
            setEvolutionRecords([newRecord, ...evolutionRecords]);
        }
        if (record.status === 'Inativo' && record.student_id) {
            setStudents(prevStudents => prevStudents.map(s => {
                if (s.id === record.student_id && s.status !== 'Inativo') { return { ...s, status: 'Inativo' }; }
                return s;
            }));
            if (viewStudent && viewStudent.id === record.student_id) {
                setViewStudent(prev => prev ? { ...prev, status: 'Inativo' } : null);
            }
        }
    };
    const handleDeleteEvolutionRecord = (id: string) => setEvolutionRecords(evolutionRecords.filter(r => r.id !== id));
    const handlePromoteStudent = (newBelt: BeltColor, newDegrees: number, date: string, obs: string) => {
        if (!viewStudent) return;
        const updatedStudent = { ...viewStudent, faixa: newBelt, graus: newDegrees, updated_at: new Date().toISOString() };
        setStudents(students.map(s => s.id === viewStudent.id ? updatedStudent : s));
        setViewStudent(updatedStudent);
        const newRecord: EvolutionRecord = {
            id: generateId(),
            student_id: viewStudent.id!,
            data: date,
            descricao: `Graduado para Faixa ${newBelt} (${newDegrees}º Grau).\n${obs}`,
            status: viewStudent.status,
            tipo: 'graduacao',
            created_at: new Date().toISOString()
        };
        setEvolutionRecords([newRecord, ...evolutionRecords]);
        setShowGraduationForm(false);
    };
    const handleSaveTransaction = (transactionData: FinancialTransaction) => {
        if (selectedTransaction) {
            setTransactions(transactions.map(t => t.id === transactionData.id ? transactionData : t));
        } else {
            setTransactions([transactionData, ...transactions]);
        }
    };
    const handleDeleteTransaction = (id: string) => setTransactions(transactions.filter(t => t.id !== id));
    
    // Income Handlers
    const handleSaveIncome = (income: FinancialIncome) => {
        setIncomes([income, ...incomes]);
    };
    const handleDeleteIncome = (id: string) => setIncomes(incomes.filter(i => i.id !== id));

    const handleFilterSelect = (type: string, value: any) => {
        if (activeFilter?.type === type && activeFilter?.value === value) { setActiveFilter(null); }
        else { setActiveFilter({ type, value }); }
    };
    const clearFilter = () => setActiveFilter(null);
    useEffect(() => { setActiveFilter(null); }, [currentView]);

    if (!currentUser) return <LoginPage onLogin={handleLogin} />;

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[50] lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Navigation Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-slate-900 text-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-24 flex items-center px-8 border-b border-slate-800 bg-slate-950">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl mr-4 shadow-lg shadow-blue-500/20 ring-1 ring-white/10">
                        <GraduationCap className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="font-bold text-xl tracking-tight block leading-none text-white">Avalanche</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">System</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu Principal</p>

                    <button onClick={() => handleNavigation('dashboard')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${currentView === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        <LayoutDashboard size={20} className={`mr-3 ${currentView === 'dashboard' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-semibold text-sm">Dashboard</span>
                    </button>

                    <button onClick={() => handleNavigation('students')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${currentView === 'students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        <Users size={20} className={`mr-3 ${currentView === 'students' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-semibold text-sm">Gestão de Alunos</span>
                    </button>

                    <button onClick={() => handleNavigation('finance')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${currentView === 'finance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        <Wallet size={20} className={`mr-3 ${currentView === 'finance' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-semibold text-sm">Financeiro</span>
                    </button>

                    <button onClick={() => handleNavigation('gospel')} className={`w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${currentView === 'gospel' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-500' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
                        <BookOpen size={20} className={`mr-3 ${currentView === 'gospel' ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                        <span className="font-semibold text-sm">Evangelho</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-800 bg-slate-950">
                    <div className="flex items-center space-x-3 mb-5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="h-10 w-10 rounded-lg flex items-center justify-center font-bold bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                            {currentUser?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-white truncate">{currentUser}</p>
                            <p className="text-xs text-slate-400 uppercase font-bold tracking-wide">Acesso Total</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-red-600/10 hover:text-red-500 text-slate-400 rounded-lg text-sm font-medium transition-all group border border-slate-800 hover:border-red-500/20">
                        <LogOut size={16} className="mr-2 group-hover:text-red-500" /> Sair do Sistema
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:ml-72 p-4 md:p-8 lg:p-10 transition-all duration-300">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-6 lg:mb-10 gap-4 animate-fade-in-down">
                    <div className="flex items-center w-full lg:w-auto">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="mr-4 p-2 text-slate-500 hover:bg-slate-200 rounded-lg lg:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                {currentView === 'dashboard' ? 'Visão Geral' : currentView === 'students' ? 'Alunos' : currentView === 'finance' ? 'Financeiro' : 'Evangelho'}
                            </h1>
                            <p className="text-slate-500 mt-1 md:mt-2 text-sm md:text-base font-medium flex items-center">
                                {currentView === 'dashboard' ? 'Acompanhe as métricas principais da ONG.' :
                                    currentView === 'students' ? 'Gerencie matrículas e graduações.' :
                                        currentView === 'finance' ? 'Controle de entradas e saídas.' :
                                            'Acompanhe o crescimento espiritual.'}
                            </p>
                        </div>
                    </div>

                    {(currentView === 'students' || currentView === 'finance') && (
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                            {currentView === 'finance' && (
                                <>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowIncomeForm(true)}
                                        className="py-3 px-5 border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 whitespace-nowrap"
                                    >
                                        <TrendingUp size={20} className="mr-2" />
                                        Nova Entrada
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => { setSelectedTransaction(null); setShowTransactionForm(true); }}
                                        className="py-3 px-5 border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 hover:border-rose-300 whitespace-nowrap"
                                    >
                                        <ArrowDownCircle size={20} className="mr-2" />
                                        Nova Saída
                                    </Button>
                                </>
                            )}
                            
                            {currentView === 'students' && (
                                <>
                                    <div className="relative group w-full sm:w-auto">
                                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Buscar por nome..."
                                            value={studentSearch}
                                            onChange={(e) => setStudentSearch(e.target.value)}
                                            className="w-full sm:w-64 lg:w-80 pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:shadow-md hover:border-slate-300 placeholder-slate-400"
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        onClick={() => { setSelectedStudent(null); setShowStudentForm(true); }}
                                        className="py-3 px-5 shadow-lg shadow-blue-600/20 w-full sm:w-auto whitespace-nowrap"
                                    >
                                        <Plus size={20} className="mr-2" />
                                        <span>Novo Aluno</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </header>

                {currentView === 'dashboard' ? (
                    <div className="space-y-8 animate-fade-in">
                        <DashboardOverview students={students} onFilterSelect={handleFilterSelect} activeFilter={activeFilter} />
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center">
                                    <Users className="mr-2 text-slate-400" size={24} />
                                    Lista de Alunos Filtrada
                                </h2>
                            </div>
                            <StudentList
                                students={students}
                                searchTerm=""
                                activeFilter={activeFilter}
                                onClearFilter={clearFilter}
                                onEdit={(s) => {
                                    setCurrentView('students');
                                    setSelectedStudent(s);
                                    setShowStudentForm(true);
                                }}
                                onView={(s) => {
                                    setCurrentView('students');
                                    setViewStudent(s);
                                }}
                                onDelete={handleDeleteStudent}
                            />
                        </div>
                    </div>
                ) : currentView === 'students' ? (
                    <div className="animate-fade-in">
                        <StudentStats students={students} onFilterSelect={handleFilterSelect} activeFilter={activeFilter} />

                        <StudentList
                            students={students}
                            searchTerm={studentSearch}
                            activeFilter={activeFilter}
                            onClearFilter={clearFilter}
                            onEdit={(s) => { setSelectedStudent(s); setShowStudentForm(true); }}
                            onView={(s) => { setViewStudent(s) }}
                            onDelete={handleDeleteStudent}
                        />

                        {showStudentForm && (
                            <StudentForm
                                onClose={() => setShowStudentForm(false)}
                                onSuccess={handleSaveStudent}
                                student={selectedStudent}
                                currentUser={currentUser}
                            />
                        )}
                        {viewStudent && (
                            <StudentView
                                student={viewStudent}
                                onClose={() => setViewStudent(null)}
                                allRecords={evolutionRecords}
                                onSaveRecord={handleSaveEvolutionRecord}
                                onDeleteRecord={handleDeleteEvolutionRecord}
                                onPromote={() => setShowGraduationForm(true)}
                            />
                        )}
                        {showGraduationForm && viewStudent && (
                            <GraduationForm
                                student={viewStudent}
                                onClose={() => setShowGraduationForm(false)}
                                onConfirm={handlePromoteStudent}
                            />
                        )}
                    </div>
                ) : currentView === 'finance' ? (
                    <div className="animate-fade-in">
                        <FinancialDashboard
                            totalExpenses={transactions.reduce((acc, curr) => acc + curr.total_value, 0)}
                            totalIncomes={incomes.reduce((acc, curr) => acc + curr.amount, 0)}
                        />

                        {/* Finance Tabs */}
                        <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-fit mb-6">
                            <button 
                                onClick={() => setFinanceTab('expenses')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${financeTab === 'expenses' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Saídas (Notas Fiscais)
                            </button>
                            <button 
                                onClick={() => setFinanceTab('incomes')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${financeTab === 'incomes' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-emerald-600'}`}
                            >
                                Entradas (Receitas)
                            </button>
                        </div>

                        {financeTab === 'expenses' ? (
                            <>
                                <div className="mb-4 relative group w-full sm:w-auto">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Buscar nota fiscal..."
                                        value={financeSearch}
                                        onChange={(e) => setFinanceSearch(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm hover:shadow-md hover:border-slate-300 placeholder-slate-400"
                                    />
                                </div>
                                <TransactionList
                                    transactions={transactions}
                                    searchTerm={financeSearch}
                                    onEdit={(t) => { setSelectedTransaction(t); setShowTransactionForm(true); }}
                                    onView={(t) => setViewTransaction(t)}
                                    onDelete={handleDeleteTransaction}
                                />
                            </>
                        ) : (
                            <IncomeList incomes={incomes} onDelete={handleDeleteIncome} />
                        )}

                        {showTransactionForm && (
                            <TransactionForm
                                onClose={() => setShowTransactionForm(false)}
                                onSuccess={handleSaveTransaction}
                                transaction={selectedTransaction}
                            />
                        )}
                        {showIncomeForm && (
                            <IncomeForm 
                                onClose={() => setShowIncomeForm(false)}
                                onSuccess={handleSaveIncome}
                            />
                        )}
                        {viewTransaction && (
                            <TransactionView
                                transaction={viewTransaction}
                                onClose={() => setViewTransaction(null)}
                            />
                        )}
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <GospelDashboard
                            students={students}
                            onFilterSelect={handleFilterSelect}
                            activeFilter={activeFilter}
                        />
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                                <BookOpen className="mr-2 text-slate-400" size={24} />
                                Alunos por Status Espiritual
                            </h2>
                            <StudentList
                                students={students}
                                searchTerm=""
                                activeFilter={activeFilter}
                                onClearFilter={clearFilter}
                                onEdit={(s) => {
                                    setCurrentView('students');
                                    setSelectedStudent(s);
                                    setShowStudentForm(true);
                                }}
                                onView={(s) => {
                                    setCurrentView('students');
                                    setViewStudent(s);
                                }}
                                onDelete={handleDeleteStudent}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}