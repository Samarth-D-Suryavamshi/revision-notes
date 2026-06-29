# Software Engineering Practices

---

# Priority 1 — Software Development Fundamentals

## 1. Introduction to Software Engineering

**Programming vs Software Engineering**
```
Programming: Write code that works
Software Engineering: Write code that works + is maintainable + scalable + testable + deployable + monitorable
```

**SDLC = Software Development Life Cycle**
```
Requirement Gathering → Feasibility → Design → Development → Testing → Deployment → Maintenance
```

**Functional vs Non-Functional Requirements**

| Functional | Non-Functional |
|-----------|-----------------|
| What system does | How well it does it |
| "User can book ticket" | "Page loads in <2s", "99.9% uptime" |


**Quality Attributes**

| Attribute | Meaning | Example |
|-----------|---------|---------|
| **Maintainability** | Easy to modify | Clean code, tests, docs |
| **Extensibility** | Easy to add features | Plugin architecture, interfaces |
| **Reliability** | Works consistently | Error handling, retries |
| **Scalability** | Handles growth | Horizontal scaling, caching |
| **Security** | Protected from threats | Auth, encryption, input validation |

---

## 2. SDLC Models

**System Flow — How each model handles development:**

**Waterfall**
```
Requirements → Design → Code → Test → Deploy → Maintain
     ↓          ↓       ↓      ↓       ↓        ↓
   Fixed    Fixed   Fixed  Fixed  Fixed    Fixed
```
- Sequential, no going back
- Use: Small projects, clear requirements, regulated industries (banking, healthcare)

**Agile**
```
Sprint 1: Plan → Design → Code → Test → Review → Deploy
Sprint 2: Plan → Design → Code → Test → Review → Deploy
Sprint 3: Plan → Design → Code → Test → Review → Deploy
```
- Iterative, continuous feedback
- Use: Most product companies, evolving requirements

**Comparison:**

| Waterfall | Agile |
|-----------|-------|
| Fixed scope, fixed timeline | Flexible scope, fixed sprints |
| Changes are expensive | Changes welcomed |
| Big bang delivery | Continuous delivery |
| Heavy documentation | Working software over docs |
| Customer sees product at end | Customer sees product every sprint |

**Other Models:**

- **Incremental** = Build in chunks (core first, then features)
- **Iterative** = Build rough version → refine → refine
- **Spiral** = Risk-driven, cycles of planning + risk analysis + engineering + evaluation
- **V-Model** = Verification (left) ↔ Validation (right), each dev phase has matching test phase

---

# Priority 2 — Agile Development

## 3. Agile Methodology

**Agile Manifesto (4 Values)**
```
Individuals and interactions     > Processes and tools
Working software                 > Comprehensive documentation
Customer collaboration           > Contract negotiation
Responding to change             > Following a plan
```

**12 Principles (Key Ones)**

- Deliver working software frequently (weeks, not months)
- Welcome changing requirements
- Business people and developers work together daily
- Working software is primary measure of progress
- Continuous attention to technical excellence
- Simplicity — maximize work not done

**System Flow:**
```
Backlog → Sprint Planning → Daily Standup → Sprint Execution → Sprint Review → Sprint Retrospective → Repeat
```

---

## 4. Scrum Framework

**System Flow — Scrum Cycle:**
```
Product Backlog (all features) 
    ↓
Sprint Planning (2 weeks worth) → Sprint Backlog
    ↓
Daily Scrum (15 min standup) → What did I do? What will I do? Any blockers?
    ↓
Sprint Execution (2 weeks)
    ↓
Sprint Review (demo to stakeholders)
    ↓
Sprint Retrospective (what went well? what to improve?)
    ↓
Increment (shippable product)
    ↓
Repeat
```

**Roles:**

| Role | Responsibility |
|------|---------------|
| **Product Owner** | Owns backlog, prioritizes features, speaks for customer |
| **Scrum Master** | Removes blockers, facilitates ceremonies, protects team |
| **Dev Team** | Self-organizing, cross-functional, delivers increment |

