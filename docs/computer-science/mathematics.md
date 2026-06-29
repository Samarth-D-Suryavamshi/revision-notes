
# MATHEMATICS


---

# PRIORITY 1 — MATHEMATICAL FOUNDATIONS

## 1. Number Systems

**1-liner:** Computers use binary (0/1) because transistors have 2 states: ON or OFF.

**Decimal → Binary Flow:**
```
Convert 13 to binary:
    13 ÷ 2 = 6 remainder 1
    6  ÷ 2 = 3 remainder 0
    3  ÷ 2 = 1 remainder 1
    1  ÷ 2 = 0 remainder 1
    Read remainders bottom-up → 1101
    Verify: 1×8 + 1×4 + 0×2 + 1×1 = 13 ✓
```

**Binary → Decimal Flow:**
```
1101 → 1×2³ + 1×2² + 0×2¹ + 1×2⁰ = 8 + 4 + 0 + 1 = 13
```

**Hexadecimal (Base-16) Flow:**
```
Binary: 1101 1110 1010 1100 → Group by 4 → DEAC (hex)
Why hex? Compact: 32-bit address = 8 hex chars vs 32 binary digits
```

**Signed Numbers — Two's Complement:**
```
Store -5 in 8-bit:
    Step 1: +5 in binary = 00000101
    Step 2: Invert bits    = 11111010 (one's complement)
    Step 3: Add 1          = 11111011 (two's complement)

Why two's complement? Single representation of zero, simple arithmetic:
    5 + (-5) = 00000101 + 11111011 = 00000000 (carry discarded) = 0 ✓
```

**One's Complement vs Two's Complement:**

| | One's Complement | Two's Complement |
|---|---|---|
| Zero | +0 (0000) and -0 (1111) — problem! | Single zero (0000) |
| Arithmetic | End-around carry needed | Natural binary addition |
| Range (8-bit) | -127 to +127 | -128 to +127 |
| Used by | Old systems | Modern computers (x86, ARM) |

---

## 2. Sets

**1-liner:** Set = unordered collection of distinct elements.

**Operations Flow:**
```
A = {1, 2, 3}, B = {2, 3, 4}

Union (A ∪ B):        Combine all → {1, 2, 3, 4}
Intersection (A ∩ B): Common only → {2, 3}
Difference (A - B):   In A, not in B → {1}
Symmetric Diff:       In A or B, not both → {1, 4}
Cartesian Product:      All pairs (a,b) → {(1,2), (1,3), (1,4), (2,2), ...} — |A|×|B| = 12 pairs
Power Set:            All subsets → {∅, {1}, {2}, {3}, {1,2}, {1,3}, {2,3}, {1,2,3}} — 2³ = 8 subsets
```

**Set Difference vs Symmetric Difference:**

- A - B = Only A's unique elements (directional).
- A Δ B = (A - B) ∪ (B - A) = Elements in exactly one set (bidirectional).

---

## 3. Relations

**1-liner:** Relation = set of ordered pairs connecting elements from two sets.

**Properties Flow:**
```
Relation R on set A:
    Reflexive:     ∀a ∈ A, (a,a) ∈ R      → Every element relates to itself
    Symmetric:     (a,b) ∈ R → (b,a) ∈ R   → If a→b then b→a
    Antisymmetric: (a,b) ∈ R and (b,a) ∈ R → a = b  → No two-way unless same
    Transitive:    (a,b) ∈ R and (b,c) ∈ R → (a,c) ∈ R  → Chain works

Equivalence Relation = Reflexive + Symmetric + Transitive → Partitions set into classes
    Example: "same age" → Groups people by age

Partial Order = Reflexive + Antisymmetric + Transitive → Hierarchy, some incomparable
    Example: "divides" on integers → 2 divides 4, but 2 and 3 incomparable
```

---

## 4. Functions

**1-liner:** Function = rule mapping each input to exactly one output.

**Types Flow:**
```
Injective (One-to-One):   f(a) = f(b) → a = b
    → No two inputs map to same output → |Domain| ≤ |Codomain|
    → Example: f(x) = 2x (doubles are unique)

Surjective (Onto):        Every y in codomain has some x where f(x) = y
    → Covers entire codomain → |Range| = |Codomain|
    → Example: f(x) = x mod 5 (outputs 0,1,2,3,4 — all covered)

Bijective:                Both injective AND surjective
    → Perfect one-to-one pairing → Has inverse function
    → Example: f(x) = x + 1 → f⁻¹(y) = y - 1
```

