# Architecture

## Public demo shape

```text
Demo Client
   |
Protected-entry UX
   |
Portal State Layer
   |---- Projects / milestones
   |---- Tasks / ownership / status
   |---- Approval gates
   |---- Activity trail
   `---- Executive brief engine
            |
        Current state summary
```

The public build is static and stores demo state in the browser. That makes it safe to host on GitHub Pages while still demonstrating the workflow and interface behavior.

## Production upgrade path

```text
Client / Team
    |
Next.js Application
    |
Auth + Role Boundary
    |
Server Actions / API Layer
    |------------------------------|
    |              |               |
Projects/Tasks   Approvals       AI Briefing
    |              |               |
PostgreSQL      Audit Events    Provider Adapter
    |                              |
Row-Level Security             OpenAI / Anthropic
```

### Core production principles

1. **Context is explicit.** Client, project, task, and approval state are first-class records instead of loose UI state.
2. **Decision gates are durable.** Sensitive actions wait for an explicit human decision that can be audited later.
3. **AI is downstream of trusted state.** The summary layer reads structured project state; it does not become the system of record.
4. **Server boundaries protect credentials.** Provider keys, admin database credentials, and privileged mutations remain server-side.
5. **Verification is visible.** Activity events make important state changes inspectable rather than silently mutating records.

## Suggested production stack

- Next.js + React + TypeScript
- Supabase Auth
- PostgreSQL / Supabase
- Row Level Security for tenant isolation
- server-side provider abstraction for OpenAI / Anthropic
- object storage for client files
- Vercel deployment
- structured logging and error monitoring
