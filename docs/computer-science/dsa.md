# Data Structures & Algorithms

## Priority 1 — Programming Fundamentals

### 1. Programming Basics

**Recursion vs Iteration**
```
Recursion: Function calls itself → Base case stops it → Uses call stack
Iteration: Loop repeats → Uses variables → No stack overhead

Recursion: Clean for trees, backtracking, divide-conquer
Iteration: Better for arrays, avoids stack overflow
```

```python
# Recursion: Fibonacci
def fib(n):
    if n <= 1: return n          # Base case
    return fib(n-1) + fib(n-2)   # Recursive case

# Iteration: Fibonacci (O(n) time, O(1) space)
def fib_iter(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

**Pass by Value vs Reference**
```
Value: Copy of data passed → Changes don't affect original (int, float, string)
Reference: Address passed → Changes affect original (list, dict, objects)
```

```python
def modify(x, arr):
    x = 10          # Local copy, original unchanged
    arr.append(4)   # Modifies original list

a = 5
b = [1, 2, 3]
modify(a, b)
print(a)   # 5 (unchanged)
print(b)   # [1, 2, 3, 4] (modified)
```

---

### 2. Mathematical Foundations

**Sieve of Eratosthenes** — Find all primes up to N
```python
def sieve(n):
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    for i in range(2, int(n**0.5) + 1):
        if is_prime[i]:
            # Mark multiples of i as non-prime
            for j in range(i * i, n + 1, i):
                is_prime[j] = False

    return [i for i in range(2, n + 1) if is_prime[i]]

# Time: O(n log log n), Space: O(n)
```

**Fast Exponentiation** — Compute a^n in O(log n)
```python
def power(a, n):
    result = 1
    while n > 0:
        if n & 1:           # If n is odd
            result *= a
        a *= a              # Square the base
        n >>= 1             # Halve the exponent
    return result

# Example: power(2, 10) = 1024
# Time: O(log n)
```

**GCD (Euclidean Algorithm)**
```python
def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

# gcd(48, 18) = 6
# Time: O(log min(a, b))
```

---

## Priority 2 — Complexity Analysis

### Big-O Notation

**System Flow — How complexity grows:**
```
Input size n → Algorithm does work → Count operations → Express as function of n

O(1):      Constant    → HashMap lookup
O(log n):  Logarithmic → Binary search (halve each step)
O(n):      Linear      → Single loop through array
O(n log n): Linearithmic → Merge sort, heap sort
O(n²):     Quadratic   → Nested loops, bubble sort
O(2ⁿ):     Exponential → Subsets, brute force
O(n!):     Factorial   → Permutations
```

| Complexity | n=10 | n=100 | n=1000 | Use Case |
|-----------|------|-------|--------|----------|
| O(1) | 1 | 1 | 1 | Hash lookup |
| O(log n) | 3 | 7 | 10 | Binary search |
| O(n) | 10 | 100 | 1000 | Linear scan |
| O(n log n) | 30 | 700 | 10,000 | Efficient sort |
| O(n²) | 100 | 10,000 | 1,000,000 | Nested loops |
| O(2ⁿ) | 1,024 | ~10³⁰ | ~10³⁰⁰ | Brute force |

**Amortized Analysis:**
```
Some operations are expensive but rare → Average cost over time is low

Example: Dynamic array (ArrayList)
  Most appends: O(1) — just add element
  Rare resize: O(n) — copy all elements to new array
  Amortized: O(1) per append
```

---

## Priority 3 — Arrays

### Core Techniques

**Prefix Sum** — Range sum queries in O(1)
```python
# Build prefix sum array
arr = [1, 2, 3, 4, 5]
prefix = [0] * (len(arr) + 1)
for i in range(len(arr)):
    prefix[i + 1] = prefix[i] + arr[i]  # prefix = [0, 1, 3, 6, 10, 15]

# Sum of arr[1:4] = prefix[4] - prefix[1] = 10 - 1 = 9
# Time to build: O(n), Query: O(1)
```

**Sliding Window** — Subarray problems
```python
# Longest substring without repeating characters
def length_of_longest_substring(s):
    char_set = set()
    left = 0
    max_len = 0

    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)

    return max_len

