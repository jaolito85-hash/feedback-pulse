'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Region } from '@/types';

export default function RegionsPage() {
    const { regions, feedbacks, addRegion, deleteRegion } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRegionName, setNewRegionName] = useState('');
    const [newRegionColor, setNewRegionColor] = useState('blue-500');

    const handleSave = () => {
        if (!newRegionName) return;
        addRegion({
            name: newRegionName,
            color: newRegionColor,
        });
        setNewRegionName('');
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza? Feedbacks desta região perderão a referência visual.')) {
            deleteRegion(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Regiões</h1>
                    <p className="text-xs md:text-sm text-[#a0a0b0]">Gerencie as áreas de atendimento do workspace</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Região
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {regions.map((region) => {
                    const count = feedbacks.filter(f => f.regionId === region.id).length;

                    const getTextColor = (color: string) => {
                        const base = color.split('-')[0];
                        switch (base) {
                            case 'blue': return 'text-blue-500';
                            case 'red': return 'text-red-500';
                            case 'green': return 'text-green-500';
                            case 'yellow': return 'text-yellow-500';
                            case 'purple': return 'text-purple-500';
                            case 'orange': return 'text-orange-500';
                            case 'pink': return 'text-pink-500';
                            default: return 'text-[#a0a0b0]';
                        }
                    };

                    const getBgColor = (color: string) => {
                        const base = color.split('-')[0];
                        switch (base) {
                            case 'blue': return 'bg-blue-500';
                            case 'red': return 'bg-red-500';
                            case 'green': return 'bg-green-500';
                            case 'yellow': return 'bg-yellow-500';
                            case 'purple': return 'bg-purple-500';
                            case 'orange': return 'bg-orange-500';
                            case 'pink': return 'bg-pink-500';
                            default: return 'bg-slate-500';
                        }
                    };

                    return (
                        <Card key={region.id} className="relative overflow-hidden">
                            <div className={cn("absolute left-0 top-0 bottom-0 w-2", getBgColor(region.color))}></div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 pl-6">
                                <CardTitle className="text-lg">{region.name}</CardTitle>
                                <MapPin className={cn("h-5 w-5", getTextColor(region.color))} />
                            </CardHeader>
                            <CardContent className="pl-6 pt-2">
                                <div className="text-2xl font-bold text-white mb-2">{count}</div>
                                <p className="text-xs text-[#6b6b80] mb-4">Feedbacks recebidos</p>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-500 hover:text-red-400 p-0 h-auto hover:bg-transparent"
                                    onClick={() => handleDelete(region.id)}
                                >
                                    Excluir
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Região">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#a0a0b0]">Nome da Região</label>
                        <Input
                            value={newRegionName}
                            onChange={(e) => setNewRegionName(e.target.value)}
                            placeholder="Ex: Zona Leste"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#a0a0b0]">Cor (Tailwind Class)</label>
                        <select
                            className="w-full h-10 rounded-md border border-[#2a2a3a] bg-[#1a1a24] px-3 py-2 text-sm text-white"
                            value={newRegionColor}
                            onChange={(e) => setNewRegionColor(e.target.value)}
                        >
                            <option value="blue-500">Azul</option>
                            <option value="red-500">Vermelho</option>
                            <option value="green-500">Verde</option>
                            <option value="yellow-500">Amarelo</option>
                            <option value="purple-500">Roxo</option>
                            <option value="orange-500">Laranja</option>
                            <option value="pink-500">Rosa</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSave}>Salvar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
