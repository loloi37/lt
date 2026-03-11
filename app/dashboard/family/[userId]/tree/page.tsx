'use client';

import { useState, useEffect, use, useCallback, useRef } from 'react';
import {
    ReactFlow, Controls, MiniMap, Background, useNodesState, useEdgesState, useReactFlow,
    ReactFlowProvider, Position, Node, Edge, Handle, NodeProps, Connection,
    type NodeChange,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, X, Check, ExternalLink, Trash2, LayoutGrid, Users } from 'lucide-react';
import Link from 'next/link';

// ─── Constants ──────────────────────────────────────────────────────────────

const H_GAP = 280;
const V_GAP = 220;

// ─── Position persistence (localStorage) ────────────────────────────────────

function getSavedPositions(userId: string): Record<string, { x: number; y: number }> {
    try {
        const raw = localStorage.getItem(`family-tree-pos-${userId}`);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function savePositions(userId: string, nodes: Node[]) {
    const positions: Record<string, { x: number; y: number }> = {};
    for (const n of nodes) {
        positions[n.id] = { x: n.position.x, y: n.position.y };
    }
    try {
        localStorage.setItem(`family-tree-pos-${userId}`, JSON.stringify(positions));
    } catch { /* ignore quota errors */ }
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface PersonData {
    id: string;
    full_name: string | null;
    profile_photo_url: string | null;
    birth_date: string | null;
    death_date: string | null;
    step1: any;
    slug: string | null;
}

// ─── Family tree layout algorithm ───────────────────────────────────────────

function computeFamilyLayout(
    people: PersonData[],
    relations: any[],
): { positions: Record<string, { x: number; y: number }>; generations: Record<string, number> } {
    if (people.length === 0) return { positions: {}, generations: {} };

    const parentChildren: Record<string, string[]> = {};
    const spouses: Record<string, string[]> = {};
    const hasParent = new Set<string>();
    const seen = new Set<string>();

    for (const rel of relations) {
        const pairKey = [rel.from_memorial_id, rel.to_memorial_id].sort().join('|');
        if (seen.has(pairKey)) continue;
        seen.add(pairKey);

        if (rel.relationship_type === 'parent') {
            if (!parentChildren[rel.from_memorial_id]) parentChildren[rel.from_memorial_id] = [];
            parentChildren[rel.from_memorial_id].push(rel.to_memorial_id);
            hasParent.add(rel.to_memorial_id);
        } else if (rel.relationship_type === 'child') {
            if (!parentChildren[rel.to_memorial_id]) parentChildren[rel.to_memorial_id] = [];
            parentChildren[rel.to_memorial_id].push(rel.from_memorial_id);
            hasParent.add(rel.from_memorial_id);
        } else if (rel.relationship_type === 'spouse') {
            if (!spouses[rel.from_memorial_id]) spouses[rel.from_memorial_id] = [];
            spouses[rel.from_memorial_id].push(rel.to_memorial_id);
            if (!spouses[rel.to_memorial_id]) spouses[rel.to_memorial_id] = [];
            spouses[rel.to_memorial_id].push(rel.from_memorial_id);
        }
    }

    const siblingOf: Record<string, string[]> = {};
    const seenSib = new Set<string>();
    for (const rel of relations) {
        if (rel.relationship_type !== 'sibling') continue;
        const pk = [rel.from_memorial_id, rel.to_memorial_id].sort().join('|');
        if (seenSib.has(pk)) continue;
        seenSib.add(pk);
        if (!siblingOf[rel.from_memorial_id]) siblingOf[rel.from_memorial_id] = [];
        siblingOf[rel.from_memorial_id].push(rel.to_memorial_id);
        if (!siblingOf[rel.to_memorial_id]) siblingOf[rel.to_memorial_id] = [];
        siblingOf[rel.to_memorial_id].push(rel.from_memorial_id);
    }

    const generation: Record<string, number> = {};
    const visited = new Set<string>();
    const queue: string[] = [];

    const roots = people.filter(p => !hasParent.has(p.id));
    const startNodes = roots.length > 0 ? roots : [people[0]];

    for (const node of startNodes) {
        if (!visited.has(node.id)) {
            generation[node.id] = 0;
            visited.add(node.id);
            queue.push(node.id);
        }
    }

    while (queue.length > 0) {
        const id = queue.shift()!;
        const gen = generation[id];
        for (const childId of (parentChildren[id] || [])) {
            if (!visited.has(childId)) { generation[childId] = gen + 1; visited.add(childId); queue.push(childId); }
        }
        for (const spouseId of (spouses[id] || [])) {
            if (!visited.has(spouseId)) { generation[spouseId] = gen; visited.add(spouseId); queue.push(spouseId); }
        }
        for (const sibId of (siblingOf[id] || [])) {
            if (!visited.has(sibId)) { generation[sibId] = gen; visited.add(sibId); queue.push(sibId); }
        }
    }

    for (const p of people) {
        if (!visited.has(p.id)) generation[p.id] = 0;
    }

    const genGroups: Record<number, string[]> = {};
    for (const p of people) {
        const gen = generation[p.id] ?? 0;
        if (!genGroups[gen]) genGroups[gen] = [];
        genGroups[gen].push(p.id);
    }

    const sortedGens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);
    const positions: Record<string, { x: number; y: number }> = {};

    for (const gen of sortedGens) {
        const ids = genGroups[gen];
        const ordered: string[] = [];
        const placed = new Set<string>();
        for (const id of ids) {
            if (placed.has(id)) continue;
            ordered.push(id);
            placed.add(id);
            for (const spouseId of (spouses[id] || [])) {
                if (!placed.has(spouseId) && ids.includes(spouseId)) {
                    ordered.push(spouseId);
                    placed.add(spouseId);
                }
            }
        }
        const totalWidth = (ordered.length - 1) * H_GAP;
        const startX = -totalWidth / 2;
        ordered.forEach((id, index) => {
            positions[id] = { x: startX + index * H_GAP, y: gen * V_GAP };
        });
    }

    return { positions, generations: generation };
}

// ─── Build edges ────────────────────────────────────────────────────────────

function buildGraphEdges(
    relations: any[],
    positions: Record<string, { x: number; y: number }>,
): Edge[] {
    const edges: Edge[] = [];
    const seenPairs = new Set<string>();

    for (const rel of relations) {
        const pairKey = [rel.from_memorial_id, rel.to_memorial_id].sort().join('|');
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        let sourceId: string, targetId: string;
        const displayLabel = rel.description || '';

        // Normalize direction: parent always flows top→bottom
        if (rel.relationship_type === 'parent') {
            sourceId = rel.from_memorial_id; targetId = rel.to_memorial_id;
        } else if (rel.relationship_type === 'child') {
            sourceId = rel.to_memorial_id; targetId = rel.from_memorial_id;
        } else {
            sourceId = rel.from_memorial_id; targetId = rel.to_memorial_id;
        }

        // Smart handle selection based on actual node positions
        const srcPos = positions[sourceId] || { x: 0, y: 0 };
        const tgtPos = positions[targetId] || { x: 0, y: 0 };
        let sourceHandle: string, targetHandle: string;

        const isParentChild = rel.relationship_type === 'parent' || rel.relationship_type === 'child';
        if (isParentChild) {
            // Parent→child: always bottom→top
            sourceHandle = 'bottom'; targetHandle = 'top';
        } else {
            // Horizontal relationships: pick handles based on relative position
            const dx = tgtPos.x - srcPos.x;
            const dy = tgtPos.y - srcPos.y;
            if (Math.abs(dx) >= Math.abs(dy)) {
                // Target is more to the side
                sourceHandle = dx >= 0 ? 'right' : 'left';
                targetHandle = dx >= 0 ? 'left' : 'right';
            } else {
                // Target is more above/below
                sourceHandle = dy >= 0 ? 'bottom' : 'top';
                targetHandle = dy >= 0 ? 'top' : 'bottom';
            }
        }

        // Muted edge colors by relationship type
        const edgeStyles: Record<string, { stroke: string; strokeDasharray?: string }> = {
            parent: { stroke: '#7d8f82' },
            child:  { stroke: '#7d8f82' },
            spouse: { stroke: '#a89080' },
            sibling: { stroke: '#9ea5ad', strokeDasharray: '5 3' },
            other:  { stroke: '#aab0b8', strokeDasharray: '3 3' },
        };
        const edgeStyle = edgeStyles[rel.relationship_type] || edgeStyles.other;

        // Minimal label — just the word, no icons
        const labelText = displayLabel || rel.relationship_type;

        edges.push({
            id: rel.id,
            source: sourceId, target: targetId,
            sourceHandle, targetHandle,
            label: labelText,
            type: 'smoothstep',
            animated: false,
            data: { relationType: rel.relationship_type, description: rel.description || '' },
            style: { ...edgeStyle, strokeWidth: 1.5 },
            pathOptions: { borderRadius: 8, offset: 20 },
            labelStyle: {
                fill: '#8a96a0', fontSize: 9, fontWeight: 500,
                fontFamily: 'var(--font-sans)', cursor: 'pointer',
            },
            labelBgStyle: { fill: '#ffffff', fillOpacity: 0.85 },
            labelBgPadding: [5, 3] as [number, number],
            labelBgBorderRadius: 4,
        });
    }
    return edges;
}

// ─── Custom node ────────────────────────────────────────────────────────────

function TreeNode({ data }: NodeProps) {
    const { photoUrl, name, birthYear, deathYear, animDelay } = data as {
        photoUrl: string | null; name: string; birthYear: string; deathYear: string | null; animDelay: number;
    };

    const dateDisplay = deathYear ? `${birthYear} – ${deathYear}` : birthYear;
    const isDeceased = !!deathYear;

    return (
        <div className="ft-node" style={{ animationDelay: `${animDelay}ms` }}>
            {/* Handles — each serves as both source and target */}
            <Handle type="source" position={Position.Top}    id="top"    isConnectableEnd={true} className="ft-handle" />
            <Handle type="source" position={Position.Bottom} id="bottom" isConnectableEnd={true} className="ft-handle" />
            <Handle type="source" position={Position.Left}   id="left"   isConnectableEnd={true} className="ft-handle" />
            <Handle type="source" position={Position.Right}  id="right"  isConnectableEnd={true} className="ft-handle" />

            {/* Avatar */}
            <div className="ft-node-avatar">
                {photoUrl ? (
                    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0e6dd 0%, #e8d8cc 100%)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b5a7c7" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="ft-node-body">
                <div className="font-serif text-[13px] font-semibold leading-tight truncate" style={{ color: '#3d4a55', maxWidth: 120 }}>
                    {name}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: '#8a96a0' }}>
                    {isDeceased && <span style={{ color: '#b5a7c7', marginRight: 3 }}>✝</span>}
                    {dateDisplay}
                </div>
            </div>
        </div>
    );
}

const nodeTypes = { familyMember: TreeNode };

// ─── Node info popup ────────────────────────────────────────────────────────

function NodeInfoPopup({ nodeData, screenPos, onClose }: {
    nodeData: any; screenPos: { x: number; y: number }; onClose: () => void;
}) {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as HTMLElement)) onClose();
        }
        const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 50);
        return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
    }, [onClose]);

    const { name, birthYear, deathYear, birthPlace, epitaph, slug, photoUrl } = nodeData;
    const dateRange = deathYear ? `${birthYear} – ${deathYear}` : `Born ${birthYear}`;

    return (
        <div
            ref={popupRef}
            className="ft-popup fixed z-50"
            style={{ left: screenPos.x + 20, top: screenPos.y - 20, width: 240 }}
        >
            {/* Header with photo */}
            {photoUrl && (
                <div style={{ height: 80, overflow: 'hidden', borderRadius: '12px 12px 0 0', margin: '-1px -1px 0 -1px' }}>
                    <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                </div>
            )}
            <div className="p-4">
                <button onClick={onClose} className="absolute top-2 right-2 p-1 hover:bg-black/5 rounded-full" style={{ color: photoUrl ? '#fff' : '#8a96a0' }}>
                    <X size={14} />
                </button>

                <div className="font-serif text-base font-semibold mb-0.5" style={{ color: '#3d4a55' }}>{name}</div>
                <div className="text-xs mb-2" style={{ color: '#8a96a0' }}>{dateRange}</div>

                {birthPlace && (
                    <div className="text-xs mb-2" style={{ color: '#8a96a0' }}>Born in {birthPlace}</div>
                )}

                {epitaph && (
                    <div className="text-xs italic mb-3" style={{ color: '#a0a8b0', lineHeight: 1.5 }}>
                        &ldquo;{epitaph.length > 80 ? epitaph.substring(0, 80) + '...' : epitaph}&rdquo;
                    </div>
                )}

                {slug && (
                    <Link
                        href={`/person/${slug}`}
                        className="flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg transition-colors font-medium"
                        style={{ color: '#89b896', background: 'rgba(137,184,150,0.08)', border: '1px solid rgba(137,184,150,0.15)' }}
                    >
                        <ExternalLink size={11} />
                        View Memorial
                    </Link>
                )}
            </div>
        </div>
    );
}