**Artifacts:**

| Artifact | What it is |
|----------|-----------|
| **Product Backlog** | All features, bugs, tech debt (prioritized) |
| **Sprint Backlog** | Items committed for current sprint |
| **Increment** | Potentially shippable work at sprint end |

**Ceremonies:**

| Ceremony | Duration | Purpose |
|----------|----------|---------|
| Sprint Planning | 2-4 hrs | What to build this sprint? |
| Daily Standup | 15 min | Sync, unblock |
| Sprint Review | 1-2 hrs | Demo to stakeholders |
| Sprint Retrospective | 1 hr | Team improvement |

**Scrum vs Agile:**
```
Agile = Philosophy (values + principles)
Scrum = Framework (roles + ceremonies + artifacts that implement Agile)
```

---

## 5. Kanban

**System Flow:**
```
Backlog → To Do → In Progress → Code Review → Testing → Done
              ↑         ↑           ↑
           WIP limit  WIP limit   WIP limit
```

**Key Concepts:**

- **Visual board** = See all work at a glance
- **WIP limits** = Max items per column (prevents overload)
- **Continuous flow** = No sprints, work pulled when capacity available

**Scrum vs Kanban:**

| Scrum | Kanban |
|-------|--------|
| Fixed sprints (2 weeks) | Continuous flow |
| Roles defined (PO, SM, Dev) | No required roles |
| Sprint backlog commitment | No commitment, pull when ready |
| Sprint review/retro | Continuous improvement |
| Use: Product teams | Use: Support/ops teams |

---

# Priority 3 — Version Control & Collaboration

## 6. Code Reviews

**System Flow:**
```
Dev writes code → Self-review → Create PR → Automated checks (CI) → Peer review → Address comments → Approve → Merge
```

**What to check in code review:**

| Category | Check |
|----------|-------|
| **Correctness** | Does it work? Edge cases handled? |
| **Design** | SOLID principles? Appropriate patterns? |
| **Readability** | Clear naming? Comments where needed? |
| **Tests** | Unit tests present? Cover edge cases? |
| **Security** | No secrets? Input validated? |
| **Performance** | N+1 queries? Unnecessary loops? |

**Best Practices:**

- Keep PRs small (<400 lines)
- Respond within 24 hours
- Be constructive, not critical
- Explain WHY, not just WHAT

---

## 7. Branching Strategies

(See Git notes for detail — quick reference here)

| Strategy | Flow | Best For |
|----------|------|----------|
| **Feature Branch** | `main` + `feature/*` → PR → merge | Small teams |
| **GitHub Flow** | `main` + short-lived branches → PR → merge → deploy | CI/CD, continuous deploy |
| **Git Flow** | `main` + `develop` + `feature` + `release` + `hotfix` | Scheduled releases, large teams |
| **Trunk-Based** | Everyone commits to `main`, feature flags | High velocity, experienced teams |

---

# Priority 4 — Testing

## 8. Testing Fundamentals

**Verification vs Validation**

| Verification | Validation |
|-------------|-----------|
| "Are we building it RIGHT?" | "Are we building the RIGHT thing?" |
| Code review, static analysis | User acceptance testing |
| Process compliance | Product meets needs |

**Test Pyramid**
```
        /\
       /  \\      E2E Tests (few, slow, expensive)
      /____\
     /      \\    Integration Tests (some, medium)
    /________\
   /          \\  Unit Tests (many, fast, cheap)
  /____________\
```

| Layer | Count | Speed | Cost | What it tests |
|-------|-------|-------|------|---------------|
| **Unit** | Many | Fast (<1s) | Low | Single function/class |
| **Integration** | Some | Medium | Medium | Components together |
| **E2E** | Few | Slow | High | Full user journey |

**Why automate?** → Fast feedback, repeatable, catches regressions, frees humans for exploratory testing.

