import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Workspace, Region, Category, Feedback } from '@/types';
import { MOCK_WORKSPACE, MOCK_REGIONS, MOCK_CATEGORIES, generateMockFeedbacks } from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';

interface AppState {
    workspace: Workspace | null;
    regions: Region[];
    categories: Category[];
    feedbacks: Feedback[];
    isLoading: boolean;

    // Actions
    initializeDemo: () => void;
    syncWithSupabase: () => Promise<void>;
    addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'workspaceId'>) => Promise<void>;
    deleteFeedback: (id: string) => Promise<void>;

    addRegion: (region: Omit<Region, 'id' | 'workspaceId'>) => Promise<void>;
    updateRegion: (id: string, data: Partial<Region>) => Promise<void>;
    deleteRegion: (id: string) => Promise<void>;

    addCategory: (category: Omit<Category, 'id' | 'workspaceId'>) => Promise<void>;
    updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    resetData: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            workspace: null,
            regions: [],
            categories: [],
            feedbacks: [],
            isLoading: false,

            initializeDemo: () => {
                const state = get();
                // If we have no workspace, try local first then sync
                if (!state.workspace) {
                    set({
                        workspace: MOCK_WORKSPACE,
                        regions: MOCK_REGIONS,
                        categories: MOCK_CATEGORIES,
                        feedbacks: generateMockFeedbacks(150),
                    });
                }
                // Always try to sync with Supabase in background
                get().syncWithSupabase();
            },

            syncWithSupabase: async () => {
                set({ isLoading: true });
                try {
                    // 1. Fetch Workspace (assuming first one for demo)
                    const { data: wsData } = await supabase.from('workspaces').select('*').limit(1).single();
                    if (wsData) {
                        set({
                            workspace: {
                                id: wsData.id,
                                name: wsData.name,
                                slug: wsData.slug,
                                createdAt: wsData.created_at
                            }
                        });

                        const wsId = wsData.id;

                        // 2. Fetch Regions
                        const { data: regData } = await supabase.from('regions').select('*').eq('workspace_id', wsId);
                        if (regData) {
                            set({
                                regions: regData.map(r => ({
                                    id: r.id,
                                    workspaceId: r.workspace_id,
                                    name: r.name,
                                    color: r.color
                                }))
                            });
                        }

                        // 3. Fetch Categories
                        const { data: catData } = await supabase.from('categories').select('*').eq('workspace_id', wsId);
                        if (catData) {
                            set({
                                categories: catData.map(c => ({
                                    id: c.id,
                                    workspaceId: c.workspace_id,
                                    name: c.name,
                                    icon: c.icon,
                                    color: c.color
                                }))
                            });
                        }

                        // 4. Fetch Feedbacks
                        const { data: fbData } = await supabase.from('feedbacks').select('*').eq('workspace_id', wsId).order('created_at', { ascending: false });
                        if (fbData) {
                            set({
                                feedbacks: fbData.map(f => ({
                                    id: f.id,
                                    workspaceId: f.workspace_id,
                                    regionId: f.region_id,
                                    categoryId: f.category_id,
                                    description: f.description,
                                    sentiment: f.sentiment,
                                    source: f.source,
                                    phoneHash: f.phone_hash,
                                    createdAt: f.created_at
                                }))
                            });
                        }
                    }
                } catch (error) {
                    console.error('Failed to sync with Supabase, using local fallback:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            addFeedback: async (data) => {
                const wsId = get().workspace?.id || 'ws-demo';
                const tempId = `fb-${Date.now()}`;

                // Local update first (optimistic)
                const newFeedback: Feedback = {
                    ...data,
                    id: tempId,
                    createdAt: new Date().toISOString(),
                    workspaceId: wsId,
                } as Feedback;

                set((state) => ({ feedbacks: [newFeedback, ...state.feedbacks] }));

                // Supabase sync
                try {
                    await supabase.from('feedbacks').insert([{
                        workspace_id: wsId,
                        region_id: data.regionId,
                        category_id: data.categoryId,
                        description: data.description,
                        sentiment: data.sentiment,
                        source: data.source,
                        phone_hash: data.phoneHash
                    }]);
                } catch (error) {
                    console.error('Supabase insert failed:', error);
                }
            },

            deleteFeedback: async (id) => {
                set((state) => ({ feedbacks: state.feedbacks.filter((f) => f.id !== id) }));
                try {
                    await supabase.from('feedbacks').delete().eq('id', id);
                } catch (error) {
                    console.error('Supabase delete failed:', error);
                }
            },

            addRegion: async (data) => {
                const wsId = get().workspace?.id || 'demo';
                const tempId = `reg-${Date.now()}`;
                const newRegion: Region = { ...data, id: tempId, workspaceId: wsId };

                set((state) => ({ regions: [...state.regions, newRegion] }));

                try {
                    await supabase.from('regions').insert([{
                        workspace_id: wsId,
                        name: data.name,
                        color: data.color
                    }]);
                } catch (error) {
                    console.error('Supabase region insert failed:', error);
                }
            },

            updateRegion: async (id, data) => {
                set((state) => ({
                    regions: state.regions.map((r) => (r.id === id ? { ...r, ...data } : r)),
                }));

                try {
                    await supabase.from('regions').update(data).eq('id', id);
                } catch (error) {
                    console.error('Supabase region update failed:', error);
                }
            },

            deleteRegion: async (id) => {
                set((state) => ({ regions: state.regions.filter((r) => r.id !== id) }));
                try {
                    await supabase.from('regions').delete().eq('id', id);
                } catch (error) {
                    console.error('Supabase region delete failed:', error);
                }
            },

            addCategory: async (data) => {
                const wsId = get().workspace?.id || 'demo';
                const tempId = `cat-${Date.now()}`;
                const newCategory: Category = { ...data, id: tempId, workspaceId: wsId };

                set((state) => ({ categories: [...state.categories, newCategory] }));

                try {
                    await supabase.from('categories').insert([{
                        workspace_id: wsId,
                        name: data.name,
                        icon: data.icon,
                        color: data.color
                    }]);
                } catch (error) {
                    console.error('Supabase category insert failed:', error);
                }
            },

            updateCategory: async (id, data) => {
                set((state) => ({
                    categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
                }));

                try {
                    await supabase.from('categories').update(data).eq('id', id);
                } catch (error) {
                    console.error('Supabase category update failed:', error);
                }
            },

            deleteCategory: async (id) => {
                set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
                try {
                    await supabase.from('categories').delete().eq('id', id);
                } catch (error) {
                    console.error('Supabase category delete failed:', error);
                }
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
