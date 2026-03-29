# Context: Memorial Experience Emotional Redesign

## What This Is About

The Ulumae memorial creation app lets users build digital archives of someone's life — a 10-step journey through facts, childhood, career, relationships, personality, life story, memories, photos, videos, and a final review. Steps are grouped into narrative paths: The Facts, The Body, The Soul, The Presence, and The Witnesses.

The app already leans toward emotional language ("paths", "exploration", "seal the archive"), but it still carries transactional DNA: percentage-based completion, "Save & Continue" buttons, confetti on success, boolean done/not-done logic, and "Upload" / "Submit" / "Publish" vocabulary.

## What We Are Going to Do

We are transforming this experience from a **tool** into a **sacred act of preservation**. The user must feel they are guarding a life — not filling out a form. Here is what changes:

### 1. Emotional State Engine (new: `/lib/emotionalState.ts`)
Replace percentage-based completion with a **richness score** that tracks depth (narrative detail), diversity (media variety), and presence (how "alive" the memorial feels). The memorial exists in one of five emotional states — **Void**, **Fragile**, **Emerging**, **Substantial**, **Eternal** — each shaping the tone, visuals, and available actions across the entire interface.

### 2. Language Transformation (all wizard steps, buttons, messages)
Every transactional word is replaced with duty-focused language. "Save" becomes "Preserve." "Upload" becomes "Gather." "Submit" becomes "Offer." "Delete" becomes "Remove with care." "Published!" becomes "Their story is now protected." No congratulations, no confetti, no "you're done."

### 3. Ghost Presence Effect (new: `/components/wizard/GhostPresence.tsx`)
Missing content is never invisible — it is **felt through absence**. Empty biography sections show faded lines with "The rest of their story remains unwritten." Missing photos show translucent silhouettes. Missing voice recordings show flat waveform outlines. The preview simultaneously shows beauty (what exists) and haunting emptiness (what's absent).

### 4. Progress = Depth, Not Completion
The progress bar is replaced with an organic presence visualization. No dots, no percentages, no step counts. The interface itself evolves — becoming warmer, richer, more luminous as the memorial deepens. Path cards visually transform from stark and minimal (Void) to full and glowing (Eternal).

### 5. Controlled Finalization as Ritual
The "Seal the Archive" button is blocked until the memorial reaches sufficient richness: biography over 200 words, at least 3 photos, and at least one voice or video element. When blocked, users see "Strengthen their legacy" with gentle redirects to thin sections. When unlocked, finalization follows a 3-phase ritual: full review, intentional pause ("Take a moment. What you seal will endure."), and a deliberate, weighty seal action.

### 6. Payment = Protection
All pricing and payment copy is reframed. "Unlock features" becomes "Ensure this memory endures." "Buy now" becomes "Protect what you've built." The payment success page becomes a moment of solemn completion, not a receipt.

### 7. Missing Content Whispers
At every stage, the system gently reveals what remains absent — never as errors or warnings, always as soft invitations. "You've captured 12 fragments of their life. Their voice is still waiting to be preserved."

### 8. User Fatigue with Dignity
If users slow down, the pause modal acknowledges the emotional weight: "Preserving a life is not easy. If the weight of this task feels heavy, our team can take what you've gathered and complete the archive for you." The concierge path is relief, not upsell.

## Files That Will Change

| File | What Changes |
|------|-------------|
| `lib/emotionalState.ts` | **New** — Richness score engine + emotional state system |
| `lib/completionLogic.ts` | Refactored to richness-based logic, no percentages |
| `types/paths.ts` | Remove `progress: number`, add depth levels |
| `types/memorial.ts` | Remove `completedSteps`, add `emotionalState` |
| `components/wizard/GhostPresence.tsx` | **New** — Ghost presence placeholders |
| `components/wizard/ProgressBar.tsx` | Organic presence visualization |
| `components/wizard/PathCard.tsx` | Language + visual state evolution |
| `components/wizard/Step10Review.tsx` | Ritual finalization + richness gating |
| `components/wizard/PreviewModal.tsx` | Ghost presence in preview |
| `components/SaveIndicator.tsx` | "Saved" → "Preserved" |
| `components/wizard/Step1-9*.tsx` | Button labels + ghost presence integration |
| `app/create/page.tsx` | Emotional state tracking + whispers + pause modal |
| `app/success/page.tsx` | Remove confetti, rewrite as protection moment |
| `app/payment-success/page.tsx` | Legacy protection language |
| `app/choice-pricing/page.tsx` | Protection-focused pricing copy |
| `app/archive/[memorialId]/steward/page.tsx` | Duty-focused moderation language |
| `app/globals.css` | Ritual animations + emotional state theming |

## The End Goal

By the time a user reaches the final step, they must feel:
- **Emotionally invested** in what they've built
- **Personally responsible** for completing the preservation
- **Unable to abandon** the memorial without a sense of loss

Completing the process should feel **natural and earned**. Paying should feel **justified and meaningful**. Stopping should feel like **letting something precious disappear**.