---

## 9. Unit Testing

**System Flow:**
```
Write function → Write test (input → expected output) → Run test → Pass/Fail → Refactor → Repeat
```

**Key Concepts:**

| Concept | Definition | Example |
|---------|-----------|---------|
| **Test Case** | Input + expected output | `add(2,3)` should return `5` |
| **Assertion** | Check expected vs actual | `assertEquals(5, result)` |
| **Mock** | Fake object that verifies interactions | Mock `PaymentGateway` to verify `process()` called once |
| **Stub** | Fake object that returns canned data | Stub `Database` to return fake user |
| **Fixture** | Setup data for tests | Create test user before each test |

**Mock vs Stub:**
```
Mock: "Did you call me? How many times?" (verification)
Stub: "Here's fake data when called" (state)
```

**Why mocks?** → Isolate unit under test. Don't test database/network in unit tests.

**AAA Pattern:**
```java
@Test
void shouldCalculateTotal() {
    // Arrange
    Cart cart = new Cart();
    cart.addItem(new Item("Book", 10.0));

    // Act
    double total = cart.getTotal();

    // Assert
    assertEquals(10.0, total);
}
```

---

## 10. Integration Testing

**System Flow:**
```
Start test DB → Seed data → Call API endpoint → Verify response + DB state → Clean up
```

**What to verify:**

- API request/response contracts
- Database read/write operations
- External service interactions (with test doubles)
- Authentication/authorization flows

**Unit vs Integration:**

| Unit | Integration |
|------|-------------|
| One class/function | Multiple components |
| Mocks dependencies | Real or test DB/services |
| Fast (<100ms) | Slower (seconds) |
| "Does this work in isolation?" | "Do these work together?" |

---

## 11. End-to-End Testing

**System Flow:**
```
Browser opens → Navigate to login → Enter credentials → Click login → Verify dashboard loads → Click menu → Verify page → Logout
```

| Tool | Use Case |
|------|----------|
| **Selenium** | Legacy, cross-browser |
| **Cypress** | Modern, developer-friendly, fast |
| **Playwright** | Microsoft, auto-wait, parallel |

---

## 12. Regression Testing

**System Flow:**
```
New feature added → Run full test suite → Old tests still pass? → Yes: safe to deploy. No: regression detected
```

**Purpose:** Ensure new changes don't break existing functionality.
**Automation:** Run on every PR via CI pipeline.

---

## 13. Performance Testing

| Type | What it does | System Flow |
|------|-------------|-------------|
| **Load** | Normal expected traffic | 1000 users → measure response time |
| **Stress** | Beyond normal capacity | Keep increasing load until system breaks |
| **Spike** | Sudden traffic burst | 0 → 10000 users instantly |
| **Soak** | Sustained load over time | 1000 users for 24 hours → memory leaks? |

---

# Priority 5 — CI/CD

## 14. Continuous Integration (CI)

**System Flow:**
```
Dev pushes code → Webhook triggers → Pull code → Build → Run unit tests → Run integration tests → Static analysis → Report → Pass/Fail
```

**Why on every commit?** → Catch issues early. Fix when context is fresh. Prevents "works on my machine."

---

## 15. Continuous Delivery (CD)

**System Flow:**
```
CI passes → Deploy to staging → Run E2E tests → Manual approval → Deploy to production
```

**Key:** Production deployment is automated but requires manual trigger.

---

## 16. Continuous Deployment

**System Flow:**
```
CI passes → Deploy to staging → E2E tests pass → Auto-deploy to production → Monitor → Rollback if alerts fire
```

**Key:** Fully automated. No manual approval. Requires robust tests + monitoring + rollback.

**CD vs CD:**

| Continuous Delivery | Continuous Deployment |
|-------------------|----------------------|
| Auto everything EXCEPT final production push | Auto everything INCLUDING production |
| Manual gate before prod | No manual gate |
| Safer for regulated industries | Requires mature testing + monitoring |

