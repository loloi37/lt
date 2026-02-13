'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { secureUpload } from '@/lib/uploadService';
import { ShieldAlert, FileText, CheckCircle, Loader2, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';

export default function SuccessionRequestPage() {
    const [email, setEmail] = useState('');
    const [files, setFiles] = useState<{ deathCert: File | null, idProof: File | null }>({ deathCert: null, idProof: null });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    const deathCertRef = useRef<HTMLInputElement>(null);
    const idProofRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!files.deathCert || !files.idProof) {
            alert("Please upload both required documents.");
            return;
        }
        setSubmitting(true);

        try {
            // 1. Verify this email is a designated steward
            const { data: steward, error: stewardError } = await supabase
                .from('user_successors')
                .select('id')
                .eq('successor_email', email)
                .eq('status', 'accepted')
                .single();

            if (stewardError || !steward) {
                throw new Error("We could not find an active stewardship associated with this email.");
            }

            // 2. Upload Documents
            const deathCertRes = await secureUpload(files.deathCert, 'legal-documents', `activations/${steward.id}/death_cert_${Date.now()}`);
            const idProofRes = await secureUpload(files.idProof, 'legal-documents', `activations/${steward.id}/id_proof_${Date.now()}`);

            if (!deathCertRes.success || !idProofRes.success) throw new Error("File upload failed.");

            // 3. Create Activation Request
            const { error: insertError } = await supabase
                .from('succession_activations')
                .insert([{
                    successor_id: steward.id,
                    death_certificate_url: deathCertRes.url,
                    id_proof_url: idProofRes.url,
                    status: 'under_review'
                }]);

            if (insertError) throw insertError;

            setSubmitted(true);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
                <div className="max-w-md bg-white p-10 rounded-2xl shadow-xl border border-sand/30">
                    <CheckCircle className="mx-auto text-sage mb-6" size={64} />
                    <h1 className="font-serif text-3xl mb-4">Request Received</h1>
                    <p className="text-charcoal/70 mb-8">
                        The verification process has begun. Our legal team will review the documents within 48 hours.
                        <br /><br />
                        By law, a <strong>30-day notice period</strong> will now follow to allow for any family contestations. You will receive an email once the transfer is complete.
                    </p>
                    <Link href="/" className="bg-charcoal text-ivory px-8 py-3 rounded-xl font-medium block">Return to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory py-20 px-6">
            <div className="max-w-2xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal mb-8 transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-sand/30">
                    <div className="p-8 bg-terracotta/10 border-b border-terracotta/20 flex items-center gap-4">
                        <ShieldAlert className="text-terracotta" size={32} />
                        <div>
                            <h1 className="font-serif text-2xl text-charcoal">Account Succession Request</h1>
                            <p className="text-terracotta/70 text-sm">Formal activation of Stewardship</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <section>
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-4">1. Identification</h2>
                            <label className="block text-xs font-medium text-charcoal/60 mb-2">Your Steward Email Address</label>
                            <input
                                required
                                type="email"
                                className="w-full p-3 rounded-xl border border-sand/30 focus:ring-sage"
                                placeholder="The email where you received the invitation"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-sm font-bold text-charcoal uppercase tracking-widest mb-4">2. Legal Documentation</h2>

                            {/* Death Certificate */}
                            <div className="p-4 border-2 border-dashed border-sand/40 rounded-xl">
                                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <FileText size={16} className="text-charcoal/40" />
                                    Official Death Certificate
                                </p>
                                <input
                                    type="file"
                                    ref={deathCertRef}
                                    className="hidden"
                                    onChange={(e) => setFiles({ ...files, deathCert: e.target.files?.[0] || null })}
                                />
                                <button
                                    type="button"
                                    onClick={() => deathCertRef.current?.click()}
                                    className={`w-full py-3 rounded-lg text-sm transition-all ${files.deathCert ? 'bg-sage/10 text-sage' : 'bg-sand/10 text-charcoal/60 hover:bg-sand/20'}`}
                                >
                                    {files.deathCert ? `Selected: ${files.deathCert.name}` : "Upload Certificate (PDF/JPG)"}
                                </button>
                            </div>

                            {/* ID Proof */}
                            <div className="p-4 border-2 border-dashed border-sand/40 rounded-xl">
                                <p className="text-sm font-medium mb-3 flex items-center gap-2">
                                    <User size={16} className="text-charcoal/40" />
                                    Your Government Photo ID
                                </p>
                                <input
                                    type="file"
                                    ref={idProofRef}
                                    className="hidden"
                                    onChange={(e) => setFiles({ ...files, idProof: e.target.files?.[0] || null })}
                                />
                                <button
                                    type="button"
                                    onClick={() => idProofRef.current?.click()}
                                    className={`w-full py-3 rounded-lg text-sm transition-all ${files.idProof ? 'bg-sage/10 text-sage' : 'bg-sand/10 text-charcoal/60 hover:bg-sand/20'}`}
                                >
                                    {files.idProof ? `Selected: ${files.idProof.name}` : "Upload ID Proof (PDF/JPG)"}
                                </button>
                            </div>
                        </section>

                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full py-4 bg-charcoal text-ivory rounded-xl font-semibold shadow-lg hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : "Submit Formal Request"}
                        </button>

                        <p className="text-[10px] text-center text-charcoal/40 uppercase tracking-tighter">
                            Legal Verification Process • 30 Day Statutory Wait Period Apply
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}