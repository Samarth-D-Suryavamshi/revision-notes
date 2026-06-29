# Developer's Mindset

## Priority 1 — Writeability

### Writing Code That Expresses Intent

**System Flow — Code Expression:**
```
Idea → Express in code → Another dev reads → Understands intent → Modifies safely

Bad:  for i in range(len(arr)): if arr[i] > 0: sum += arr[i]
Good: positive_numbers = [n for n in numbers if n > 0]
      total = sum(positive_numbers)
```

**Principles:**

| Principle | Meaning | Example |
|-----------|---------|---------|
| **DRY** | Don't Repeat Yourself | Extract common logic to function |
| **KISS** | Keep It Simple, Stupid | Simple loop > clever one-liner |
| **YAGNI** | You Aren't Gonna Need It | Don't build abstraction "just in case" |
| **Least Astonishment** | Code should behave as expected | `getUser()` shouldn't delete user |
| **Convention over Config** | Follow standards, minimize setup | Rails, Spring Boot defaults |

**Why Small Functions?**
```
Long function (100 lines): Reader keeps 100 lines in working memory
Small functions (10 lines each): Reader understands one at a time

Rule: Function does ONE thing. Name describes exactly what it does.
```

**Why Avoid Clever Code?**
```
Clever: result = [x for x in data if x & 1 and not x % 3]
Clear:  odd_and_not_divisible_by_three = [
            num for num in data 
            if is_odd(num) and not is_divisible_by(num, 3)
        ]

Clever saves 1 second writing, costs 10 minutes reading
```

---

## Priority 2 — Readability

### Code That Reads Like Prose

**System Flow — Reading Code:**
```
Open file → Scan structure → Read function names → Dive into details → Understand flow

Goal: At each step, the code tells you what's happening without digging deeper
```

**Naming Conventions:**

| What | Bad | Good | Why |
|------|-----|------|-----|
| Variable | `d` | `elapsed_days` | Self-documenting |
| Function | `process()` | `calculate_invoice_total()` | Action + object |
| Class | `Manager` | `PaymentProcessor` | Single responsibility |
| Boolean | `flag` | `is_payment_valid` | Reads like question |
| Constant | `MAX` | `MAX_RETRY_ATTEMPTS` | Context included |

**Self-Documenting Code:**
```python
# Bad: Needs comment explaining
# Check if user can access resource
def check(u, r):
    if u.role == 'admin' or (u.role == 'editor' and r.owner == u):
        return True
    return False

# Good: Code explains itself
def can_access_resource(user, resource):
    if user.is_admin():
        return True
    if user.is_editor() and resource.is_owned_by(user):
        return True
    return False
```

**When to Comment:**
```
✓ WHY, not WHAT (code says what, comment says why)
✓ Complex algorithms (explain approach)
✓ Workarounds (link to bug ticket)
✓ API contracts (preconditions, side effects)
✗ What the code does (should be obvious)
✗ Outdated comments (worse than no comments)
```

**Anti-Patterns:**

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| **Magic Numbers** | `if status == 7` | `if status == STATUS_APPROVED` |
| **Deep Nesting** | 5+ levels of if/for | Extract functions, early returns |
| **Long Functions** | >50 lines | Extract smaller functions |
| **Long Parameters** | >3-4 params | Use object/params class |
| **Hidden Side Effects** | `getUser()` modifies DB | Name reflects action: `fetchAndUpdateUser()` |
| **Inconsistent Naming** | `getData()`, `retrieveInfo()`, `fetchDetails()` | Pick one: `fetch_*` |

---

## Priority 3 — Maintainability

### Code That Evolves Gracefully

**System Flow — Software Evolution:**
```
Requirement change → Find relevant code → Understand it → Modify → Test → Deploy

Maintainable: Each step is fast and safe
Unmaintainable: Each step is slow and risky
```

**Design Principles:**

| Principle | Meaning | How |
|-----------|---------|-----|
| **Separation of Concerns** | Each module handles one aspect | UI ≠ Business ≠ Data |
| **Encapsulation** | Hide internal state | Private fields, public methods |
| **Abstraction** | Hide complexity, expose essence | Interface, facade |
| **Loose Coupling** | Modules depend minimally | Interfaces, events, DI |
| **High Cohesion** | Related things stay together | Class has single purpose |

**SOLID (Quick Reference):**