---

## 17. CI/CD Tools

| Tool | Platform | Best For |
|------|----------|----------|
| **GitHub Actions** | GitHub | Tight GitHub integration, free for public repos |
| **Jenkins** | Self-hosted | Full control, complex pipelines, enterprise |
| **GitLab CI** | GitLab | Built-in, integrated with GitLab features |
| **CircleCI** | Cloud | Fast, easy setup, good for startups |

---

# Priority 6 — Build & Dependency Management

**System Flow:**
```
Source code → Build tool compiles → Runs tests → Packages → Publishes artifact → Deploys
```

| Tool | Language | What it manages |
|------|----------|----------------|
| **Maven** | Java | Dependencies (pom.xml), build lifecycle, plugins |
| **Gradle** | Java/Kotlin | Dependencies (build.gradle), faster builds, scripting |
| **npm** | JavaScript | Packages (package.json), scripts, lock file |
| **pip** | Python | Packages (requirements.txt), virtual envs |

**Maven vs Gradle:**

| Maven | Gradle |
|-------|--------|
| XML config (verbose) | Groovy/Kotlin DSL (concise) |
| Convention over config | Flexible, scriptable |
| Slower builds | Faster (incremental, parallel) |
| Mature ecosystem | Modern, Android default |

**Semantic Versioning (SemVer)**
```
MAJOR.MINOR.PATCH
  2  .  1  .  3

MAJOR: Breaking changes (API changes)
MINOR: New features, backward compatible
PATCH: Bug fixes
```

---

# Priority 7 — Logging

## 18. Logging Fundamentals

**System Flow:**
```
Code executes → Logger writes message → Appender sends to file/stdout/ELK → Log rotates → Old logs archived/deleted
```

**Log Levels (When to use):**

| Level | When to Use | Example |
|-------|-------------|---------|
| **TRACE** | Detailed execution flow | "Entering method X with params Y" |
| **DEBUG** | Development debugging | "Query returned 5 results" |
| **INFO** | Normal operations | "User logged in", "Order placed" |
| **WARN** | Unexpected but handled | "Slow query detected", "Retry attempt 2" |
| **ERROR** | Failed operation | "Payment failed", "DB connection lost" |
| **FATAL** | System crash | "Out of memory", "Disk full" |

**Structured Logging:**
```json
// Instead of: "User john logged in at 10:00"
{
  "timestamp": "2024-01-15T10:00:00Z",
  "level": "INFO",
  "message": "User logged in",
  "userId": "john",
  "correlationId": "abc-123",
  "service": "auth-service"
}
```

**Correlation ID:**
```
Request enters → Generate correlation-id → Pass through all services → All logs tagged with same ID → Trace full request path
```

**What NEVER to log:**

- Passwords, tokens, API keys
- PII (SSN, credit card numbers)
- Sensitive business data

**Log Rotation:**
```
app.log (current) → app.log.1 (yesterday) → app.log.2.gz (compressed) → ... → Delete after 30 days
```

---

# Priority 8 — Monitoring & Observability

## 19. Monitoring

**System Flow:**
```
App emits metrics → Collector (Prometheus) → Dashboard (Grafana) → Alert rules → Notification (PagerDuty/Slack) → On-call responds
```

**Key Definitions:**

| Term | Definition | Example |
|------|-----------|---------|
| **SLI** | Service Level Indicator | "Request latency", "Error rate" |
| **SLO** | Service Level Objective | "P95 latency < 200ms", "Error rate < 0.1%" |
| **SLA** | Service Level Agreement | "99.9% uptime or refund" (contract with customer) |

**Hierarchy:**
```
SLI (metric) → SLO (target) → SLA (contract)
```

**What to monitor:**

| Category | Metrics |
|----------|---------|
| **Performance** | Response time, throughput, CPU, memory |
| **Reliability** | Error rate, uptime, crash count |
| **Business** | Orders/min, signups/day, revenue |
| **Infrastructure** | Disk usage, network I/O, queue depth |