**Function Composition:**
```
f(x) = x + 2, g(x) = x × 3
(g ∘ f)(x) = g(f(x)) = g(x+2) = (x+2) × 3 = 3x + 6
    → Right to left: f first, then g
    → (f ∘ g)(x) = f(g(x)) = f(3x) = 3x + 2 → Different result!
```

---

# PRIORITY 2 — LOGIC & PROOFS

## 5. Mathematical Logic

**Truth Tables:**
```
P  Q  P∧Q  P∨Q  ¬P  P→Q
T  T   T    T    F    T
T  F   F    T    F    F
F  T   F    T    T    T
F  F   F    F    T    T

Key: P→Q (Implication) is FALSE only when P=T, Q=F
     "If it rains, ground is wet" — Only false if it rains but ground is dry
```

**De Morgan's Laws:**
```
¬(P ∧ Q) = ¬P ∨ ¬Q    → "Not both" = "At least one is not"
¬(P ∨ Q) = ¬P ∧ ¬Q    → "Not either" = "Both are not"

Example: "Not (rich AND happy)" = "Not rich OR not happy"
```

**Quantifiers:**
```
∀x ∈ ℕ, x > 0          → Universal: "For ALL natural numbers, x > 0" (True)
∃x ∈ ℕ, x = 5          → Existential: "There EXISTS a natural number equal to 5" (True)
¬(∀x P(x)) = ∃x ¬P(x)  → "Not all are P" = "At least one is not P"
¬(∃x P(x)) = ∀x ¬P(x)  → "None are P" = "All are not P"
```

**Implication vs Equivalence:**

- Implication (P → Q): If P then Q (one direction).
- Equivalence (P ↔ Q): P if and only if Q (both directions).

---

## 6. Proof Techniques

**Direct Proof:**
```
Claim: If n is even, then n² is even.
Proof: n even → n = 2k → n² = 4k² = 2(2k²) → n² is even ✓
```

**Proof by Contradiction:**
```
Claim: √2 is irrational.
Assume opposite: √2 = p/q (reduced fraction)
    → 2 = p²/q² → p² = 2q² → p² even → p even → p = 2k
    → 4k² = 2q² → q² = 2k² → q even → p and q both even → Contradiction!
    → Original claim true ✓
```

**Contrapositive:**
```
P → Q is equivalent to ¬Q → ¬P
"If it rains, ground is wet" ≡ "If ground is dry, it didn't rain"
Useful when direct proof is hard but contrapositive is easy.
```

**Mathematical Induction:**
```
Claim: 1 + 2 + ... + n = n(n+1)/2

Base case (n=1): 1 = 1(2)/2 = 1 ✓

Inductive step: Assume true for n=k → Prove for n=k+1
    1 + 2 + ... + k + (k+1) = k(k+1)/2 + (k+1)
                            = (k+1)(k/2 + 1)
                            = (k+1)(k+2)/2 ✓

→ True for all n ≥ 1
```

**Contradiction vs Contrapositive:**

- Contradiction: Assume claim false → Derive absurdity → Claim must be true.
- Contrapositive: Prove equivalent statement (¬Q → ¬P) instead of (P → Q).

---

# PRIORITY 3 — DISCRETE MATHEMATICS

## 7. Counting

**Permutation vs Combination:**
```
Permutation (order matters): P(n,r) = n!/(n-r)!
    → Arrange 3 people from 5 in a line: 5 × 4 × 3 = 60 ways
    → President, VP, Secretary: Alice-Bob ≠ Bob-Alice

Combination (order doesn't matter): C(n,r) = n!/(r!(n-r)!)
    → Choose 3 people from 5 for a team: 10 ways
    → Team {Alice, Bob, Carol} = {Bob, Carol, Alice}
```

**Pigeonhole Principle:**
```
10 pigeons, 9 holes → At least one hole has ≥ 2 pigeons
    → 367 people → At least 2 share a birthday (365 days)
    → Hash table with n buckets, n+1 items → Collision guaranteed
```