| Principle | Violation | Fix |
|-----------|-----------|-----|
| **SRP** | God class (500+ lines) | Split into focused classes |
| **OCP** | `if-else` for new types | Polymorphism, strategy pattern |
| **LSP** | Square extends Rectangle | Redesign hierarchy |
| **ISP** | Fat interface | Split into smaller interfaces |
| **DIP** | `new Database()` in business logic | Inject `IDatabase` interface |

**Technical Debt:**
```
Deliberate: "We'll fix this later, ship now" → Track in backlog
Inadvertent: "We didn't know better" → Learn, refactor

Interest: Every feature takes longer because of debt
Principal: Time to fix the underlying issue

Strategy: 20% of sprint capacity for debt reduction
```

**Refactoring Safely:**
```
1. Ensure tests pass (green)
2. Make small change
3. Run tests (should still pass)
4. Commit
5. Repeat

Golden rule: Never refactor without tests
```

---

## Priority 4 — Code Quality

### Measurable Excellence

**System Flow — Quality Assurance:**
```
Write code → Static analysis → Tests → Review → Deploy → Monitor → Feedback → Improve
```

**Quality Dimensions:**

| Dimension | Question | How to Measure |
|-----------|----------|---------------|
| **Correctness** | Does it do what it should? | Tests, user feedback |
| **Robustness** | Does it handle bad input? | Error handling, fuzz testing |
| **Reliability** | Does it work consistently? | Uptime, error rates |
| **Reusability** | Can it be used elsewhere? | Modularity, no hidden dependencies |
| **Testability** | Can we verify it? | Dependency injection, small functions |
| **Extensibility** | Can we add features? | Open-closed principle |

**Metrics:**

| Metric | What | Target |
|--------|------|--------|
| **Cyclomatic Complexity** | Number of paths through code | <10 per function |
| **Code Coverage** | % code executed by tests | >80% |
| **Maintainability Index** | Composite score (0-100) | >80 |
| **Coupling** | Dependencies between modules | Low |
| **Cohesion** | Relatedness within module | High |

**Lines of Code:**
```
Fewer LOC ≠ Better code

Concise: 10 lines doing one thing → Good
Cryptic: 1 line doing 10 things → Bad
Verbose: 100 lines doing one thing → Bad

Goal: Minimum code to express intent clearly
```

---

## Priority 5 — Debugging Mindset

### Systematic Problem Solving

**System Flow — Debugging Process:**
```
1. REPRODUCE → Make it fail consistently (same inputs → same failure)
2. ISOLATE → Minimal case that triggers bug (remove unrelated code)
3. HYPOTHESIZE → List possible causes (don't guess, reason)
4. TEST → Design experiment to validate/invalidate each hypothesis
5. FIX → Smallest change that fixes root cause (not symptom)
6. VERIFY → Confirm fix works + no regressions (run full test suite)
7. PREVENT → Add test, improve process, document lesson
```

**Root Cause vs Symptom:**
```
Symptom: NullPointerException at line 42
Direct cause: Object not initialized
Root cause: Constructor not called because dependency injection failed
Fix: Fix DI configuration + add null check + add test

Fixing symptom (add null check): Hides the real problem
Fixing root cause (fix DI): Solves it permanently
```

**Binary Search Debugging:**
```
Bug in 1000 lines → Comment out half → Test → Bug in remaining 500
→ Comment out half → Test → Bug in remaining 250
→ ... → Find exact line

Git bisect: Binary search commits to find when bug introduced
```

**Assertions:**
```python
def divide(a, b):
    assert b != 0, "Divisor cannot be zero"  # Catch bugs in development
    assert isinstance(a, (int, float)), "a must be numeric"
    return a / b

# Assertions: Development-time checks (can be disabled in production)
# Exceptions: Runtime checks (always active)
```

---

## Priority 6 — Engineering Trade-offs

### No Perfect Solution, Only Best Fit

**System Flow — Trade-off Analysis:**
```
Requirement → Identify constraints → List options → Score each → Pick best → Document why
```

**Common Trade-offs:**

