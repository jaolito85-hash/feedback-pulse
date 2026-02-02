'use client';

import { useStore } from '@/store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, Save, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
    const { workspace, resetData } = useStore();
    const [copied, setCopied] = useState(false);

    // Fake Webhook URL logic for display
    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/api/webhook`
        : 'https://feedback-pulse.demo/api/webhook';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(webhookUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Configurações</h1>
                    <p className="text-xs md:text-sm text-[#a0a0b0]">Gerencie seu workspace e integrações</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Dados do Workspace</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-[#a0a0b0]">Nome do Workspace</label>
                            <Input defaultValue={workspace?.name} />
                        </div>
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            Salvar Alterações
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Integração (Webhook)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-[#1a1a24] rounded-lg border border-[#2a2a3a]">
                            <p className="text-sm text-[#a0a0b0] mb-2">
                                Envie POST requests para este endpoint para registrar feedbacks automaticamente via n8n.
                            </p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-[#0a0a0f] p-2 rounded text-xs font-mono text-[#a0a0b0] break-all">
                                    {webhookUrl}
                                </code>
                                <Button size="sm" onClick={copyToClipboard}>
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </Button>
                            </div>
                        </div>

                        <div className="text-xs text-[#6b6b80]">
                            <p className="font-semibold text-[#a0a0b0] mb-1">Formato JSON esperado:</p>
                            <pre className="bg-[#0a0a0f] p-2 rounded">
                                {`{
  "region": "id-da-regiao",
  "category": "id-da-categoria",
  "description": "Texto do feedback",
  "sentiment": "positive | neutral | negative"
}`}
                            </pre>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-900/20 bg-red-900/5">
                    <CardHeader>
                        <CardTitle className="text-red-500">Zona de Perigo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-medium text-red-500">Resetar Dados Demo</h4>
                                <p className="text-sm text-red-400/70">
                                    Apaga todos os feedbacks atuais e restaura os 150+ exemplos iniciais. Útil para limpar testes.
                                </p>
                            </div>
                            <Button variant="destructive" className="w-full sm:w-auto" onClick={() => {
                                if (confirm('Isso apagará seus dados atuais. Continuar?')) resetData();
                            }}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Restaurar Dados
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
