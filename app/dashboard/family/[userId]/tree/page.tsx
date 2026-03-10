'use client';

import { useState, useEffect, use, useCallback, useRef } from 'react';
import {
    ReactFlow, Controls, useNodesState, useEdgesState, useReactFlow,
    ReactFlowProvider, Position, Node, Edge, Handle, NodeProps, Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, X, Check, ExternalLink, Trash2 } from 'lucide-react';
import Link from 'next/link';

// ─── Family tree layout algorithm ───────────────────────────────────────────

const H_GAP = 260;
const V_GAP = 180;

interface PersonData {
    id: string;
    full_name: string | null;
    profile_photo_url: string | null;
    birth_date: string | null;
    death_date: string | null;
    step1: any;
    slug: string | null;
}

function computeFamilyLayout(
    people: PersonData[],
    relations: any[],
): Record<string, { x: number; y: number }> {
    if (people.length === 0) return {};

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
            if (!visited.has(childId)) {
                generation[childId] = gen + 1;
                visited.add(childId);
                queue.push(childId);
            }
        }

        for (const spouseId of (spouses[id] || [])) {
            if (!visited.has(spouseId)) {
                generation[spouseId] = gen;
                visited.add(spouseId);
                queue.push(spouseId);
            }
        }

        for (const sibId of (siblingOf[id] || [])) {
            if (!visited.has(sibId)) {
                generation[sibId] = gen;
                visited.add(sibId);
                queue.push(sibId);
            }
        }
    }

    for (const p of people) {
        if (!visited.has(p.id)) {
            generation[p.id] = 0;
        }
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
            positions[id] = {
                x: startX + index * H_GAP,
                y: gen * V_GAP,
            };
        });
    }

    return positions;
}

// ─── Build edges from relations (deduplicated) ─────────────────────────────

function buildGraphEdges(
    relations: any[],
    peopleMap: Record<string, PersonData>,
): Edge[] {
    const edges: Edge[] = [];
    const seenPairs = new Set<string>();

    for (const rel of relations) {
        const pairKey = [rel.from_memorial_id, rel.to_memorial_id].sort().join('|');
        if (seenPairs.has(pairKey)) continue;
        seenPairs.add(pairKey);

        const isVertical = rel.relationship_type === 'parent' || rel.relationship_type === 'child';

        let sourceId: string;
        let targetId: string;
        let sourceHandle: string;
        let targetHandle: string;
        let displayLabel = rel.description || rel.relationship_type;

        if (rel.relationship_type === 'parent') {
            sourceId = rel.from_memorial_id;
            targetId = rel.to_memorial_id;
            sourceHandle = 'bottom-src';
            targetHandle = 'top-tgt';
        } else if (rel.relationship_type === 'child') {
            sourceId = rel.to_memorial_id;
            targetId = rel.from_memorial_id;
            sourceHandle = 'bottom-src';
            targetHandle = 'top-tgt';
            if (!rel.description) displayLabel = 'parent';
        } else {
            sourceId = rel.from_memorial_id;
            targetId = rel.to_memorial_id;
            sourceHandle = 'right-src';
            targetHandle = 'left-tgt';
        }

        // Color-code by type
        const edgeColors: Record<string, string> = {
            parent: '#89b896',
            child: '#89b896',
            spouse: '#d4958a',
            sibling: '#b5a7c7',
            other: '#5a6b78',
        };
        const color = edgeColors[rel.relationship_type] || edgeColors.other;

        edges.push({
            id: rel.id,
            source: sourceId,
            target: targetId,
            sourceHandle,
            targetHandle,
            label: displayLabel,
            type: isVertical ? 'smoothstep' : 'straight',
            animated: false,
            data: {
                relationType: rel.relationship_type,
                description: rel.description || '',
            },
            style: {
                stroke: color,
                strokeWidth: 2,
                strokeOpacity: 0.55,
            },
            labelStyle: {
                fill: '#5a6b78',
                fontSize: 10,
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
            },
            labelBgStyle: {
                fill: '#fdf6f0',
                fillOpacity: 0.9,
            },
            labelBgPadding: [6, 4] as [number, number],
            labelBgBorderRadius: 4,
        });
    }

    return edges;
}

// ─── Custom node: elegant card ──────────────────────────────────────────────

