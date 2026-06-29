# The Power of Data Interview Notes — System Flow Approach

## Priority 1 — Data Fundamentals

### Data vs Information

**System Flow — Raw to Useful:**
```
Raw Data → Context + Structure → Information → Analysis → Knowledge → Decision → Action

Example:
  Data:        ["2024-01-15", "user_123", "click", "button_buy"]
  Information: User 123 clicked buy button on Jan 15
  Knowledge:   Users who click buy within 2 sessions convert at 60%
  Decision:    Show buy button prominently to returning users
```

| Data | Information |
|------|-------------|
| Raw facts, symbols | Processed, contextualized |
| "120" | "120 km/h speed limit" |
| Meaningless alone | Actionable |

**Data Types:**
```
Structured:    Rows + columns, schema-defined     → SQL tables, CSV
Semi-Structured: Tags, nested, flexible schema   → JSON, XML, logs
Unstructured:  No predefined format               → Images, videos, text, audio

Ratio in enterprises: 20% structured, 80% unstructured
```

**Metadata:**
```
Data about data → Who created it? When? Format? Source? Quality score?

Example: Photo file
  Data: Pixel values
  Metadata: Camera model, GPS, timestamp, aperture, ISO

Why important: Discovery, governance, lineage, quality tracking
```

**Master vs Reference Data:**
```
Master Data: Core business entities (customers, products, employees)
             Single source of truth, carefully managed

Reference Data: Standard codes (country codes, currency, status values)
                Shared across systems, rarely changes
```

**Data Lifecycle:**
```
Create → Store → Process → Analyze → Archive → Delete
   ↓        ↓        ↓         ↓         ↓       ↓
Events   DB/Lake   ETL      BI/ML    Cold      GDPR
Sensors  Object    Transform  Dashboard  Storage  Compliance
```

---

## Priority 2 — Data Collection

### How Data Flows In

**System Flow — Collection Channels:**
```
User clicks app    → SDK → Event stream → Kafka → Data Lake
IoT sensor         → MQTT → Edge gateway → Cloud → Time-series DB
Transaction        → Application → OLTP DB → CDC → Warehouse
API call           → Gateway → Log files → Batch ETL → Analytics
Web scrape         → Crawler → Raw HTML → Parser → Structured store
Third-party        → SFTP/API → Landing zone → Validation → Integration
```

**Batch vs Streaming:**

| Batch | Streaming |
|-------|-----------|
| Collect → Process periodically | Process as it arrives |
| Hourly, daily jobs | Milliseconds latency |
| High throughput, high latency | Lower throughput, real-time |
| Historical analysis | Fraud detection, alerts |
| Hadoop, Spark batch | Kafka, Flink, Spark Streaming |

**Example — E-commerce Data Collection:**
```
User opens app     → Event: page_view, product_id, timestamp, user_id
Adds to cart     → Event: add_to_cart, product_id, quantity, price
Checks out       → Event: checkout, items[], total, payment_method
Payment success  → Event: purchase, order_id, amount, timestamp

All events → Kafka → Real-time dashboard (streaming)
         → S3 → Daily ETL → Data warehouse (batch)
```

---

## Priority 3 — Data Storage

### Where Data Lives

**System Flow — Storage Hierarchy:**
```
Hot (frequently accessed)     → SSD, In-memory (Redis), OLTP DB
Warm (recent, occasional)   → SSD/SAS, Data warehouse
Cold (rarely accessed)        → Object storage (S3), Tape
Archive (compliance)          → Glacier, Deep archive
```

**Database Types:**

| Type | Best For | Example |
|------|----------|---------|
| **Relational** | Transactions, ACID, joins | PostgreSQL, MySQL |
| **Document** | Flexible schema, JSON | MongoDB, DynamoDB |
| **Key-Value** | Caching, sessions | Redis, DynamoDB |
| **Columnar** | Analytics, aggregations | Cassandra, BigQuery |
| **Graph** | Relationships, networks | Neo4j, Neptune |
| **Time-Series** | Metrics, IoT, monitoring | InfluxDB, TimescaleDB |

**Storage Systems:**
```
File Storage:  Hierarchical folders → NFS, SMB (shared drives)
Block Storage: Raw disk blocks → EBS, SAN (databases)
Object Storage: Object + Metadata + ID → S3, GCS (images, backups)
```

**Data Warehouse vs Data Lake vs Lakehouse:**