// ─── Edge edit popover ──────────────────────────────────────────────────────

function EdgeEditPopover({ edgeData, screenPos, onSave, onDelete, onClose }: {
    edgeData: { id: string; relationType: string; description: string };
    screenPos: { x: number; y: number };
    onSave: (id: string, description: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}) {
    const [value, setValue] = useState(edgeData.description || '');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as HTMLElement)) onClose();
        }
        const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 50);
        return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
    }, [onClose]);

    const badgeColors: Record<string, string> = {
        parent: '#89b896', child: '#89b896', spouse: '#d4958a', sibling: '#b5a7c7',
    };
    const badgeColor = badgeColors[edgeData.relationType] || '#8a96a0';

    return (
        <div ref={popupRef} className="ft-popup fixed z-50 p-4" style={{ left: screenPos.x - 115, top: screenPos.y - 60, width: 240 }}>
            <div className="flex items-center gap-2 mb-3">
                {edgeData.relationType && edgeData.relationType !== 'other' && (
                    <span
                        className="text-xs capitalize px-2.5 py-0.5 rounded-full font-medium"
                        style={{ color: badgeColor, background: `${badgeColor}15`, border: `1px solid ${badgeColor}30` }}
                    >
                        {edgeData.relationType}
                    </span>
                )}
                <span className="text-xs" style={{ color: '#a0a8b0' }}>relationship</span>
            </div>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSave(edgeData.id, value.trim()); if (e.key === 'Escape') onClose(); }}
                placeholder="Custom label (optional)"
                className="w-full text-xs px-3 py-2 rounded-lg outline-none transition-colors"
                style={{ background: '#f8f4f0', border: '1px solid #e8d8cc', color: '#3d4a55' }}
                maxLength={50}
            />

            <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTop: '1px solid #f0e6dd' }}>
                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-1 text-xs p-1.5 rounded-lg transition-colors"
                        style={{ color: '#c4867a' }}
                    >
                        <Trash2 size={13} />
                        <span>Remove</span>
                    </button>
                ) : (
                    <button
                        onClick={() => onDelete(edgeData.id)}
                        className="text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                        style={{ color: '#d4635e', background: '#fef2f2', border: '1px solid #fecaca' }}
                    >
                        Confirm remove
                    </button>
                )}

                <div className="flex gap-1.5">
                    <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: '#a0a8b0' }}>
                        <X size={14} />
                    </button>
                    <button
                        onClick={() => onSave(edgeData.id, value.trim())}
                        className="px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                        style={{ color: '#89b896', background: 'rgba(137,184,150,0.1)' }}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── New connection popup ───────────────────────────────────────────────────