| Trade-off | Option A | Option B | When to Choose |
|-----------|----------|----------|----------------|
| **Readability vs Performance** | Clean code | Optimized code | Default: readability. Optimize when profiled |
| **Simplicity vs Flexibility** | Simple | Configurable | MVP: simple. Platform: flexible |
| **Speed vs Quality** | Ship fast | Ship perfect | Startup: speed. Enterprise: quality |
| **Memory vs CPU** | Cache everything | Compute on demand | Memory cheap: cache. CPU cheap: compute |
| **Time vs Space** | Precompute | Compute live | Query frequent: precompute. Query rare: compute |

**Example — Readability vs Performance:**
```python
# Readable (O(n²))
def has_duplicate_readable(nums):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False

# Fast (O(n))
def has_duplicate_fast(nums):
    return len(nums) != len(set(nums))

# Decision: n < 1000 → readable. n > 1M → fast. Profile first.
```

**Why Trade-offs Are Unavoidable:**
```
CAP Theorem: Consistency, Availability, Partition tolerance — pick 2
No free lunch: Every optimization has a cost
Context matters: Best choice depends on constraints
```

---

## Priority 7 — Collaboration

### Code Is Read More Than Written

**System Flow — Code Review:**
```
Author writes code → Self-review → Open PR → Automated checks → Peer review → Address feedback → Approve → Merge
```

**Good Code Review:**

| Aspect | Good | Bad |
|--------|------|-----|
| **Tone** | "Consider using a constant here" | "This is wrong" |
| **Specificity** | "Line 42: This could be null" | "Fix this" |
| **Education** | "Pattern X handles this case" | Just reject |
| **Priority** | Block on correctness, suggest on style | Block on everything |
| **Speed** | Respond within 4 hours | Leave for days |

**Resolving Disagreements:**
```
1. Assume positive intent
2. Ask questions, don't dictate
3. Back with evidence (docs, benchmarks, patterns)
4. Escalate if deadlock (tech lead decides)
5. Document decision (ADR if significant)
6. Move on (don't hold grudges)
```

**Pair Programming:**
```
Driver: Writes code (focuses on syntax, immediate problem)
Navigator: Reviews code, thinks strategically, catches errors

Switch every 15-30 minutes

Benefits: Knowledge sharing, fewer bugs, better design
Cost: 15% slower initially, fewer bugs long-term
```

---

## Priority 8 — Production Thinking

### Code That Runs in the Real World

**System Flow — Production Mindset:**
```
Development: "It works on my machine"
Production: "It works for 1M users, under load, with failures, while being monitored"
```

**Defensive Programming:**
```python
# Never trust input
def process_payment(amount, user_id):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if not isinstance(user_id, str) or len(user_id) != 36:
        raise ValueError("Invalid user ID format")

    try:
        result = payment_gateway.charge(amount, user_id)
    except PaymentError as e:
        logger.error(f"Payment failed: {e}", extra={"user_id": user_id})
        raise  # Re-raise after logging

    return result
```

**Error Handling Hierarchy:**
```
1. Prevent (validation, type checking)
2. Detect (assertions, monitoring)
3. Recover (retries, fallbacks, circuit breakers)
4. Fail gracefully (user-friendly error, don't crash)
5. Alert (notify team, log context)
```

**Observability:**
```
Logs: "What happened?" (structured, with correlation IDs)
Metrics: "Is it healthy?" (latency, errors, throughput)
Traces: "Where is it slow?" (request path across services)

Every production service needs all three
```

**Backward Compatibility:**
```
API v1: GET /users/{id}
API v2: GET /users/{id} (adds new field, doesn't remove old)

Breaking change: Remove field, rename endpoint, change behavior
Non-breaking: Add optional field, new endpoint, deprecate old

Strategy: Version in URL or header. Support old version for 6-12 months.
```

---

## Priority 9 — Continuous Improvement

### Never Stop Learning

**System Flow — Improvement Loop:**
```
Learn → Apply → Reflect → Teach → Learn deeper
```

**Learning Strategies:**

| Strategy | How | Example |
|----------|-----|---------|
| **Read source code** | Study how experts solve problems | Read Redis, Linux kernel |
| **Code reviews** | Learn from feedback | Every review is a lesson |
| **Refactor legacy** | Understand why code evolved | "Why was this done this way?" |
| **Write about it** | Teaching forces clarity | Blog posts, talks, documentation |
| **Open source** | Contribute to real projects | Fix bugs, add features |
| **Engineering journal** | Document decisions and lessons | "Today I learned..." |

