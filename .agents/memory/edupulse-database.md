---
name: EduPulse database choice
description: Why EduPulse uses the managed relational database available in the workspace
---

EduPulse uses the Replit-managed PostgreSQL database rather than MongoDB because no MongoDB connection is available in the workspace; the REST contract and data relationships remain the same.

**Why:** A working persistent CRUD demo is more valuable than an unconfigured external database, and the project environment supplies PostgreSQL automatically.

**How to apply:** Keep schema changes in the shared Drizzle schema and use the managed database for future EduPulse work unless the user explicitly adds a MongoDB service.