**Monitoring vs Logging:**

| Monitoring | Logging |
|-----------|---------|
| "Is the system healthy?" | "What happened in detail?" |
| Metrics, dashboards, alerts | Text records of events |
| Aggregated numbers | Individual events |
| "Error rate is 5%" | "User X got error Y at time Z" |

---

## 20. Observability

**Three Pillars:**
```
Logs: "What happened?" (text events)
Metrics: "How is it performing?" (numbers over time)
Traces: "Where did the request go?" (request path across services)
```

**System Flow — Observability Stack:**
```
App → Logs (ELK: Elasticsearch + Logstash + Kibana)
    → Metrics (Prometheus + Grafana)
    → Traces (OpenTelemetry + Jaeger/Zipkin)
```

| Tool | Purpose |
|------|---------|
| **Prometheus** | Metrics collection, alerting |
| **Grafana** | Dashboards, visualization |
| **ELK Stack** | Log aggregation, search, visualization |
| **OpenTelemetry** | Standard for traces, metrics, logs |
| **Jaeger/Zipkin** | Distributed tracing |

**Trace Example:**
```
[Gateway] → [Auth Service] → [User Service] → [Database]
   5ms         15ms            25ms             10ms
   Total: 55ms
```

---

# Priority 9 — Software Quality

**System Flow:**
```
Write code → Code review → Static analysis → Run tests → Merge → Monitor in prod → Refactor when needed
```

| Concept | Definition | Example |
|---------|-----------|---------|
| **Clean Code** | Readable, maintainable, well-tested code | Meaningful names, small functions |
| **Code Smell** | Indicator of deeper problem | Long method, duplicated code, god class |
| **Refactoring** | Improving code without changing behavior | Extract method, rename variable |
| **Technical Debt** | Shortcut taken now, cost later | Skipping tests, hardcoded values |
| **Static Analysis** | Automated code quality checks | SonarQube, ESLint, SpotBugs |
| **Linting** | Style/format enforcement | Prettier, Checkstyle |

**Common Code Smells:**
```
Long Method (>50 lines) → Extract smaller methods
Duplicated Code → Extract common logic
God Class (>500 lines) → Split responsibilities
Magic Numbers → Named constants
Feature Envy → Method belongs in different class
```

**Technical Debt Quadrant:**
```
Deliberate + Prudent: "We know, we'll fix later" (OK)
Deliberate + Reckless: "We don't have time for tests" (BAD)
Inadvertent + Prudent: "Now we know better, let's refactor" (OK)
Inadvertent + Reckless: "We didn't know any better" (BAD)
```

---

# Priority 10 — Release Management

**System Flow:**
```
Code ready → Version bump (SemVer) → Build artifact → Deploy to staging → Test → Deploy to production → Monitor
```

| Deployment Strategy | How it works | Risk |
|--------------------|-------------|------|
| **Blue-Green** | Two identical environments. Route traffic to one. Deploy to other. Switch traffic. Instant rollback = switch back. | High resource cost (2x infra) |
| **Canary** | Deploy to small % of users (5%). Monitor. Gradually increase to 100%. | Low risk, gradual exposure |
| **Rolling** | Replace instances one by one. No extra infra. | Medium risk, longer deployment |

**Rollback Strategy:**
```
Deploy fails → Monitor detects → Auto-rollback to previous version → Alert team → Investigate
```

---

# Priority 11 — Documentation

| Type | Purpose | Example |
|------|---------|---------|
| **README** | Project overview, setup, usage | GitHub repo front page |
| **API Docs** | How to use the API | OpenAPI/Swagger spec |
| **Code Docs** | Inline explanations | Javadoc, docstrings |
| **Architecture Docs** | System design, decisions | ADR, C4 diagrams |
| **ADR** | Record why decisions were made | "Why we chose PostgreSQL over MongoDB" |

