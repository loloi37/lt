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

const H_GAP = 250;   // horizontal gap between nodes
const V_GAP = 200;   // vertical gap between generations
const NODE_W = 180;

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

    // Build relationship maps (deduplicated by pair)
    const parentChildren: Record<string, string[]> = {}; // parentId → [childIds]
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
            // from is child of to → to is parent
            if (!parentChildren[rel.to_memorial_id]) parentChildren[rel.to_memorial_id] = [];
            parentChildren[rel.to_memorial_id].push(rel.from_memorial_id);
            hasParent.add(rel.from_memorial_id);
        } else if (rel.relationship_type === 'spouse') {
            if (!spouses[rel.from_memorial_id]) spouses[rel.from_memorial_id] = [];
            spouses[rel.from_memorial_id].push(rel.to_memorial_id);
            if (!spouses[rel.to_memorial_id]) spouses[rel.to_memorial_id] = [];
            spouses[rel.to_memorial_id].push(rel.from_memorial_id);
        }
        // sibling: same generation, handled like unlinked within same gen
    }

    // Also process siblings to keep them in the same generation
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

    // Assign generations via BFS
    const generation: Record<string, number> = {};
    const visited = new Set<string>();
    const queue: string[] = [];

    // Roots = people with no parent
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

        // Children → next generation
        for (const childId of (parentChildren[id] || [])) {
            if (!visited.has(childId)) {
                generation[childId] = gen + 1;
                visited.add(childId);
                queue.push(childId);
            }
        }

        // Spouses → same generation
        for (const spouseId of (spouses[id] || [])) {
            if (!visited.has(spouseId)) {
                generation[spouseId] = gen;
                visited.add(spouseId);
                queue.push(spouseId);
            }
        }

        // Siblings → same generation
        for (const sibId of (siblingOf[id] || [])) {
            if (!visited.has(sibId)) {
                generation[sibId] = gen;
                visited.add(sibId);
                queue.push(sibId);
            }
        }
    }

    // Place any remaining unvisited nodes
    for (const p of people) {
        if (!visited.has(p.id)) {
            generation[p.id] = 0;
        }
    }

    // Group by generation
    const genGroups: Record<number, string[]> = {};
    for (const p of people) {
        const gen = generation[p.id] ?? 0;
        if (!genGroups[gen]) genGroups[gen] = [];
        genGroups[gen].push(p.id);
    }

    // Within each generation, place spouse pairs adjacent
    const sortedGens = Object.keys(genGroups).map(Number).sort((a, b) => a - b);
    const positions: Record<string, { x: number; y: number }> = {};

    for (const gen of sortedGens) {
        const ids = genGroups[gen];
        // Order: try to keep spouse pairs together
        const ordered: string[] = [];
        const placed = new Set<string>();

        for (const id of ids) {
            if (placed.has(id)) continue;
            ordered.push(id);
            placed.add(id);
            // Place spouses right next to this person
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
            // from is parent (above) → to is child (below)
            sourceId = rel.from_memorial_id;
            targetId = rel.to_memorial_id;
            sourceHandle = 'bottom-src';
            targetHandle = 'top-tgt';
        } else if (rel.relationship_type === 'child') {
            // from is child → to is parent (above)
            sourceId = rel.to_memorial_id; // parent on top
            targetId = rel.from_memorial_id; // child on bottom
            sourceHandle = 'bottom-src';
            targetHandle = 'top-tgt';
            if (!rel.description) displayLabel = 'parent'; // normalize label
        } else {
            // spouse / sibling / other → horizontal
            sourceId = rel.from_memorial_id;
            targetId = rel.to_memorial_id;
            sourceHandle = 'right-src';
            targetHandle = 'left-tgt';
        }

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
                stroke: 'rgba(181, 167, 199, 0.5)',
                strokeWidth: 1.5,
            },
            labelStyle: {
                fill: 'rgba(181, 167, 199, 0.7)',
                fontSize: 10,
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
            },
            labelBgStyle: {
                fill: 'transparent',
            },
        });
    }

    return edges;
}

// ─── Custom node: rounded rectangle card with 4 handles ─────────────────────