# Window [left, right] expands and contracts
# Time: O(n), Space: O(min(m, n)) where m = charset size
```

**Two Pointers**
```python
# Two Sum (sorted array)
def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1

    while left < right:
        current = arr[left] + arr[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1      # Need larger sum
        else:
            right -= 1     # Need smaller sum

    return []

# Time: O(n), Space: O(1)
```

**Kadane's Algorithm** — Maximum subarray sum
```python
def max_subarray(nums):
    max_sum = current_sum = nums[0]

    for num in nums[1:]:
        # Either start new subarray at current element or extend existing
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)

    return max_sum

# [-2, 1, -3, 4, -1, 2, 1, -5, 4] → [4, -1, 2, 1] = 6
# Time: O(n), Space: O(1)
```

**Dutch National Flag** — Sort array of 0s, 1s, 2s
```python
def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1

    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1

    return nums

# Three pointers: low (0s boundary), mid (current), high (2s boundary)
# Time: O(n), Space: O(1)
```

---

## Priority 4 — Strings

**KMP Algorithm** — Pattern matching in O(n + m)
```python
def kmp_search(text, pattern):
    # Build LPS (Longest Prefix Suffix) array
    def build_lps(p):
        lps = [0] * len(p)
        length = 0
        i = 1

        while i < len(p):
            if p[i] == p[length]:
                length += 1
                lps[i] = length
                i += 1
            else:
                if length != 0:
                    length = lps[length - 1]
                else:
                    lps[i] = 0
                    i += 1
        return lps

    lps = build_lps(pattern)
    i = j = 0  # i for text, j for pattern

    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1

            if j == len(pattern):
                return i - j  # Found at index i-j
        elif j != 0:
            j = lps[j - 1]  # Skip ahead using LPS
        else:
            i += 1

    return -1

# LPS tells us how much of the pattern we can skip when mismatch occurs
# Time: O(n + m), Space: O(m)
```

**Trie (Prefix Tree)**
```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

# Use: Auto-complete, spell checker, IP routing
# Time: O(m) per operation where m = word length
```

---

## Priority 5 — Linked Lists

**Reverse Linked List**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    current = head

    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp

    return prev

# prev → current → next_temp
# After: prev ← current  next_temp → ...
# Time: O(n), Space: O(1)
```

**Floyd's Cycle Detection**
```python
def has_cycle(head):
    slow = fast = head

    while fast and fast.next:
        slow = slow.next          # Move 1 step
        fast = fast.next.next     # Move 2 steps

        if slow == fast:          # They meet → cycle exists
            return True

    return False

# If there's a cycle, fast will eventually catch slow from behind
# Time: O(n), Space: O(1)
```

**Merge K Sorted Lists**
```python
import heapq

def merge_k_lists(lists):
    heap = []

    # Push first node of each list with its list index
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))

    dummy = ListNode(0)
    current = dummy

    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next

        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

    return dummy.next

# Min-heap always gives smallest element among all lists
# Time: O(N log k), Space: O(k) where k = number of lists
```

---

## Priority 6 — Stack & Queue

**Monotonic Stack** — Next Greater Element
```python
def next_greater_element(nums):
    stack = []  # Stack stores indices, values are in decreasing order
    result = [-1] * len(nums)

    for i in range(len(nums)):
        # Current element is greater than stack top → Found next greater
        while stack and nums[stack[-1]] < nums[i]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)

    return result

# [2, 1, 2, 4, 3] → [4, 2, 4, -1, -1]
# Time: O(n), Space: O(n)
```

**Min Stack** — O(1) getMin
```python
class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val):
        self.stack.append(val)
        # Push current min (either new val or previous min)
        min_val = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(min_val)

    def pop(self):
        self.stack.pop()
        self.min_stack.pop()

    def top(self):
        return self.stack[-1]

    def get_min(self):
        return self.min_stack[-1]

# min_stack always mirrors the min at each level
# All operations: O(1)
```

**LRU Cache**
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return -1
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value

        if len(self.cache) > self.capacity:
            # Pop first item (least recently used)
            self.cache.popitem(last=False)

# OrderedDict maintains insertion order
# Time: O(1) for get and put
```

---

## Priority 7 — Hashing

**HashMap Internals**
```
Key → hash(key) → index = hash % array_size → Store (key, value) at index

Collision: Two keys hash to same index
  Chaining: Store linked list at each index
  Open Addressing: Find next empty slot (linear/quadratic probing)

Load Factor = entries / buckets
  > 0.75 → Resize (double buckets, rehash all entries)
```

**Group Anagrams**
```python
def group_anagrams(strs):
    groups = {}

    for s in strs:
        # Sort characters to get canonical form
        key = ''.join(sorted(s))
        groups.setdefault(key, []).append(s)

    return list(groups.values())

