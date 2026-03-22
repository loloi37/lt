'use client';
import { useCallback } from 'react';

type FlowEvent =
    | 'invite_preview_viewed'
    | 'invite_auth_started'
    | 'invite_auth_completed'
    | 'invite_anonymous_started'
    | 'invite_anonymous_otp_sent'
    | 'invite_anonymous_verified'
    | 'invite_acceptance_viewed'
    | 'invite_accepted'
    | 'invite_declined'
    | 'invite_terminal_shown'
    | 'welcome_page_viewed'
    | 'contribution_started'
    | 'contribution_submitted'
    | 'drawer_opened'
    | 'contribution_approved'
    | 'contribution_rejected';

export function useAnalytics() {
    const track = useCallback((
        event: FlowEvent,
        properties?: Record<string, any>
    ) => {
        // Fire and forget — never block the UI
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event,
                properties: properties || {},
                timestamp: new Date().toISOString()
            })
        }).catch(() => {
            // Silently fail — analytics must
            // never break the flow
        });
    }, []);

    return { track };
}