function ConstellationNode({ data }: NodeProps) {
    const { photoUrl, name, birthYear, animDelay } = data as {
        photoUrl: string | null;
        name: string;
        birthYear: string;
        animDelay: number;
    };

    return (
        <div
            className="constellation-node"
            style={{
                animationDelay: `${animDelay}ms`,
                background: 'rgba(30, 37, 58, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(181, 167, 199, 0.2)',
                borderRadius: '18px',
                padding: '14px 18px',
                minWidth: '160px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 15px rgba(181,167,199,0.06)',
            }}
        >
            {/* ── 4 visible source handles (user drags FROM these) ── */}
            <Handle type="source" position={Position.Top}    id="top-src"    className="constellation-handle" />
            <Handle type="source" position={Position.Bottom} id="bottom-src" className="constellation-handle" />
            <Handle type="source" position={Position.Left}   id="left-src"   className="constellation-handle" />
            <Handle type="source" position={Position.Right}  id="right-src"  className="constellation-handle" />

            {/* ── 4 hidden target handles (other nodes can drop ON these) ── */}
            <Handle type="target" position={Position.Top}    id="top-tgt"    className="constellation-handle-hidden" />
            <Handle type="target" position={Position.Bottom} id="bottom-tgt" className="constellation-handle-hidden" />
            <Handle type="target" position={Position.Left}   id="left-tgt"   className="constellation-handle-hidden" />
            <Handle type="target" position={Position.Right}  id="right-tgt"  className="constellation-handle-hidden" />

            {/* ── Card content ── */}
            <div className="flex items-center gap-3">
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        style={{ border: '1.5px solid rgba(181,167,199,0.3)' }}
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                            background: 'rgba(181,167,199,0.12)',
                            border: '1.5px solid rgba(181,167,199,0.2)',
                        }}
                    >
                        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 16 }}>&#10022;</span>
                    </div>
                )}
                <div className="min-w-0">
                    <div
                        className="text-sm font-medium leading-tight truncate"
                        style={{ color: 'rgba(255,255,255,0.9)', maxWidth: '110px' }}
                    >
                        {name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(181,167,199,0.6)' }}>
                        {birthYear}
                    </div>
                </div>
            </div>
        </div>
    );
}

const nodeTypes = { constellation: ConstellationNode };

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
            className="constellation-popup fixed z-50 p-4"
            style={{ left: screenPos.x + 20, top: screenPos.y - 20, width: 210 }}
        >
            <button onClick={onClose} className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={12} />
            </button>

            <div className="font-serif text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>{name}</div>
            <div className="text-xs mb-2" style={{ color: 'rgba(181,167,199,0.7)' }}>{dateRange}</div>

            {birthPlace && (
                <div className="text-xs mb-2" style={{ color: 'rgba(138,171,180,0.7)' }}>Born in {birthPlace}</div>
            )}

            {epitaph && (
                <div className="text-xs italic mb-3" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                    &ldquo;{epitaph.length > 80 ? epitaph.substring(0, 80) + '...' : epitaph}&rdquo;
                </div>
            )}

            {slug && (
                <Link
                    href={`/person/${slug}`}
                    className="flex items-center gap-1.5 text-xs py-1.5 px-2.5 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: 'rgba(181,167,199,0.8)', border: '1px solid rgba(181,167,199,0.2)' }}
                >
                    <ExternalLink size={10} />
                    View Memorial
                </Link>
            )}
        </div>
    );
}

