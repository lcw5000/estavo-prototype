# Estavo — Data Warehouse Strategy

## What this is and why it matters

Your app database (PostgreSQL or similar) is optimised for the *application* — fast reads and writes, normalised schema, row-oriented storage. It answers questions like "give me contact-1's messages." It is not designed to answer questions like "across all agents on the platform, what is the average response time from lead received to first contact, broken down by lead source and zip code, for the last 18 months."

A data warehouse is a separate system optimised for *analytical* queries across large volumes of data. It stores everything that ever happened on the platform — every event, every transaction, every lead, every message — in a columnar format that makes aggregate queries fast and cheap.

The distinction matters for an acquisition because:
- Your app DB is a live operational system — a buyer can't run analytics against it directly
- A warehouse is a clean, queryable historical record of everything that happened on your platform
- The warehouse is what a buyer's data team will audit and value

---

## The architecture — four layers

```
┌─────────────────────────────────────────────────────┐
│  SOURCES                                            │
│  App DB · Behavioral events · MLS · Zillow API     │
│  Twilio SMS · Email events · IDX site              │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  INGESTION (ETL/ELT)                                │
│  Moves data from sources into the warehouse         │
│  Airbyte (DB sync) + RudderStack (events)           │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  WAREHOUSE                                          │
│  Central store — raw tables + modelled tables       │
│  BigQuery (Google Cloud)                            │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  ANALYTICS / BI                                     │
│  Dashboards, ad-hoc queries, acquisition due        │
│  diligence, product decisions                       │
│  Looker Studio (free) → Metabase → Tableau          │
└─────────────────────────────────────────────────────┘
```

---

## Layer 1 — Sources

Everything the platform touches is a potential data source:

| Source | What it contains | Priority |
|--------|-----------------|----------|
| App database | Contacts, transactions, leads, messages, interactions | Critical |
| Behavioral events | Page views, button clicks, feature usage, session duration | Critical |
| MLS/IDX feed | Listing views, saved searches, property data | High |
| Zillow/portal leads | Lead arrival time, property of interest, source metadata | High |
| Twilio | SMS send/receive timestamps, delivery status | High |
| Email platform | Opens, clicks, reply rates, send times | Medium |
| Showing scheduler | Showing requests, confirmations, cancellations | Medium |

The behavioral events layer is the most important to get right early. This is the data Zillow paid $500M for with ShowingTime — *intent signals before outcome*. Every time a contact views a listing, a lead arrives, or an agent responds, that event should be captured with a timestamp, a user ID, and relevant metadata.

---

## Layer 2 — Ingestion

Two distinct pipelines feed the warehouse:

### 2a. Database replication (Airbyte)

Airbyte connects to your production database and continuously syncs table-level changes into the warehouse. It uses Change Data Capture (CDC) — it reads the database's write log rather than polling, so it captures every insert, update, and delete without hammering your production DB.

You get raw copies of all your app tables in the warehouse: `contacts`, `transactions`, `leads`, `messages`, etc. These are the source-of-truth operational tables.

**Airbyte options:**
- **Self-hosted** (Docker): Free. You run it on a $20/month VPS. Full control.
- **Airbyte Cloud**: Free tier available; ~$200-500/month at production scale.

### 2b. Event streaming (RudderStack)

This is the behavioral layer. You instrument your app with a small SDK — similar to Google Analytics but you own the data. Every meaningful user action fires an event:

```javascript
// Example events you'd instrument in Estavo
rudderanalytics.track('lead_received', {
  lead_id: 'lead-1',
  source: 'zillow',
  agent_id: 'agent-1',
  property_address: '22 Clipper St',
  received_at: '2026-04-24T09:26:00Z'
})

rudderanalytics.track('lead_response_sent', {
  lead_id: 'lead-1',
  channel: 'sms',
  response_time_minutes: 26,
  agent_id: 'agent-1'
})

rudderanalytics.track('contact_viewed_listing', {
  contact_id: 'contact-1',
  listing_address: '147 Oak St',
  session_count_today: 4,
  agent_id: 'agent-1'
})
```