function TreeNode({ data }: NodeProps) {
    const { photoUrl, name, birthYear, deathYear, animDelay } = data as {
        photoUrl: string | null;
        name: string;
        birthYear: string;
        deathYear: string | null;
        animDelay: number;
    };

    const dateDisplay = deathYear ? `${birthYear} – ${deathYear}` : birthYear;

    return (
        <div
            className="tree-node"
            style={{ animationDelay: `${animDelay}ms` }}
        >
            {/* Source handles */}
            <Handle type="source" position={Position.Top}    id="top-src"    className="tree-handle" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="tree-handle" />
            <Handle type="source" position={Position.Left}   id="left-src"   className="tree-handle" />
            <Handle type="source" position={Position.Right}  id="right-src"  className="tree-handle" />

            {/* Hidden target handles */}
            <Handle type="target" position={Position.Top}    id="top-tgt"    className="tree-handle-target" />
            <Handle type="target" position={Position.Bottom} id="bottom-tgt" className="tree-handle-target" />
            <Handle type="target" position={Position.Left}   id="left-tgt"   className="tree-handle-target" />
            <Handle type="target" position={Position.Right}  id="right-tgt"  className="tree-handle-target" />

            {/* Photo */}
            <div className="tree-node-photo">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-sand/30">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-charcoal/30">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Name + dates */}
            <div className="tree-node-info">
                <div className="font-serif text-sm font-semibold text-charcoal leading-tight truncate">
                    {name}
                </div>
                <div className="text-xs text-charcoal/45 mt-0.5">
                    {dateDisplay}
                </div>
            </div>
        </div>
    );
}

const nodeTypes = { constellation: TreeNode };

// ─── Node info popup ────────────────────────────────────────────────────────

function NodeInfoPopup({
    nodeData,
    screenPos,
    onClose,
}: {
    nodeData: any;
    screenPos: { x: number; y: number };
    onClose: () => void;
}) {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as HTMLElement)) {
                onClose();
            }
        }
        const timer = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 50);
        return () => { clearTimeout(timer); document.removeEventListener('mousedown', handleClickOutside); };
    }, [onClose]);

    const { name, birthYear, deathYear, birthPlace, epitaph, slug } = nodeData;
    const dateRange = deathYear ? `${birthYear} – ${deathYear}` : `Born ${birthYear}`;

    return (
        <div
            ref={popupRef}
            className="tree-popup fixed z-50 p-4"
            style={{ left: screenPos.x + 20, top: screenPos.y - 20, width: 220 }}
        >
            <button onClick={onClose} className="absolute top-2 right-2 p-1 hover:bg-charcoal/5 rounded text-charcoal/30">
                <X size={12} />
            </button>

            <div className="font-serif text-base font-semibold text-charcoal mb-0.5">{name}</div>
            <div className="text-xs text-charcoal/50 mb-2">{dateRange}</div>

            {birthPlace && (
                <div className="text-xs text-charcoal/45 mb-2">Born in {birthPlace}</div>
            )}

            {epitaph && (
                <div className="text-xs italic text-charcoal/40 mb-3 leading-relaxed">
                    &ldquo;{epitaph.length > 80 ? epitaph.substring(0, 80) + '...' : epitaph}&rdquo;
                </div>
            )}

            {slug && (
                <Link
                    href={`/person/${slug}`}
                    className="flex items-center gap-1.5 text-xs py-1.5 px-2.5 rounded-lg transition-colors text-sage hover:bg-sage/10 border border-sage/20"
                >
                    <ExternalLink size={10} />
                    View Memorial
                </Link>
            )}
        </div>
    );
}

// ─── Edge edit popover ──────────────────────────────────────────────────────

