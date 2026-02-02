'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, MessageSquare, MapPin, Tag, Settings, Hexagon } from 'lucide-react';

const navigation = [
    { name: 'Painel', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Feedbacks', href: '/feedbacks', icon: MessageSquare },
    { name: 'Regiões', href: '/regions', icon: MapPin },
    { name: 'Categorias', href: '/categories', icon: Tag },
    { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar({ onItemClick }: { onItemClick?: () => void }) {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col bg-[#0d0d14] lg:border-r lg:border-[#1e1e2e]">
            <div className="hidden h-16 items-center px-6 border-b border-[#1e1e2e] lg:flex">
                <Hexagon className="h-6 w-6 text-blue-500 mr-2" />
                <span className="text-lg font-bold text-white">FeedbackPulse</span>
            </div>

            <div className="px-3 py-4">
                <div className="mb-4 px-3">
                    <label className="text-xs font-semibold text-[#6b6b80] uppercase tracking-wider">Workspace</label>
                    <div className="mt-1 flex items-center p-2 rounded-md bg-[#12121a] border border-[#1e1e2e]">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm text-[#a0a0b0] truncate font-medium">Campanha Silva 2026</span>
                    </div>
                </div>

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onItemClick}
                                className={cn(
                                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                        : "text-[#a0a0b0] hover:bg-[#12121a] hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0",
                                        isActive ? "text-white" : "text-[#6b6b80] group-hover:text-[#a0a0b0]"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto px-6 py-4 border-t border-[#1e1e2e]">
                <div className="text-xs text-[#6b6b80]">
                    v1.0.0
                </div>
            </div>
        </div>
    );
}
