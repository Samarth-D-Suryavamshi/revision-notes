# Data Analytics Interview Notes — System Flow Approach

---

# Priority 1 — Mathematics & Statistics

## 1. Mathematics Fundamentals

**Linear Algebra Basics**
```
Vector = [1, 2, 3] → Direction + magnitude in space
Matrix = Grid of numbers → Transform data, represent relationships
Matrix Multiplication: A(m×n) × B(n×p) = C(m×p) → Rows of A dot columns of B

Use case: Feature vectors in ML, correlation matrices, recommendation systems
```

**Calculus Basics**
```
Derivative = Rate of change → Slope of curve at a point
Partial Derivative = Derivative w.r.t one variable, others constant
Optimization: Find where derivative = 0 (minimum/maximum)

Use case: Gradient descent in ML, cost function minimization
```

---

## 2. Statistics

### Descriptive Statistics

**System Flow — Data → Summary:**
```
Raw Data: [10, 20, 30, 40, 50]
    ↓
Mean = 30 (average)
Median = 30 (middle value)
Mode = none (no repeats)
    ↓
Variance = 250 (spread from mean)
Std Dev = 15.8 (variance in original units)
    ↓
Q1 = 17.5, Q3 = 42.5, IQR = 25 (middle 50% spread)
```

| Measure | Formula | When to Use | Example |
|---------|---------|-------------|---------|
| **Mean** | Sum / Count | Symmetric data, no outliers | Avg revenue per customer |
| **Median** | Middle value | Skewed data, outliers present | Avg salary (CEO skews mean) |
| **Mode** | Most frequent | Categorical data | Most popular product |
| **Variance** | Σ(x - mean)² / n | Measure spread | Consistency of delivery times |
| **Std Dev** | √Variance | Same units as data | ±2 days delivery variation |
| **IQR** | Q3 - Q1 | Robust to outliers | Salary range excluding extremes |

**Skewness & Kurtosis:**
```
Skewness: -1 ←——0——→ +1
  Left skew: Tail on left (mean < median) → Most values high
  Right skew: Tail on right (mean > median) → Most values low, few high outliers

Kurtosis: How "peaked" the distribution is
  High = sharp peak, heavy tails (more outliers)
  Low = flat peak, light tails
```

---

### Probability

**Conditional Probability:**
```
P(A|B) = P(A and B) / P(B)

Example: P(Buy | Added to cart) = P(Buy and Added to cart) / P(Added to cart)
= 30% / 50% = 60% conversion rate
```

**Bayes' Theorem:**
```
P(A|B) = P(B|A) × P(A) / P(B)

Example: Spam filter
P(Spam|Word "free") = P("free"|Spam) × P(Spam) / P("free")
= 0.8 × 0.3 / 0.4 = 0.6 → 60% chance spam
```

---

### Distributions

| Distribution | Shape | Use Case | Example |
|-------------|-------|----------|---------|
| **Normal** | Bell curve | Natural phenomena, CLT applies | Heights, test scores, measurement errors |
| **Binomial** | Discrete, two outcomes | Success/failure counts | Click-through rate, conversion rate |
| **Poisson** | Discrete, rare events | Count of events in interval | Website crashes per day, customer arrivals |
| **Uniform** | Flat, equal probability | Random selection | Dice roll, random sampling |
| **Exponential** | Decaying curve | Time between events | Time between website visits, machine failure |

**Normal Distribution:**
```
     ▲
    /|\
   / | \\     68% within 1σ
  /  |  \    95% within 2σ
 /   |   \   99.7% within 3σ
/____|____\
    μ-3σ  μ-2σ  μ-1σ  μ  μ+1σ  μ+2σ  μ+3σ
```

---

### Inferential Statistics

**System Flow — Sample → Population Inference:**
```
Population (1M users) → Random Sample (1000 users) → Calculate sample mean → Infer population mean
```

**Central Limit Theorem (CLT):**
```
Take many samples → Calculate each sample mean → Plot sample means → Approaches normal distribution

Magic: Even if original data is NOT normal, sample means ARE normal (n > 30)
```

**Confidence Interval:**
```
Sample mean ± (Z-score × Standard Error)

Example: Mean = 100, SE = 5, 95% CI → 100 ± 1.96×5 = [90.2, 109.8]
"We are 95% confident true population mean lies between 90.2 and 109.8"
```

