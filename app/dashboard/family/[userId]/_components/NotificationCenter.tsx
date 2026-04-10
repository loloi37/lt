import React from 'react';
import { BellDot, Shield, User, Check, X, Loader2 } from 'lucide-react';

interface PendingCreationRequest {
    id: string;
    sourceMemorialId: string;
    sourceMemorialName: string;
    requesterEmail: string;
    proposedName: string | null;
    requestMessage: string;
    createdAt: string;
}

interface PendingAccessRequest {
    id: string;
    memorialId: string;
    memorialName: string;
    requesterEmail: string;
    requestedRole: string;
    requestMessage: string;
    createdAt: string;
}

interface NotificationCenterProps {
    pendingCreationRequests: PendingCreationRequest[];
    pendingAccessRequests: PendingAccessRequest[];
    onCreationDecision: (memorialId: string, requestId: string, decision: 'approved' | 'rejected') => Promise<void>;
    onAccessDecision: (memorialId: string, requestId: string, decision: 'approved' | 'denied') => Promise<void>;
    processingId: string | null;
}

export default function NotificationCenter({
    pendingCreationRequests,
    pendingAccessRequests,
    onCreationDecision,
    onAccessDecision,
    processingId
}: NotificationCenterProps) {
    const totalRequests = pendingCreationRequests.length + pendingAccessRequests.length;

    if (totalRequests === 0) return null;

    return (
        <section className="bg-white border border-warm-border/30 rounded-xl p-8 mb-12 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-olive/10 flex items-center justify-center">
                        <BellDot size={20} className="text-olive" />
                    </div>
                    <div>
                        <h2 className="font-serif text-2xl text-warm-dark">Legacy Stewardship</h2>
                        <p className="text-sm text-warm-muted font-sans italic">Pending requests requiring your attention</p>
                    </div>
                </div>
                <div className="px-3 py-1 bg-warm-brown/10 border border-warm-brown/20 rounded-full text-warm-brown text-xs font-sans font-semibold">
                    {totalRequests} Urgent
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Creation Requests */}
                {pendingCreationRequests.map((request) => (
                    <div key={request.id} className="relative group p-6 rounded-2xl border border-warm-border/20 bg-surface-low/30 hover:bg-white hover:border-warm-border/40 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-warm-outline mb-3 font-semibold">
                                    <Shield size={12} />
                                    New Memorial Request
                                </div>
                                <h3 className="font-serif text-lg text-warm-dark group-hover:text-black transition-colors">
                                    {request.proposedName || 'Unnamed Memorial'}
                                </h3>
                                <p className="text-sm text-warm-muted mt-1 font-sans">
                                    From <span className="text-warm-dark font-medium">{request.requesterEmail}</span>
                                </p>
                            </div>
                        </div>

                        {request.requestMessage && (
                            <div className="mt-4 p-3 bg-white/50 rounded-xl border border-warm-border/10">
                                <p className="text-sm text-warm-muted font-sans italic leading-relaxed">
                                    &ldquo;{request.requestMessage}&rdquo;
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex items-center gap-3">
                            <button
                                onClick={() => onCreationDecision(request.sourceMemorialId, request.id, 'approved')}
                                disabled={!!processingId}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-warm-dark text-white rounded-lg text-sm font-sans font-semibold hover:bg-black transition-colors disabled:opacity-50"
                            >
                                {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Approve
                            </button>
                            <button
                                onClick={() => onCreationDecision(request.sourceMemorialId, request.id, 'rejected')}
                                disabled={!!processingId}
                                className="px-4 py-2.5 bg-surface-high text-warm-muted rounded-lg text-sm font-sans hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Access Requests */}
                {pendingAccessRequests.map((request) => (
                    <div key={request.id} className="relative group p-6 rounded-2xl border border-warm-border/20 bg-surface-low/30 hover:bg-white hover:border-warm-border/40 transition-all">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-warm-outline mb-3 font-semibold">
                                    <User size={12} />
                                    Access Request
                                </div>
                                <h3 className="font-serif text-lg text-warm-dark group-hover:text-black transition-colors">
                                    {request.requesterEmail}
                                </h3>
                                <p className="text-sm text-warm-muted mt-1 font-sans">
                                    Wants <span className="text-olive font-medium px-1.5 py-0.5 bg-olive/5 rounded-md">{request.requestedRole}</span> access to {request.memorialName}
                                </p>
                            </div>
                        </div>

                        {request.requestMessage && (
                            <div className="mt-4 p-3 bg-white/50 rounded-xl border border-warm-border/10">
                                <p className="text-sm text-warm-muted font-sans italic leading-relaxed">
                                    &ldquo;{request.requestMessage}&rdquo;
                                </p>
                            </div>
                        )}

                        <div className="mt-6 flex items-center gap-3">
                            <button
                                onClick={() => onAccessDecision(request.memorialId, request.id, 'approved')}
                                disabled={!!processingId}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-warm-dark text-white rounded-lg text-sm font-sans font-semibold hover:bg-black transition-colors disabled:opacity-50"
                            >
                                {processingId === request.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Grant Access
                            </button>
                            <button
                                onClick={() => onAccessDecision(request.memorialId, request.id, 'denied')}
                                disabled={!!processingId}
                                className="px-4 py-2.5 bg-surface-high text-warm-muted rounded-lg text-sm font-sans hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
