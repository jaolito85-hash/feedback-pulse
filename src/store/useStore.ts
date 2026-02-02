import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workspace, Region, Category, Feedback } from '@/types';
import { MOCK_WORKSPACE, MOCK_REGIONS, MOCK_CATEGORIES, generateMockFeedbacks } from '@/lib/mock-data';

interface AppState {
    workspace: Workspace | null;
    regions: Region[];
    categories: Category[];
    feedbacks: Feedback[];

    // Actions
    initializeDemo: () => void;
    addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'workspaceId'>) => void;
    deleteFeedback: (id: string) => void;

    addRegion: (region: Omit<Region, 'id' | 'workspaceId'>) => void;
    updateRegion: (id: string, data: Partial<Region>) => void;
    deleteRegion: (id: string) => void;

    addCategory: (category: Omit<Category, 'id' | 'workspaceId'>) => void;
    updateCategory: (id: string, data: Partial<Category>) => void;
    deleteCategory: (id: string) => void;

    resetData: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            workspace: null,
            regions: [],
            categories: [],
            feedbacks: [],

            initializeDemo: () => {
                const state = get();
                if (!state.workspace) {
                    set({
                        workspace: MOCK_WORKSPACE,
                        regions: MOCK_REGIONS,
                        categories: MOCK_CATEGORIES,
                        feedbacks: generateMockFeedbacks(150),
                    });
                }
            },

            addFeedback: (data) => {
                const newFeedback: Feedback = {
                    ...data,
                    id: `fb-${Date.now()}`,

                    createdAt: new Date().toISOString(),
                    workspaceId: 'ws-demo', // Force demo ID for prototype
                } as Feedback;
                set((state) => ({ feedbacks: [newFeedback, ...state.feedbacks] }));
            },

            deleteFeedback: (id) => {
                set((state) => ({ feedbacks: state.feedbacks.filter((f) => f.id !== id) }));
            },

            addRegion: (data) => {
                const newRegion: Region = {
                    ...data,
                    id: `reg-${Date.now()}`,
                    workspaceId: get().workspace?.id || 'demo',
                };
                set((state) => ({ regions: [...state.regions, newRegion] }));
            },

            updateRegion: (id, data) => {
                set((state) => ({
                    regions: state.regions.map((r) => (r.id === id ? { ...r, ...data } : r)),
                }));
            },

            deleteRegion: (id) => {
                set((state) => ({ regions: state.regions.filter((r) => r.id !== id) }));
            },

            addCategory: (data) => {
                const newCategory: Category = {
                    ...data,
                    id: `cat-${Date.now()}`,
                    workspaceId: get().workspace?.id || 'demo',
                };
                set((state) => ({ categories: [...state.categories, newCategory] }));
            },

            updateCategory: (id, data) => {
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
                }));
            },

            deleteCategory: (id) => {
                set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
            },

            resetData: () => {
                set({
                    workspace: MOCK_WORKSPACE,
                    regions: MOCK_REGIONS,
                    categories: MOCK_CATEGORIES,
                    feedbacks: generateMockFeedbacks(150),
                });
            },
        }),
        {
            name: 'feedback-pulse-storage',
        }
    )
);