**Hypothesis Testing:**
```
Step 1: H₀ (null) = No effect, H₁ (alternative) = There is effect
Step 2: Choose significance level (α = 0.05)
Step 3: Calculate test statistic
Step 4: Find p-value
Step 5: p < 0.05 → Reject H₀ (significant result)
```

| Test | When to Use | Example |
|------|-------------|---------|
| **t-test** | Compare means (2 groups) | A/B test: conversion rate Group A vs B |
| **Chi-Square** | Categorical association | Is gender related to product preference? |
| **ANOVA** | Compare means (3+ groups) | Which ad campaign has highest CTR? |

**p-value:**
```
p = 0.03 → 3% chance results are random → Reject null (significant)
p = 0.20 → 20% chance results are random → Fail to reject (not significant)

p < 0.05: "Statistically significant"
p ≥ 0.05: "Not statistically significant"
```

---

# Priority 2 — SQL (Highest Priority)

## System Flow — Query Execution Order

```
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

(Not written order, but execution order!)
```

## Core Queries

**SELECT + WHERE + ORDER BY + LIMIT:**
```sql
SELECT name, revenue 
FROM customers 
WHERE country = 'USA' AND revenue > 1000
ORDER BY revenue DESC
LIMIT 10;
```

**GROUP BY + HAVING:**
```sql
SELECT country, COUNT(*) as customers, AVG(revenue) as avg_revenue
FROM customers
GROUP BY country
HAVING COUNT(*) > 100;  -- Filter groups, not rows
```

**CASE (Conditional logic):**
```sql
SELECT name,
  CASE 
    WHEN revenue > 10000 THEN 'VIP'
    WHEN revenue > 1000 THEN 'Premium'
    ELSE 'Standard'
  END as segment
FROM customers;
```

---

## Joins

**System Flow — How Joins Work:**
```sql
-- INNER JOIN: Only matching rows from both tables
SELECT c.name, o.order_id
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
-- Result: Customers who placed orders

-- LEFT JOIN: All from left, matching from right
SELECT c.name, o.order_id
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
-- Result: All customers, NULL for those with no orders

-- RIGHT JOIN: All from right, matching from left (rarely used)
-- FULL JOIN: All from both, NULL where no match
-- CROSS JOIN: Cartesian product (every row × every row)
```

| Join | Result | Use |
|------|--------|-----|
| **INNER** | Matching rows only | "Show orders with customer details" |
| **LEFT** | All left + matching right | "Show all customers, with orders if any" |
| **RIGHT** | All right + matching left | Rare (use LEFT with swapped tables) |
| **FULL** | All from both | "Show all customers and all orders, matched where possible" |
| **CROSS** | All combinations | "Generate all possible pairs" |

---

## Window Functions

**System Flow — Calculate across row "window" without collapsing rows:**
```sql
-- ROW_NUMBER: Rank without gaps
SELECT name, revenue,
  ROW_NUMBER() OVER (ORDER BY revenue DESC) as rank
FROM customers;

-- RANK: Rank with gaps (1, 2, 2, 4)
-- DENSE_RANK: Rank without gaps (1, 2, 2, 3)

-- Running total
SELECT date, revenue,
  SUM(revenue) OVER (ORDER BY date) as running_total
FROM sales;

-- Partition by category
SELECT category, product, revenue,
  RANK() OVER (PARTITION BY category ORDER BY revenue DESC) as category_rank
FROM products;
```

| Function | What it does | Example |
|----------|-------------|---------|
| **ROW_NUMBER()** | Unique rank per row | Top 3 per category |
| **RANK()** | Rank with ties (gaps) | Competition ranking |
| **DENSE_RANK()** | Rank with ties (no gaps) | Grade distribution |
| **LEAD()/LAG()** | Access next/previous row | Day-over-day change |
| **SUM() OVER** | Running total | Cumulative revenue |
| **AVG() OVER** | Moving average | 7-day rolling average |

---

## CTEs (Common Table Expressions)

**System Flow — Break complex query into readable steps:**
```sql
WITH monthly_sales AS (
  SELECT DATE_TRUNC('month', order_date) as month, SUM(amount) as revenue
  FROM orders
  GROUP BY 1
),
growth AS (
  SELECT month, revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month,
    (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month) * 100 as growth_pct
  FROM monthly_sales
)
SELECT * FROM growth WHERE growth_pct > 10;
```

---

## Interview Patterns

