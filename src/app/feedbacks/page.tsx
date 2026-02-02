'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MessageSquare, Calendar, Phone, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sentiment } from '@/types';

const sentimentConfig: Record<Sentiment, { label: string; color: string; icon: string }> = {
    positive: { label: 'Positivo', color: 'text-green-500 bg-green-500/10', icon: '😊' },
    neutral: { label: 'Neutro', color: 'text-slate-500 bg-slate-500/10', icon: '😐' },
    negative: { label: 'Negativo', color: 'text-red-500 bg-red-500/10', icon: '😟' },
    critical: { label: 'Crítico', color: 'text-red-700 bg-red-700/10 border-red-900', icon: '😡' },
};

export default function FeedbacksPage() {
    const { feedbacks, regions, categories } = useStore();
    const [search, setSearch] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('all');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedSentiment, setSelectedSentiment] = useState('all');

    const filteredFeedbacks = feedbacks.filter((f) => {
        const matchesSearch = f.description.toLowerCase().includes(search.toLowerCase());
        const matchesRegion = selectedRegion === 'all' || f.regionId === selectedRegion;
        const matchesCategory = selectedCategory === 'all' || f.categoryId === selectedCategory;
        const matchesSentiment = selectedSentiment === 'all' || f.sentiment === selectedSentiment;
        return matchesSearch && matchesRegion && matchesCategory && matchesSentiment;
    });

    const getRegionName = (id: string) => regions.find(r => r.id === id)?.name || 'N/A';
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'N/A';
    const getCategoryColor = (id: string) => categories.find(c => c.id === id)?.color || 'zinc';
    const getRegionColor = (id: string) => regions.find(r => r.id === id)?.color || 'zinc-500';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Feedbacks</h1>
                    <p className="text-xs md:text-sm text-[#a0a0b0]">Gerencie e analise as opiniões recebidas ({filteredFeedbacks.length})</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#12121a] p-4 rounded-xl border border-[#1e1e2e]">
                <Input
                    placeholder="Buscar por texto..."
                    className="w-full"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="h-10 w-full rounded-md border border-[#2a2a3a] bg-[#1a1a24] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                >
                    <option value="all">Todas as Regiões</option>
                    {regions.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                </select>

                <select
                    className="h-10 w-full rounded-md border border-[#2a2a3a] bg-[#1a1a24] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">Todas as Categorias</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="h-10 w-full rounded-md border border-[#2a2a3a] bg-[#1a1a24] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                >
                    <option value="all">Todos Sentimentos</option>
                    <option value="positive">Positivo</option>
                    <option value="neutral">Neutro</option>
                    <option value="negative">Negativo</option>
                    <option value="critical">Crítico</option>
                </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredFeedbacks.map((feedback) => {
                    const sentiment = sentimentConfig[feedback.sentiment];
                    const regionColor = getRegionColor(feedback.regionId);

                    const getBorderColor = (color: string) => {
                        const base = color.split('-')[0];
                        switch (base) {
                            case 'blue': return 'border-l-blue-600';
                            case 'green': return 'border-l-green-600';
                            case 'amber': return 'border-l-amber-600';
                            case 'rose': return 'border-l-rose-600';
                            case 'violet': return 'border-l-violet-600';
                            case 'red': return 'border-l-red-600';
                            default: return 'border-l-slate-600';
                        }
                    };

                    return (
                        <Card key={feedback.id} className={cn(
                            "hover:bg-[#1a1a24] transition-colors border-l-4",
                            getBorderColor(regionColor)
                        )}>
                            <CardContent className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className={cn("px-2 py-1 rounded-full text-xs font-medium border", sentiment.color)}>
                                        {sentiment.icon} {sentiment.label}
                                    </span>
                                    <span className="text-xs text-[#6b6b80] flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {format(new Date(feedback.createdAt), "dd/MM/yy HH:mm")}
                                    </span>
                                </div>

                                <p className="text-[#a0a0b0] text-sm line-clamp-3 min-h-[60px]">
                                    "{feedback.description}"
                                </p>

                                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#1e1e2e]">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-[#1a1a24] px-2 py-1 rounded text-[#a0a0b0] font-medium">
                                            {getRegionName(feedback.regionId)}
                                        </span>
                                        <span className="bg-[#1a1a24] px-2 py-1 rounded text-[#a0a0b0] font-medium">
                                            {getCategoryName(feedback.categoryId)}
                                        </span>
                                    </div>
                                    {feedback.source === 'whatsapp' && (
                                        <div className="text-green-500" title="Via WhatsApp">
                                            <Phone className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {filteredFeedbacks.length === 0 && (
                    <div className="col-span-full py-20 text-center text-[#6b6b80]">
                        Nenhum feedback encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}
