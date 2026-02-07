// types/paths.ts

export type PathId = 'facts' | 'body' | 'soul' | 'presence' | 'witnesses';

export type PathStatus = 'locked' | 'empty' | 'in_progress' | 'completed';

export interface PathState {
    id: PathId;
    title: string;
    status: PathStatus;
    progress: number; // 0 to 100
}