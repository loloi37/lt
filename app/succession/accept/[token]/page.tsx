'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Shield, Check, Loader2, AlertCircle, Scale } from 'lucide-react';

export default function SuccessorAcceptancePage({ params }: { params: Promise<{ token: string }> }) {
    const unwrappedParams = use(params);
    const token = unwrappedParams.token;
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [successorRecord, setSuccessorRecord] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchSuccessorDetails();
    }, [token]);

    const fetchSuccessorDetails = async () => {
        try {
            const { data, error: dbError } = await supabase
                .from('user_successors')
                .select('*')
                .eq('verification_token', token)
                .single();

            if (dbError || !data) throw new Error('Stewardship invitation not found or expired.');
            if (data.status === 'accepted') throw new Error('You have already accepted this responsibility.');

            setSuccessorRecord(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        setProcessing(true);
        try {
            const { error: updateError } = await supabase
                .from('user_successors')
                .update({ status: 'accepted' })
                .eq('id', successorRecord.id);

            if (updateError) throw updateError;

            alert("Responsibility Accepted. You are now the designated Archive Steward.");
            router.push('/'); // Redirect to home or a success page

        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-ivory flex items-center justify-center">
            <Loader2 className="animate-spin text-mist" size={32} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <AlertCircle className="mx-auto text-stone mb-4" size={48} />
                <h1 className="font-serif text-2xl mb-2">Invitation Invalid</h1>
                <p className="text-charcoal/60 mb-6">{error}</p>
                <button onClick={() => router.push('/')} className="text-mist font-medium underline">Return to Home</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-sand/30">
                <div className="p-8 md:p-12">
                    <div className="w-16 h-16 bg-charcoal text-mist rounded-full flex items-center justify-center mx-auto mb-8">
                        <Shield size={32} />
                    </div>

                    <h1 className="font-serif text-3xl text-center text-charcoal mb-4">
                        Archive Stewardship
                    </h1>

                    <div className="prose prose-sm text-charcoal/80 space-y-4 mb-8 text-center leading-relaxed">
                        <p className="text-base">
                            You have been designated as the <strong>Archive Steward</strong> for a Legacy Vault account.
                        </p>
                        <p>
                            This means that in the event of the account owner's passing, you will be entrusted with the management, preservation, and control of all family archives associated with this account.
                        </p>
                        <div className="bg-sand/10 p-6 rounded-xl border border-sand/20 text-left space-y-3">
                            <h4 className="font-bold flex items-center gap-2 text-charcoal">
                                <Scale size={16} /> Your Commitment:
                            </h4>
                            <ul className="list-disc pl-5 space-y-1 text-xs">
                                <li>I accept the duty to preserve the family history with integrity.</li>
                                <li>I agree to manage archive access for future descendants.</li>
                                <li>I understand that I will become the final arbiter for family disputes.</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleAccept}
                        disabled={processing}
                        className="btn-paper w-full py-4 bg-charcoal text-ivory rounded-lg font-semibold shadow-lg hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2"
                    >
                        {processing ? <Loader2 className="animate-spin" size={20} /> : "I Accept This Responsibility"}
                    </button>

                    <p className="text-center mt-6 text-xs text-charcoal/40">
                        A confirmation has been sent to the account owner.
                    </p>
                </div>
            </div>
        </div>
    );
}