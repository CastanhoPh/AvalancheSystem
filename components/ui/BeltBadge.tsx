import React from 'react';
import { BeltColor } from '../../types';
import { BELT_STYLES } from '../../constants';

export const BeltBadge = ({ color, degrees }: { color: BeltColor, degrees: number }) => {
    const style = BELT_STYLES[color] || BELT_STYLES['Branca'];

    if (color === 'Sem Faixa') {
        return (
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full border shadow-sm text-xs font-bold ${style.bg} ${style.border} ${style.text}`}>
                Sem Faixa
            </div>
        );
    }

    return (
        <div className={`inline-flex items-center px-2.5 py-1 rounded-full border shadow-sm text-xs font-bold ${style.bg} ${style.border} ${style.text}`}>
            {color}
            {degrees > 0 && (
                <div className="ml-2 flex gap-0.5">
                    {Array.from({ length: degrees }).map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full shadow-sm ring-1 ring-black/10 ${color === 'Preta' ? 'bg-red-500' : 'bg-white'}`}></div>
                    ))}
                </div>
            )}
        </div>
    );
};