**ADR Template:**
```
Title: Use Redis for caching
Status: Accepted
Context: High read load, low write
Decision: Use Redis with TTL
Consequences: Faster reads, eventual consistency
```

---

# Priority 12 — Engineering Best Practices

**Quick Reference:**

| Practice | What it means | Example |
|----------|-------------|---------|
| **DRY** | Don't Repeat Yourself | Extract common validation logic |
| **KISS** | Keep It Simple, Stupid | Simple loop vs over-engineered stream pipeline |
| **YAGNI** | You Aren't Gonna Need It | Don't build feature until requested |
| **SOLID** | Design principles (see OOD notes) | Single responsibility, open-closed, etc. |
| **Separation of Concerns** | Each module does one thing | UI layer ≠ Business logic ≠ Data access |
| **Code Reviews** | Peer review before merge | PR process |
| **Pair Programming** | Two devs, one keyboard | Knowledge sharing, fewer bugs |

---

# Common Interview Scenarios — Quick Answers

| Question | One-Liner |
|----------|-----------|
| SDLC phases | Requirements → Feasibility → Design → Dev → Test → Deploy → Maintain |
| Waterfall vs Agile | Waterfall = sequential, fixed scope. Agile = iterative, flexible scope |
| Agile vs Scrum | Agile = philosophy. Scrum = framework implementing Agile |
| Scrum roles | PO (backlog), SM (facilitate), Dev Team (build) |
| Sprint Planning | Team commits to sprint backlog from product backlog |
| Unit vs Integration | Unit = one component. Integration = components together |
| Mock vs Stub | Mock = verify interactions. Stub = provide fake data |
| CI vs CD | CI = auto build+test. CD = auto deploy (delivery = manual gate, deployment = fully auto) |
| Why automate testing? | Fast feedback, repeatable, catches regressions |
| Why CI/CD? | Reduce manual errors, faster delivery, consistent process |
| Logging vs Monitoring | Logging = what happened. Monitoring = is it healthy? |
| Logs vs Metrics vs Traces | Logs = events. Metrics = numbers. Traces = request path |
| Log levels | TRACE→DEBUG→INFO→WARN→ERROR→FATAL |
| What not to log | Passwords, tokens, PII, credit cards |
| Debug production issue | Check logs → metrics → traces → reproduce locally → fix → deploy |
| Monitor backend service | Latency, error rate, throughput, CPU, memory, queue depth |
| Technical Debt | Shortcuts taken now that cost later |
| Code Smells | Indicators of deeper problems (long methods, duplication, god classes) |
| SemVer | MAJOR.MINOR.PATCH (breaking.features.fixes) |
| Blue-Green vs Canary | Blue-Green = instant switch, 2x infra. Canary = gradual rollout, 1x infra |

---

# Debugging Production Issues — System Flow

```
Alert fires (P99 latency > 500ms)
    ↓
Check dashboard (Grafana) → Is it widespread or specific endpoint?
    ↓
Check logs (ELK) → Search correlation ID → Find error stack trace
    ↓
Check traces (Jaeger) → Which service is slow? Database? External API?
    ↓
Check metrics (Prometheus) → CPU spike? Memory leak? DB connections exhausted?
    ↓
Reproduce locally with same data → Root cause identified
    ↓
Fix → Deploy → Monitor → Resolve incident
```

---

# Final Tip: Interview Flow for SE Practices Questions

```
1. Start with SDLC/Agile context (how team works)
2. Explain testing strategy (pyramid, unit + integration + E2E)
3. Describe CI/CD pipeline (build → test → deploy)
4. Mention monitoring (logs + metrics + traces)
5. Discuss code quality (reviews, clean code, tech debt management)
6. Give real example from your project
```

> **Always remember:** Interviewers want to hear that you think beyond "it works on my machine." Show you care about the full lifecycle: code → test → deploy → monitor → maintain.
