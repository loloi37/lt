'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Shield, Check, Loader2, AlertCircle } from 'lucide-react';

export default function WitnessAcceptancePage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const invitationId = unwrappedParams.id;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [invitation, setInvitation] = useState<any>(null);
    const [memorialName, setMemorialName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [accepted, setAccepted] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchInvitationDetails();
    }, [invitationId]);

    const fetchInvitationDetails = async () => {
        try {
            // 1. Fetch Invitation
            const { data: inv, error: invError } = await supabase
                .from('witness_invitations')
                .select('*')
                .eq('id', invitationId)
                .single();

            if (invError || !inv) throw new Error('Invitation not found or expired.');
            if (inv.status !== 'pending') throw new Error('This invitation has already been used.');

            setInvitation(inv);

            // 2. Fetch Memorial Name
            const { data: mem, error: memError } = await supabase
                .from('memorials')
                .select('step1')
                .eq('id', inv.memorial_id)
                .single();

            if (memError) throw new Error('Associated memorial not found.');
            setMemorialName(mem.step1?.fullName || 'a loved one');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptance = async () => {
        if (!accepted) return;
        setProcessing(true);

        try {
            // 1. Update invitation status
            const { error: updateError } = await supabase
                .from('witness_invitations')
                .update({ status: 'accepted' })
                .eq('id', invitationId);

            if (updateError) throw updateError;

            // 2. Store the invitation ID in localStorage 
            // This allows us to link the user to the memorial in the next step
            localStorage.setItem('pending-invitation-id', invitationId);

            // 3. Redirect to the main ritual/create page
            // The creation page will detect this localStorage item and grant access
            router.push(`/create?id=${invitation.memorial_id}&role=witness`);

        } catch (err: any) {
            alert('Error accepting invitation: ' + err.message);
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <Loader2 className="animate-spin text-sage" size={32} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <AlertCircle className="mx-auto text-terracotta mb-4" size={48} />
                    <h1 className="font-serif text-2xl mb-2 text-charcoal">Invitation Unavailable</h1>
                    <p className="text-charcoal/60 mb-6">{error}</p>
                    <button onClick={() => router.push('/')} className="text-sage font-medium underline">Return to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-sand/30">
                <div className="p-8 md:p-12">
                    <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Shield size={32} className="text-sage" />
                    </div>

                    <h1 className="font-serif text-3xl text-center text-charcoal mb-4">
                        Bearer of Witness
                    </h1>

                    <div className="prose prose-sm text-charcoal/80 space-y-4 mb-10 text-center leading-relaxed">
                        <p className="text-base">
                            <strong>{invitation.inviter_name}</strong> has invited you to contribute to the permanent historical archive of
                            <br />
                            <span className="text-xl font-serif text-charcoal block mt-2">
                                {memorialName}
                            </span>
                        </p>

                        <p className="italic bg-sand/5 p-4 rounded-xl border border-sand/20 mt-6">
                            "To bear witness is to preserve the truth of a life. It is an act of love that defies time. By entering this space, you agree to handle these memories with the dignity and respect they deserve."
                        </p>
                    </div>

                    <label className="flex items-start gap-4 p-4 bg-sage/5 rounded-xl border border-sage/20 cursor-pointer group transition-all hover:bg-sage/10 mb-8">
                        <div className="relative flex-shrink-0 mt-1">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={(e) => setAccepted(e.target.checked)}
                                className="w-6 h-6 rounded border-sand/40 text-sage focus:ring-sage cursor-pointer"
                            />
                        </div>
                        <span className="text-sm text-charcoal leading-tight">
                            I accept the responsibility of contributing to this archive in a truthful and respectful manner.
                        </span>
                    </label>

                    <button
                        onClick={handleAcceptance}
                        disabled={!accepted || processing}
                        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${accepted && !processing
                                ? 'bg-charcoal text-ivory shadow-lg hover:bg-charcoal/90'
                                : 'bg-sand/30 text-charcoal/40 cursor-not-allowed'
                            }`}
                    >
                        {processing ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Check size={20} />
                                I Accept
                            </>
                        )}
                    </button>
                </div>

                <div className="bg-sand/10 p-4 text-center border-t border-sand/20">
                    <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-medium">
                        Authorized Historical Access • Legacy Vault
                    </p>
                </div>
            </div>
        </div>
    );
}