**Inclusion-Exclusion:**
```
|A ∪ B| = |A| + |B| - |A ∩ B|
    → Students in Math OR CS = Math students + CS students - Both
    → Without subtraction: Double-counted the intersection!
```

---

## 8. Recurrence Relations

**Fibonacci Flow:**
```
F(0) = 0, F(1) = 1
F(n) = F(n-1) + F(n-2)

Sequence: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34...
    → Each term = sum of previous two
    → Golden ratio: F(n+1)/F(n) → 1.618... as n → ∞
```

**Master Theorem (for divide-and-conquer):**
```
T(n) = aT(n/b) + O(n^d)

Compare a vs b^d:
    a < b^d  → T(n) = O(n^d)          → Merge: a=2, b=2, d=1 → 2 = 2^1 → O(n log n)
    a = b^d  → T(n) = O(n^d log n)    → Binary search: a=1, b=2, d=0 → 1 = 2^0 → O(log n)
    a > b^d  → T(n) = O(n^(log_b a))  → Strassen: a=7, b=2 → O(n^2.81)
```

---

# PRIORITY 4 — PROBABILITY

## Basics

**1-liner:** Probability = measure of uncertainty → 0 (impossible) to 1 (certain).

**Conditional Probability:**
```
P(A|B) = P(A ∩ B) / P(B)
    → "Probability of A GIVEN B happened"
    → Deck of cards: P(King | Red) = P(King AND Red) / P(Red) = (2/52) / (26/52) = 2/26 = 1/13
```

**Bayes' Theorem:**
```
P(A|B) = P(B|A) × P(A) / P(B)

Medical test example:
    Disease prevalence P(D) = 1%
    Test accuracy: P(T+|D) = 99% (true positive), P(T+|¬D) = 5% (false positive)

    P(D|T+) = P(T+|D) × P(D) / P(T+)
             = 0.99 × 0.01 / (0.99×0.01 + 0.05×0.99)
             = 0.0099 / 0.0594
             = 16.7%

    → Even with 99% accurate test, only 16.7% chance you have disease!
    → Because disease is rare, false positives outnumber true positives
```

**Independent Events:**
```
P(A ∩ B) = P(A) × P(B)  → Knowing A doesn't change B's probability
Coin flip: P(Head AND Head) = 0.5 × 0.5 = 0.25
```

---

## Probability Distributions

**Discrete Distributions:**

| Distribution | What it models | Example |
|--------------|---------------|---------|
| **Bernoulli** | Single trial, 2 outcomes | Coin flip (1 trial) |
| **Binomial** | n independent Bernoulli trials | 10 coin flips, count heads |
| **Poisson** | Rare events in fixed interval | Emails received per hour |
| **Geometric** | Trials until first success | Coin flips until first head |

**Continuous Distributions:**

| Distribution | What it models | Key Property |
|--------------|---------------|--------------|
| **Uniform** | Equal probability everywhere | Die roll (discrete), random number generator |
| **Normal** | Natural phenomena, central limit theorem | Bell curve, mean=median=mode |
| **Exponential** | Time between events | Time until next customer arrives |

**Normal Distribution:**
```
Bell curve: μ (mean) at center, σ (std dev) controls width
    68% within μ ± σ
    95% within μ ± 2σ
    99.7% within μ ± 3σ
    → Standard Normal: μ=0, σ=1 → Z = (X - μ) / σ
```

---

# PRIORITY 5 — STATISTICS

## Descriptive Statistics

**Measures of Central Tendency:**
```
Data: [1, 2, 2, 3, 100]
Mean:   (1+2+2+3+100)/5 = 21.6        → Affected by outliers (100 pulls it up)
Median: Sort → [1,2,2,3,100] → Middle = 2  → Robust to outliers
Mode:   Most frequent = 2               → Only measure for categorical data
```

**Spread:**
```
Variance: σ² = Σ(xᵢ - μ)² / N          → Average squared distance from mean
Standard Deviation: σ = √σ²            → Same units as data, interpretable

Data: [2, 4, 4, 4, 5, 5, 7, 9]
Mean = 5, Variance = 4, Std Dev = 2
    → Most values within 5 ± 2 = [3, 7]
```

