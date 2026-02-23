'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, Position, MarkerType, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { supabase } from '@/lib/supabase';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Custom Node Style (The "Box")
const nodeStyle = {
    background: '#fff',
    border: '1px solid #e8d8cc', // Sand color
    borderRadius: '12px',
    padding: '10px',
    width: 180,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontFamily: 'var(--font-sans)',
    textAlign: 'center' as const,
};

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
            // We need relations where EITHER side belongs to one of our memorials
            // Since RLS restricts to owner, a simple select * works fine for "my" relations
            const { data: relations } = await supabase
                .from('memorial_relations')
                .select('*');

            if (!people) return;

            // 3. Transform into Graph Nodes
            // Simple layout logic: Distribute in a grid for now
            // (A real genealogy layout algorithm is complex, this is a starting point)
            const graphNodes: Node[] = people.map((person, index) => ({
                id: person.id,
                position: { x: (index % 4) * 250, y: Math.floor(index / 4) * 150 }, // Simple grid layout
                data: {
                    label: (
                        <div className="flex flex-col items-center">
                            {person.profile_photo_url ? (
                                <img src={person.profile_photo_url} alt="" className="w-12 h-12 rounded-full object-cover mb-2 border-2 border-sage/20" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-sage/10 mb-2" />
                            )}
                            <div className="font-semibold text-charcoal text-sm">{person.full_name}</div>
                            <div className="text-xs text-charcoal/50">{person.birth_date?.substring(0, 4) || '????'}</div>
                        </div>
                    )
                },
                style: nodeStyle,
                sourcePosition: Position.Bottom,
                targetPosition: Position.Top,
            }));

            // 4. Transform into Graph Edges
            const graphEdges: Edge[] = (relations || []).map((rel) => ({
                id: rel.id,
                source: rel.from_memorial_id,
                target: rel.to_memorial_id,
                label: rel.relationship_type,
                type: 'smoothstep',
                animated: false,
                style: { stroke: '#89b896' }, // Sage color lines
                labelStyle: { fill: '#5a6b78', fontSize: 10 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#89b896' },
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
        <div className="h-screen flex flex-col bg-ivory">
            {/* Header */}
            <div className="flex-none bg-white border-b border-sand/30 px-6 py-4 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/family/${userId}`} className="p-2 hover:bg-sand/10 rounded-lg transition-colors">
                        <ArrowLeft size={20} className="text-charcoal/60" />
                    </Link>
                    <h1 className="font-serif text-2xl text-charcoal">Family Constellation</h1>
                </div>
                <div className="text-xs text-charcoal/40 bg-sand/10 px-3 py-1 rounded-full">
                    Drag nodes to organize
                </div>
            </div>

            {/* Graph Area */}
            <div className="flex-1 w-full h-full relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="animate-spin text-sage" size={32} />
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        fitView
                        attributionPosition="bottom-right"
                    >
                        <Background color="#e8d8cc" gap={16} />
                        <Controls showInteractive={false} />
                    </ReactFlow>
                )}
            </div>
        </div>
    );
}