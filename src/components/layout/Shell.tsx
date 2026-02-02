'use client';

import { Sidebar } from './Sidebar';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Shell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
            {/* Sidebar for Desktop */}
            <div className="hidden lg:flex lg:flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0d0d14] transition-transform duration-300 ease-in-out lg:hidden
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex justify-end p-4">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-6 w-6 text-[#a0a0b0]" />
                    </Button>
                </div>
                <Sidebar onItemClick={() => setIsSidebarOpen(false)} />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="flex h-16 items-center border-b border-[#1e1e2e] bg-[#0d0d14] px-4 lg:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6 text-[#a0a0b0]" />
                    </Button>
                    <span className="ml-4 text-lg font-bold text-white">FeedbackPulse</span>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
                    <div className="mx-auto max-w-7xl w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
