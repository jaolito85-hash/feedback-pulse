"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/Card';

interface DataPoint {
    date: string;
    Feedbacks: number;
}

interface TimeTrendChartProps {
    data: DataPoint[];
}

export function TimeTrendChart({ data }: TimeTrendChartProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Feedbacks (30 Dias)</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b6b80', fontSize: 10 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b6b80', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid #2a2a3a',
                                borderRadius: '8px',
                                color: '#ffffff'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="Feedbacks"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorFeedback)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
