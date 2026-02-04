import React, { useState } from 'react';
import { GraduationCap, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Primitives';

export default function LoginPage({ onLogin }: { onLogin: (name: string) => void }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin') {
            onLogin('Administrador');
        } else {
            setError('Senha incorreta (Dica: use "admin")');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=2232')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative z-10 animate-fade-in-up">
                <div className="bg-white p-8 text-center border-b border-slate-100">
                    <div className="inline-flex bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-500/20">
                        <GraduationCap className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Avalanche System</h1>
                    <p className="text-slate-500 text-sm mt-1">Gestão de Performance e Alunos</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Senha de Acesso</label>
                        <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-slate-800 placeholder-slate-400"
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2 font-medium flex items-center"><AlertCircle size={12} className="mr-1" />{error}</p>}
                    </div>

                    <Button type="submit" className="w-full py-3 shadow-blue-500/20" size="lg">Aceder ao Painel</Button>
                </form>
                <div className="bg-slate-50 p-4 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest border-t border-slate-100">
                    Avalanche Jiu-Jitsu &copy; 2025
                </div>
            </div>
        </div>
    );
}