**Top-N per Group:**
```sql
WITH ranked AS (
  SELECT category, product, revenue,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY revenue DESC) as rn
  FROM products
)
SELECT * FROM ranked WHERE rn <= 3;
```

**Running Total:**
```sql
SELECT date, daily_revenue,
  SUM(daily_revenue) OVER (ORDER BY date) as cumulative
FROM sales;
```

**Cohort Analysis:**
```sql
-- Retention by signup month
WITH cohorts AS (
  SELECT user_id, DATE_TRUNC('month', signup_date) as cohort_month
  FROM users
),
activity AS (
  SELECT user_id, DATE_TRUNC('month', login_date) as activity_month
  FROM logins
)
SELECT c.cohort_month,
  COUNT(DISTINCT c.user_id) as cohort_size,
  COUNT(DISTINCT CASE WHEN a.activity_month = c.cohort_month + INTERVAL '1 month' THEN c.user_id END) as month_1_retained
FROM cohorts c
LEFT JOIN activity a ON c.user_id = a.user_id
GROUP BY c.cohort_month;
```

**Funnel Analysis:**
```sql
SELECT 
  COUNT(DISTINCT user_id) as step_1_views,
  COUNT(DISTINCT CASE WHEN event = 'add_to_cart' THEN user_id END) as step_2_cart,
  COUNT(DISTINCT CASE WHEN event = 'checkout' THEN user_id END) as step_3_checkout,
  COUNT(DISTINCT CASE WHEN event = 'purchase' THEN user_id END) as step_4_purchase,

  ROUND(step_2_cart * 100.0 / step_1_views, 2) as view_to_cart_pct,
  ROUND(step_4_purchase * 100.0 / step_1_views, 2) as overall_conversion_pct
FROM events
WHERE event IN ('page_view', 'add_to_cart', 'checkout', 'purchase');
```

**Query Optimization:**
```sql
-- Check execution plan
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123;

-- Add index
CREATE INDEX idx_orders_customer ON orders(customer_id);

-- Covering index (includes all columns needed)
CREATE INDEX idx_orders_customer_date ON orders(customer_id, order_date) INCLUDE (amount);
```

| Optimization | When | How |
|-------------|------|-----|
| **Index** | Slow WHERE/JOIN | `CREATE INDEX` on filter columns |
| **Covering Index** | Frequent column lookups | Include columns in index |
| **Partition** | Large tables | Partition by date/range |
| **Avoid SELECT *** | Large tables | Select only needed columns |
| **Filter early** | Complex queries | Use WHERE before JOIN |

---

# Priority 3 — Excel (High ROI)

| Function | What it does | Example |
|----------|-------------|---------|
| **VLOOKUP** | Vertical lookup (search left, return right) | `=VLOOKUP(A2, table, 2, FALSE)` |
| **XLOOKUP** | Modern lookup (any direction, no column index) | `=XLOOKUP(A2, lookup_range, return_range)` |
| **INDEX-MATCH** | Flexible lookup (row + column) | `=INDEX(return_range, MATCH(A2, lookup_range, 0))` |
| **SUMIFS** | Sum with multiple conditions | `=SUMIFS(revenue, region, "North", year, 2024)` |
| **COUNTIFS** | Count with multiple conditions | `=COUNTIFS(status, "Active", region, "North")` |
| **Pivot Table** | Summarize data dynamically | Drag fields to rows/columns/values |
| **Power Query** | ETL within Excel | Connect → Transform → Load |
| **Power Pivot** | Data model + DAX measures | Relate tables, create calculated fields |

**Pivot Table System Flow:**
```
Raw Data → Insert PivotTable → Drag 'Region' to Rows → Drag 'Revenue' to Values (SUM)
→ Add 'Year' to Columns → Filter by 'Product Category' → Refresh when data updates
```

---

# Priority 4 — Python for Analytics

**Pandas System Flow:**
```python
import pandas as pd

# Load
df = pd.read_csv('sales.csv')

# Inspect
df.head()        # First 5 rows
df.info()        # Column types, non-null counts
df.describe()    # Statistics (mean, std, min, max, quartiles)

# Clean
df.drop_duplicates()
df.fillna(0)                    # or df['col'].fillna(df['col'].median())
df = df[df['revenue'] > 0]      # Remove invalid rows

# Transform
df['month'] = df['date'].dt.month
df['category'] = df['category'].str.upper()

# Analyze
df.groupby('region')['revenue'].sum()
df.groupby('region')['revenue'].agg(['sum', 'mean', 'count'])

# Merge
df_merged = pd.merge(df_orders, df_customers, on='customer_id', how='left')

# Pivot
df.pivot_table(values='revenue', index='region', columns='month', aggfunc='sum')
```

