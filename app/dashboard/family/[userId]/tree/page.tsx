'use client';

import { useState, useEffect, use, useCallback, useMemo, useRef } from 'react';
import { ReactFlow, Controls, useNodesState, useEdgesState, useReactFlow, ReactFlowProvider, Position, Node, Edge, Handle, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft, Link2, X, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Golden angle in radians for organic spiral distribution
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

// Seeded pseudo-random for consistent "organic" offsets
function seededRandom(seed: number) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
}

// Calculate constellation positions using golden-angle spiral
function getConstellationPosition(index: number, total: number) {
    const centerX = 0;
    const centerY = 0;

    if (total === 1) return { x: centerX, y: centerY };

    // Radius grows with sqrt for even area distribution
    const baseRadius = Math.min(200, 120 + total * 15);
    const radius = baseRadius * Math.sqrt((index + 0.5) / total);
    const angle = index * GOLDEN_ANGLE;

    // Add organic offset (seeded by index for consistency)
    const offsetX = (seededRandom(index * 3) - 0.5) * 40;
    const offsetY = (seededRandom(index * 7) - 0.5) * 40;

    return {
        x: centerX + radius * Math.cos(angle) + offsetX,
        y: centerY + radius * Math.sin(angle) + offsetY,
    };
}

// Custom constellation node component
function ConstellationNode({ data }: NodeProps) {
    const { photoUrl, name, birthYear, animDelay } = data as {
        photoUrl: string | null;
        name: string;
        birthYear: string;
        animDelay: number;
    };

    return (
        <div
            className="constellation-node flex flex-col items-center"
            style={{ animationDelay: `${animDelay}ms` }}
        >
            <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'all' }} />

            {/* Glow ring behind photo */}
            <div className="node-photo relative mb-3" style={{ padding: '3px' }}>
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, rgba(181,167,199,0.4), rgba(138,171,180,0.4), rgba(137,184,150,0.3))',
                        filter: 'blur(4px)',
                    }}
                />
                {photoUrl ? (
                    <img
                        src={photoUrl}
                        alt=""
                        className="relative w-16 h-16 rounded-full object-cover"
                        style={{
                            border: '2px solid rgba(255,255,255,0.3)',
                        }}
                    />
                ) : (
                    <div
                        className="relative w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, rgba(181,167,199,0.3), rgba(138,171,180,0.3))',
                            border: '2px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        <span className="text-white/50 text-xl">&#10022;</span>
                    </div>
                )}
            </div>

            {/* Name */}
            <div
                className="font-semibold text-sm text-center leading-tight"
                style={{
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 1px 8px rgba(0,0,0,0.5)',
                    maxWidth: '120px',
                }}
            >
                {name}
            </div>

            {/* Birth year */}
            <div
                className="text-xs mt-0.5"
                style={{
                    color: 'rgba(181,167,199,0.7)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }}
            >
                {birthYear}
            </div>

            <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'all' }} />
        </div>
    );
}

const nodeTypes = { constellation: ConstellationNode };

// Info popup component shown when clicking a node
function NodeInfoPopup({
    nodeData,
    screenPos,
    onClose
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
        // Delay to avoid the same click triggering close
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 50);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const { name, birthYear, deathYear, birthPlace, epitaph, memorialId, slug } = nodeData;
    const dateRange = deathYear ? `${birthYear} – ${deathYear}` : `Born ${birthYear}`;

    return (
        <div
            ref={popupRef}
            className="constellation-popup fixed z-50 p-4"
            style={{
                left: screenPos.x + 20,
                top: screenPos.y - 20,
                width: 210,
            }}
        >
            {/* Close button */}
            <button onClick={onClose} className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded" style={{ color: 'rgba(255,255,255,0.4)' }}>
                <X size={12} />
            </button>

            {/* Name */}
            <div className="font-serif text-sm font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {name}
            </div>

            {/* Dates */}
            <div className="text-xs mb-2" style={{ color: 'rgba(181,167,199,0.7)' }}>
                {dateRange}
            </div>

            {/* Birth place */}
            {birthPlace && (
                <div className="text-xs mb-2" style={{ color: 'rgba(138,171,180,0.7)' }}>
                    Born in {birthPlace}
                </div>
            )}

            {/* Epitaph */}
            {epitaph && (
                <div className="text-xs italic mb-3" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
                    &ldquo;{epitaph.length > 80 ? epitaph.substring(0, 80) + '...' : epitaph}&rdquo;
                </div>
            )}

            {/* View Memorial link */}
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

// Edge label edit popover
function EdgeEditPopover({
    edgeData,
    screenPos,
    onSave,
    onClose,
}: {
    edgeData: { id: string; relationType: string; description: string };
    screenPos: { x: number; y: number };
    onSave: (id: string, description: string) => void;
    onClose: () => void;
}) {
    const [value, setValue] = useState(edgeData.description || '');
    const popupRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as HTMLElement)) {
                onClose();
            }
        }
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 50);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleConfirm = () => {
        onSave(edgeData.id, value.trim());
    };

    return (
        <div
            ref={popupRef}
            className="constellation-popup fixed z-50 p-3"
            style={{
                left: screenPos.x - 90,
                top: screenPos.y - 40,
                width: 200,
            }}
        >
            {/* Relationship type badge */}
            <div
                className="text-xs capitalize px-2 py-0.5 rounded-full inline-block mb-2"
                style={{
                    color: 'rgba(181,167,199,0.8)',
                    background: 'rgba(181,167,199,0.15)',
                    border: '1px solid rgba(181,167,199,0.2)',
                }}
            >
                {edgeData.relationType}
            </div>

            {/* Custom label input */}
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') onClose(); }}
                placeholder="e.g. husband/wife"
                className="w-full text-xs px-2 py-1.5 rounded-lg outline-none"
                style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(181,167,199,0.2)',
                    color: 'rgba(255,255,255,0.85)',
                }}
                maxLength={40}
            />

            {/* Actions */}
            <div className="flex justify-end gap-1.5 mt-2">
                <button
                    onClick={onClose}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                    <X size={14} />
                </button>
                <button
                    onClick={handleConfirm}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors"
                    style={{ color: 'rgba(137,184,150,0.8)' }}
                >
                    <Check size={14} />
                </button>
            </div>
        </div>
    );
}