**Percentiles & IQR:**
```
Q1 (25th percentile), Q2/Median (50th), Q3 (75th percentile)
IQR = Q3 - Q1 = middle 50% of data
Outliers: Values < Q1 - 1.5×IQR or > Q3 + 1.5×IQR
```

## Inferential Statistics

**Central Limit Theorem:**
```
Take ANY distribution → Sample n items → Calculate mean → Repeat many times
    → Distribution of sample means → Approaches NORMAL as n increases
    → n ≥ 30 usually sufficient
    → Why it matters: Can use normal-based stats even for non-normal populations
```

**Hypothesis Testing Flow:**
```
1. State H₀ (null hypothesis: no effect) and H₁ (alternative: there is effect)
2. Choose significance level α (usually 0.05)
3. Collect data → Calculate test statistic
4. Calculate p-value: P(observing data | H₀ is true)
5. p-value < α? → Reject H₀ → Effect is statistically significant
   p-value ≥ α? → Fail to reject H₀ → Not enough evidence
```

**p-value Interpretation:**
```
p = 0.03 → If H₀ were true, only 3% chance of seeing this data
    → "Unlikely under null" → Reject null → Result is significant

    NOT: "Probability that H₀ is true is 3%" (common misconception!)
    It IS: "Probability of this data assuming H₀"
```

---

# PRIORITY 6 — LINEAR ALGEBRA

## Vectors

**1-liner:** Vector = ordered list of numbers → represents direction and magnitude.

**Operations:**
```
v = [3, 4], w = [1, 2]
Addition:     v + w = [4, 6]           → Component-wise
Scalar mult:  2v = [6, 8]              → Scale each component
Dot product:  v · w = 3×1 + 4×2 = 11   → Scalar result
    → v · w = |v| |w| cos(θ) → Measures alignment
    → v · w = 0 → Perpendicular (orthogonal)
Cross product: v × w (3D only) → Perpendicular vector, magnitude = area of parallelogram
Magnitude:    |v| = √(3² + 4²) = 5    → Length of vector
Unit vector:   v̂ = v/|v| = [3/5, 4/5]  → Direction only, length = 1
```

---

## Matrices

**Matrix Multiplication Flow:**
```
A (2×3) × B (3×2) = C (2×2)

C[0][0] = A[0][0]×B[0][0] + A[0][1]×B[1][0] + A[0][2]×B[2][0]
        = row 0 of A · column 0 of B

C[i][j] = dot product of row i of A and column j of B
→ Inner dimensions must match: (m×n) × (n×p) = (m×p)
→ NOT commutative: A×B ≠ B×A (usually)
```

**Key Matrices:**

| Matrix | Property | Use |
|--------|----------|-----|
| **Identity I** | Diagonal = 1, rest = 0 | A × I = A (like multiplying by 1) |
| **Inverse A⁻¹** | A × A⁻¹ = I | Solve Ax = b → x = A⁻¹b |
| **Transpose Aᵀ** | Rows ↔ Columns | (AB)ᵀ = BᵀAᵀ |
| **Determinant** | Scalar | det(A) = 0 → No inverse (singular) |

**Eigenvalues & Eigenvectors:**
```
A × v = λ × v
    → Matrix A acts on vector v → Only scales it by λ (eigenvalue)
    → v doesn't change direction, just length

Why matter in ML?
    → PCA: Find directions of maximum variance (eigenvectors of covariance matrix)
    → PageRank: Eigenvector of link matrix = page importance scores
    → Stability analysis: Eigenvalues tell if system grows or decays
```

---

# PRIORITY 7 — CALCULUS

## Differential Calculus

**Derivative = Rate of Change:**
```
f(x) = x² → f'(x) = 2x
    → At x=3, slope = 6 → Function increasing steeply
    → At x=0, slope = 0 → Flat (local min/max)
    → At x=-2, slope = -4 → Function decreasing
```

**Partial Derivatives:**
```
f(x,y) = x²y + 3y
∂f/∂x = 2xy          → Rate of change in x direction (treat y as constant)
∂f/∂y = x² + 3       → Rate of change in y direction (treat x as constant)
```

**Chain Rule:**
```
f(g(x))' = f'(g(x)) × g'(x)
    → sin(x²)' = cos(x²) × 2x
    → Neural networks: Layer 3 depends on Layer 2 depends on Layer 1 → Chain rule propagates gradients
```

