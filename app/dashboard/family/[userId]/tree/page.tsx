'use client';

import { useState, useEffect, use, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, useNodesState, useEdgesState, Position, Node, Edge, Handle, NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft } from 'lucide-react';
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

export default function FamilyTreePage({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFamilyData();
    }, []);

    const loadFamilyData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Memorials (The People)
            const { data: people } = await supabase
                .from('memorials')
                .select('id, full_name, profile_photo_url, birth_date')
                .eq('user_id', userId);

            // 2. Fetch Relations (The Connections)
            const { data: relations } = await supabase
                .from('memorial_relations')
                .select('*');

            if (!people) return;

            // 3. Transform into Constellation Nodes
            const total = people.length;
            const graphNodes: Node[] = people.map((person, index) => {
                const pos = getConstellationPosition(index, total);
                return {
                    id: person.id,
                    type: 'constellation',
                    position: { x: pos.x, y: pos.y },
                    data: {
                        photoUrl: person.profile_photo_url,
                        name: person.full_name,
                        birthYear: person.birth_date?.substring(0, 4) || '????',
                        animDelay: index * 150,
                    },
                };
            });

            // 4. Transform into Constellation Edges
            const graphEdges: Edge[] = (relations || []).map((rel) => ({
                id: rel.id,
                source: rel.from_memorial_id,
                target: rel.to_memorial_id,
                label: rel.relationship_type,
                type: 'straight',
                animated: false,
                style: {
                    stroke: 'rgba(181, 167, 199, 0.45)',
                    strokeWidth: 1,
                },
                labelStyle: {
                    fill: 'rgba(255, 255, 255, 0.45)',
                    fontSize: 9,
                    fontFamily: 'var(--font-sans)',
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
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
                <div
                    className="text-xs px-3 py-1 rounded-full"
                    style={{
                        color: 'rgba(181, 167, 199, 0.6)',
                        background: 'rgba(181, 167, 199, 0.08)',
                        border: '1px solid rgba(181, 167, 199, 0.1)',
                    }}
                >
                    Drag nodes to organize
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
            </div>
        </div>
    );
}
