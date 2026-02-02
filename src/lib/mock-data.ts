import { Category, Feedback, Region, Workspace } from '@/types';
import { subHours } from 'date-fns';

export const MOCK_WORKSPACE: Workspace = {
    id: 'ws-demo',
    name: 'Campanha Prefeito Silva 2026',
    slug: 'campanha-silva-2026',
    createdAt: new Date().toISOString(),
};

export const MOCK_REGIONS: Region[] = [
    { id: 'reg-1', workspaceId: 'ws-demo', name: 'Centro', color: 'blue-500' },
    { id: 'reg-2', workspaceId: 'ws-demo', name: 'Zona Norte', color: 'red-500' },
    { id: 'reg-3', workspaceId: 'ws-demo', name: 'Zona Sul', color: 'green-500' },
    { id: 'reg-4', workspaceId: 'ws-demo', name: 'Zona Leste', color: 'yellow-500' },
    { id: 'reg-5', workspaceId: 'ws-demo', name: 'Zona Oeste', color: 'purple-500' },
    { id: 'reg-6', workspaceId: 'ws-demo', name: 'Área Rural', color: 'orange-500' },
];

export const MOCK_CATEGORIES: Category[] = [
    { id: 'cat-1', workspaceId: 'ws-demo', name: 'Saúde', icon: 'Activity', color: 'rose' },
    { id: 'cat-2', workspaceId: 'ws-demo', name: 'Emprego', icon: 'Briefcase', color: 'blue' },
    { id: 'cat-3', workspaceId: 'ws-demo', name: 'Segurança', icon: 'Shield', color: 'slate' },
    { id: 'cat-4', workspaceId: 'ws-demo', name: 'Educação', icon: 'BookOpen', color: 'indigo' },
    { id: 'cat-5', workspaceId: 'ws-demo', name: 'Infraestrutura', icon: 'Hammer', color: 'amber' },
];

const COMPLAINTS = {
    Saúde: [
        "Falta médico no posto de saúde.",
        "Demora para marcar consulta com especialista.",
        "Falta de remédios na farmácia popular.",
        "Atendimento excelente no pronto socorro hoje.",
        "Ambulância demorou para chegar.",
        "Posto de vacinação muito cheio e sem organização.",
        "Médicos atenciosos na UPA.",
    ],
    Emprego: [
        "Falta de oportunidades para jovens.",
        "Precisamos de mais cursos profissionalizantes.",
        "Empresas saindo da região.",
        "Sine não tem vagas atualizadas.",
        "Promessa de emprego na fábrica não cumprida.",
    ],
    Segurança: [
        "Muitos assaltos no ponto de ônibus à noite.",
        "Falta iluminação na praça central.",
        "Policiamento melhorou na última semana.",
        "Sensação de insegurança ao sair da escola.",
        "Precisamos de câmeras de segurança na avenida.",
    ],
    Educação: [
        "Escola sem ventiladores funcionando.",
        "Merenda escolar de baixa qualidade.",
        "Professores faltando muito.",
        "Biblioteca da escola está fechada.",
        "Creche não tem vaga para meu filho.",
    ],
    Infraestrutura: [
        "Buraco enorme na rua principal.",
        "Sem água há dois dias.",
        "Coleta de lixo não passou essa semana.",
        "Esgoto a céu aberto.",
        "Asfalto novo ficou ótimo.",
        "Ponte precisando de reparos urgentes.",
    ],
};

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedRegion(categoryName: string): string {
    const rand = Math.random();
    // "Saúde" ter mais feedbacks na "Zona Norte" (reg-2)
    if (categoryName === 'Saúde') {
        if (rand < 0.6) return 'reg-2'; // 60% chance
        return getRandomItem(MOCK_REGIONS.filter(r => r.id !== 'reg-2')).id;
    }
    // "Emprego" ter mais feedbacks na "Zona Sul" (reg-3)
    if (categoryName === 'Emprego') {
        if (rand < 0.6) return 'reg-3';
        return getRandomItem(MOCK_REGIONS.filter(r => r.id !== 'reg-3')).id;
    }
    return getRandomItem(MOCK_REGIONS).id;
}

export function generateMockFeedbacks(count: number = 150): Feedback[] {
    const feedbacks: Feedback[] = [];

    for (let i = 0; i < count; i++) {
        const category = getRandomItem(MOCK_CATEGORIES);
        const regionId = getWeightedRegion(category.name);

        // Weighted sentiment based on category texts (simple random here)
        const complaints = COMPLAINTS[category.name as keyof typeof COMPLAINTS] || ["Feedback genérico"];
        const description = getRandomItem(complaints);

        let sentiment: Feedback['sentiment'] = 'neutral';
        if (description.toLowerCase().includes('excelente') || description.toLowerCase().includes('ótimo') || description.toLowerCase().includes('melhorou')) {
            sentiment = 'positive';
        } else if (description.toLowerCase().includes('falta') || description.toLowerCase().includes('demora') || description.toLowerCase().includes('buraco') || description.toLowerCase().includes('assalto')) {
            const sev = Math.random();
            sentiment = sev > 0.7 ? 'critical' : 'negative';
        }

        // Distribute dates over last 30 days
        const date = subHours(new Date(), Math.floor(Math.random() * 30 * 24));

        feedbacks.push({
            id: `fb-${i}`,
            workspaceId: 'ws-demo',
            regionId,
            categoryId: category.id,
            description,
            sentiment,
            source: Math.random() > 0.3 ? 'whatsapp' : 'manual',
            createdAt: date.toISOString(),
            phoneHash: Math.random() > 0.5 ? '55119****1234' : undefined,
        });
    }

    return feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
