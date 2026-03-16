'use client';

import { useState } from 'react';
import { Key, Users, FileText, Shield, Plus, X, AlertTriangle, Check } from 'lucide-react';
import { KEY_BACKUP_METHODS, type KeyBackupMethod } from '@/lib/crypto/encryptionService';

interface RecoveryContact {
    id: string;
    name: string;
    email: string;
    relationship: string;
    status: 'pending' | 'confirmed' | 'delivered';
}

interface SocialRecoveryProps {
    memorialId: string;
    existingContacts?: RecoveryContact[];
    onSave?: (contacts: RecoveryContact[]) => void;
}

export default function SocialRecovery({
    memorialId,
    existingContacts = [],
    onSave,
}: SocialRecoveryProps) {
    const [contacts, setContacts] = useState<RecoveryContact[]>(existingContacts);
    const [selectedMethod, setSelectedMethod] = useState<KeyBackupMethod['type']>('family_recovery');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newContact, setNewContact] = useState({ name: '', email: '', relationship: '' });

    const handleAddContact = () => {
        if (!newContact.name || !newContact.email) return;
        const contact: RecoveryContact = {
            id: `rc_${Date.now()}`,
            name: newContact.name,
            email: newContact.email,
            relationship: newContact.relationship,
            status: 'pending',
        };
        const updated = [...contacts, contact];
        setContacts(updated);
        setNewContact({ name: '', email: '', relationship: '' });
        setShowAddForm(false);
        onSave?.(updated);
    };

    const handleRemoveContact = (id: string) => {
        const updated = contacts.filter(c => c.id !== id);
        setContacts(updated);
        onSave?.(updated);
    };

    return (
        <div className="dark-card p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Key size={16} className="text-purple-400" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-vault-text font-sans">Social Recovery</h3>
                    <p className="text-xs text-vault-muted font-sans">Protect access with trusted contacts</p>
                </div>
            </div>

            {/* How it works */}
            <div className="bg-vault-dark/30 rounded-lg p-4 mb-5">
                <p className="text-xs text-vault-muted font-sans leading-relaxed">
                    Your memorial is encrypted with a unique key. To prevent permanent lockout,
                    the key is split among your trusted contacts using Shamir&apos;s Secret Sharing.
                    Any <strong className="text-vault-text">3 of 5</strong> contacts can recover access.
                </p>
            </div>

            {/* Backup method selector */}
            <div className="mb-5">
                <p className="text-xs text-vault-muted font-sans mb-3">Key backup method</p>
                <div className="space-y-2">
                    {KEY_BACKUP_METHODS.map(method => {
                        const icons = { family_recovery: Users, paper_backup: FileText, lawyer_executor: Shield };
                        const Icon = icons[method.type];
                        return (
                            <button
                                key={method.type}
                                onClick={() => setSelectedMethod(method.type)}
                                className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-colors text-left ${
                                    selectedMethod === method.type
                                        ? 'border-purple-500/40 bg-purple-500/5'
                                        : 'border-vault-border hover:border-vault-muted/30'
                                }`}
                            >
                                <Icon size={16} className={selectedMethod === method.type ? 'text-purple-400 mt-0.5' : 'text-vault-muted mt-0.5'} />
                                <div>
                                    <p className="text-sm font-sans font-medium text-vault-text">{method.label}</p>
                                    <p className="text-xs text-vault-muted font-sans">{method.description}</p>
                                </div>
                                {selectedMethod === method.type && (
                                    <Check size={14} className="text-purple-400 ml-auto mt-0.5" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Recovery contacts */}
            {selectedMethod === 'family_recovery' && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-vault-muted font-sans">
                            Recovery contacts ({contacts.length}/5)
                        </p>
                        {contacts.length < 5 && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-1 text-xs font-sans text-purple-400 hover:text-purple-300"
                            >
                                <Plus size={12} /> Add contact
                            </button>
                        )}
                    </div>

                    {contacts.length === 0 && !showAddForm && (
                        <div className="text-center py-6 border border-dashed border-vault-border rounded-lg">
                            <Users size={24} className="text-vault-muted mx-auto mb-2" />
                            <p className="text-sm text-vault-muted font-sans">No recovery contacts yet</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="text-xs text-purple-400 font-sans mt-1 hover:text-purple-300"
                            >
                                Add your first contact
                            </button>
                        </div>
                    )}

                    {contacts.map(contact => (
                        <div key={contact.id} className="flex items-center justify-between bg-vault-dark/30 rounded-lg p-3 mb-2">
                            <div>
                                <p className="text-sm font-sans text-vault-text">{contact.name}</p>
                                <p className="text-xs text-vault-muted font-sans">{contact.email} · {contact.relationship}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${
                                    contact.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                                    contact.status === 'delivered' ? 'bg-blue-500/10 text-blue-400' :
                                    'bg-amber-500/10 text-amber-400'
                                }`}>
                                    {contact.status}
                                </span>
                                <button onClick={() => handleRemoveContact(contact.id)} className="text-vault-muted hover:text-red-400">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {showAddForm && (
                        <div className="bg-vault-dark/50 rounded-lg p-4 mt-2 space-y-3">
                            <input
                                type="text"
                                placeholder="Full name"
                                value={newContact.name}
                                onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 bg-vault-dark border border-vault-border rounded-lg text-sm font-sans text-vault-text placeholder:text-vault-muted/50 focus:outline-none focus:border-purple-500/40"
                            />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={newContact.email}
                                onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full px-3 py-2 bg-vault-dark border border-vault-border rounded-lg text-sm font-sans text-vault-text placeholder:text-vault-muted/50 focus:outline-none focus:border-purple-500/40"
                            />
                            <input
                                type="text"
                                placeholder="Relationship (e.g. Sister, Attorney)"
                                value={newContact.relationship}
                                onChange={e => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                                className="w-full px-3 py-2 bg-vault-dark border border-vault-border rounded-lg text-sm font-sans text-vault-text placeholder:text-vault-muted/50 focus:outline-none focus:border-purple-500/40"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddContact}
                                    className="px-4 py-2 bg-purple-500/20 text-purple-300 text-xs font-sans font-medium rounded-lg hover:bg-purple-500/30"
                                >
                                    Add Contact
                                </button>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 text-vault-muted text-xs font-sans rounded-lg hover:bg-vault-dark"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {contacts.length > 0 && contacts.length < 3 && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                            <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-300 font-sans">
                                Add at least {3 - contacts.length} more contact{3 - contacts.length !== 1 ? 's' : ''} to
                                enable recovery. 3 of 5 contacts are needed to reconstruct the key.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
