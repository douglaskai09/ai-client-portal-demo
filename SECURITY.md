# Security Notes

## Public demo

This repository intentionally contains **no production credentials, real client data, private API keys, or privileged backend access**.

The protected-entry screen is a portfolio interaction, not real authentication. Demo state is stored in browser `localStorage` and should be treated as disposable sample data.

## Production requirements

A real client portal should use:

- managed authentication with secure sessions
- server-side authorization checks on every privileged mutation
- tenant isolation with database row-level security
- least-privilege service credentials
- server-only AI/API secrets
- signed or access-controlled file URLs
- durable approval/audit records
- input validation and output encoding
- rate limits on sensitive endpoints
- safe error messages that do not expose internal configuration

## Human approval boundary

AI-generated summaries or recommendations should not automatically perform sensitive external actions. Sending communications, changing financial records, deleting data, or committing consequential workflow changes should be controlled by explicit rules and human approval where appropriate.

## Demo vs. production

The public app is designed to demonstrate product thinking and workflow behavior. It deliberately avoids pretending that browser-only demo storage is equivalent to production authentication or database security.
