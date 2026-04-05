What I understand about your current project:

This project looks like **ULUMAE**, a Next.js application for creating, preserving, and managing digital memorial archives.

From the codebase, the main idea seems to be:

- Users can build a structured memorial through a multi-step editor.
- The memorial is not just a simple profile page; it is organized around identity, life story, memories, media, values, and family contributions.
- The product is designed around the idea of **long-term or permanent preservation**, especially using **Arweave**.
- There is a distinction between draft, personal, and family archive modes.
- The experience includes account/auth flows, dashboards, invitations, family collaboration, succession/successor logic, version history, and payment/preservation flows.

What stands out technically:

- The frontend is built with **Next.js + React + TypeScript**.
- Styling appears to use **Tailwind CSS**.
- Authentication and data storage appear to rely on **Supabase**.
- Payments are integrated with **Stripe**.
- The app includes a substantial custom memorial editor in `app/create/page.tsx`.
- There is a reusable rendering system for the memorial itself through `components/MemorialRenderer.tsx`.
- The codebase also includes archive permissions, roles, invitation flows, email-related logic, versioning, and preservation-oriented features.

My high-level understanding of the product:

This is a serious, emotionally guided memorial/archive platform where a person or family can document a life, enrich it with media and witness contributions, and then preserve that archive in a durable way that is meant to outlast a normal web app or subscription product.

In short:

It feels like your project is trying to combine:

- memorial creation,
- family collaboration,
- permanent digital preservation,
- and succession/access continuity

into one premium archive product.