# "eat", "tea", "ate" → all sort to "aet"
# Time: O(n × k log k), Space: O(n × k)
```

---

## Priority 8 — Trees

**Binary Tree Traversals**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# DFS - Inorder (Left, Root, Right)
def inorder(root):
    return inorder(root.left) + [root.val] + inorder(root.right) if root else []

# DFS - Preorder (Root, Left, Right)
def preorder(root):
    return [root.val] + preorder(root.left) + preorder(root.right) if root else []

# DFS - Postorder (Left, Right, Root)
def postorder(root):
    return postorder(root.left) + postorder(root.right) + [root.val] if root else []

# BFS - Level Order
def level_order(root):
    if not root: return []
    result, queue = [], [root]

    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)

    return result
```

**LCA (Lowest Common Ancestor)**
```python
def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root

    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)

    # If p and q are on different sides, root is LCA
    if left and right:
        return root

    # Both on same side
    return left if left else right

# Time: O(n), Space: O(h) where h = height
```

**Binary Search Tree Validation**
```python
def is_valid_bst(root):
    def validate(node, min_val, max_val):
        if not node:
            return True

        if node.val <= min_val or node.val >= max_val:
            return False

        # Left subtree: all values < node.val
        # Right subtree: all values > node.val
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))

    return validate(root, float('-inf'), float('inf'))

# Time: O(n), Space: O(h)
```

**Heap (Priority Queue)**
```python
import heapq

# Min Heap (default)
heap = []
heapq.heappush(heap, 3)
heapq.heappush(heap, 1)
heapq.heappush(heap, 2)
print(heapq.heappop(heap))  # 1 (smallest)

# Max Heap (invert values)
max_heap = []
heapq.heappush(max_heap, -3)
heapq.heappush(max_heap, -1)
print(-heapq.heappop(max_heap))  # 3

# Kth Largest Element
def find_kth_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)  # Min heap of size k

    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)

    return heap[0]  # Root is kth largest

# Time: O(n log k), Space: O(k)
```

---

## Priority 9 — Graphs

**Graph Representations**
```python
# Adjacency List (preferred for sparse graphs)
graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 4],
    3: [1],
    4: [1, 2]
}
# Space: O(V + E)

# Adjacency Matrix (dense graphs)
matrix = [
    [0, 1, 1, 0, 0],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 0, 0]
]
# Space: O(V²)
```

**BFS & DFS**
```python
from collections import deque

# BFS - Shortest path in unweighted graph
def bfs(graph, start, target):
    visited = set([start])
    queue = deque([(start, 0)])  # (node, distance)

    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))

    return -1

# DFS - Explore all paths
def dfs(graph, node, visited):
    visited.add(node)

    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Time: O(V + E), Space: O(V)
```

**Dijkstra's Algorithm** — Shortest path in weighted graph
```python
import heapq

def dijkstra(graph, start):
    # graph: {node: [(neighbor, weight), ...]}
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]  # (distance, node)

    while heap:
        d, node = heapq.heappop(heap)

        if d > dist[node]:
            continue  # Already found better path

        for neighbor, weight in graph[node]:
            new_dist = d + weight
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                heapq.heappush(heap, (new_dist, neighbor))

    return dist

# Greedy: Always expand shortest known path first
# Time: O((V + E) log V), Space: O(V)
# Works only for non-negative weights
```

**Union Find (Disjoint Set Union)**
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False  # Already connected

        # Union by rank
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1

        return True

    def connected(self, x, y):
        return self.find(x) == self.find(y)

# Time: O(α(n)) ≈ O(1) amortized
# Use: Connected components, cycle detection, Kruskal's MST
```

**Topological Sort (Kahn's Algorithm)**
```python
from collections import deque

def topological_sort(graph, num_nodes):
    # graph: adjacency list
    in_degree = [0] * num_nodes

    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1

    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    result = []

    while queue:
        node = queue.popleft()
        result.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return result if len(result) == num_nodes else []  # Cycle if not all nodes

# Process nodes with no dependencies first
# Time: O(V + E), Space: O(V)
```

---

## Priority 10 — Recursion & Backtracking

**Backtracking Template**
```python
def backtrack(candidate, path, result):
    if is_valid_solution(path):
        result.append(path[:])
        return

    for next_candidate in get_candidates(candidate):
        if is_valid(next_candidate, path):
            path.append(next_candidate)
            backtrack(next_candidate, path, result)
            path.pop()  # Undo choice (backtrack)
