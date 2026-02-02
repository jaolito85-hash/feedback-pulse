'use client';

import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { useStore } from '@/store/useStore';
import { FeedbackBarChart } from '@/components/charts/FeedbackBarChart';
import { CategoryDonutChart } from '@/components/charts/CategoryDonutChart';
import { TimeTrendChart } from '@/components/charts/TimeTrendChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { format, isSameDay, subDays, startOfDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, MessageSquare, MapPin, Tag, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const { feedbacks, regions, categories, initializeDemo } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        initializeDemo();
        setMounted(true);
    }, [initializeDemo]);

    if (!mounted) return null;

    // Stats Calculations
    const totalFeedbacks = feedbacks.length;
    const todayFeedbacks = feedbacks.filter(f => isSameDay(parseISO(f.createdAt), new Date())).length;

    // Top Region
    const regionCounts = regions.map(r => ({
        name: r.name,
        value: feedbacks.filter(f => f.regionId === r.id).length
    })).sort((a, b) => b.value - a.value);
    const topRegion = regionCounts[0];

    // Top Category
    const categoryCounts = categories.map(c => ({
        name: c.name,
        value: feedbacks.filter(f => f.categoryId === c.id).length
    })).sort((a, b) => b.value - a.value);
    const topCategory = categoryCounts[0];

    // Trend Data (Last 30 days)
    const trendData = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        const count = feedbacks.filter(f => isSameDay(parseISO(f.createdAt), date)).length;
        return {
            date: format(date, 'dd/MM'),
            Feedbacks: count
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Painel</h1>
                <div className="text-xs md:text-sm text-[#a0a0b0]">
                    Última atualização: {format(new Date(), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-[#a0a0b0]">Total de Feedbacks</CardTitle>
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalFeedbacks}</div>
                        <p className="text-xs text-[#6b6b80]">+12% em relação ao mês anterior</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-[#a0a0b0]">Feedbacks Hoje</CardTitle>
                        <Activity className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{todayFeedbacks}</div>
                        <p className="text-xs text-[#6b6b80]">Novos registros</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-[#a0a0b0]">Região Mais Ativa</CardTitle>
                        <MapPin className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white truncate">{topRegion?.name || '-'}</div>
                        <p className="text-xs text-[#6b6b80]">{topRegion?.value} feedbacks</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-[#a0a0b0]">Principal Categoria</CardTitle>
                        <Tag className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white truncate">{topCategory?.name || '-'}</div>
                        <p className="text-xs text-[#6b6b80]">{topCategory?.value} feedbacks</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                <div className="lg:col-span-4">
                    <TimeTrendChart data={trendData} />
                </div>
                <div className="lg:col-span-3">
                    <CategoryDonutChart data={categoryCounts} />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                <div className="lg:col-span-3">
                    <FeedbackBarChart data={regionCounts} />
                </div>
                <div className="lg:col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Top 5 Problemas por Região</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {regions.slice(0, 5).map((region) => {
                                    const regionFeedbacks = feedbacks.filter(f => f.regionId === region.id);
                                    if (regionFeedbacks.length === 0) return null;

                                    // Find most common category in this region
                                    const catCounts = categories.map(c => ({
                                        name: c.name,
                                        count: regionFeedbacks.filter(f => f.categoryId === c.id).length
                                    })).sort((a, b) => b.count - a.count);

                                    const topCat = catCounts[0];
                                    const percent = Math.round((topCat.count / regionFeedbacks.length) * 100);

                                    return (
                                        <div key={region.id} className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 bg-${region.color.replace('500', '500')}`}></div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none text-white">{region.name}</p>
                                                <p className="text-xs text-[#6b6b80]">{topCat.name} representa {percent}% dos problemas</p>
                                            </div>
                                            <div className="font-medium text-[#a0a0b0]">{regionFeedbacks.length}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