**NumPy Basics:**
```python
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
arr.mean()       # 3.0
arr.std()        # 1.414
arr.reshape(2, 3) # Reshape array
np.where(arr > 3, 'high', 'low')  # Conditional
```

---

# Priority 5 — Data Visualization

## When to Use Which Chart

| Chart | Use When | Example |
|-------|----------|---------|
| **Line** | Trends over time | Monthly revenue, stock prices |
| **Bar** | Compare categories | Sales by region, top 10 products |
| **Histogram** | Distribution of continuous data | Age distribution, order values |
| **Box Plot** | Distribution + outliers | Salary by department, delivery times |
| **Scatter** | Relationship between 2 variables | Ad spend vs revenue, height vs weight |
| **Heatmap** | Matrix of values | Correlation matrix, sales by month×region |
| **Pie** | Part of whole (few categories) | Market share (use sparingly) |
| **Treemap** | Hierarchical proportions | Budget breakdown by category |
| **Waterfall** | Cumulative changes | Profit breakdown: revenue → costs → profit |

**Box Plot Interpretation:**
```
    │    ○  ← Outlier
  Q3├───────
    │  ┌─┐
Median├─│ │──
    │  └─┘
  Q1├───────
    │
```

**Dashboard Design Principles:**
```
1. Start with business question → "What decision will this dashboard inform?"
2. KPIs at top (big numbers, red/green indicators)
3. Trends next (line charts, time series)
4. Breakdowns below (bar charts, tables)
5. Filters on side (date range, region, category)
6. Keep it simple: 3-5 charts max per dashboard
7. Color: Red = bad, Green = good, consistent usage
```

---

# Priority 6 — Data Cleaning & Wrangling

**System Flow — Raw Data → Clean Data:**
```
Raw Data → Inspect → Handle Missing → Remove Duplicates → Fix Types → Detect Outliers → Encode → Scale → Ready for Analysis
```

| Problem | Detection | Fix |
|---------|-----------|-----|
| **Missing Values** | `df.isnull().sum()` | Drop (if <5%), Impute mean/median/mode, or flag |
| **Duplicates** | `df.duplicated().sum()` | `df.drop_duplicates()` |
| **Outliers** | Box plot, Z-score > 3, IQR method | Remove, cap, or transform (log) |
| **Wrong Types** | `df.info()` | `pd.to_datetime()`, `astype('category')` |
| **Inconsistent Text** | `df['col'].value_counts()` | Standardize: lower(), strip(), replace() |
| **Encoding** | Categorical variables | One-hot encoding, label encoding |
| **Scaling** | Different units | Normalization (0-1), Standardization (z-score) |

**Outlier Detection (IQR Method):**
```python
Q1 = df['revenue'].quantile(0.25)
Q3 = df['revenue'].quantile(0.75)
IQR = Q3 - Q1
lower = Q1 - 1.5 * IQR
upper = Q3 + 1.5 * IQR
outliers = df[(df['revenue'] < lower) | (df['revenue'] > upper)]
```

---

# Priority 7 — Exploratory Data Analysis (EDA)

**System Flow — EDA Process:**
```
1. Understand data: What columns? What do they mean? (Univariate)
2. Find relationships: Which variables correlate? (Bivariate)
3. Segment: How do groups differ? (Multivariate)
4. Hypothesize: What patterns suggest business actions?
```

**Univariate:**
```python
df['revenue'].describe()      # Central tendency + spread
df['revenue'].hist()          # Distribution shape
df['category'].value_counts() # Frequency table
```

**Bivariate:**
```python
df[['revenue', 'ad_spend']].corr()  # Correlation matrix
sns.scatterplot(x='ad_spend', y='revenue', data=df)  # Relationship
sns.boxplot(x='category', y='revenue', data=df)      # Group comparison
```

**Correlation vs Causation:**
```
Correlation: Ice cream sales ↔ Drowning incidents (both rise in summer)
Causation: Ad spend increase → Revenue increase (direct cause)

Rule: Correlation ≠ Causation. Always ask: "Is there a confounding variable?"
```

---

# Priority 8 — Business Analytics

