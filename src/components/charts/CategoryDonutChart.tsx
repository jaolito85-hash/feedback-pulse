"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/Card';

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444'];

interface CategoryData {
    name: string;
    value: number;
}

interface Props {
    data: CategoryData[];
}

export function CategoryDonutChart({ data }: Props) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={105}
                            paddingAngle={4}
                            dataKey="value"
                            stroke="none"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1a1a2e',
                                border: '1px solid #2a2a3a',
                                borderRadius: '8px',
                                color: '#ffffff'
                            }}
                            itemStyle={{ color: '#ffffff' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            wrapperStyle={{ color: '#ffffff', paddingTop: '20px' }}
                            formatter={(value) => <span className="text-xs font-medium text-[#a0a0b0]">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
