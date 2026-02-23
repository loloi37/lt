'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This route has been replaced — the real authorization form is at /authorization/[memorialId]
// which is opened directly from the personal-confirmation and family-confirmation pages.
export default function LegalMemorialAuthorizationRedirect() {
    const router = useRouter();
<<<<<<< HEAD
    useEffect(() => {
        router.replace('/choice-pricing');
    }, [router]);
    return null;
=======
    const searchParams = useSearchParams();
    const memorialId = searchParams.get('memorialId');

    // Form state - just the essential fields first
    const [formData, setFormData] = useState({
        // Section 1: Creator
        creator_full_name: '',
        creator_email: '',
        creator_phone: '',
        relationship_to_deceased: '',

        // Section 2: Deceased
        deceased_full_name: '',
        deceased_dob: '',
        deceased_dod: '',

        // Section 3-5: Checkboxes
        no_conflicting_claims: false,
        accuracy_confirmed: false,
        copyright_confirmed: false,
        privacy_confirmed: false,
        indemnification_accepted: false,

        // Section 8: Signature
        electronic_signature: '',
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            // Get user ID from localStorage (your current auth pattern)
            const userId = localStorage.getItem('user-id');

            // Prepare data for database
            const authData = {
                user_id: userId,
                memorial_id: memorialId,
                ...formData,
                signature_date: new Date().toISOString(),
                signature_ip_address: null, // Can add IP detection later
                signature_user_agent: navigator.userAgent,
                status: 'pending',
            };

            // Insert into Supabase
            const { data, error: insertError } = await supabase
                .from('memorial_authorizations')
                .insert([authData])
                .select()
                .single();

            if (insertError) throw insertError;

            // Success! Redirect back to create page
            alert('Authorization submitted successfully!');
            router.push(memorialId ? `/create?id=${memorialId}` : '/create');

        } catch (err: any) {
            console.error('Error submitting authorization:', err);
            setError(err.message || 'Failed to submit authorization');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-ivory py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl text-charcoal mb-8">
                    Memorial Authorization Form
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Your Information */}
                    <div className="bg-white rounded-xl border border-sand/30 p-6">
                        <h2 className="text-2xl font-semibold text-charcoal mb-4">
                            1. Your Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Full Legal Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.creator_full_name}
                                    onChange={(e) => setFormData({ ...formData, creator_full_name: e.target.value })}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.creator_email}
                                    onChange={(e) => setFormData({ ...formData, creator_email: e.target.value })}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Relationship to Deceased *
                                </label>
                                <select
                                    required
                                    value={formData.relationship_to_deceased}
                                    onChange={(e) => setFormData({ ...formData, relationship_to_deceased: e.target.value })}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl"
                                >
                                    <option value="">Select...</option>
                                    <option value="spouse">Spouse</option>
                                    <option value="child">Child</option>
                                    <option value="parent">Parent</option>
                                    <option value="sibling">Sibling</option>
                                    <option value="executor">Estate Executor</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Deceased Information */}
                    <div className="bg-white rounded-xl border border-sand/30 p-6">
                        <h2 className="text-2xl font-semibold text-charcoal mb-4">
                            2. Deceased Person Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-charcoal mb-2">
                                    Full Legal Name of Deceased *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.deceased_full_name}
                                    onChange={(e) => setFormData({ ...formData, deceased_full_name: e.target.value })}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">
                                        Date of Birth *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.deceased_dob}
                                        onChange={(e) => setFormData({ ...formData, deceased_dob: e.target.value })}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-charcoal mb-2">
                                        Date of Death
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.deceased_dod}
                                        onChange={(e) => setFormData({ ...formData, deceased_dod: e.target.value })}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Critical Checkboxes */}
                    <div className="bg-terracotta/10 rounded-xl border-2 border-terracotta/30 p-6">
                        <h2 className="text-2xl font-semibold text-charcoal mb-4">
                            Legal Acknowledgments *
                        </h2>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    checked={formData.indemnification_accepted}
                                    onChange={(e) => setFormData({ ...formData, indemnification_accepted: e.target.checked })}
                                    className="mt-1 w-5 h-5"
                                />
                                <span className="text-sm text-charcoal">
                                    <strong>I accept the indemnification agreement</strong> and agree to hold Legacy Vault harmless from any family disputes or legal claims.
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    checked={formData.accuracy_confirmed}
                                    onChange={(e) => setFormData({ ...formData, accuracy_confirmed: e.target.checked })}
                                    className="mt-1 w-5 h-5"
                                />
                                <span className="text-sm text-charcoal">
                                    I confirm all information is accurate to the best of my knowledge.
                                </span>
                            </label>

                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    required
                                    checked={formData.copyright_confirmed}
                                    onChange={(e) => setFormData({ ...formData, copyright_confirmed: e.target.checked })}
                                    className="mt-1 w-5 h-5"
                                />
                                <span className="text-sm text-charcoal">
                                    I own or have permission for all content I will upload.
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Section 8: Electronic Signature */}
                    <div className="bg-white rounded-xl border border-sand/30 p-6">
                        <h2 className="text-2xl font-semibold text-charcoal mb-4">
                            Electronic Signature *
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-2">
                                Type your full legal name to sign
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.electronic_signature}
                                onChange={(e) => setFormData({ ...formData, electronic_signature: e.target.value })}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl font-serif text-lg"
                            />
                            <p className="text-xs text-charcoal/60 mt-2">
                                By typing your name, you agree this is legally binding under the E-SIGN Act.
                            </p>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-paper w-full py-4 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg font-semibold text-lg disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Authorization'}
                    </button>
                </form>
            </div>
        </div>
    );
>>>>>>> origin/claude/pastel-color-palette-avZIb
}