**Gradient:**
```
∇f = [∂f/∂x, ∂f/∂y, ∂f/∂z] → Vector pointing in direction of steepest ascent
    → Gradient descent: Move OPPOSITE to gradient → Find minimum
```

## Optimization

**Gradient Descent Flow:**
```
Start at random point x₀
Repeat:
    1. Compute gradient ∇f(x) → Direction of steepest increase
    2. Update: x = x - α × ∇f(x)  → Move opposite to gradient (α = learning rate)
    3. Until convergence (gradient ≈ 0)

    Like rolling a ball down a hill → Follows steepest path → Reaches valley (minimum)

    Local vs Global Minimum:
        → GD can get stuck in local valley → Not the deepest one
        → Solutions: Random restarts, momentum, adaptive learning rates
```

**Why Derivatives in ML?**
```
Loss function L(θ) = how wrong model is for parameters θ
    → Want to minimize L → Find θ where dL/dθ = 0
    → Derivative tells which direction to adjust θ → Backpropagation = chain rule applied
```

---

# PRIORITY 8 — GRAPH THEORY

**1-liner:** Graph = collection of nodes (vertices) connected by edges.

**Types:**
```
Undirected:  A — B — C    → Edge has no direction (friendship)
Directed:    A → B → C    → Edge has direction (Twitter follow)
Weighted:    A —5→ B      → Edge has cost/distance
Tree:        Connected, no cycles, n-1 edges
DAG:         Directed Acyclic Graph → No cycles, topological sort possible
```

**Tree vs Graph:**


| | Tree | Graph |
|---|---|---|
| Cycles | No | Can have |
| Edges | n-1 | Any number |
| Root | Has one | No concept |
| Path | Exactly one between any two nodes | Multiple or none |

**DAG Applications:**
```
Task scheduling: A → B means "A must finish before B starts"
    → Compile order: Parse → TypeCheck → Optimize → CodeGen
    → Course prerequisites: CS101 → CS201 → CS301
    → Package dependencies: npm install order
```

---

# PRIORITY 9 — BOOLEAN ALGEBRA

**1-liner:** Boolean algebra = rules for manipulating true/false values → Foundation of digital circuits.

**Laws:**
```
AND (·):  0·0=0, 0·1=0, 1·0=0, 1·1=1
OR (+):   0+0=0, 0+1=1, 1+0=1, 1+1=1
NOT (¬):  ¬0=1, ¬1=0

Distributive: A·(B+C) = A·B + A·C
Absorption:   A + A·B = A
Complement:   A + ¬A = 1,  A · ¬A = 0
```

**Simplification Example:**
```
F = A·B + A·¬B = A·(B + ¬B) = A·1 = A
    → Two branches simplify to just A!
```

---

# PRIORITY 10 — NUMBER THEORY

**Euclidean Algorithm (GCD):**
```
GCD(48, 18):
    48 ÷ 18 = 2 remainder 12
    18 ÷ 12 = 1 remainder 6
    12 ÷ 6  = 2 remainder 0
    → GCD = 6

    Key: GCD(a,b) = GCD(b, a mod b) → Repeat until remainder 0
```

**Modular Arithmetic:**
```
(a + b) mod m = ((a mod m) + (b mod m)) mod m
(a × b) mod m = ((a mod m) × (b mod m)) mod m

Applications:
    → Hash tables: index = hash(key) mod table_size
    → Clock arithmetic: 14:00 = 2:00 PM (14 mod 12 = 2)
    → Cryptography: RSA uses modular exponentiation
```

**Fast Exponentiation:**
```
Compute 3^13 mod 7:
    13 = 1101 in binary
    3^1  mod 7 = 3
    3^2  mod 7 = 9 mod 7 = 2
    3^4  mod 7 = 2^2 mod 7 = 4
    3^8  mod 7 = 4^2 mod 7 = 2
    3^13 = 3^8 × 3^4 × 3^1 = 2 × 4 × 3 = 24 mod 7 = 3
    → O(log n) instead of O(n)
```

---

# PRIORITY 11 — OPTIMIZATION