function NewConnectionPopup({ sourceName, targetName, onSave, onClose }: {
    sourceName: string; targetName: string;
    onSave: (type: string, description: string) => void; onClose: () => void;
}) {
    const [type, setType] = useState('spouse');
    const [label, setLabel] = useState('');
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as HTMLElement)) onClose();
        }
        const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 50);
        return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
    }, [onClose]);

    const types = [
        { key: 'parent', label: 'Parent', icon: '↑', color: '#89b896' },
        { key: 'child', label: 'Child', icon: '↓', color: '#89b896' },
        { key: 'spouse', label: 'Spouse', icon: '♥', color: '#d4958a' },
        { key: 'sibling', label: 'Sibling', icon: '∼', color: '#b5a7c7' },
    ];

    return (
        <div
            ref={popupRef}
            className="ft-popup fixed z-50 p-5"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 300 }}
        >
            <div className="text-xs font-medium mb-1" style={{ color: '#a0a8b0' }}>New connection</div>
            <div className="font-serif text-base font-semibold mb-5" style={{ color: '#3d4a55' }}>
                {sourceName} <span style={{ color: '#d4c4b5', margin: '0 6px' }}>&harr;</span> {targetName}
            </div>

            <div className="mb-4">
                <div className="text-xs font-medium mb-2" style={{ color: '#5a6b78' }}>Relationship type</div>
                <div className="grid grid-cols-2 gap-2">
                    {types.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setType(t.key)}
                            className="flex items-center gap-2 text-xs py-2.5 px-3 rounded-lg transition-all border"
                            style={type === t.key
                                ? { background: `${t.color}12`, color: t.color, borderColor: `${t.color}40`, fontWeight: 600 }
                                : { background: '#faf7f4', color: '#8a96a0', borderColor: '#ede5dc' }
                            }
                        >
                            <span style={{ fontSize: 14 }}>{t.icon}</span>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-5">
                <div className="text-xs font-medium mb-1.5" style={{ color: '#5a6b78' }}>
                    Custom label <span style={{ color: '#c4b8a8' }}>(optional)</span>
                </div>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSave(type, label.trim()); if (e.key === 'Escape') onClose(); }}
                    placeholder="e.g. grandma, uncle..."
                    className="w-full text-xs px-3 py-2.5 rounded-lg outline-none transition-colors"
                    style={{ background: '#f8f4f0', border: '1px solid #e8d8cc', color: '#3d4a55' }}
                    maxLength={50}
                />
            </div>

            <div className="flex justify-end gap-2 pt-3" style={{ borderTop: '1px solid #f0e6dd' }}>
                <button
                    onClick={onClose}
                    className="text-xs px-4 py-2 rounded-lg transition-colors font-medium"
                    style={{ color: '#8a96a0' }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(type, label.trim())}
                    className="text-xs px-5 py-2 rounded-lg transition-colors font-medium"
                    style={{ background: '#89b896', color: '#fff', boxShadow: '0 1px 3px rgba(137,184,150,0.3)' }}
                >
                    Connect
                </button>
            </div>
        </div>
    );
}

