'use client';

// components/NotificationCenter.tsx
//
// Bell icon + dropdown that surfaces:
//   - Pending witness contributions awaiting review
//   - Pending access requests on memorials the user owns
//   - Pending creation requests from co-guardians
//   - Recent activity from any memorial the user can see
//
// Data is fetched from /api/notifications, which is server-authenticated and
// always derives the user from the session cookie. The badge count is the
// number of pending items requiring action — recent activity does not bump it.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, Inbox, Loader2, MessageSquareText, Sparkles, UserPlus } from 'lucide-react';

interface PendingItem {
  id: string;
  type: 'pending_contribution' | 'pending_access_request' | 'pending_creation_request';
  title: string;
  body: string;
  href: string;
  memorialId: string;
  memorialName: string;
  createdAt: string;
}

interface ActivityItem {
  id: string;
  action: string;
  summary: string;
  actorEmail: string | null;
  subjectEmail: string | null;
  memorialId: string;
  memorialName: string;
  createdAt: string;
}

interface NotificationsResponse {
  badgeCount: number;
  pendingItems: PendingItem[];
  recentActivity: ActivityItem[];
}

const REFRESH_INTERVAL_MS = 60_000;

function iconForType(type: PendingItem['type']) {
  switch (type) {
    case 'pending_contribution':
      return MessageSquareText;
    case 'pending_access_request':
      return UserPlus;
    case 'pending_creation_request':
      return Sparkles;
    default:
      return Inbox;
  }
}

function relativeTime(iso: string) {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const seconds = Math.max(1, Math.round((now - then) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NotificationsResponse>({
    badgeCount: 0,
    pendingItems: [],
    recentActivity: [],
  });
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (res.status === 401) {
        // Unauthenticated — silently render an empty bell.
        setData({ badgeCount: 0, pendingItems: [], recentActivity: [] });
        setError(null);
        return;
      }
      if (!res.ok) {
        throw new Error(`Notifications request failed (${res.status})`);
      }
      const json = (await res.json()) as NotificationsResponse;
      setData({
        badgeCount: json.badgeCount || 0,
        pendingItems: json.pendingItems || [],
        recentActivity: json.recentActivity || [],
      });
      setError(null);
    } catch (err: any) {
      console.error('[NotificationCenter] refresh failed', err);
      setError('Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [refresh]);

  // Close dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const badge = data.badgeCount;
  const hasPending = data.pendingItems.length > 0;
  const hasActivity = data.recentActivity.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        aria-label={badge > 0 ? `${badge} pending notifications` : 'Notifications'}
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          if (!open) refresh();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-warm-border/30 bg-white text-warm-dark transition-colors hover:bg-surface-mid/60"
      >
        <Bell size={16} />
        {badge > 0 && (
          <span
            className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-warm-brown px-1 text-[10px] font-semibold leading-[18px] text-white shadow-sm"
            aria-hidden="true"
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[360px] max-w-[90vw] rounded-2xl border border-warm-border/40 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-warm-border/30 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-warm-dark">Notifications</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-warm-outline">
                {badge > 0 ? `${badge} need attention` : 'All caught up'}
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="text-xs text-warm-outline hover:text-warm-dark"
            >
              Refresh
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && (
              <div className="flex items-center gap-2 px-4 py-6 text-sm text-warm-outline">
                <Loader2 size={14} className="animate-spin" />
                Loading…
              </div>
            )}

            {!loading && error && (
              <div className="px-4 py-6 text-sm text-red-600">{error}</div>
            )}

            {!loading && !error && (
              <>
                <section>
                  <h3 className="px-4 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-warm-outline">
                    Needs your attention
                  </h3>
                  {hasPending ? (
                    <ul className="mt-2 space-y-1 px-2 pb-2">
                      {data.pendingItems.map((item) => {
                        const Icon = iconForType(item.type);
                        return (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="flex gap-3 rounded-xl px-3 py-2.5 hover:bg-surface-mid/60"
                            >
                              <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-warm-brown/10 text-warm-brown">
                                <Icon size={14} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-warm-dark">
                                  {item.title}
                                </p>
                                <p className="line-clamp-2 text-xs text-warm-outline">
                                  {item.body}
                                </p>
                                <p className="mt-1 text-[11px] text-warm-outline">
                                  {item.memorialName} · {relativeTime(item.createdAt)}
                                </p>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 text-xs text-warm-outline">
                      Nothing waiting for review.
                    </p>
                  )}
                </section>

                <section className="border-t border-warm-border/30">
                  <h3 className="px-4 pt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-warm-outline">
                    Recent activity
                  </h3>
                  {hasActivity ? (
                    <ul className="mt-2 space-y-1 px-2 pb-3">
                      {data.recentActivity.map((item) => (
                        <li
                          key={item.id}
                          className="rounded-xl px-3 py-2 text-xs text-warm-dark/80"
                        >
                          <p className="truncate font-medium text-warm-dark">{item.summary}</p>
                          <p className="mt-0.5 text-[11px] text-warm-outline">
                            {item.memorialName} · {relativeTime(item.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-3 pb-4 text-xs text-warm-outline">
                      No recent activity yet.
                    </p>
                  )}
                </section>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