**Convex vs Non-Convex:**
```
Convex function: Bowl shape → Any local minimum IS global minimum
    → Gradient descent guaranteed to find global min
    → Example: f(x) = x²

Non-convex: Multiple valleys → GD can get stuck in local minimum
    → Example: f(x) = x⁴ - 3x³ + 2 (neural network loss surfaces)
```

**Stochastic Gradient Descent (SGD):**
```
Standard GD: Compute gradient on ALL data → Accurate but slow
SGD:         Compute gradient on ONE random sample → Noisy but fast
Mini-batch:  Compute gradient on small batch (32-512 samples) → Balance
    → SGD noise helps escape local minima!
```

---

# PRIORITY 12 — NUMERICAL METHODS

**Floating Point Issues:**
```
0.1 in binary: 0.0001100110011... (repeating!)
    → Can't represent exactly in finite bits → Rounding error
    → 0.1 + 0.2 = 0.30000000000000004

Overflow:  Number too large → Infinity
Underflow: Number too small → 0
```

**Numerical Stability:**
```
Unstable: x = 10^8, y = 10^8 + 1 → x - y = 0 (lost precision!)
Stable:   Compute difference before squaring, use Kahan summation
```

---

# PRIORITY 13 — INFORMATION THEORY

**Entropy:**
```
H(X) = -Σ p(x) × log₂(p(x))
    → Measures uncertainty/randomness in a distribution
    → Fair coin: H = -0.5×log₂(0.5) - 0.5×log₂(0.5) = 1 bit
    → Biased coin (99% heads): H ≈ 0.08 bits (very predictable)
    → Uniform distribution: Maximum entropy (most uncertain)
```

**Information Gain (Decision Trees):**
```
IG = H(parent) - weighted_avg(H(children))
    → How much uncertainty is reduced by splitting on this feature?
    → Choose feature with highest IG → Best split
```

**Cross Entropy (ML Loss):**
```
H(p,q) = -Σ p(x) × log(q(x))
    → p = true distribution, q = predicted distribution
    → Measures how different q is from p
    → Lower = better prediction
```

---

# PRIORITY 14 — CRYPTOGRAPHIC MATHEMATICS

**RSA High-Level Flow:**
```
Key Generation:
    1. Pick two large primes p, q
    2. n = p × q, φ(n) = (p-1)(q-1)
    3. Choose e (public exponent, usually 65537)
    4. Find d where (e × d) mod φ(n) = 1 (private exponent)

Encryption: c = m^e mod n    (anyone can encrypt with public key)
Decryption: m = c^d mod n    (only holder of private key can decrypt)

Why it works: (m^e)^d = m^(ed) = m^(kφ(n)+1) = m mod n (Euler's theorem)
```

**Diffie-Hellman Key Exchange:**
```
Goal: Two parties agree on secret key over public channel

Alice: Pick secret a → Compute A = g^a mod p → Send A to Bob
Bob:   Pick secret b → Compute B = g^b mod p → Send B to Alice

Alice computes: s = B^a mod p = (g^b)^a mod p = g^(ab) mod p
Bob computes:   s = A^b mod p = (g^a)^b mod p = g^(ab) mod p

→ Both have same secret s! Attacker sees A and B but can't compute g^(ab) (discrete log problem)
```

---

# PRIORITY 15 — MATHEMATICAL MODELING

**Growth Models:**
```
Linear:     y = mx + b                    → Constant rate
Exponential: y = a × e^(rt)               → Proportional to current value (population, compound interest)
Logistic:   y = L / (1 + e^(-k(x-x₀)))    → S-curve, growth slows as approaching limit
```

---

# COMMON INTERVIEW SCENARIOS — QUICK ANSWERS