**System Flow — Business Metrics:**
```
Acquisition → Activation → Retention → Revenue → Referral (AARRR)
```

| Metric | Definition | Formula | Example |
|--------|-----------|---------|---------|
| **Conversion Rate** | % who complete action | Actions / Visitors × 100 | 3% purchase rate |
| **Retention** | % users return | Users returning / Total users × 100 | Day-7 retention = 40% |
| **Churn** | % users who leave | Users lost / Total users × 100 | Monthly churn = 5% |
| **LTV** | Lifetime value | Avg revenue per user × Lifespan | $500 per customer |
| **CAC** | Customer acquisition cost | Marketing spend / New customers | $50 per customer |
| **ROI** | Return on investment | (Gain - Cost) / Cost × 100 | 200% ROI |
| **ARPU** | Average revenue per user | Total revenue / Users | $25/month |
| **MAU/DAU** | Monthly/Daily active users | Count unique users | DAU/MAU = stickiness |

**A/B Testing:**
```
Step 1: Define hypothesis ("New button color increases clicks by 5%")
Step 2: Split users randomly (50% A, 50% B)
Step 3: Run test (minimum 2 weeks or until significance)
Step 4: Measure metric (click rate)
Step 5: Statistical test (t-test, p < 0.05)
Step 6: Implement winner if significant
```

**Cohort Analysis:**
```
Cohort: Users who signed up in same month
Track: What % are active in Month 1, Month 2, Month 3...

        M1   M2   M3   M4
Jan:    100%  60%  45%  35%
Feb:    100%  55%  40%  —
Mar:    100%  50%  —    —

Insight: Earlier cohorts retain better → Product improved over time
```

**Customer Segmentation (RFM):**
```
Recency: How recently purchased? (R: 1-5)
Frequency: How often purchased? (F: 1-5)
Monetary: How much spent? (M: 1-5)

Segments:
R=5,F=5,M=5 → Champions (reward them)
R=1,F=5,M=5 → At Risk (win-back campaign)
R=5,F=1,M=1 → New Customers (nurture)
R=1,F=1,M=1 → Lost (don't spend here)
```

---

# Priority 9 — Databases

**OLTP vs OLAP:**
| OLTP | OLAP |
|------|------|
| Online Transaction Processing | Online Analytical Processing |
| Day-to-day operations | Reporting & analysis |
| Fast writes, normalized | Fast reads, denormalized |
| Row-oriented | Column-oriented |
| MySQL, PostgreSQL | Snowflake, BigQuery, Redshift |
| "Process this order" | "What were sales last quarter?" |

**Star Schema:**
```
        Fact Table (Sales)
        ├── date_id → Date Dimension
        ├── product_id → Product Dimension
        ├── customer_id → Customer Dimension
        └── region_id → Region Dimension

        Measures: quantity, revenue, cost
```

**Snowflake Schema:**
```
        Same as Star but dimensions are normalized
        Product → Category → Subcategory (multiple levels)
        More storage efficient, more complex joins
```

| Schema | Pros | Cons | Use |
|--------|------|------|-----|
| **Star** | Simple, fast queries | Redundancy, larger storage | Most BI, fast performance |
| **Snowflake** | Less redundancy, normalized | More joins, slower | Complex hierarchies, storage constraints |

---

# Priority 10 — ETL

**System Flow — ETL Pipeline:**
```
Extract → Transform → Load
   ↓         ↓         ↓
Source    Cleanse    Target
(DB/API)  (Filter,   (Data
          Join,      Warehouse)
          Aggregate)
```

**ELT (Modern):**
```
Extract → Load → Transform
   ↓       ↓        ↓
Source → Data Lake → Transform in-place (SQL/Python)
         (Raw data)  (BigQuery, Snowflake)
```

| Tool | Purpose | Example |
|------|---------|---------|
| **Airflow** | Orchestrate pipelines | Schedule daily ETL jobs |
| **dbt** | Transform in warehouse | SQL-based data modeling |
| **Spark** | Big data processing | Process TBs of log data |

---

# Priority 11 — Big Data (Basic)

| Concept | What it is | Example |
|---------|-----------|---------|
| **Hadoop** | Distributed storage (HDFS) + processing (MapReduce) | Store PBs of data across cluster |
| **Spark** | In-memory distributed processing | 100x faster than MapReduce |
| **Data Lake** | Raw data storage (structured + unstructured) | S3 with all company data |
| **Data Warehouse** | Structured, processed data for analysis | Snowflake, BigQuery |
| **Parquet** | Columnar storage format | Efficient for analytics queries |
| **ORC** | Optimized row columnar (Hadoop) | Similar to Parquet |

