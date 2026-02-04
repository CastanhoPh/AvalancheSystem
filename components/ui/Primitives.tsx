import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

// --- Card ---
export const Card = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 ${className} ${onClick ? 'cursor-pointer hover:translate-y-[-2px] transition-all duration-300 ease-out' : ''}`}
    >
        {children}
    </div>
);

// --- Badge ---
export const Badge = ({ children, variant = 'primary' }: { children: React.ReactNode, variant?: 'primary' | 'success' | 'danger' | 'warning' | 'neutral' }) => {
    const styles = {
        primary: 'bg-blue-50 text-blue-700 border border-blue-100',
        success: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
        danger: 'bg-rose-50 text-rose-700 border border-rose-100',
        warning: 'bg-amber-50 text-amber-700 border border-amber-100',
        neutral: 'bg-slate-50 text-slate-600 border border-slate-100'
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}>
            {children}
        </span>
    );
};

// --- Button ---
export const Button = ({ onClick, children, variant = 'primary', size = 'md', className = "", disabled = false, type = 'button' }: { onClick?: (e: any) => void, children: React.ReactNode, variant?: 'primary' | 'secondary' | 'danger' | 'ghost', size?: 'sm' | 'md' | 'lg', className?: string, disabled?: boolean, type?: 'button' | 'submit' }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
        secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50 focus:ring-red-500",
        ghost: "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </button>
    );
};

// --- ConfirmModal ---
export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string, message: string }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="danger" onClick={onConfirm}>Confirmar</Button>
                </div>
            </div>
        </div>
    );
};

// --- Notification ---
export const Notification = ({ message, onClose }: { message: string | null, onClose: () => void }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-4 right-4 z-[100] bg-slate-900 text-white px-6 py-4 rounded-xl shadow-lg flex items-center animate-in slide-in-from-bottom-5 duration-300">
            <CheckCircle2 size={20} className="text-emerald-400 mr-3" />
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 text-slate-400 hover:text-white transition-colors"><X size={16} /></button>
        </div>
    )
};