```

**N-Queens**
```python
def solve_n_queens(n):
    def is_safe(row, col):
        # Check column and diagonals
        for r in range(row):
            if board[r] == col or                abs(board[r] - col) == abs(r - row):
                return False
        return True

    def backtrack(row):
        if row == n:
            result.append(board[:])
            return

        for col in range(n):
            if is_safe(row, col):
                board[row] = col
                backtrack(row + 1)
                # Implicit backtrack: board[row] will be overwritten

    board = [-1] * n
    result = []
    backtrack(0)
    return result

# board[i] = column of queen in row i
# Time: O(n!), Space: O(n)
```

**Generate Parentheses**
```python
def generate_parenthesis(n):
    def backtrack(open_count, close_count, current):
        if len(current) == 2 * n:
            result.append(current)
            return

        if open_count < n:
            backtrack(open_count + 1, close_count, current + '(')

        if close_count < open_count:
            backtrack(open_count, close_count + 1, current + ')')

    result = []
    backtrack(0, 0, '')
    return result

# Only add ')' if it won't exceed '('
# Time: O(4ⁿ/√n) (Catalan number), Space: O(n)
```

---

## Priority 11 — Dynamic Programming (Highest ROI)

**DP Framework**
```
1. Define state: dp[i] = what?
2. Transition: dp[i] = f(dp[i-1], dp[i-2], ...)
3. Base case: dp[0], dp[1]
4. Order: Bottom-up (tabulation) or Top-down (memoization)
5. Answer: dp[n] or max(dp)
```

**Climbing Stairs**
```python
def climb_stairs(n):
    if n <= 2:
        return n

    # dp[i] = ways to reach step i
    dp = [0] * (n + 1)
    dp[1], dp[2] = 1, 2

    for i in range(3, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]  # From i-1 or i-2

    return dp[n]

# Space optimized: O(1)
def climb_stairs_optimized(n):
    if n <= 2: return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    return prev1
```

**Coin Change**
```python
def coin_change(coins, amount):
    # dp[i] = minimum coins to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0

    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)

    return dp[amount] if dp[amount] != float('inf') else -1

# Time: O(amount × n), Space: O(amount)
```

**Longest Common Subsequence (LCS)**
```python
def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    # dp[i][j] = LCS of text1[0:i] and text2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

    return dp[m][n]

# Match → diagonal + 1
# Mismatch → max(left, top)
# Time: O(m × n), Space: O(m × n) → O(min(m,n)) optimized
```

**Edit Distance**
```python
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    # dp[i][j] = min operations to convert word1[0:i] to word2[0:j]
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    # Base cases
    for i in range(m + 1): dp[i][0] = i  # Delete all
    for j in range(n + 1): dp[0][j] = j  # Insert all

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]  # No operation
            else:
                dp[i][j] = 1 + min(
                    dp[i - 1][j],      # Delete
                    dp[i][j - 1],      # Insert
                    dp[i - 1][j - 1]   # Replace
                )

    return dp[m][n]

# Time: O(m × n), Space: O(m × n)
```

**Memoization vs Tabulation:**
```
Memoization (Top-Down):
  def fib(n):
      if n in memo: return memo[n]
      memo[n] = fib(n-1) + fib(n-2)
      return memo[n]

  Pros: Intuitive, computes only needed states
  Cons: Recursion overhead, stack limit

Tabulation (Bottom-Up):
  def fib(n):
      dp = [0, 1]
      for i in range(2, n+1):
          dp.append(dp[i-1] + dp[i-2])
      return dp[n]

  Pros: No recursion, predictable memory, often faster
  Cons: Computes all states (may be unnecessary)
```

---

## Priority 12 — Greedy Algorithms

**When Greedy Works:**
```
Greedy: Make locally optimal choice at each step → Hope for global optimum

Works when: Problem has optimal substructure + greedy choice property
  (Local optimal leads to global optimal)

Fails when: Local optimal doesn't lead to global optimal
  (Need DP or backtracking instead)
```

**Activity Selection**
```python
def activity_selection(activities):
    # activities = [(start, end), ...]
    # Sort by end time
    activities.sort(key=lambda x: x[1])

    selected = [activities[0]]
    last_end = activities[0][1]

    for start, end in activities[1:]:
        if start >= last_end:  # Non-overlapping
            selected.append((start, end))
            last_end = end

    return selected

