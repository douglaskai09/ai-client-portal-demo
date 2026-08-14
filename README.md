# AI Client Portal Demo

A working public portfolio demo of a client-facing business portal with a protected-entry experience, project visibility, task tracking, approval gates, activity history, and an AI-style executive summary.

## Live demo

After GitHub Pages is enabled for this repository, the app will be available at:

`https://douglaskai09.github.io/ai-client-portal-demo/`

## What this demonstrates

- client login / protected-entry UX
- project and milestone visibility
- task ownership and status management
- approval gates for client decisions
- activity timeline and audit-style events
- AI-style executive summary generated from current project state
- responsive business dashboard UI
- demo-safe local persistence with no exposed credentials

## Engineering signature

The portal follows a visible operating pattern:

**Context → Prioritize → Gate → Act → Verify**

Instead of hiding decisions inside the interface, the demo makes current state, blockers, approvals, and recommended next actions explicit.

## Demo architecture

The public build is intentionally deployable as a static GitHub Pages app. It uses browser-local demo data so anyone can test the workflow without accounts, API keys, or a backend.

A production version would replace the demo adapters with:

- Next.js / React application shell
- Supabase Auth or another identity provider
- PostgreSQL / Supabase row-level security
- server-side AI provider calls
- signed file storage
- role-based client/team permissions
- durable activity and approval records
- email / Slack / CRM integrations

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) and [`SECURITY.md`](./SECURITY.md).

## Portfolio purpose

This repo is a compact proof that a client portal can be more than a collection of CRUD screens. The interface is built around business state, decisions, handoffs, and safe human approval.