function EdgeEditPopover({
    edgeData,
    screenPos,
    onSave,
    onDelete,
    onClose,
}: {
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

    const typeBadgeColors: Record<string, { bg: string; text: string; border: string }> = {
        parent: { bg: 'bg-sage/10', text: 'text-sage', border: 'border-sage/20' },
        child: { bg: 'bg-sage/10', text: 'text-sage', border: 'border-sage/20' },
        spouse: { bg: 'bg-terracotta/10', text: 'text-terracotta', border: 'border-terracotta/20' },
        sibling: { bg: 'bg-lavender/10', text: 'text-lavender', border: 'border-lavender/20' },
    };
    const badge = typeBadgeColors[edgeData.relationType] || { bg: 'bg-charcoal/5', text: 'text-charcoal/60', border: 'border-charcoal/10' };

    return (
        <div
            ref={popupRef}
            className="tree-popup fixed z-50 p-3"
            style={{ left: screenPos.x - 110, top: screenPos.y - 50, width: 230 }}
        >
            {edgeData.relationType && edgeData.relationType !== 'other' && (
                <div className={`text-xs capitalize px-2 py-0.5 rounded-full inline-block mb-2 border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {edgeData.relationType}
                </div>
            )}

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSave(edgeData.id, value.trim()); if (e.key === 'Escape') onClose(); }}
                placeholder="Custom label (optional)"
                className="w-full text-xs px-2.5 py-1.5 rounded-lg outline-none bg-charcoal/[0.03] border border-charcoal/10 text-charcoal placeholder:text-charcoal/30 focus:border-sage/40 transition-colors"
                maxLength={50}
            />

            <div className="flex justify-between items-center mt-2">
                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-1 text-xs p-1.5 rounded hover:bg-terracotta/10 transition-colors text-terracotta/50"
                    >
                        <Trash2 size={12} />
                    </button>
                ) : (
                    <button
                        onClick={() => onDelete(edgeData.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors text-terracotta bg-terracotta/10 border border-terracotta/20"
                    >
                        Remove?
                    </button>
                )}

                <div className="flex gap-1.5">
                    <button onClick={onClose} className="p-1.5 rounded hover:bg-charcoal/5 transition-colors text-charcoal/30">
                        <X size={14} />
                    </button>
                    <button onClick={() => onSave(edgeData.id, value.trim())} className="p-1.5 rounded hover:bg-sage/10 transition-colors text-sage">
                        <Check size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── New connection popup ───────────────────────────────────────────────────

function NewConnectionPopup({
    sourceName,
    targetName,
    onSave,
    onClose,
}: {
    sourceName: string;
    targetName: string;
    onSave: (type: string, description: string) => void;
    onClose: () => void;
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
        { key: 'parent', label: 'Parent', color: 'sage' },
        { key: 'child', label: 'Child', color: 'sage' },
        { key: 'spouse', label: 'Spouse', color: 'terracotta' },
        { key: 'sibling', label: 'Sibling', color: 'lavender' },
    ];

    return (
        <div
            ref={popupRef}
            className="tree-popup fixed z-50 p-5"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 280 }}
        >
            <div className="text-xs text-charcoal/40 mb-1">New connection</div>
            <div className="text-sm font-serif font-semibold text-charcoal mb-4">
                {sourceName} <span className="text-charcoal/25 mx-1">&harr;</span> {targetName}
            </div>

            <div className="mb-3">
                <div className="text-xs text-charcoal/50 mb-1.5">Relationship</div>
                <div className="grid grid-cols-2 gap-1.5">
                    {types.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setType(t.key)}
                            className={`text-xs py-1.5 px-3 rounded-lg transition-all text-center border ${
                                type === t.key
                                    ? `bg-${t.color}/15 text-${t.color} border-${t.color}/30 font-medium`
                                    : 'bg-charcoal/[0.02] text-charcoal/50 border-charcoal/8 hover:border-charcoal/15'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="text-xs mt-1.5 text-charcoal/35">
                    {type === 'parent' || type === 'child'
                        ? 'Vertical layout (older on top)'
                        : 'Horizontal layout (side by side)'}
                </div>
            </div>

            <div className="mb-4">
                <div className="text-xs text-charcoal/50 mb-1.5">
                    Custom label <span className="text-charcoal/25">(optional)</span>
                </div>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSave(type, label.trim()); if (e.key === 'Escape') onClose(); }}
                    placeholder="e.g. grandma"
                    className="w-full text-xs px-2.5 py-2 rounded-lg outline-none bg-charcoal/[0.03] border border-charcoal/10 text-charcoal placeholder:text-charcoal/30 focus:border-sage/40 transition-colors"
                    maxLength={50}
                />
            </div>

            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors text-charcoal/40 hover:bg-charcoal/5"
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(type, label.trim())}
                    className="text-xs px-4 py-1.5 rounded-lg transition-colors bg-sage/15 text-sage border border-sage/25 hover:bg-sage/25 font-medium"
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

    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

    const [editingEdge, setEditingEdge] = useState<{ id: string; relationType: string; description: string } | null>(null);
    const [edgePopupPos, setEdgePopupPos] = useState({ x: 0, y: 0 });

    const [pendingConnection, setPendingConnection] = useState<{ source: string; target: string } | null>(null);
    const [linking, setLinking] = useState(false);

    const relationsRef = useRef<any[]>([]);
    const peopleRef = useRef<PersonData[]>([]);

    const reactFlowInstance = useReactFlow();

    useEffect(() => {
        loadFamilyData();
    }, []);

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

            const positions = computeFamilyLayout(people, relations || []);

            const graphNodes: Node[] = people.map((person, index) => {
                const pos = positions[person.id] || { x: index * H_GAP, y: 0 };
                const step1 = person.step1 || {};
                return {
                    id: person.id,
                    type: 'constellation',
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
                        animDelay: index * 80,
                    },
                };
            });

            const peopleMap: Record<string, PersonData> = {};
            for (const p of people) peopleMap[p.id] = p;

            const graphEdges = buildGraphEdges(relations || [], peopleMap);

            setNodes(graphNodes);
            setEdges(graphEdges);
        } catch (error) {
            console.error("Error loading tree:", error);
        } finally {
            setLoading(false);
        }
    };

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

            if (type === 'parent') {
                if (dateA > dateB) {
                    fromId = pendingConnection.target;
                    toId = pendingConnection.source;
                }
            } else {
                if (dateA < dateB) {
                    fromId = pendingConnection.target;
                    toId = pendingConnection.source;
                }
            }
        }

        try {
            const res = await fetch('/api/family/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromId,
                    toId,
                    type,
                    description: description || undefined,
                }),
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

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (selectedNodeId === node.id) {
            setSelectedNodeId(null);
            setSelectedNodeData(null);
            return;
        }

        const screenPos = reactFlowInstance.flowToScreenPosition({
            x: node.position.x,
            y: node.position.y,
        });

        setPopupPos({ x: screenPos.x + 100, y: screenPos.y });
        setSelectedNodeId(node.id);
        setSelectedNodeData(node.data);
    }, [selectedNodeId, reactFlowInstance]);

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
            await supabase
                .from('memorial_relations')
                .update({ description: description || null })
                .eq('id', edgeId);

            setEdges((eds) =>
                eds.map((e) =>
                    e.id === edgeId
                        ? { ...e, label: description || (e.data as any)?.relationType || '' }
                        : e
                )
            );

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
                await supabase
                    .from('memorial_relations')
                    .delete()
                    .eq('from_memorial_id', rel.to_memorial_id)
                    .eq('to_memorial_id', rel.from_memorial_id);
            }
            setEditingEdge(null);
            await loadFamilyData();
        } catch (error) {
            console.error('Failed to delete edge:', error);
        }
    }, []);

    const pendingSourceName = pendingConnection
        ? (nodes.find(n => n.id === pendingConnection.source)?.data as any)?.name || '?'
        : '';
    const pendingTargetName = pendingConnection
        ? (nodes.find(n => n.id === pendingConnection.target)?.data as any)?.name || '?'
        : '';

    return (
        <div className="h-screen flex flex-col bg-ivory">
            {/* Header */}
            <div className="flex-none px-6 py-4 flex justify-between items-center z-10 bg-ivory border-b border-sand/40">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/family/${userId}`} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                        <ArrowLeft size={20} className="text-charcoal/50" />
                    </Link>
                    <div>
                        <h1 className="font-serif text-2xl text-charcoal">
                            Family Tree
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-xs px-3 py-1.5 rounded-full text-charcoal/40 bg-sand/20 border border-sand/30">
                        Drag between dots to connect
                    </div>
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 w-full h-full relative overflow-hidden tree-canvas">
                {/* Subtle pattern background */}
                <div className="tree-pattern" />

                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-sage/60" size={28} />
                        <span className="font-serif text-sm text-charcoal/40">
                            Loading family tree...
                        </span>
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={handleNodeClick}
                        onEdgeClick={handleEdgeClick}
                        onConnect={handleNewConnection}
                        nodeTypes={nodeTypes}
                        fitView
                        fitViewOptions={{ padding: 0.4 }}
                        attributionPosition="bottom-right"
                        style={{ background: 'transparent' }}
                    >
                        <Controls
                            showInteractive={false}
                            className="tree-controls"
                        />
                    </ReactFlow>
                )}

                {selectedNodeId && selectedNodeData && (
                    <NodeInfoPopup
                        nodeData={selectedNodeData}
                        screenPos={popupPos}
                        onClose={() => { setSelectedNodeId(null); setSelectedNodeData(null); }}
                    />
                )}

                {editingEdge && (
                    <EdgeEditPopover
                        edgeData={editingEdge}
                        screenPos={edgePopupPos}
                        onSave={handleEdgeSave}
                        onDelete={handleEdgeDelete}
                        onClose={() => setEditingEdge(null)}
                    />
                )}

                {pendingConnection && (
                    <NewConnectionPopup
                        sourceName={pendingSourceName}
                        targetName={pendingTargetName}
                        onSave={handleSaveNewConnection}
                        onClose={() => setPendingConnection(null)}
                    />
                )}

                {linking && (
                    <div className="absolute inset-0 flex items-center justify-center z-50 bg-ivory/60">
                        <Loader2 className="animate-spin text-sage" size={24} />
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Page wrapper ───────────────────────────────────────────────────────────

export default function FamilyTreePage({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;

    return (
        <ReactFlowProvider>
            <FamilyTreeGraph userId={userId} />
        </ReactFlowProvider>
    );
}