# Greedy: Always pick activity that ends earliest
# Time: O(n log n), Space: O(1)
```

**Greedy vs DP:**
```
Greedy: Make one choice, never reconsider → Fast, but may be wrong
DP: Consider all choices, pick best → Slower, but always optimal

Example: Fractional Knapsack → Greedy works (take highest value/weight)
         0/1 Knapsack → Greedy fails → Use DP
```

---

## Priority 13 — Bit Manipulation

| Operation | Symbol | Example | Result |
|-----------|--------|---------|--------|
| AND | `&` | 5 & 3 (101 & 011) | 1 (001) |
| OR | `\|` | 5 \| 3 (101 \| 011) | 7 (111) |
| XOR | `^` | 5 ^ 3 (101 ^ 011) | 6 (110) |
| NOT | `~` | ~5 | -6 |
| Left Shift | `<<` | 5 << 1 (101 → 1010) | 10 |
| Right Shift | `>>` | 5 >> 1 (101 → 10) | 2 |

**Common Patterns:**
```python
# Check if bit i is set
if n & (1 << i):  # True if bit i is 1

# Set bit i
n |= (1 << i)

# Clear bit i
n &= ~(1 << i)

# Toggle bit i
n ^= (1 << i)

# Power of two
(n & (n - 1)) == 0  # True if n is power of 2

# Count set bits
def count_bits(n):
    count = 0
    while n:
        n &= n - 1  # Clear lowest set bit
        count += 1
    return count

# Generate all subsets using bitmask
def subsets(nums):
    n = len(nums)
    result = []

    for mask in range(1 << n):  # 0 to 2^n - 1
        subset = []
        for i in range(n):
            if mask & (1 << i):  # If bit i is set
                subset.append(nums[i])
        result.append(subset)

    return result

# Time: O(2^n × n), Space: O(2^n)
```

---

## Priority 14 — Advanced Data Structures

**Segment Tree** — Range queries and updates
```python
class SegmentTree:
    def __init__(self, nums):
        self.n = len(nums)
        self.tree = [0] * (4 * self.n)
        self.build(nums, 0, 0, self.n - 1)

    def build(self, nums, node, start, end):
        if start == end:
            self.tree[node] = nums[start]
            return

        mid = (start + end) // 2
        self.build(nums, 2 * node + 1, start, mid)
        self.build(nums, 2 * node + 2, mid + 1, end)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, node, start, end, left, right):
        if right < start or left > end:
            return 0  # Out of range
        if left <= start and end <= right:
            return self.tree[node]  # Fully in range

        mid = (start + end) // 2
        return (self.query(2 * node + 1, start, mid, left, right) +
                self.query(2 * node + 2, mid + 1, end, left, right))

    def update(self, node, start, end, idx, val):
        if start == end:
            self.tree[node] = val
            return

        mid = (start + end) // 2
        if idx <= mid:
            self.update(2 * node + 1, start, mid, idx, val)
        else:
            self.update(2 * node + 2, mid + 1, end, idx, val)

        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

# Query: O(log n), Update: O(log n)
# Use: Range sum/min/max, interval problems
```

**Fenwick Tree (Binary Indexed Tree)**
```python
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def update(self, idx, delta):
        # Add delta at index idx (1-based)
        while idx <= self.n:
            self.tree[idx] += delta
            idx += idx & -idx  # Add lowest set bit

    def query(self, idx):
        # Sum from 1 to idx
        result = 0
        while idx > 0:
            result += self.tree[idx]
            idx -= idx & -idx  # Remove lowest set bit
        return result

    def range_query(self, left, right):
        return self.query(right) - self.query(left - 1)

# Update: O(log n), Query: O(log n)
# Simpler and faster than Segment Tree for sum queries
```

---

## Priority 15 — Advanced Algorithms

**Binary Search on Answer**
```python
def binary_search_answer(nums, target):
    # Find minimum value that satisfies condition
    left, right = 0, max(nums)
    answer = -1

    while left <= right:
        mid = (left + right) // 2

        if is_valid(mid):  # Can we achieve with mid?
            answer = mid
            right = mid - 1  # Try smaller
        else:
            left = mid + 1   # Need larger

    return answer