| | Warehouse | Lake | Lakehouse |
|--|-----------|------|-----------|
| **Data** | Structured, processed | Raw, all formats | Raw + processed |
| **Schema** | Schema-on-write | Schema-on-read | Both |
| **Users** | Analysts, BI | Data scientists | Both |
| **Performance** | Fast queries | Slow (needs processing) | Fast (indexing) |
| **Cost** | Higher | Lower | Medium |
| **Example** | Snowflake, Redshift | S3 + Athena | Databricks, Delta Lake |

**OLTP vs OLAP:**
```
OLTP (Online Transaction Processing):
  → Day-to-day operations
  → Fast writes, normalized, row-oriented
  → "Process this order"
  → MySQL, PostgreSQL

OLAP (Online Analytical Processing):
  → Reporting, analysis
  → Fast reads, denormalized, column-oriented
  → "What were sales last quarter?"
  → Snowflake, BigQuery, Redshift
```

---

## Priority 4 — Data Processing

### ETL vs ELT

**System Flow — ETL:**
```
Extract (source systems) → Transform (clean, join, aggregate) → Load (warehouse)
                              ↓
                        Dedicated ETL server/process
                        Schema defined before loading
                        Best for: Structured data, strict governance
```

**System Flow — ELT:**
```
Extract (source systems) → Load (raw to lake) → Transform (in warehouse)
                                                  ↓
                                            Warehouse does heavy lifting
                                            Schema defined on query
                                            Best for: Big data, flexibility
```

| ETL | ELT |
|-----|-----|
| Transform before load | Transform after load |
| Schema-on-write | Schema-on-read |
| Better data quality at load | More flexible, faster ingestion |
| Traditional, mature | Modern, cloud-native |
| Informatica, Talend | dbt, Spark SQL, BigQuery |

**Batch vs Stream Processing:**
```
Batch:
  Input: File/dataset (bounded)
  Process: Read all → Transform → Write all
  Latency: Minutes to hours
  Use: Payroll, monthly reports, backups
  Tool: Spark, Hadoop

Stream:
  Input: Continuous flow (unbounded)
  Process: Event arrives → Transform immediately → Output
  Latency: Milliseconds to seconds
  Use: Fraud detection, real-time alerts, recommendations
  Tool: Kafka Streams, Flink, Spark Streaming
```

**Data Pipeline Example:**
```
Raw logs (S3) → Spark job (parse JSON, validate schema) → Clean data (Parquet)
                                                     → Invalid data (quarantine)
                                                     → Metrics (monitoring)

Clean data → dbt models (join, aggregate) → Warehouse tables
         → Feature store (ML features)
         → Dashboard (BI)
```

---

## Priority 5 — Data Quality

### Garbage In, Garbage Out

**System Flow — Quality Checks:**
```
Source → Validation rules → Pass → Process
                    → Fail → Quarantine → Alert → Fix → Reprocess
```

**Quality Dimensions:**

| Dimension | Question | Check |
|-----------|----------|-------|
| **Accuracy** | Is it correct? | Compare to source, cross-reference |
| **Completeness** | Is anything missing? | Null counts, required fields |
| **Consistency** | Is it the same across systems? | Cross-system reconciliation |
| **Validity** | Does it conform to rules? | Type, range, format checks |
| **Timeliness** | Is it up to date? | Lag time, freshness metrics |
| **Uniqueness** | Are there duplicates? | Deduplication, primary keys |
| **Integrity** | Are relationships valid? | Foreign keys, referential checks |

**Common Causes of Bad Data:**
```
□ Manual entry errors (typos, wrong format)
□ System migration (schema mismatch, encoding issues)
□ Integration failures (API changes, dropped records)
□ Timezone confusion (UTC vs local)
□ Duplicate sources (same data from multiple systems)
□ Missing defaults (null where value expected)
```

**Data Validation Example:**
```python
def validate_order(order):
    errors = []

    if not order.get('order_id') or len(order['order_id']) != 36:
        errors.append("Invalid order_id")

    if order.get('amount', 0) <= 0:
        errors.append("Amount must be positive")

    if order.get('currency') not in ['USD', 'EUR', 'GBP']:
        errors.append("Invalid currency")

    if not order.get('customer_id'):
        errors.append("Missing customer_id")

    return len(errors) == 0, errors
```

---

## Priority 6 — Data Analysis

### Types of Analytics

