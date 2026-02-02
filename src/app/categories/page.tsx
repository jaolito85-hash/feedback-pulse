'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash, Tag } from 'lucide-react';
import { Category } from '@/types';

export default function CategoriesPage() {
    const { categories, feedbacks, addCategory, deleteCategory } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [newCatColor, setNewCatColor] = useState('blue');

    const handleSave = () => {
        if (!newCatName) return;
        addCategory({
            name: newCatName,
            color: newCatColor,
            icon: 'Tag', // hardcoded for now or add icon selector logic
        });
        setNewCatName('');
        setIsModalOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Excluir esta categoria?')) {
            deleteCategory(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Categorias</h1>
                    <p className="text-xs md:text-sm text-[#a0a0b0]">Classificação dos feedbacks recebidos</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Categoria
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((cat) => {
                    const count = feedbacks.filter(f => f.categoryId === cat.id).length;

                    return (
                        <Card key={cat.id} className="relative">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">{cat.name}</CardTitle>
                                <Tag className="h-5 w-5 text-[#6b6b80]" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white mb-2">{count}</div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-[#6b6b80]">Feedbacks</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-400 p-0 h-auto hover:bg-transparent"
                                        onClick={() => handleDelete(cat.id)}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Categoria">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#a0a0b0]">Nome</label>
                        <Input
                            value={newCatName}
                            onChange={(e) => setNewCatName(e.target.value)}
                            placeholder="Ex: Infraestrutura"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[#a0a0b0]">Cor</label>
                        <select
                            className="w-full h-10 rounded-md border border-[#2a2a3a] bg-[#1a1a24] px-3 py-2 text-sm text-white"
                            value={newCatColor}
                            onChange={(e) => setNewCatColor(e.target.value)}
                        >
                            <option value="blue">Azul</option>
                            <option value="rose">Rosa</option>
                            <option value="amber">Âmbar</option>
                            <option value="emerald">Esmeralda</option>
                            <option value="slate">Cinza</option>
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
