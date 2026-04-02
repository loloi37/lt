// app/admin/[id]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    ArrowLeft, Save, Eye, Upload, FileText, Image,
    Film, Music, Settings, Sparkles,
    MessageCircle, Trash2, Download, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ConciergeProject, ConciergeFile, ConciergeNote } from '@/types/concierge';

const STATUS_OPTIONS = [
    { value: 'requested', label: 'Requested' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'finalized', label: 'Finalized' }
];

const STEP_NAMES = ['Basic Info', 'Childhood', 'Career', 'Relationships', 'Personality', 'Life Story', 'Memories', 'Photos', 'Videos'];

export default function AdminProjectEditor({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const projectId = unwrappedParams.id;

    const [activeTab, setActiveTab] = useState<'build' | 'materials' | 'preview'>('build');
    const [project, setProject] = useState<ConciergeProject | null>(null);
    const [files, setFiles] = useState<ConciergeFile[]>([]);
    const [notes, setNotes] = useState<ConciergeNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Build Memorial State
    const [memorialData, setMemorialData] = useState<any>({});
    const [currentStep, setCurrentStep] = useState(1);

    // Settings State
    const [showSettings, setShowSettings] = useState(false);
    const [zoomLink, setZoomLink] = useState('');
    const [projectStatus, setProjectStatus] = useState('requested');
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        loadAll();
    }, [projectId]);

    const loadAll = async () => {
        setLoading(true);
        try {
            // Load project
            const { data: projectData, error: projectError } = await supabase
                .from('concierge_projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (projectError) throw projectError;

            setProject(projectData);
            setMemorialData(projectData.memorial_data || {});
            setZoomLink(projectData.zoom_link || '');
            setProjectStatus(projectData.status);

            // Load files
            const { data: filesData } = await supabase
                .from('concierge_files')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            setFiles(filesData || []);

            // Load notes
            const { data: notesData } = await supabase
                .from('concierge_notes')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            setNotes(notesData || []);

        } catch (err) {
            console.error('Error loading:', err);
            alert('Failed to load project');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('concierge_projects')
                .update({
                    memorial_data: memorialData,
                    status: projectStatus,
                    zoom_link: zoomLink
                })
                .eq('id', projectId);

            if (error) throw error;
            alert('✅ Project saved successfully!');
        } catch (err) {
            console.error('Error saving:', err);
            alert('❌ Failed to save project');
        } finally {
            setSaving(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const { error } = await supabase
                .from('concierge_notes')
                .insert([{
                    project_id: projectId,
                    note_type: 'text',
                    content: newMessage.trim(),
                    from_user: false // from admin
                }]);

            if (error) throw error;
            setNewMessage('');
            loadAll();
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message');
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <Image size={20} className="text-blue-600" />;
        if (mimeType.startsWith('video/')) return <Film size={20} className="text-purple-600" />;
        if (mimeType.startsWith('audio/')) return <Music size={20} className="text-olive" />;
        return <FileText size={20} className="text-slate-600" />;
    };

    if (loading || !project) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="animate-spin mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{project.person_full_name || 'New Project'}</h1>
                                <p className="text-sm text-slate-600">Requested by {project.name} • {project.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2"
                            >
                                <Settings size={18} />
                                Settings
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save All
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                        <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4">Project Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Project Status</label>
                                    <select
                                        value={projectStatus}
                                        onChange={(e) => setProjectStatus(e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {STATUS_OPTIONS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Zoom Meeting Link</label>
                                    <input
                                        type="url"
                                        value={zoomLink}
                                        onChange={(e) => setZoomLink(e.target.value)}
                                        placeholder="https://zoom.us/j/..."
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mt-4 border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('build')}
                            className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === 'build' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} />
                                Build Memorial
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('materials')}
                            className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === 'materials' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Upload size={18} />
                                User Materials ({files.length})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`px-6 py-3 font-medium transition-all border-b-2 ${activeTab === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Eye size={18} />
                                User View
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* BUILD MEMORIAL TAB */}
                {activeTab === 'build' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Build Memorial Content</h2>
                            <p className="text-slate-600 mb-6">Create the memorial step by step, like the regular wizard at /create</p>

                            {/* Step Navigator */}
                            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(step => (
                                    <button
                                        key={step}
                                        onClick={() => setCurrentStep(step)}
                                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${currentStep === step ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        Step {step}
                                    </button>
                                ))}
                            </div>

                            {/* Step Content */}
                            <div className="p-8 bg-slate-50 rounded-xl">
                                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                                    Step {currentStep}: {STEP_NAMES[currentStep - 1]}
                                </h3>

                                {currentStep === 1 && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={memorialData.step1?.fullName || ''}
                                                onChange={(e) => setMemorialData({
                                                    ...memorialData,
                                                    step1: { ...memorialData.step1, fullName: e.target.value }
                                                })}
                                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Eleanor Marie Thompson"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Birth Date</label>
                                                <input
                                                    type="date"
                                                    value={memorialData.step1?.birthDate || ''}
                                                    onChange={(e) => setMemorialData({
                                                        ...memorialData,
                                                        step1: { ...memorialData.step1, birthDate: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Death Date</label>
                                                <input
                                                    type="date"
                                                    value={memorialData.step1?.deathDate || ''}
                                                    onChange={(e) => setMemorialData({
                                                        ...memorialData,
                                                        step1: { ...memorialData.step1, deathDate: e.target.value }
                                                    })}
                                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 6 && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Biography</label>
                                        <textarea
                                            value={memorialData.step6?.biography || ''}
                                            onChange={(e) => setMemorialData({
                                                ...memorialData,
                                                step6: { ...memorialData.step6, biography: e.target.value }
                                            })}
                                            rows={12}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                            placeholder="Write the life story..."
                                        />
                                    </div>
                                )}

                                {![1, 6].includes(currentStep) && (
                                    <div className="text-center py-12 text-slate-500">
                                        <p className="text-lg mb-2">💡 Step {currentStep} Editor</p>
                                        <p className="text-sm">Copy the form structure from your existing wizard components:</p>
                                        <p className="text-sm text-blue-600 mt-2">components/wizard/Step{currentStep}*.tsx</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Preview Update */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Update User Preview</h3>
                            <p className="text-sm text-slate-600 mb-4">This controls what the user sees in their space</p>
                            <div className="space-y-3">
                                <textarea
                                    placeholder='{"full_name": "...", "biography_intro": "...", "structure": [...]}'
                                    rows={6}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                                    defaultValue={JSON.stringify(project.content_preview, null, 2)}
                                />
                                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
                                    Update Preview
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* USER MATERIALS TAB */}
                {activeTab === 'materials' && (
                    <div className="space-y-6">
                        {/* Files */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Files from User</h2>
                                <span className="text-sm text-slate-600">{files.length} total</span>
                            </div>

                            {files.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">
                                    <Upload size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p>No files gathered yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {files.map(file => (
                                        <div key={file.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">
                                            {getFileIcon(file.file_type)}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{file.file_name}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                    <span>{formatFileSize(file.file_size)}</span>
                                                    <span>•</span>
                                                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                                                    {file.user_note && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="italic">"{file.user_note}"</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <a
                                                href={file.public_url || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-slate-200 rounded-lg transition-all"
                                            >
                                                <Download size={18} className="text-slate-600" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <MessageCircle size={20} />
                                Messages
                            </h3>

                            <div className="space-y-3 mb-4">
                                {notes.map(note => (
                                    <div
                                        key={note.id}
                                        className={`p-4 rounded-lg ${note.from_user ? 'bg-blue-50 border border-blue-200' : 'bg-surface-high border border-warm-border/30'}`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className="text-xs font-medium text-slate-600">
                                                {note.from_user ? 'User' : 'Admin (You)'}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {new Date(note.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-slate-900">{note.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Send a message to the user..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* USER VIEW TAB */}
                {activeTab === 'preview' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">User View Preview</h2>
                            <p className="text-slate-600">This simulates /concierge/{projectId}</p>
                        </div>

                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8">
                            <div className="max-w-3xl mx-auto space-y-8">
                                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                                        {projectStatus === 'finalized' ? 'Your archive is complete' : 'Your archive is being created'}
                                    </h3>
                                    <p className="text-slate-700">You can close this page anytime — we'll handle everything.</p>
                                </div>

                                {project.content_preview?.structure && (
                                    <div>
                                        <h4 className="font-semibold text-slate-900 mb-4">What We're Building</h4>
                                        {project.content_preview.structure.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg mb-2">
                                                <div className={`w-2 h-2 rounded-full ${item.status === 'complete' ? 'bg-olive' :
                                                        item.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'
                                                    }`} />
                                                <span className="text-slate-700">{item.section}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center bg-slate-50">
                                    <Upload size={48} className="mx-auto text-slate-400 mb-4" />
                                    <p className="text-slate-600">Drop files here or click to browse</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}