'use client';

import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#12121a] border border-[#1e1e2e] rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-[#1e1e2e]">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-[#6b6b80] hover:text-white">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}
