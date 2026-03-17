# Legacy Vault — Fresh Supabase Project Setup Guide

Complete setup instructions for a **brand new** Supabase project.

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **API keys** from Settings > API

---

## Step 2: Enable Authentication

1. Go to **Authentication > Providers**
2. Enable **Email** (should be enabled by default)
3. Optional: Enable Google, GitHub, etc.
4. Go to **Authentication > URL Configuration**:
   - Site URL: `http://localhost:3000` (dev) or your production URL
   - Redirect URLs: Add `http://localhost:3000/**` and your production URL

---

## Step 3: Run the SQL Setup

1. Go to **SQL Editor** in your Supabase Dashboard
2. Copy the ENTIRE contents of `supabase_fresh_setup.sql`
3. Paste it into the SQL Editor
4. Click **Run**

This creates all **19 tables**, **5 storage buckets**, all **RLS policies**, **indexes**, **triggers**, and **functions**.

### Tables Created (19 total):

| # | Table | Purpose |
|---|-------|---------|
| 1 | `users` | User profiles (auto-created on signup) |
| 2 | `memorials` | Core memorial data (9 wizard steps as JSONB) |
| 3 | `memorial_authorizations` | Legal authorization forms |
| 4 | `memorial_versions` | Version history snapshots |
| 5 | `witness_invitations` | Invitations for witnesses to contribute |
| 6 | `memorial_contributions` | Witness contributions (memories, photos) |
| 7 | `memorial_relations` | Family connections between memorials |
| 8 | `user_successors` | Successor designation (dead man's switch) |
| 9 | `succession_activations` | Succession access requests |
| 10 | `memorial_reminders` | Scheduled email reminders |
| 11 | `concierge_projects` | Concierge tier projects ($6,300) |
| 12 | `concierge_files` | Files uploaded for concierge projects |
| 13 | `concierge_notes` | Notes/messages for concierge projects |
| 14 | `arweave_transactions` | Arweave blockchain upload tracking |
| 15 | `anchor_devices` | Device sync tracking (Family tier) |
| 16 | `recovery_contacts` | Social recovery contacts (Shamir's SSS) |
| 17 | `encryption_keys` | Memorial encryption key metadata |
| 18 | `content_reviews` | Pre-preservation content review status |
| 19 | `preservation_certificates` | Certificate of Permanence metadata |

### Storage Buckets Created (5 total):

| Bucket | Public? | Max Size | Purpose |
|--------|---------|----------|---------|
| `videos` | Yes | 500MB | Memorial video uploads |
| `concierge-files` | Yes | 100MB | Concierge project files |
| `authorization-pdfs` | No | 10MB | Legal authorization PDFs |
| `memorial-media` | Yes | 100MB | Photos, audio recordings |
| `certificates` | No | 10MB | Preservation certificates |

---

## Step 4: Verify the Setup

After running the SQL, run this verification query in the SQL Editor:

```sql
-- Should return 19 rows
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
    'users', 'memorials', 'memorial_authorizations', 'memorial_versions',
    'witness_invitations', 'memorial_contributions', 'memorial_relations',
    'user_successors', 'succession_activations', 'memorial_reminders',
    'concierge_projects', 'concierge_files', 'concierge_notes',
    'arweave_transactions', 'anchor_devices', 'recovery_contacts',
    'encryption_keys', 'content_reviews', 'preservation_certificates'
)
ORDER BY table_name;

-- Should return 5 rows
SELECT id, name, public
FROM storage.buckets
WHERE id IN ('videos', 'concierge-files', 'authorization-pdfs', 'memorial-media', 'certificates');
```

---

## Step 5: Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# ============================================
# SUPABASE (Required)
# ============================================
# From: Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key

# ============================================
# STRIPE (Required for payments)
# ============================================
# From: Stripe Dashboard > Developers > API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================
# RESEND (Required for emails)
# ============================================
# From: resend.com > API Keys
RESEND_API_KEY=re_...

# ============================================
# APP CONFIG
# ============================================
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# ============================================
# CRON SECURITY (Required for dead man's switch)
# ============================================
# Generate a random secret: openssl rand -hex 32
CRON_SECRET=your-random-secret-here
```

### Where to get each key:

| Variable | Where |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API > anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API > service_role (keep secret!) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard > Developers > API Keys > Publishable key |
| `STRIPE_SECRET_KEY` | Stripe Dashboard > Developers > API Keys > Secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard > Developers > Webhooks > Signing secret |
| `RESEND_API_KEY` | resend.com > API Keys |
| `CRON_SECRET` | Generate yourself: `openssl rand -hex 32` |

---

## Step 6: Stripe Webhook Setup

1. Go to **Stripe Dashboard > Developers > Webhooks**
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`

For local development:
```bash
# Install Stripe CLI and forward webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Step 7: Resend Email Setup

1. Go to [resend.com](https://resend.com) and create an account
2. Add and verify your domain (or use their test domain for dev)
3. Create an API key and add to `RESEND_API_KEY`

---

## Step 8: Dead Man's Switch Cron Job (Optional)

The dead man's switch checks for inactive users and emails successors.

**On Vercel:**
1. Create `vercel.json` with cron config:
```json
{
  "crons": [
    {
      "path": "/api/cron/dead-man-switch",
      "schedule": "0 9 * * *"
    }
  ]
}
```

**Or use an external cron service:**
- Call `POST https://your-domain.com/api/cron/dead-man-switch`
- With header: `Authorization: Bearer YOUR_CRON_SECRET`
- Schedule: Daily at 9 AM

---

## Step 9: Run the App

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## Troubleshooting

### "relation does not exist" errors
- Make sure you ran the ENTIRE SQL file, not just parts of it
- Check the SQL Editor output for any errors during execution

### Auth not working
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check that email auth is enabled in Supabase Dashboard > Authentication > Providers

### Storage upload errors
- Verify buckets exist in Supabase Dashboard > Storage
- Check that storage policies were created (run verification query above)

### Stripe payment errors
- Make sure you're using test keys (pk_test_ / sk_test_) for development
- Set up webhook forwarding for local dev with Stripe CLI
