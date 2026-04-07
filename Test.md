## What I understand about this project

This project looks like a `Next.js` application for **creating, managing, and preserving digital memorials / family legacy archives**.

From the codebase, I understand that the product lets users:

- create a memorial through a multi-step guided editor with biography, family, values, memories, photos, audio, and video
- save drafts and continue later
- preview the memorial as a visitor would see it
- invite family members or witnesses to contribute content
- manage archive roles, permissions, and succession / successor access
- pay through Stripe to unlock permanent preservation features
- store application data with Supabase
- generate archived / rendered memorial pages and preservation flows tied to Arweave-style permanent storage

The main product idea seems to be:

`ULUMAE` is a platform for preserving a person's life story and family memory in a structured, private, long-lasting archive, with collaboration, inheritance, and permanence as core features.

A few specific signals from the project structure:

- `app/create` is the main memorial creation wizard
- `app/archive/[memorialId]` contains archive viewing, contribution, stewardship, family, and welcome flows
- `app/api/...` contains backend routes for invites, payments, uploads, reminders, succession, authorization, and archive management
- `lib/arweave`, `lib/certificate`, and `components/PreservationStatus` suggest a preservation / certification layer
- `components/providers/AuthProvider` and Supabase utilities show authentication and user/archive state management

So in short, I understand this as a **digital legacy / memorial preservation platform** built with `Next.js`, `Supabase`, and `Stripe`, with a product direction centered on long-term archival preservation and family continuity.
