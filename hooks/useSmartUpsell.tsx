'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { EmotionalStateResult } from '@/lib/emotionalState';

// ─── Types ──────────────────────────────────────────────────────────────────

type UpsellTrigger = 'fragments' | 'session_time' | null;

export interface SmartUpsellState {
  shouldShow: boolean;
  trigger: UpsellTrigger;
  dismiss: () => void;
  remindLater: () => void;
  dontShowAgain: () => void;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY_FOREVER = 'ulumae-upsell-dismissed-forever';
const STORAGE_KEY_REMIND = 'ulumae-upsell-remind-later';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 60 * 1000;
const FRAGMENT_THRESHOLD = 15;

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useSmartUpsell(
  emotionalResult: EmotionalStateResult | null,
  userPlan: string | undefined
): SmartUpsellState {
  const [shouldShow, setShouldShow] = useState(false);
  const [trigger, setTrigger] = useState<UpsellTrigger>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const dismissedRef = useRef(false);

  // Check if user has permanently dismissed or is in remind-later window
  const isUserSuppressed = useCallback((): boolean => {
    try {
      if (localStorage.getItem(STORAGE_KEY_FOREVER) === 'true') return true;

      const remindTimestamp = localStorage.getItem(STORAGE_KEY_REMIND);
      if (remindTimestamp) {
        const remindTime = parseInt(remindTimestamp, 10);
        if (Date.now() - remindTime < TWENTY_FOUR_HOURS_MS) return true;
        // Expired — clean up
        localStorage.removeItem(STORAGE_KEY_REMIND);
      }
    } catch {
      // localStorage not available
    }
    return false;
  }, []);

  // Only show for users who could benefit from upgrade (draft or personal)
  const isEligiblePlan = userPlan === 'draft' || userPlan === 'personal' || userPlan === 'none';

  // Check fragment-based trigger
  useEffect(() => {
    if (dismissedRef.current || !isEligiblePlan) return;
    if (isUserSuppressed()) return;

    if (emotionalResult && emotionalResult.fragmentCount > FRAGMENT_THRESHOLD) {
      setTrigger('fragments');
      setShouldShow(true);
    }
  }, [emotionalResult, isEligiblePlan, isUserSuppressed]);

  // Check session-time-based trigger
  useEffect(() => {
    if (!isEligiblePlan) return;

    const interval = setInterval(() => {
      if (dismissedRef.current) return;
      if (isUserSuppressed()) return;

      const elapsed = Date.now() - sessionStartRef.current;
      if (elapsed >= TWO_HOURS_MS) {
        setTrigger('session_time');
        setShouldShow(true);
      }
    }, CHECK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isEligiblePlan, isUserSuppressed]);

  const dismiss = useCallback(() => {
    dismissedRef.current = true;
    setShouldShow(false);
    setTrigger(null);
  }, []);

  const remindLater = useCallback(() => {
    dismissedRef.current = true;
    setShouldShow(false);
    setTrigger(null);
    try {
      localStorage.setItem(STORAGE_KEY_REMIND, Date.now().toString());
    } catch {
      // localStorage not available
    }
  }, []);

  const dontShowAgain = useCallback(() => {
    dismissedRef.current = true;
    setShouldShow(false);
    setTrigger(null);
    try {
      localStorage.setItem(STORAGE_KEY_FOREVER, 'true');
    } catch {
      // localStorage not available
    }
  }, []);

  return {
    shouldShow,
    trigger,
    dismiss,
    remindLater,
    dontShowAgain,
  };
}