# Use: Minimize maximum, maximize minimum, allocation problems
# Example: Split array into m subarrays with minimum largest sum
```

---

## Priority 16 — Algorithmic Paradigms

| Paradigm | Approach | Example |
|----------|----------|---------|
| **Divide & Conquer** | Split → Solve subproblems → Combine | Merge sort, quick sort, binary search |
| **Greedy** | Local optimal choice | Activity selection, Huffman coding |
| **Dynamic Programming** | Optimal substructure + overlapping subproblems | Knapsack, LCS, edit distance |
| **Backtracking** | Explore all possibilities, prune invalid | N-queens, Sudoku, permutations |
| **Sliding Window** | Expand/shrink window for subarray problems | Max subarray, substring problems |
| **Two Pointers** | Move from both ends or chase pattern | Two sum, merge sorted arrays |

---

## Priority 17 — Sorting & Searching

**Quick Sort**
```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)

# In-place version (O(log n) space)
def quicksort_inplace(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quicksort_inplace(arr, low, pi - 1)
        quicksort_inplace(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1

# Time: O(n log n) avg, O(n²) worst, Space: O(log n)
```

**Merge Sort**
```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    result.extend(left[i:])
    result.extend(right[j:])
    return result

# Time: O(n log n) guaranteed, Space: O(n)
# Stable sort (preserves order of equal elements)
```

**Binary Search Variations**
```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# Lower bound: First element >= target
def lower_bound(arr, target):
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left

# Upper bound: First element > target
def upper_bound(arr, target):
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid

    return left
```

---

## Priority 18 — Problem-Solving Patterns

| Pattern | When to Use | Key Technique |
|---------|-------------|---------------|
| **Sliding Window** | Subarray/substring problems | Expand right, shrink left |
| **Two Pointers** | Sorted arrays, palindromes | Move from both ends |
| **Prefix Sum** | Range queries | Precompute cumulative sums |
| **Binary Search** | Sorted data, find boundary | Halve search space |
| **DFS** | Explore all paths, trees, graphs | Recursion/stack |
| **BFS** | Shortest path, level-order | Queue |
| **Topological Sort** | Ordering with dependencies | Kahn's algorithm or DFS |
| **Backtracking** | Generate all combinations | Choose → Explore → Undo |
| **Greedy** | Local optimal = global optimal | Sort + iterate |
| **DP** | Optimal substructure, overlapping | Memoization or tabulation |
| **Union Find** | Connected components, cycles | Path compression + union by rank |
| **Heap** | Top K, merge sorted | Min/max heap |
| **Trie** | Prefix matching, auto-complete | Tree of characters |
| **Monotonic Stack** | Next greater/smaller element | Maintain increasing/decreasing stack |
| **Segment Tree** | Range queries with updates | Binary tree over intervals |

---

## Common Interview Scenarios — Quick Solutions

| Problem | Pattern | Approach |
|---------|---------|----------|
| Two Sum | Hashing | dict to store complements |
| Longest Substring Without Repeating | Sliding Window | Expand right, shrink left |
| Valid Parentheses | Stack | Push open, pop matching close |
| Merge Intervals | Sorting | Sort by start, merge overlapping |
| Reverse Linked List | Two Pointers | prev, current, next |
| LRU Cache | Hash + Doubly Linked List | Move to front on access |
| Binary Tree Level Order | BFS | Queue level by level |
| LCA | DFS | Return if found in subtree |
| Validate BST | DFS | Pass min/max bounds |
| Kth Largest | Min Heap | Heap of size k |
| Number of Islands | DFS/BFS | Mark visited, count components |
| Course Schedule | Topological Sort | Detect cycle, order courses |
| Clone Graph | DFS/BFS | HashMap to track visited |
| Word Ladder | BFS | Level by level, word transformations |
| Coin Change | DP | dp[i] = min coins for amount i |
| LIS | DP + Binary Search | Patience sorting |
| Edit Distance | DP | Match → diagonal, else min(insert, delete, replace) |
| N-Queens | Backtracking | Place queen, check safe, recurse |
| Top K Frequent | Heap/Quick Select | Min heap of size k |
| Design LRU/LFU | Hash + Linked List | Track order and frequency |

---

## Final Tip: Interview Problem-Solving Flow

```
1. UNDERSTAND (2 min)  → Clarify inputs, outputs, constraints, edge cases
2. BRUTE FORCE (3 min) → Simple solution first, state complexity
3. OPTIMIZE (5 min)    → Identify bottleneck, apply pattern
4. CODE (10 min)       → Write clean code, use meaningful names
5. TEST (5 min)        → Walk through with example, check edge cases
6. ANALYZE (5 min)     → Time/space complexity, trade-offs
```

> **Always remember:** Start with brute force → Optimize step by step → Explain your thinking. Interviewers care more about your problem-solving process than getting the optimal solution immediately.