// Connect mode: relationship type picker
function RelationshipPicker({
    screenPos,
    onSelect,
    onClose,
}: {
    screenPos: { x: number; y: number };
    onSelect: (type: string) => void;
    onClose: () => void;
}) {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (popupRef.current && !popupRef.current.contains(e.target as HTMLElement)) {
                onClose();
            }
        }
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 50);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const types = ['parent', 'child', 'spouse', 'sibling'];

    return (
        <div
            ref={popupRef}
            className="constellation-popup fixed z-50 p-3"
            style={{
                left: screenPos.x - 70,
                top: screenPos.y + 10,
                width: 160,
            }}
        >
            <div className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Relationship type
            </div>
            <div className="flex flex-col gap-1">
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => onSelect(type)}
                        className="text-left text-xs capitalize px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Inner component that uses useReactFlow (must be inside ReactFlowProvider)
function ConstellationGraph({ userId }: { userId: string }) {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);

    // Node info popup state
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [selectedNodeData, setSelectedNodeData] = useState<any>(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

    // Edge edit state
    const [editingEdge, setEditingEdge] = useState<{ id: string; relationType: string; description: string } | null>(null);
    const [edgePopupPos, setEdgePopupPos] = useState({ x: 0, y: 0 });

    // Connect mode state
    const [connectMode, setConnectMode] = useState(false);
    const [connectFrom, setConnectFrom] = useState<string | null>(null);
    const [connectTarget, setConnectTarget] = useState<string | null>(null);
    const [relationPickerPos, setRelationPickerPos] = useState({ x: 0, y: 0 });
    const [linking, setLinking] = useState(false);

    // Store raw relation data for edge editing
    const relationsRef = useRef<any[]>([]);

    const reactFlowInstance = useReactFlow();

    useEffect(() => {
        loadFamilyData();
    }, []);

    const loadFamilyData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Memorials with extra fields for info popup
            const { data: people } = await supabase
                .from('memorials')
                .select('id, full_name, profile_photo_url, birth_date, death_date, step1, slug')
                .eq('user_id', userId);

            // 2. Fetch Relations
            const { data: relations } = await supabase
                .from('memorial_relations')
                .select('*');

            if (!people) return;

            relationsRef.current = relations || [];

            // 3. Transform into Constellation Nodes
            const total = people.length;
            const graphNodes: Node[] = people.map((person, index) => {
                const pos = getConstellationPosition(index, total);
                const step1 = person.step1 || {};
                return {
                    id: person.id,
                    type: 'constellation',
                    position: { x: pos.x, y: pos.y },
                    data: {
                        photoUrl: person.profile_photo_url,
                        name: person.full_name || 'Unknown',
                        birthYear: person.birth_date?.substring(0, 4) || '????',
                        deathYear: person.death_date?.substring(0, 4) || null,
                        birthPlace: step1.birthPlace || null,
                        epitaph: step1.epitaph || null,
                        memorialId: person.id,
                        slug: person.slug,
                        animDelay: index * 150,
                    },
                };
            });

            // 4. Transform into Constellation Edges
            const graphEdges: Edge[] = (relations || []).map((rel) => ({
                id: rel.id,
                source: rel.from_memorial_id,
                target: rel.to_memorial_id,
                label: rel.description || rel.relationship_type,
                type: 'straight',
                animated: false,
                data: {
                    relationType: rel.relationship_type,
                    description: rel.description || '',
                },
                style: {
                    stroke: 'rgba(181, 167, 199, 0.45)',
                    strokeWidth: 1,
                },
                labelStyle: {
                    fill: 'rgba(255, 255, 255, 0.45)',
                    fontSize: 9,
                    fontFamily: 'var(--font-sans)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                    cursor: 'pointer',
                },
            }));

            setNodes(graphNodes);
            setEdges(graphEdges);

        } catch (error) {
            console.error("Error loading tree:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle node click: info popup or connect mode
    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        if (connectMode) {
            if (!connectFrom) {
                setConnectFrom(node.id);
            } else if (node.id !== connectFrom) {
                setConnectTarget(node.id);
                setRelationPickerPos({ x: event.clientX, y: event.clientY });
            }
            return;
        }

        // Toggle info popup
        if (selectedNodeId === node.id) {
            setSelectedNodeId(null);
            setSelectedNodeData(null);
            return;
        }

        const screenPos = reactFlowInstance.flowToScreenPosition({
            x: node.position.x,
            y: node.position.y,
        });

        setPopupPos({ x: screenPos.x + 60, y: screenPos.y });
        setSelectedNodeId(node.id);
        setSelectedNodeData(node.data);
    }, [connectMode, connectFrom, selectedNodeId, reactFlowInstance]);

    // Handle edge click: edit label
    const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
        if (connectMode) return;

        const rel = relationsRef.current.find(r => r.id === edge.id);
        setEditingEdge({
            id: edge.id,
            relationType: rel?.relationship_type || 'other',
            description: rel?.description || '',
        });
        setEdgePopupPos({ x: event.clientX, y: event.clientY });
    }, [connectMode]);

    // Save edge description to DB
    const handleEdgeSave = useCallback(async (edgeId: string, description: string) => {
        try {
            await supabase
                .from('memorial_relations')
                .update({ description: description || null })
                .eq('id', edgeId);

            // Update local state
            setEdges((eds) =>
                eds.map((e) =>
                    e.id === edgeId
                        ? { ...e, label: description || (e.data as any)?.relationType || '' }
                        : e
                )
            );

            // Update relations ref
            const rel = relationsRef.current.find(r => r.id === edgeId);
            if (rel) rel.description = description || null;

        } catch (error) {
            console.error('Failed to update edge label:', error);
        }
        setEditingEdge(null);
    }, [setEdges]);

    // Create connection via API
    const handleConnect = useCallback(async (type: string) => {
        if (!connectFrom || !connectTarget) return;
        setLinking(true);
        try {
            const res = await fetch('/api/family/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fromId: connectFrom,
                    toId: connectTarget,
                    type,
                }),
            });
            if (!res.ok) throw new Error('Failed to link');
            await loadFamilyData();
        } catch (error) {
            console.error('Failed to connect:', error);
        } finally {
            setConnectMode(false);
            setConnectFrom(null);
            setConnectTarget(null);
            setLinking(false);
        }
    }, [connectFrom, connectTarget]);

    // Get connect mode status text
    const connectStatusText = connectMode
        ? connectFrom
            ? 'Select second person'
            : 'Select first person'
        : null;

    // Find name for connectFrom node
    const connectFromName = connectFrom
        ? (nodes.find(n => n.id === connectFrom)?.data as any)?.name || ''
        : '';

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
                    {/* Connect mode status */}
                    {connectMode && (
                        <div className="text-xs px-3 py-1 rounded-full" style={{ color: 'rgba(137,184,150,0.9)', background: 'rgba(137,184,150,0.12)', border: '1px solid rgba(137,184,150,0.2)' }}>
                            {connectFrom ? (
                                <><span style={{ color: 'rgba(255,255,255,0.6)' }}>{connectFromName} →</span> {connectStatusText}</>
                            ) : (
                                connectStatusText
                            )}
                        </div>
                    )}

                    {/* Connect / Cancel button */}
                    <button
                        onClick={() => {
                            setConnectMode(!connectMode);
                            setConnectFrom(null);
                            setConnectTarget(null);
                            setSelectedNodeId(null);
                        }}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={connectMode
                            ? { color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }
                            : { color: 'rgba(181,167,199,0.8)', background: 'rgba(181,167,199,0.1)', border: '1px solid rgba(181,167,199,0.15)' }
                        }
                    >
                        {connectMode ? (
                            <><X size={12} /> Cancel</>
                        ) : (
                            <><Link2 size={12} /> Connect</>
                        )}
                    </button>

                    {!connectMode && (
                        <div
                            className="text-xs px-3 py-1 rounded-full"
                            style={{
                                color: 'rgba(181, 167, 199, 0.6)',
                                background: 'rgba(181, 167, 199, 0.08)',
                                border: '1px solid rgba(181, 167, 199, 0.1)',
                            }}
                        >
                            Click a star for info
                        </div>
                    )}
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 w-full h-full relative overflow-hidden">
                {/* Star field layers */}
                <div className="constellation-stars" />
                <div className="constellation-stars-2" />
                {/* Nebula glow */}
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
                        onClose={() => setEditingEdge(null)}
                    />
                )}

                {/* Relationship type picker for connect mode */}
                {connectTarget && (
                    <RelationshipPicker
                        screenPos={relationPickerPos}
                        onSelect={handleConnect}
                        onClose={() => { setConnectTarget(null); }}
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

export default function FamilyTreePage({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;

    return (
        <ReactFlowProvider>
            <ConstellationGraph userId={userId} />
        </ReactFlowProvider>
    );
}
