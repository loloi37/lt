// types/paths.ts

export type PathId = 'facts' | 'body' | 'soul' | 'presence' | 'witnesses';

export type PathStatus = 'locked' | 'empty' | 'in_progress' | 'completed';

export type PathDepth = 'untouched' | 'shallow' | 'meaningful' | 'embodied';

export interface PathState {
    id: PathId;
    title: string;
    status: PathStatus;
    depth: PathDepth;
}