These events land in BigQuery as raw event tables and become the signal layer for your data models.

**RudderStack options:**
- **Self-hosted**: Free. More setup than Airbyte.
- **RudderStack Cloud**: Free up to 500K events/month; $75-200/month above that.
- **Segment** (alternative): Industry standard but expensive — $120/month minimum, scales to thousands.

---

## Layer 3 — Warehouse

### BigQuery (recommended to start)

BigQuery is Google's serverless data warehouse. There is no infrastructure to manage — you create a project, create datasets, and query with SQL. Pricing is on-demand: you pay per byte queried, not per server running.

**Why BigQuery for Estavo:**
- Serverless — no cluster to provision or maintain
- Near-zero cost at early stage (free tier covers most early workloads)
- Native connectors from Airbyte and RudderStack
- Scales to petabytes without architecture changes
- Google Looker Studio (free BI tool) connects natively
- Familiar to any data engineer a buyer would bring in

**Pricing:**
| Resource | Cost |
|----------|------|
| Storage | $0.02/GB/month (first 10GB free) |
| Queries | $5/TB scanned (first 1TB/month free) |
| Streaming inserts | $0.01/200MB |

At early stage (< 1,000 agents), your monthly BigQuery bill will be **$0–30/month**.

### Snowflake (alternative, better at scale)

Snowflake is the enterprise standard. It separates storage and compute cleanly — you can spin up a large compute cluster for a heavy query then shut it down. It is better than BigQuery for complex multi-table joins at scale and has stronger data sharing features (useful for selling data products to brokerages).

Snowflake is the right choice once you're at ~$10M ARR or 5,000+ agents. Start with BigQuery and migrate when you have engineering resources to justify it.

**Pricing:** $2/credit for compute; storage ~$25/TB/month. Minimum practical spend ~$200-500/month even with light usage. Not worth it early.

### Redshift (AWS)

Only relevant if you're already deep in the AWS ecosystem. No meaningful advantage over BigQuery for a greenfield build.

---

## Layer 4 — Transformation (dbt)

Raw tables in the warehouse are messy — they look exactly like your app database, with foreign keys, status codes, and timestamps that require interpretation. dbt (data build tool) transforms raw tables into clean, analytics-ready models using SQL.

You write SQL select statements; dbt handles materialising them as tables or views, documenting lineage, running tests, and scheduling refreshes.

**Example dbt models for Estavo:**

```sql
-- models/lead_response_times.sql
-- Calculates response time for every lead, with source and agent metadata

select
    l.id                                           as lead_id,
    l.source,
    l.received_at,
    l.contacted_at,
    a.name                                         as agent_name,
    a.brokerage,
    timestampdiff(minute, l.received_at,
                  l.contacted_at)                  as response_minutes,
    case
        when response_minutes < 5   then 'under_5min'
        when response_minutes < 60  then 'under_1hr'
        when response_minutes < 1440 then 'under_24hr'
        else 'over_24hr'
    end                                            as response_bucket

from raw.leads l
join raw.agents a on l.agent_id = a.id
where l.contacted_at is not null
```

```sql
-- models/agent_performance_summary.sql
select
    agent_id,
    count(distinct lead_id)                         as total_leads,
    count(distinct case when status = 'closed'
          then lead_id end)                         as closed_deals,
    avg(response_minutes)                           as avg_response_min,
    sum(gci)                                        as total_gci,
    avg(gci)                                        as avg_gci_per_deal

from {{ ref('lead_response_times') }}
left join {{ ref('transactions') }} using (lead_id)
group by 1
```

**dbt options:**
- **dbt Core** (CLI, open source): Free. Runs locally or in CI. Sufficient early on.
- **dbt Cloud**: Free for 1 developer seat; $50/month for teams. Adds scheduling, a nice UI, and documentation hosting.

---

## Data models to build for Estavo

These are the tables an acquirer's data team will ask for immediately:

