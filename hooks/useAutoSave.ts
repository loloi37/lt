// hooks/useAutoSave.ts
// Auto-saves memorial data to Supabase every 30 seconds
// Also saves on any change after a 3-second debounce (so rapid typing doesn't spam)

import { useEffect, useRef, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { MemorialData } from '@/types/memorial';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseAutoSaveOptions {
    memorialId: string | null;
    data: MemorialData;
    enabled?: boolean;         // Disable auto-save if needed
    intervalMs?: number;       // Default: 30000 (30s)
    debounceMs?: number;       // Default: 3000 (3s) after last change
}

interface UseAutoSaveReturn {
    saveStatus: SaveStatus;
    lastSavedAt: Date | null;
    saveNow: () => Promise<void>;   // Force immediate save
    error: string | null;
}

export function useAutoSave({
    memorialId,
    data,
    enabled = true,
    intervalMs = 30000,
    debounceMs = 3000,
}: UseAutoSaveOptions): UseAutoSaveReturn {
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs to track latest data without re-triggering effects
    const dataRef = useRef(data);
    const lastSavedDataRef = useRef<string>('');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const intervalTimerRef = useRef<NodeJS.Timeout | null>(null);
    const isSavingRef = useRef(false);

    // Keep data ref current
    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    // Core save function
    const performSave = useCallback(async () => {
        if (!memorialId || !enabled || isSavingRef.current) return;

        const currentData = dataRef.current;

        // Serialize to compare — skip save if nothing changed
        const serialized = JSON.stringify({
            step1: currentData.step1,
            step2: currentData.step2,
            step3: currentData.step3,
            step4: currentData.step4,
            step5: currentData.step5,
            step6: currentData.step6,
            step7: currentData.step7,
            step8: {
                // Exclude File objects (can't serialize), keep previews
                coverPhotoPreview: currentData.step8.coverPhotoPreview,
                gallery: currentData.step8.gallery.map(g => ({
                    id: g.id, preview: g.preview, caption: g.caption, year: g.year, type: g.type
                })),
                interactiveGallery: currentData.step8.interactiveGallery?.map(ig => ({
                    id: ig.id, preview: ig.preview, description: ig.description
                })),
                voiceRecordings: currentData.step8.voiceRecordings.map(v => ({
                    id: v.id, title: v.title
                })),
                legacyStatement: currentData.step8.legacyStatement,
            },
            step9: currentData.step9,
        });

        if (serialized === lastSavedDataRef.current) {
            // Nothing changed, skip
            return;
        }

        isSavingRef.current = true;
        setSaveStatus('saving');
        setError(null);

        try {
            const { error: saveError } = await supabase
                .from('memorials')
                .update({
                    step1: currentData.step1,
                    step2: currentData.step2,
                    step3: currentData.step3,
                    step4: currentData.step4,
                    step5: currentData.step5,
                    step6: currentData.step6,
                    step7: currentData.step7,
                    step8: {
                        coverPhotoPreview: currentData.step8.coverPhotoPreview,
                        gallery: currentData.step8.gallery.map(g => ({
                            id: g.id, preview: g.preview, caption: g.caption, year: g.year, type: g.type
                        })),
                        interactiveGallery: currentData.step8.interactiveGallery?.map(ig => ({
                            id: ig.id, preview: ig.preview, description: ig.description
                        })),
                        voiceRecordings: currentData.step8.voiceRecordings.map(v => ({
                            id: v.id, title: v.title
                        })),
                        legacyStatement: currentData.step8.legacyStatement,
                    },
                    step9: currentData.step9,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', memorialId);

            if (saveError) throw saveError;

            lastSavedDataRef.current = serialized;
            setLastSavedAt(new Date());
            setSaveStatus('saved');

            // Reset to idle after 3 seconds
            setTimeout(() => {
                setSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
            }, 3000);

        } catch (err: any) {
            console.error('Auto-save failed:', err);
            setError(err.message || 'Failed to save');
            setSaveStatus('error');
        } finally {
            isSavingRef.current = false;
        }
    }, [memorialId, enabled]);

    // Public "save now" function
    const saveNow = useCallback(async () => {
        await performSave();
    }, [performSave]);

    // Debounced save on data change (3s after last change)
    useEffect(() => {
        if (!memorialId || !enabled) return;

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            performSave();
        }, debounceMs);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [data, memorialId, enabled, debounceMs, performSave]);

    // Interval save every 30 seconds
    useEffect(() => {
        if (!memorialId || !enabled) return;

        intervalTimerRef.current = setInterval(() => {
            performSave();
        }, intervalMs);

        return () => {
            if (intervalTimerRef.current) {
                clearInterval(intervalTimerRef.current);
            }
        };
    }, [memorialId, enabled, intervalMs, performSave]);

    // Save on page unload (best effort)
    useEffect(() => {
        if (!memorialId || !enabled) return;

        const handleBeforeUnload = () => {
            // Use sendBeacon for reliability on page close
            const currentData = dataRef.current;
            const payload = JSON.stringify({
                memorialId,
                step1: currentData.step1,
                step2: currentData.step2,
                step3: currentData.step3,
                step4: currentData.step4,
                step5: currentData.step5,
                step6: currentData.step6,
                step7: currentData.step7,
                step8: {
                    coverPhotoPreview: currentData.step8.coverPhotoPreview,
                    gallery: currentData.step8.gallery.map(g => ({
                        id: g.id, preview: g.preview, caption: g.caption, year: g.year, type: g.type
                    })),
                    interactiveGallery: currentData.step8.interactiveGallery?.map(ig => ({
                        id: ig.id, preview: ig.preview, description: ig.description
                    })),
                    voiceRecordings: currentData.step8.voiceRecordings.map(v => ({
                        id: v.id, title: v.title
                    })),
                    legacyStatement: currentData.step8.legacyStatement,
                },
                step9: currentData.step9,
            });

            navigator.sendBeacon('/api/autosave', payload);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [memorialId, enabled]);

    return { saveStatus, lastSavedAt, saveNow, error };
}