**System Flow — Analytical Maturity:**
```
Descriptive → Diagnostic → Predictive → Prescriptive
   "What      "Why did      "What will    "What should
    happened?"  it happen?"   happen?"     we do?"

Example: Sales dropped 20%
  Descriptive: Revenue by month shows drop in March
  Diagnostic: March had website outage + competitor launched
  Predictive: Model predicts 15% drop if no action
  Prescriptive: Run promotion + fix infrastructure = 10% recovery
```

| Type | Question | Techniques | Example |
|------|----------|------------|---------|
| **Descriptive** | What happened? | Aggregation, dashboards | Monthly revenue report |
| **Diagnostic** | Why did it happen? | Drill-down, correlation | Root cause of churn |
| **Predictive** | What will happen? | ML, time series | Next quarter forecast |
| **Prescriptive** | What should we do? | Optimization, simulation | Dynamic pricing |

**Correlation vs Causation:**
```
Correlation: Ice cream sales ↔ Drowning deaths (both rise in summer)
Causation:   Price decrease → Sales increase (direct cause)

Rule: Correlation ≠ Causation
      Always ask: Is there a confounding variable?
      Test: A/B test, controlled experiment
```

**EDA (Exploratory Data Analysis):**
```
Step 1: Understand → What columns? What do they mean?
Step 2: Profile → Distributions, missing values, outliers
Step 3: Visualize → Histograms, scatter plots, correlations
Step 4: Ask → What patterns? What anomalies? What questions?
Step 5: Hypothesize → Form theories to test
```

---

## Priority 7 — Data Visualization

### Charts That Tell Stories

**System Flow — Dashboard Design:**
```
Business Question → Identify KPIs → Choose chart types → Design layout → Add interactivity → Test → Deploy
```

**When to Use Which Chart:**

| Chart | Use When | Example |
|-------|----------|---------|
| **Line** | Trends over time | Monthly revenue, stock prices |
| **Bar** | Compare categories | Sales by region |
| **Scatter** | Relationship between 2 variables | Ad spend vs conversions |
| **Histogram** | Distribution of values | Order value distribution |
| **Box Plot** | Distribution + outliers | Salary by department |
| **Heatmap** | Matrix of values | Correlation matrix |
| **Pie** | Part of whole (few categories) | Market share |
| **Treemap** | Hierarchical proportions | Budget breakdown |
| **Funnel** | Conversion stages | User journey |

**Dashboard Principles:**
```
1. Start with question: "What decision will this inform?"
2. KPIs at top: Big numbers, red/green indicators
3. Trends next: Time series, comparisons
4. Details below: Tables, drill-downs
5. Filters on side: Date range, segment, category
6. Keep simple: 3-5 charts per dashboard
7. Color consistently: Red = bad, green = good
```

**Storytelling with Data:**
```
Hook:    "Revenue dropped 20% last month"
Context: "Here's what happened..."
Evidence: Charts showing trend, breakdown by segment
Insight: "Enterprise segment churned due to competitor launch"
Action:  "Launch retention campaign, reduce prices 10%"
```

---

## Priority 8 — Statistics for Data

### Numbers That Matter

**System Flow — Statistical Thinking:**
```
Population (all data) → Sample (subset) → Calculate statistic → Infer population → Test significance → Decide
```

**Central Tendency:**

| Measure | When to Use | Example |
|---------|-------------|---------|
| **Mean** | Symmetric data, no outliers | Average order value |
| **Median** | Skewed data, outliers present | Median salary (CEO skews mean) |
| **Mode** | Categorical, most frequent | Most popular product |

**Spread:**
```
Variance: Average squared deviation from mean
Std Dev: √Variance (same units as data)
IQR: Q3 - Q1 (middle 50%, robust to outliers)
```

**Central Limit Theorem:**
```
Take many samples → Calculate each sample mean → Plot sample means
→ Distribution approaches normal (bell curve) regardless of original distribution

Magic: Sample means are normally distributed (n > 30)
Use: Confidence intervals, hypothesis testing
```

**Hypothesis Testing:**
```
H₀ (null): No effect ("New feature doesn't improve conversion")
H₁ (alt): There is effect ("New feature improves conversion")

Test: Collect data → Calculate p-value
p < 0.05: Reject H₀ (statistically significant)
p ≥ 0.05: Fail to reject H₀ (not significant)
```

---

## Priority 9 — Business Intelligence

### Metrics That Drive Decisions