// ─── Main graph component ───────────────────────────────────────────────────

function FamilyTreeGraph({ userId }: { userId: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);
    const [memberCount, setMemberCount] = useState(0);
    const [relationCount, setRelationCount] = useState(0);

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

    const [editingEdge, setEditingEdge] = useState<{ id: string; relationType: string; description: string } | null>(null);
    const [edgePopupPos, setEdgePopupPos] = useState({ x: 0, y: 0 });

    const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
    const [linking, setLinking] = useState(false);

    const relationsRef = useRef<any[]>([]);
    const peopleRef = useRef<PersonData[]>([]);
    const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const reactFlowInstance = useReactFlow();

    // ─── Debounced position save ─────────────────────────────────────────

    const debouncedSavePositions = useCallback((updatedNodes: Node[]) => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
            savePositions(userId, updatedNodes);
        }, 500);
    }, [userId]);

    // Intercept node changes to detect drag end and save positions
    const handleNodesChange = useCallback((changes: NodeChange[]) => {
        onNodesChange(changes);
        // Save after any position change
        const hasDrag = changes.some(c => c.type === 'position' && (c as any).dragging === false);
        if (hasDrag) {
            // Use a micro delay so the state has updated
            setTimeout(() => {
                setNodes(current => {
                    debouncedSavePositions(current);
                    return current;
                });
            }, 0);
        }
    }, [onNodesChange, debouncedSavePositions, setNodes]);

    // ─── Load data ───────────────────────────────────────────────────────

    useEffect(() => { loadFamilyData(); }, []);

    const loadFamilyData = async () => {
        setLoading(true);
        try {
            const { data: people } = await supabase
                .from('memorials')
                .select('id, full_name, profile_photo_url, birth_date, death_date, step1, slug')
                .eq('user_id', userId);

            const { data: relations } = await supabase
                .from('memorial_relations')
                .select('*');

            if (!people) return;

            peopleRef.current = people;
            relationsRef.current = relations || [];
            setMemberCount(people.length);

            const { positions: computedPositions } = computeFamilyLayout(people, relations || []);
            const savedPositions = getSavedPositions(userId);

            // Merge: use saved positions if available, otherwise computed
            const mergedPositions: Record<string, { x: number; y: number }> = {};
            for (const person of people) {
                mergedPositions[person.id] = savedPositions[person.id] || computedPositions[person.id] || { x: 0, y: 0 };
            }

            const graphNodes: Node[] = people.map((person, index) => {
                const pos = mergedPositions[person.id];
                const step1 = person.step1 || {};
                return {
                    id: person.id,
                    type: 'familyMember',
                    position: pos,
                    data: {
                        photoUrl: person.profile_photo_url,
                        name: person.full_name || 'Unknown',
                        birthYear: person.birth_date?.substring(0, 4) || '????',
                        deathYear: person.death_date?.substring(0, 4) || null,
                        birthPlace: step1.birthPlace || null,
                        epitaph: step1.epitaph || null,
                        memorialId: person.id,
                        slug: person.slug,
                        animDelay: index * 60,
                    },
                };
            });

            const graphEdges = buildGraphEdges(relations || [], mergedPositions);
            // Count unique edge pairs
            const uniquePairs = new Set<string>();
            for (const rel of (relations || [])) {
                uniquePairs.add([rel.from_memorial_id, rel.to_memorial_id].sort().join('|'));
            }
            setRelationCount(uniquePairs.size);

            setNodes(graphNodes);
            setEdges(graphEdges);
        } catch (error) {
            console.error("Error loading tree:", error);
        } finally {
            setLoading(false);
        }
    };

    // ─── Auto-arrange (reset to computed layout) ─────────────────────────

    const handleAutoArrange = useCallback(() => {
        const { positions } = computeFamilyLayout(peopleRef.current, relationsRef.current);
        setNodes(current =>
            current.map(n => ({
                ...n,
                position: positions[n.id] || n.position,
            }))
        );
        // Rebuild edges with new positions for correct handle routing
        setEdges(buildGraphEdges(relationsRef.current, positions));
        // Clear saved positions
        try { localStorage.removeItem(`family-tree-pos-${userId}`); } catch {}
        // Fit view after layout change
        setTimeout(() => reactFlowInstance.fitView({ padding: 0.3, duration: 400 }), 50);
    }, [userId, setNodes, reactFlowInstance]);

    // ─── Connection handling ─────────────────────────────────────────────

    const handleNewConnection = useCallback((connection: Connection) => {
        if (connection.source && connection.target && connection.source !== connection.target) {
            setPendingConnection({ source: connection.source, target: connection.target });
        }
    }, []);

    const handleSaveNewConnection = useCallback(async (type: string, description: string) => {
        if (!pendingConnection) return;
        setLinking(true);

        let fromId = pendingConnection.source;
        let toId = pendingConnection.target;

        if (type === 'parent' || type === 'child') {
            const personA = peopleRef.current.find(p => p.id === fromId);
            const personB = peopleRef.current.find(p => p.id === toId);
            const dateA = personA?.birth_date || '9999';
            const dateB = personB?.birth_date || '9999';
            if (type === 'parent' && dateA > dateB) { fromId = pendingConnection.target; toId = pendingConnection.source; }
            if (type === 'child' && dateA < dateB) { fromId = pendingConnection.target; toId = pendingConnection.source; }
        }

        try {
            const res = await fetch('/api/family/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromId, toId, type, description: description || undefined }),
            });
            if (!res.ok) throw new Error('Failed to link');
            await loadFamilyData();
        } catch (error) {
            console.error('Failed to connect:', error);
        } finally {
            setPendingConnection(null);
            setLinking(false);
        }
    }, [pendingConnection]);

    // ─── Node click ──────────────────────────────────────────────────────

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (selectedNodeId === node.id) {
            setSelectedNodeId(null); setSelectedNodeData(null); return;
        }
        const screenPos = reactFlowInstance.flowToScreenPosition({ x: node.position.x, y: node.position.y });
        setPopupPos({ x: screenPos.x + 100, y: screenPos.y });
        setSelectedNodeId(node.id);
        setSelectedNodeData(node.data);
    }, [selectedNodeId, reactFlowInstance]);

    // ─── Edge click ──────────────────────────────────────────────────────

    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        const rel = relationsRef.current.find(r => r.id === edge.id);
        setEditingEdge({
            id: edge.id,
            relationType: rel?.relationship_type || 'other',
            description: rel?.description || '',
        });
        setEdgePopupPos({ x: event.clientX, y: event.clientY });
    }, []);

    const handleEdgeSave = useCallback(async (edgeId: string, description: string) => {
        try {
            await supabase.from('memorial_relations').update({ description: description || null }).eq('id', edgeId);
            setEdges(eds => eds.map(e =>
                e.id === edgeId ? { ...e, label: description || (e.data as any)?.relationType || '' } : e
            ));
            const rel = relationsRef.current.find(r => r.id === edgeId);
            if (rel) rel.description = description || null;
        } catch (error) {
            console.error('Failed to update edge label:', error);
        }
        setEditingEdge(null);
    }, [setEdges]);

    const handleEdgeDelete = useCallback(async (edgeId: string) => {
        try {
            const rel = relationsRef.current.find(r => r.id === edgeId);
            if (rel) {
                await supabase.from('memorial_relations').delete().eq('id', edgeId);
                await supabase.from('memorial_relations').delete()
                    .eq('from_memorial_id', rel.to_memorial_id)
                    .eq('to_memorial_id', rel.from_memorial_id);
            }
            setEditingEdge(null);
            await loadFamilyData();
        } catch (error) {
            console.error('Failed to delete edge:', error);
        }
    }, []);

    // ─── Pending connection names ────────────────────────────────────────

    const pendingSourceName = pendingConnection ? (nodes.find(n => n.id === pendingConnection.source)?.data as any)?.name || '?' : '';
    const pendingTargetName = pendingConnection ? (nodes.find(n => n.id === pendingConnection.target)?.data as any)?.name || '?' : '';

    // ─── Render ──────────────────────────────────────────────────────────

    return (
        <div className="h-screen flex flex-col" style={{ background: '#faf7f4' }}>
            {/* Header */}
            <div
                className="flex-none px-5 py-3 flex justify-between items-center z-10"
                style={{ background: '#fff', borderBottom: '1px solid #ede5dc' }}
            >
                <div className="flex items-center gap-3">
                    <Link href={`/dashboard/family/${userId}`} className="p-2 rounded-lg transition-colors hover:bg-black/[0.03]">
                        <ArrowLeft size={18} style={{ color: '#8a96a0' }} />
                    </Link>
                    <div>
                        <h1 className="font-serif text-xl font-semibold" style={{ color: '#3d4a55' }}>
                            Family Tree
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Stats */}
                    <div className="flex items-center gap-3 mr-2">
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: '#a0a8b0' }}>
                            <Users size={13} />
                            <span>{memberCount} members</span>
                        </div>
                        {relationCount > 0 && (
                            <div className="text-xs" style={{ color: '#c4b8a8' }}>
                                {relationCount} connections
                            </div>
                        )}
                    </div>

                    {/* Auto-arrange button */}
                    <button
                        onClick={handleAutoArrange}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors font-medium"
                        style={{ color: '#5a6b78', background: '#f0e6dd', border: '1px solid #e8d8cc' }}
                        title="Reset to automatic layout"
                    >
                        <LayoutGrid size={13} />
                        Auto-arrange
                    </button>
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 w-full h-full relative overflow-hidden">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ background: '#faf7f4' }}>
                        <Loader2 className="animate-spin" size={28} style={{ color: '#b5a7c7' }} />
                        <span className="font-serif text-sm" style={{ color: '#a0a8b0' }}>
                            Loading family tree...
                        </span>
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={handleNodeClick}
                        onEdgeClick={handleEdgeClick}
                        onConnect={handleNewConnection}
                        onPaneClick={() => { setSelectedNodeId(null); setSelectedNodeData(null); }}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.3 }}
                        attributionPosition="bottom-right"
                        style={{ background: '#faf7f4' }}
                        connectionLineStyle={{ stroke: '#d4958a', strokeWidth: 2 }}
                        defaultEdgeOptions={{ type: 'smoothstep' }}
                    >
                        <Background color="#e0d6cc" gap={24} size={1} />
                        <Controls
                            showInteractive={false}
                            className="ft-controls"
                        />
                        <MiniMap
                            nodeColor={() => '#d4c4b5'}
                            maskColor="rgba(250, 247, 244, 0.85)"
                            className="ft-minimap"
                        />
                    </ReactFlow>
                )}

                {/* Onboarding hint (show only when no edges) */}
                {!loading && edges.length === 0 && nodes.length > 1 && (
                    <div
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs px-4 py-2.5 rounded-full"
                        style={{ background: '#fff', color: '#5a6b78', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #ede5dc' }}
                    >
                        <span style={{ fontSize: 16 }}>↔</span>
                        Hover a card and drag from a dot to another card to create a connection
                    </div>
                )}

                {/* Popups */}
                {selectedNodeId && selectedNodeData && (
                    <NodeInfoPopup nodeData={selectedNodeData} screenPos={popupPos}
                        onClose={() => { setSelectedNodeId(null); setSelectedNodeData(null); }} />
                )}
                {editingEdge && (
                    <EdgeEditPopover edgeData={editingEdge} screenPos={edgePopupPos}
                        onSave={handleEdgeSave} onDelete={handleEdgeDelete} onClose={() => setEditingEdge(null)} />
                )}
                {pendingConnection && (
                    <NewConnectionPopup sourceName={pendingSourceName} targetName={pendingTargetName}
                        onSave={handleSaveNewConnection} onClose={() => setPendingConnection(null)} />
                )}
                {linking && (
                    <div className="absolute inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(250,247,244,0.7)' }}>
                        <Loader2 className="animate-spin" size={24} style={{ color: '#89b896' }} />
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page wrapper ───────────────────────────────────────────────────────────

export default function FamilyTreePage({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    return (
        <ReactFlowProvider>
            <FamilyTreeGraph userId={unwrappedParams.userId} />
        </ReactFlowProvider>
    );
}
