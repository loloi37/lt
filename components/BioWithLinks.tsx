'use client';

import Link from 'next/link';

interface Relation {
    to_memorial_id: string;
    target_name?: string;
    relationship_type: string;
}

interface BioWithLinksProps {
    text: string;
    relations: Relation[];
    className?: string;
}

export default function BioWithLinks({ text, relations, className = '' }: BioWithLinksProps) {
    if (!text) return null;
    if (!relations || relations.length === 0) {
        return <p className={`whitespace-pre-wrap ${className}`}>{text}</p>;
    }

    // 1. Sort relations by name length (longest first) to avoid partial matches
    // e.g. Match "Michael Jordan" before matching just "Michael"
    const sortedRelations = [...relations].sort((a, b) =>
        (b.target_name?.length || 0) - (a.target_name?.length || 0)
    );

    // 2. Create a regex pattern from names
    // We use \b to ensure we match whole words only (avoid matching "Rob" inside "Robert")
    const escapedNames = sortedRelations
        .map(r => r.target_name?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // Escape regex chars
        .filter(Boolean)
        .join('|');

    if (!escapedNames) {
        return <p className={`whitespace-pre-wrap ${className}`}>{text}</p>;
    }

    const regex = new RegExp(`\\b(${escapedNames})\\b`, 'g');

    // 3. Split text and replace
    // Using split with capturing group () keeps the separators (the names) in the array
    const parts = text.split(regex);

    return (
        <p className={`whitespace-pre-wrap ${className}`}>
            {parts.map((part, i) => {
                // Check if this part matches a relation name
                const match = sortedRelations.find(r => r.target_name === part);

                if (match) {
                    return (
                        <Link
                            key={i}
                            href={`/person/${match.to_memorial_id}`}
                            className="text-sage font-medium hover:underline hover:text-sage/80 transition-colors"
                            title={`View ${match.relationship_type}`}
                        >
                            {part}
                        </Link>
                    );
                }

                // Return normal text
                return <span key={i}>{part}</span>;
            })}
        </p>
    );
}