**System Flow — Metrics Hierarchy:**
```
North Star Metric (company-wide goal)
    ↓
Department Metrics (product, marketing, sales)
    ↓
Team Metrics (features, campaigns, pipelines)
    ↓
Individual Metrics (tickets, commits, calls)
```

**Key Metrics:**

| Metric | Formula | Use |
|--------|---------|-----|
| **Conversion Rate** | Conversions / Visitors × 100 | Funnel effectiveness |
| **Churn Rate** | Lost customers / Total × 100 | Retention health |
| **Retention** | Returning users / Total × 100 | Product stickiness |
| **LTV** | Avg revenue × Lifespan | Customer value |
| **CAC** | Marketing spend / New customers | Acquisition cost |
| **NPS** | % promoters - % detractors | Customer satisfaction |
| **ARPU** | Revenue / Users | Monetization |

**A/B Testing:**
```
Step 1: Hypothesis ("Green button increases clicks by 5%")
Step 2: Split users randomly (50% A, 50% B)
Step 3: Run experiment (min 2 weeks or significance)
Step 4: Measure (click rate, conversion)
Step 5: Test significance (p < 0.05)
Step 6: Implement winner

Pitfalls: Multiple testing, peeking, sample size too small
```

**Cohort Analysis:**
```
Cohort: Users who signed up in same month
Track: % active in Month 1, Month 2, Month 3...

        M1   M2   M3   M4
Jan:   100%  60%  45%  35%
Feb:   100%  55%  40%   —
Mar:   100%  50%   —    —

Insight: Earlier cohorts retain better → Product improved over time
```

---

## Priority 10 — Data Engineering

### Pipelines That Scale

**System Flow — Data Pipeline:**
```
Sources (DB, API, files) → Ingestion (batch/stream) → Processing (ETL/ELT)
    → Storage (warehouse/lake) → Serving (BI, ML, apps)
```

**Orchestration:**
```
Airflow DAG:
  extract_task → validate_task → transform_task → load_task
       ↓              ↓               ↓              ↓
    Success       Success         Success       Success
       ↓              ↓               ↓              ↓
  next_task      next_task       next_task      notify_slack

Dependencies: Task B runs only after Task A succeeds
Scheduling: Daily at 2 AM, or event-triggered
Monitoring: Alert on failure, retry 3 times
```

**Schema Evolution:**
```
V1: users(id, name, email)
V2: users(id, name, email, phone)        → Add column (backward compatible)
V3: users(id, name, email, phone, age)  → Add column
V4: users(id, name, email, phone, age, country) → Add column

Backward compatible: Add columns, don't remove/rename
Forward compatible: Old readers ignore new fields
```

**Data Partitioning:**
```
Why: Query only relevant data → Faster, cheaper
How: Split by date, region, category

Example: orders table
  orders_2024_01, orders_2024_02, orders_2024_03...
  Query: WHERE date = '2024-01-15' → Only scan January partition
```

---

## Priority 11 — Big Data Fundamentals

### When Data Gets Big

**System Flow — Distributed Processing:**
```
Data (10 TB) → Split into chunks (128 MB each) → Distribute across cluster
    → Process in parallel (map) → Shuffle/sort → Aggregate (reduce) → Result
```

**Why Traditional DBs Fail:**
```
Single machine limits: RAM, CPU, disk
Big data: Billions of rows, petabytes of storage
Solution: Distributed storage + distributed computing

Hadoop: HDFS (distributed storage) + MapReduce (distributed compute)
Spark: In-memory computing (100x faster than MapReduce)
```

**Spark vs Hadoop:**

| Hadoop | Spark |
|--------|-------|
| Disk-based | In-memory |
| Map + Reduce only | DAG of operations |
| Batch only | Batch + streaming |
| Slower | Faster |
| More mature ecosystem | Modern, unified |

**File Formats:**

| Format | Structure | Best For |
|--------|-----------|----------|
| **CSV** | Row-based, text | Small data, human-readable |
| **JSON** | Semi-structured | APIs, logs |
| **Parquet** | Columnar, compressed | Analytics, big data |
| **ORC** | Columnar, Hive-optimized | Hadoop ecosystem |
| **Avro** | Row-based, schema-evolution | Streaming, serialization |

**Why Parquet?**
```
Columnar: Read only needed columns (vs row-based reads all)
Compressed: Smaller storage, faster transfer
Predicate pushdown: Filter at storage level (skip irrelevant data)
Self-describing: Schema embedded in file
```