---

# Priority 12 — Reporting

**System Flow — Report Creation:**
```
Business Question → Data Collection → Analysis → Insights → Visualization → Story → Decision
```

**Storytelling with Data:**
```
1. Hook: "Revenue dropped 20% last month"
2. Context: "Here's what happened..."
3. Evidence: Charts showing trend, breakdown by segment
4. Insight: "Churn increased in Enterprise segment"
5. Action: "Launch retention campaign for Enterprise"
```

---

# Common Interview Questions — Quick Answers

| Question | One-Liner |
|----------|-----------|
| Mean vs Median | Mean = average (sensitive to outliers). Median = middle (robust). Use median for skewed data |
| Correlation vs Causation | Correlation = two variables move together. Causation = one causes the other. Always check for confounders |
| p-value | Probability results are due to chance. p < 0.05 = statistically significant |
| SQL Window Functions | Calculate across row sets without collapsing rows. ROW_NUMBER, RANK, SUM OVER, LEAD/LAG |
| LEFT JOIN vs INNER JOIN | INNER = matching rows only. LEFT = all left rows + matching right (NULL if no match) |
| A/B Testing | Randomly split users, show variant A vs B, measure difference, test significance |
| Clean dirty data | Handle missing (impute/drop), remove duplicates, fix types, standardize text, detect outliers |
| Detect outliers | IQR method (Q1-1.5×IQR to Q3+1.5×IQR), Z-score > 3, visual inspection (box plot) |
| Tableau vs Power BI | Tableau = better visuals, steeper learning. Power BI = Microsoft ecosystem, cheaper, easier |
| Dashboard you built | "I built a sales dashboard tracking revenue, conversion, and retention with filters for region/time" |
| KPIs to track | Acquisition (CAC), Engagement (DAU/MAU), Revenue (ARPU), Retention (churn), Satisfaction (NPS) |
| OLTP vs OLAP | OLTP = transactional, fast writes, normalized. OLAP = analytical, fast reads, denormalized |
| Star vs Snowflake | Star = simpler, faster, redundant. Snowflake = normalized, less storage, more joins |
| Data Warehouse vs Database | DW = analytical, columnar, aggregated. DB = transactional, row-oriented, current state |
| Optimize SQL query | Add indexes, use EXPLAIN ANALYZE, avoid SELECT *, filter early, use covering indexes |

---

# Quick Reference: SQL Pattern Cheat Sheet

| Pattern | Query Structure |
|---------|----------------|
| **Top-N per group** | `WITH ranked AS (SELECT *, ROW_NUMBER() OVER (PARTITION BY group ORDER BY col DESC) as rn FROM table) SELECT * FROM ranked WHERE rn <= N` |
| **Running total** | `SELECT *, SUM(col) OVER (ORDER BY date) as running_total FROM table` |
| **Month-over-month** | `SELECT *, LAG(revenue) OVER (ORDER BY month) as prev, (revenue - LAG(revenue)) / LAG(revenue) as growth FROM ...` |
| **Cohort retention** | `WITH cohorts AS (...) SELECT cohort_month, COUNT(DISTINCT user_id) as total, COUNT(DISTINCT CASE WHEN month_diff = 1 THEN user_id END) as m1 FROM ...` |
| **Funnel** | `SELECT COUNT(DISTINCT CASE WHEN step = 1 THEN user_id END) as s1, COUNT(DISTINCT CASE WHEN step = 2 THEN user_id END) as s2 FROM events` |
| **Duplicate detection** | `SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > 1` |
| **Gaps in sequence** | `SELECT id, LEAD(id) OVER (ORDER BY id) as next_id, LEAD(id) - id as gap FROM table` |

---

# Final Tip: Interview Flow for Data Analytics

```
1. Understand the business problem (what decision?)
2. Identify data sources (SQL, Excel, API)
3. Clean and validate data (missing, outliers, consistency)
4. Explore (distributions, correlations, trends)
5. Analyze (segment, cohort, funnel, A/B test)
6. Visualize (right chart, clear story)
7. Recommend (actionable insights, not just numbers)
```

**Always remember:** Analytics is about driving decisions. Every analysis should answer: "So what? What should we do differently?"