// ─── Edge label edit popover ────────────────────────────────────────────────

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

    return (
        <div
            ref={popupRef}
            className="constellation-popup fixed z-50 p-3"
            style={{ left: screenPos.x - 100, top: screenPos.y - 50, width: 220 }}
        >
            {edgeData.relationType && edgeData.relationType !== 'other' && (
                <div
                    className="text-xs capitalize px-2 py-0.5 rounded-full inline-block mb-2"
                    style={{ color: 'rgba(181,167,199,0.8)', background: 'rgba(181,167,199,0.15)', border: '1px solid rgba(181,167,199,0.2)' }}
                >
                    {edgeData.relationType}
                </div>
            )}

            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') onSave(edgeData.id, value.trim()); if (e.key === 'Escape') onClose(); }}
                placeholder="e.g. grandma/little child"
                className="w-full text-xs px-2 py-1.5 rounded-lg outline-none"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(181,167,199,0.2)', color: 'rgba(255,255,255,0.85)' }}
                maxLength={50}
            />

            <div className="flex justify-between items-center mt-2">
                {/* Delete button */}
                {!confirmDelete ? (
                    <button
                        onClick={() => setConfirmDelete(true)}
                        className="flex items-center gap-1 text-xs p-1.5 rounded hover:bg-red-500/10 transition-colors"
                        style={{ color: 'rgba(220,100,100,0.6)' }}
                    >
                        <Trash2 size={12} />
                    </button>
                ) : (
                    <button
                        onClick={() => onDelete(edgeData.id)}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors"
                        style={{ color: '#e87171', background: 'rgba(220,100,100,0.12)', border: '1px solid rgba(220,100,100,0.2)' }}
                    >
                        Remove?
                    </button>
                )}

                {/* Save / Cancel */}
                <div className="flex gap-1.5">
                    <button onClick={onClose} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        <X size={14} />
                    </button>
                    <button onClick={() => onSave(edgeData.id, value.trim())} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: 'rgba(137,184,150,0.8)' }}>
                        <Check size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── New connection popup: type picker + custom label ───────────────────────

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

    return (
        <div
            ref={popupRef}
            className="constellation-popup fixed z-50 p-4"
            style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 260 }}
        >
            {/* Title */}
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                New connection
            </div>
            <div className="text-sm font-medium mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {sourceName} <span style={{ color: 'rgba(181,167,199,0.5)' }}>↔</span> {targetName}
            </div>

            {/* Type selector */}
            <div className="mb-3">
                <div className="text-xs mb-1.5" style={{ color: 'rgba(181,167,199,0.6)' }}>Relationship type</div>
                <div className="grid grid-cols-2 gap-1.5">
                    {['parent', 'child', 'spouse', 'sibling'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t)}
                            className="text-xs capitalize py-1.5 px-3 rounded-lg transition-all text-center"
                            style={type === t
                                ? { background: 'rgba(181,167,199,0.25)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(181,167,199,0.4)' }
                                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
                            }
                        >
                            {t}
                        </button>
                    ))}
                </div>
                <div className="text-xs mt-1.5" style={{ color: 'rgba(138,171,180,0.5)' }}>
                    {type === 'parent' || type === 'child'
                        ? 'Vertical layout (older on top)'
                        : 'Horizontal layout (side by side)'}
                </div>
            </div>

            {/* Custom label */}
            <div className="mb-4">
                <div className="text-xs mb-1.5" style={{ color: 'rgba(181,167,199,0.6)' }}>Custom label <span style={{ color: 'rgba(255,255,255,0.25)' }}>(optional)</span></div>
                <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSave(type, label.trim()); if (e.key === 'Escape') onClose(); }}
                    placeholder="e.g. grandma/little child"
                    className="w-full text-xs px-2.5 py-2 rounded-lg outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(181,167,199,0.15)', color: 'rgba(255,255,255,0.85)' }}
                    maxLength={50}
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
                <button
                    onClick={onClose}
                    className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    Cancel
                </button>
                <button
                    onClick={() => onSave(type, label.trim())}
                    className="text-xs px-4 py-1.5 rounded-lg transition-colors"
                    style={{ background: 'rgba(137,184,150,0.25)', color: 'rgba(137,184,150,0.9)', border: '1px solid rgba(137,184,150,0.3)' }}
                >
                    Connect
                </button>
            </div>
        </div>
    );
}

// ─── Main graph component ───────────────────────────────────────────────────