**Post-Mortem Template:**
```markdown
# Incident Post-Mortem: API Outage 2024-01-15

## Summary
API down for 23 minutes. 500 errors for all users.

## Timeline
14:00 - Deploy v2.3.1
14:05 - Error rate spikes
14:10 - PagerDuty alert
14:15 - Rollback initiated
14:23 - Service recovered

## Root Cause
New query missing index → Table scan → DB CPU 100% → Connection pool exhausted

## Impact
- 23 min downtime
- ~5000 failed requests
- No data loss

## Lessons Learned
- Add DB query review to CI
- Load test before production deploy
- Better monitoring on DB CPU

## Action Items
- [ ] Add EXPLAIN to CI pipeline
- [ ] Set up load testing environment
- [ ] Add DB CPU alert
```

---

# Common Interview Questions — Quick Answers

| Question | One-Liner |
|----------|-----------|
| What makes code maintainable? | Readable, testable, loosely coupled, well-documented, follows SOLID |
| Readability vs Performance | Default to readability. Optimize only when profiled and justified |
| Meaningful names important? | Yes. Names are 80% of communication. `elapsed_days` vs `d` |
| What is technical debt? | Shortcuts taken now that cost later. Track it, pay it down 20% per sprint |
| What are code smells? | Indicators of deeper problems: long methods, duplication, god classes, magic numbers |
| Why SOLID principles? | SRP=focus, OCP=extend, LSP=substitute, ISP=segregate, DIP=abstract. Together: flexible, testable |
| Good code review? | Constructive, specific, educational, fast, blocks on correctness not style |
| When to write comments? | WHY not WHAT, complex algorithms, workarounds, API contracts. Never state the obvious |
| Self-documenting code? | Code so clear it needs no comments. Good names, small functions, obvious flow |
| Debugging approach? | Reproduce → Isolate → Hypothesize → Test → Fix root cause → Verify → Prevent |
| Why avoid premature optimization? | Most "optimizations" don't matter. Profile first, optimize bottlenecks only |
| Defensive programming? | Never trust input. Validate, handle errors, fail gracefully, log context |
| Why observability? | Production is different. Logs/metrics/traces let you understand and fix issues |
| Backward compatibility? | Don't break existing users. Version APIs, deprecate gradually, communicate changes |
| Balance speed and quality? | MVP: ship fast with tests. Production: quality gates. Context-dependent |
| How to improve as engineer? | Read code, write code, get reviewed, review others, teach, reflect, repeat |
| Why read others' code? | Learn patterns, understand trade-offs, see different styles, find bugs |

---

# Quick Reference: Code Quality Checklist

```
Before submitting PR:
  □ Function does ONE thing (SRP)
  □ Name describes exactly what it does
  □ No magic numbers (use constants)
  □ No deep nesting (extract functions)
  □ Handles errors (don't ignore exceptions)
  □ Has tests (unit + integration)
  □ No duplication (DRY)
  □ Comments explain WHY not WHAT
  □ Complexity < 10 (cyclomatic)
  □ Self-reviewed (read as if you're the reviewer)
```

---

# Quick Reference: Production Readiness Checklist

```
Before deploying to production:
  □ Error handling (all paths covered)
  □ Input validation (never trust user input)
  □ Logging (structured, with correlation IDs)
  □ Metrics (latency, errors, throughput)
  □ Health checks (/health endpoint)
  □ Graceful shutdown (finish requests before exit)
  □ Circuit breaker (fail fast on dependency issues)
  □ Rate limiting (prevent abuse)
  □ Backward compatible (don't break existing clients)
  □ Rollback plan (can revert in < 5 minutes)
  □ Monitoring alerts (PagerDuty/Slack)
  □ Runbook (how to debug common issues)
```

---

# Final Tip: Interview Flow for Developer's Mindset

```
1. CODE EXAMPLE → Show a piece of code, explain your decisions
2. TRADE-OFFS → "I chose X over Y because..."
3. MAINTAINABILITY → "This makes it easy to change because..."
4. TESTING → "I test this by..."
5. PRODUCTION → "In production, I'd add..."
6. DEBUGGING → "If this broke, I'd..."
7. IMPROVEMENT → "Next time, I'd do differently..."
```

> ***Always remember:*** The code you write today will be read, modified, and debugged by someone else (probably future you). Optimize for that person's experience.