| # | Question | Answer |
|---|----------|--------|
| 1 | Binary vs Decimal? | Binary: base-2 (0,1), computers use it; Decimal: base-10 (0-9), humans use it |
| 2 | Two's Complement? | Invert bits + 1 → Represents negatives; single zero, natural arithmetic |
| 3 | Set Operations? | Union=combine, Intersection=common, Difference=only in first, Cartesian=all pairs |
| 4 | Function vs Relation? | Function: each input → exactly one output; Relation: input can map to multiple outputs |
| 5 | Permutation vs Combination? | Permutation=order matters (arrangement); Combination=order doesn't matter (selection) |
| 6 | Conditional Probability? | P(A\|B) = P(A∩B)/P(B) → Probability of A given B happened |
| 7 | Bayes' Theorem? | P(A\|B) = P(B\|A)×P(A)/P(B) → Update belief given evidence |
| 8 | Mean vs Median? | Mean=average (sensitive to outliers); Median=middle value (robust) |
| 9 | Variance vs Std Dev? | Variance=avg squared distance; Std Dev=√variance (same units as data) |
| 10 | Central Limit Theorem? | Sample means approach normal distribution as sample size increases, regardless of population |
| 11 | Matrix Multiplication? | Row × Column dot products; (m×n)×(n×p)=(m×p); not commutative |
| 12 | Dot vs Cross Product? | Dot=scalar, measures alignment; Cross=vector (3D), perpendicular, area magnitude |
| 13 | Eigenvalues/Eigenvectors? | Av=λv → Matrix only scales vector, doesn't rotate; used in PCA, PageRank |
| 14 | Derivative intuition? | Instant rate of change; slope of tangent line; zero at local min/max |
| 15 | Gradient Descent? | Iteratively move opposite to gradient to minimize function; learning rate controls step size |
| 16 | Prime algorithms? | Sieve of Eratosthenes: mark multiples → unmarked = prime; O(n log log n) |
| 17 | Euclidean Algorithm? | GCD(a,b) = GCD(b, a mod b); repeat until remainder 0 |
| 18 | Modular Arithmetic? | Clock arithmetic; (a+b) mod m = ((a mod m)+(b mod m)) mod m; used in hashing, crypto |
| 19 | Floating Point Precision? | 0.1 has no finite binary representation → rounding errors accumulate |
| 20 | Entropy in ML? | Measures uncertainty; high entropy = unpredictable; used in decision trees, cross-entropy loss |

---

# REVISION ORDER (Highest ROI)

1. Number Systems (binary, hex, two's complement)
2. Sets & Operations (union, intersection, Cartesian product)
3. Functions (injective, surjective, bijective, composition)
4. Logic & Proofs (truth tables, De Morgan's, induction)
5. Counting (permutations, combinations, pigeonhole)
6. Recurrence Relations (Fibonacci, Master Theorem)
7. Probability (conditional, Bayes', independence)
8. Distributions (normal, binomial, uniform)
9. Statistics (mean/median/mode, variance, CLT, p-value)
10. Linear Algebra (vectors, matrices, eigenvalues)
11. Calculus (derivatives, chain rule, gradient)
12. Optimization (gradient descent, convexity)
13. Graph Theory (tree vs graph, DAG, cycles)
14. Boolean Algebra (laws, simplification)
15. Number Theory (Euclidean, modular arithmetic, fast exp)
16. Information Theory (entropy, information gain)
17. Cryptography (RSA, Diffie-Hellman high-level)
18. Numerical Methods (floating point, overflow/underflow)

---

# HANDS-ON PRACTICE

1. **Base Conversions:** Decimal↔Binary↔Hex — implement without built-ins
2. **Euclidean Algorithm:** GCD iterative + recursive → Trace with (48,18)
3. **Fast Modular Exponentiation:** Compute a^b mod m in O(log b)
4. **Matrix Operations:** Multiply, transpose, determinant (2×2, 3×3)
5. **Vector Math:** Dot product, cross product, magnitude, unit vector
6. **Monte Carlo:** Estimate π by random points in unit square
7. **Stats Calculator:** Mean, median, mode, variance, std dev from data
8. **Gradient Descent:** Find minimum of f(x) = x² → Start random → Iterate → Converge to 0
9. **Sieve of Eratosthenes:** Generate primes up to N efficiently
10. **Graph Traversal:** BFS/DFS with mathematical interpretation (distances, components)

---

**REMEMBER:** Interviewers care about:

1. **Can you translate math to code?** (Implement GCD, matrix multiply, gradient descent)
2. **Do you understand WHY?** (Why two's complement, why gradient descent works, why Bayes matters)
3. **Can you connect to real applications?** (Entropy in decision trees, eigenvalues in PCA, modular arithmetic in crypto)
4. **Do you know the trade-offs?** (Mean vs median for outliers, SGD vs full GD, local vs global minima)

> Tell the story of how numbers transform — from input → through operations → to output.
