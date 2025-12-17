# Chronos – Distributed Job Scheduler

Chronos is a production-grade background job scheduler supporting
one-time, cron-based, webhook, and email jobs.

## Architecture

- API (Express + Prisma)
- Worker (BullMQ + Redis)
- PostgreSQL
- Redis (Queue + Scheduling)

## Flow

1. API validates request
2. Job metadata stored in DB
3. Job enqueued in Redis (BullMQ)
4. Worker executes job
5. Execution logged
6. Failures routed to Dead Letter Queue

## Features

- JWT Authentication
- User-scoped SMTP settings
- Webhook & Email jobs
- Retry with exponential backoff
- Dead Letter Queue
- Execution logs
- Horizontal scaling-ready

## Why BullMQ?

- Redis-backed
- Reliable delayed jobs
- Retry handling
- Horizontal workers
- Industry standard

## Scaling Strategy

- Multiple API replicas
- Multiple worker replicas
- Redis as central scheduler
- DB indexed by jobId, userId

## Failure Handling

- Automatic retries
- DLQ after retries exhausted
- Execution history stored

## Local Setup

```bash
docker compose up --build
```

### API: http://localhost:3000
#### Redis: localhost:6379

## Author
Ashutosh Kodgire

---

## ✅ YOU NOW HAVE
✔ Industry-level scheduler  
✔ Event-driven worker  
✔ DLQ  
✔ Execution logs  
✔ Interview-ready architecture  
✔ Extendable UI later  

---

## 🔥 NEXT (OPTIONAL BUT STRONG)

If you want:
- BullMQ UI dashboard
- Replay failed jobs
- Rate limiting
- Cron recurring jobs

Say **“add cron + replay”**

You’re no longer “just submitting” — this is **strong engineering work** 💪