function ConstellationGraph({ userId }: { userId: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);

    // Node info popup
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

    // Edge edit
    const [editingEdge, setEditingEdge] = useState<{ id: string; relationType: string; description: string } | null>(null);
    const [edgePopupPos, setEdgePopupPos] = useState({ x: 0, y: 0 });

    // New connection (after drag)
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

            // Compute family tree positions
            const positions = computeFamilyLayout(people, relations || []);

            // Build nodes
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
                        animDelay: index * 100,
                    },
                };
            });

            // Build edges (deduplicated, with correct handles)
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

    // ─── Drag-to-connect handler ──────────────────────────────────────────

    const handleNewConnection = useCallback((connection: Connection) => {
        if (connection.source && connection.target && connection.source !== connection.target) {
            setPendingConnection({ source: connection.source, target: connection.target });
        }
    }, []);

    // Save new connection with type + optional custom label
    const handleSaveNewConnection = useCallback(async (type: string, description: string) => {
        if (!pendingConnection) return;
        setLinking(true);

        let fromId = pendingConnection.source;
        let toId = pendingConnection.target;

        // For parent/child, figure out who's older using birth_date
        if (type === 'parent' || type === 'child') {
            const personA = peopleRef.current.find(p => p.id === fromId);
            const personB = peopleRef.current.find(p => p.id === toId);
            const dateA = personA?.birth_date || '9999';
            const dateB = personB?.birth_date || '9999';

            if (type === 'parent') {
                // "parent" means: fromId is the parent of toId
                // Make the older one the parent
                if (dateA > dateB) {
                    // A is younger → swap so the older person is "from" (parent)
                    fromId = pendingConnection.target;
                    toId = pendingConnection.source;
                }
            } else {
                // "child" means: fromId is the child of toId
                // Make the younger one the child (from)
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

    // ─── Node click: info popup ───────────────────────────────────────────

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

    // ─── Edge click: edit label ───────────────────────────────────────────

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

    // Delete an edge and its reverse link from DB, then reload
    const handleEdgeDelete = useCallback(async (edgeId: string) => {
        try {
            // Find the relation to get from/to IDs for reverse deletion
            const rel = relationsRef.current.find(r => r.id === edgeId);
            if (rel) {
                // Delete the forward link
                await supabase.from('memorial_relations').delete().eq('id', edgeId);
                // Delete the reverse link (same pair, opposite direction)
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

    // ─── Get names for pending connection popup ───────────────────────────

    const pendingSourceName = pendingConnection
        ? (nodes.find(n => n.id === pendingConnection.source)?.data as any)?.name || '?'
        : '';
    const pendingTargetName = pendingConnection
        ? (nodes.find(n => n.id === pendingConnection.target)?.data as any)?.name || '?'
        : '';

    // ─── Render ───────────────────────────────────────────────────────────

    return (
        <div className="h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #0a0e1a 0%, #121828 40%, #151a30 100%)' }}>
            {/* Header */}
            <div
                className="flex-none px-6 py-4 flex justify-between items-center z-10"
                style={{
                    background: 'rgba(10, 14, 26, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: '1px solid rgba(181, 167, 199, 0.1)',
                }}
            >
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/family/${userId}`} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <ArrowLeft size={20} style={{ color: 'rgba(255,255,255,0.6)' }} />
                    </Link>
                    <h1 className="font-serif text-2xl" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        Family Constellation
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                            color: 'rgba(181, 167, 199, 0.6)',
                            background: 'rgba(181, 167, 199, 0.08)',
                            border: '1px solid rgba(181, 167, 199, 0.1)',
                        }}
                    >
                        Drag between dots to connect · Click a card for info
                    </div>
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 w-full h-full relative overflow-hidden">
                <div className="constellation-stars" />
                <div className="constellation-stars-2" />
                <div className="constellation-nebula" />

                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={32} style={{ color: 'rgba(181,167,199,0.6)' }} />
                        <span className="font-serif text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Loading constellation...
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
                            style={{
                                background: 'rgba(10, 14, 26, 0.7)',
                                border: '1px solid rgba(181, 167, 199, 0.15)',
                                borderRadius: '8px',
                            }}
                        />
                    </ReactFlow>
                )}

                {/* Node info popup */}
                {selectedNodeId && selectedNodeData && (
                    <NodeInfoPopup
                        nodeData={selectedNodeData}
                        screenPos={popupPos}
                        onClose={() => { setSelectedNodeId(null); setSelectedNodeData(null); }}
                    />
                )}

                {/* Edge edit popover */}
                {editingEdge && (
                    <EdgeEditPopover
                        edgeData={editingEdge}
                        screenPos={edgePopupPos}
                        onSave={handleEdgeSave}
                        onDelete={handleEdgeDelete}
                        onClose={() => setEditingEdge(null)}
                    />
                )}

                {/* New connection popup: type + label */}
                {pendingConnection && (
                    <NewConnectionPopup
                        sourceName={pendingSourceName}
                        targetName={pendingTargetName}
                        onSave={handleSaveNewConnection}
                        onClose={() => setPendingConnection(null)}
                    />
                )}

                {/* Linking overlay */}
                {linking && (
                    <div className="absolute inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(10,14,26,0.5)' }}>
                        <Loader2 className="animate-spin" size={24} style={{ color: 'rgba(181,167,199,0.8)' }} />
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
            <ConstellationGraph userId={userId} />
        </ReactFlowProvider>
    );
}