---

## Priority 12 — Machine Learning Foundations

### Data Powers Intelligence

**System Flow — ML Pipeline:**
```
Raw Data → Cleaning → Feature Engineering → Split (train/val/test)
    → Model Training → Evaluation → Deployment → Monitoring → Retrain
```

| Term | Definition | Example |
|------|-----------|---------|
| **Feature** | Input variable | User age, purchase history |
| **Label** | Target to predict | Will churn? (yes/no) |
| **Training** | Learning from labeled data | Fit model on 80% of data |
| **Validation** | Tune hyperparameters | Evaluate on 10% during training |
| **Test** | Final evaluation | Evaluate on 10% never seen before |
| **Inference** | Making predictions | Predict churn for new user |

**Feature Engineering:**
```
Raw: timestamp = "2024-01-15 14:30:00"
Features:
  - hour_of_day = 14
  - day_of_week = 1 (Monday)
  - is_weekend = False
  - is_holiday = False
  - days_since_last_purchase = 7

Good features → Better model than complex algorithm
```

---

## Priority 13 — Data Governance

### Data You Can Trust

**System Flow — Governance Framework:**
```
Data created → Classified (sensitivity) → Access controlled → Tracked (lineage)
    → Quality monitored → Retention policy → Archive/Delete
```

**Key Concepts:**

| Concept | What | Example |
|---------|------|---------|
| **Data Ownership** | Who is responsible? | Product team owns user data |
| **Data Lineage** | Where did this come from? | Report → Warehouse → ETL → Source DB |
| **Data Catalog** | Inventory of all data assets | Table schemas, owners, quality scores |
| **Access Control** | Who can see what? | Role-based, column-level masking |
| **Retention** | How long to keep? | 7 years for financial, 30 days for logs |

**GDPR Basics:**
```
Right to access: User can request their data
Right to erasure: User can request deletion ("right to be forgotten")
Right to portability: Data in machine-readable format
Consent: Must be explicit, withdrawable
Breach notification: Within 72 hours
```

**Data Lineage vs Metadata:**
```
Metadata: What is this data? (schema, type, owner)
Lineage: Where did this data come from? (source → transformations → destination)

Example: Dashboard metric "Monthly Revenue"
  Metadata: Currency=USD, Updated=daily, Owner=finance
  Lineage: transactions DB → ETL job → warehouse → dbt model → BI tool
```

---

## Priority 14 — Production Data Systems

### Reliable Data Infrastructure

**System Flow — Production Data Architecture:**
```
Sources → Ingestion (Kafka) → Processing (Spark) → Storage (S3 + Warehouse)
    → Serving (API) → Apps/BI/ML
    ↓
Monitoring (Datadog) → Alerting (PagerDuty) → On-call response
```

**Reliability Patterns:**

| Pattern | How | Example |
|---------|-----|---------|
| **Replication** | Copy data to multiple nodes | 3 copies in different AZs |
| **Checkpointing** | Save progress periodically | Spark writes to S3 every 10 min |
| **Idempotency** | Same input = same output | ETL job can safely rerun |
| **Dead letter queue** | Failed events stored separately | Kafka topic for invalid messages |
| **Backpressure** | Slow down producer if consumer slow | Buffer limits, rate limiting |

**Why Monitor Pipelines?**
```
□ Data freshness: Last update > 1 hour?
□ Data volume: Row count dropped 50%?
□ Error rate: > 1% of records failed?
□ Schema changes: Unexpected new columns?
□ SLAs: Report delivered by 9 AM?
```

---

## Priority 15 — Data-Driven Decision Making

### From Data to Action

**System Flow — Decision Framework:**
```
Business Question → Hypothesis → Data Collection → Analysis → Insight
    → Recommendation → Decision → Action → Measure → Learn
```

**Metrics-Driven Development:**
```
Feature idea → Define success metric → Build MVP → A/B test → Measure
    → Significant improvement? → Ship or iterate

Example:
  Idea: New onboarding flow
  Metric: Day-7 retention
  Result: 15% improvement (p < 0.05)
  Decision: Ship to all users
```

**Experimentation vs Intuition:**
```
Intuition: "I think users want X" → Build → Launch → Hope
Experiment: "Hypothesis: X improves metric Y by Z%" → Test → Measure → Decide

Data-driven: Decisions backed by evidence
Pitfall: Analysis paralysis (too much data, no action)
Balance: Use data to inform, judgment to decide
```