| Model | Description | Acquisition relevance |
|-------|-------------|----------------------|
| `lead_funnel` | Every lead, source, status, response time, outcome | Core conversion data |
| `agent_performance` | GCI, deals, response times, conversion rates per agent | Platform health |
| `transaction_timeline` | Every event in a transaction lifecycle | Workflow intelligence |
| `listing_intent_signals` | Contact × listing view events with timestamps | Pre-outcome intent data |
| `lead_source_roi` | GCI earned per lead source, cost if available | Acquisition justification |
| `market_benchmarks` | Aggregated metrics by zip/neighbourhood (anonymised) | Data product potential |
| `agent_retention` | Login frequency, feature usage, churn signals | SaaS health metrics |

---

## Recommended stack and phased rollout

### Phase 1 — Now (cost: ~$0/month)

| Tool | Purpose | Cost |
|------|---------|------|
| BigQuery | Warehouse | Free tier |
| Airbyte (self-hosted) | DB → BigQuery sync | Free (VPS ~$10/month) |
| RudderStack Cloud | Event capture | Free up to 500K events |
| dbt Core | Transformation | Free |
| Looker Studio | Dashboards | Free |

**What to do:** Set up BigQuery, connect Airbyte to your app DB, instrument 10-15 key events in the Estavo app with RudderStack, write 3-4 dbt models for the core metrics. This is a weekend of work for a technical founder.

### Phase 2 — Post-launch (cost: ~$300-600/month)

| Tool | Purpose | Cost |
|------|---------|------|
| BigQuery | Warehouse | $20-50/month |
| Airbyte Cloud | DB sync (managed) | $200-300/month |
| RudderStack Cloud | Events | $75-150/month |
| dbt Cloud | Transformation | $50/month |
| Metabase (self-hosted) | Internal BI | Free |

**What to do:** Move Airbyte to managed cloud (removes ops burden), expand event instrumentation, build out the full model library, start publishing internal "market intelligence" dashboards that could become a product.

### Phase 3 — Acquisition-ready (cost: ~$2,000-5,000/month)

| Tool | Purpose | Cost |
|------|---------|------|
| Snowflake | Warehouse | $1,000-2,000/month |
| Fivetran | Connectors | $500-1,000/month |
| Segment | Events | $500-1,000/month |
| dbt Cloud (Teams) | Transformation | $200/month |
| Tableau / Looker | BI | $500-1,000/month |
| Atlan or DataHub | Data catalog | $500-1,000/month |

**What to do:** Migrate to Snowflake, add a data catalog (documents every table, column, lineage — due diligence gold), establish data quality tests, and build external-facing market reports as a product.

---

## What due diligence looks like

When an acquirer's data team comes in, they will want:

1. **A complete event schema** — every event you capture, what fields it has, how far back it goes. Three years of event data is significantly more valuable than six months.

2. **Agent-level data without PII** — they want to run queries across all agents without needing to see individual contact names/emails. Your dbt models should have a clean anonymised layer.

3. **Completeness metrics** — what % of transactions have complete data, what % of leads have response times logged. Gaps in coverage reduce the data premium.

4. **Lineage documentation** — where does each metric come from, what is the business logic, is it consistent. dbt generates this automatically if you use it correctly.

5. **Data volume projections** — how many events/day at current scale, what does that look like at 10× agents. Shows the data compound as the business grows.

---

## The terms of service language to add now

Before you capture any agent or client data, your ToS should include language similar to:

> *"Estavo stores and processes data you provide in order to deliver the service. You retain ownership of your individual client and contact data and may export or delete it at any time. Estavo may use anonymised, aggregated, de-identified data derived from platform usage for product improvement, benchmarking, and market intelligence features. Estavo will never sell individually identifiable agent or client data to third parties."*

This is standard, defensible, and gives you the rights you need to build and monetise the aggregate data layer.

---

## Summary recommendation

Start with **BigQuery + Airbyte (self-hosted) + RudderStack + dbt Core + Looker Studio** at effectively zero cost. Instrument the app now — the age of your event data at acquisition time is a direct multiplier on its value. Every month you delay is a month of signal you can never recover.

The data warehouse is not a feature. It is the asset.