**Root Cause Analysis:**
```
Symptom: Conversion rate dropped
  → Why? Checkout page errors increased
    → Why? Payment API latency spiked
      → Why? Database connection pool exhausted
        → Why? New feature opened too many connections
          → Why? No connection limit in code review checklist
            → Fix: Add connection pooling review to checklist
```

---

## Common Interview Questions — Quick Answers


| Question | One-Liner |
|----------|-----------|
| Data vs Information | Data = raw facts. Information = data + context, actionable |
| Structured vs Unstructured | Structured = rows/columns (20%). Unstructured = text/images/video (80%) |
| Metadata importance | Data about data. Enables discovery, governance, lineage, quality tracking |
| Batch vs Streaming | Batch = periodic, high throughput. Streaming = real-time, low latency |
| ETL vs ELT | ETL = transform before load (strict). ELT = load raw then transform (flexible) |
| Data Lake vs Warehouse | Lake = raw, all formats, schema-on-read. Warehouse = structured, processed, schema-on-write |
| OLTP vs OLAP | OLTP = transactions, fast writes, normalized. OLAP = analytics, fast reads, denormalized |
| Data quality dimensions | Accuracy, completeness, consistency, validity, timeliness, uniqueness, integrity |
| Correlation vs Causation | Correlation = variables move together. Causation = one causes other. Test with experiments |
| Types of analytics | Descriptive (what), Diagnostic (why), Predictive (what will), Prescriptive (what should) |
| Mean vs Median | Mean = average (sensitive to outliers). Median = middle (robust). Use median for skewed data |
| CLT importance | Sample means approach normal distribution. Enables confidence intervals and hypothesis testing |
| Feature vs Label | Feature = input variable. Label = target to predict |
| Training vs Inference | Training = learning from data. Inference = making predictions on new data |
| Why partition datasets | Query only relevant data → Faster, cheaper. Split by date/region/category |
| Schema evolution | Handle changes to data structure over time. Add columns (backward compatible), don't remove |
| Spark vs Hadoop | Spark = in-memory, faster, unified. Hadoop = disk-based, mature, batch-only |
| Why Parquet | Columnar, compressed, predicate pushdown. Optimized for analytics queries |
| Data lineage | Track data from source → transformations → destination. Essential for debugging and compliance |
| GDPR key rights | Access, erasure, portability, explicit consent, breach notification within 72 hours |
| Why monitor pipelines | Detect freshness issues, volume drops, errors, schema changes, SLA breaches |
| Data-driven decisions | Hypothesis → Experiment → Measure → Decide. Data informs, judgment decides |

---

## Quick Reference: Data Storage Decision Tree

```
Need transactions? → Relational DB (PostgreSQL, MySQL)
Need flexible schema? → Document DB (MongoDB, DynamoDB)
Need analytics? → Data Warehouse (Snowflake, BigQuery)
Need raw storage? → Data Lake (S3 + Athena)
Need both? → Lakehouse (Databricks, Delta Lake)
Need caching? → Key-Value (Redis)
Need relationships? → Graph DB (Neo4j)
Need time-series? → Time-Series DB (InfluxDB, TimescaleDB)
```

---

## Quick Reference: Data Pipeline Checklist

```
□ Data sources identified and documented
□ Ingestion method chosen (batch/stream)
□ Validation rules defined
□ Transformation logic tested
□ Schema evolution strategy
□ Error handling and dead letter queue
□ Monitoring and alerting
□ Data quality checks
□ Access controls and encryption
□ Retention and archival policy
□ Lineage tracking
□ Disaster recovery plan
```

---

## Final Tip: Interview Flow for Data Questions

```
1. LIFECYCLE → Describe data from creation to decision (collection → storage → processing → analysis → action)
2. QUALITY → How you ensure data quality (validation, monitoring, governance)
3. STORAGE → Choose right storage for the use case (OLTP vs OLAP vs Lake)
4. PROCESSING → Batch vs stream, ETL vs ELT, tools (Spark, Kafka)
5. ANALYSIS → Types of analytics, metrics, A/B testing
6. GOVERNANCE → Security, privacy, compliance, lineage
7. PRODUCTION → Reliability, monitoring, scaling
```

> ***Always remember:*** Data is only valuable when it's accurate, timely, and actionable. The strongest engineers understand the full data lifecycle — from a user click to a business decision.
