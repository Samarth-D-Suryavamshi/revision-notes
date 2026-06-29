# Git & Version Control
---
# Priority 1 — Version Control Fundamentals

## 1. Introduction to Version Control

**What is VCS?** → Tracks every change to code. Like "Save As" but automatic and smart.

**System Flow:**
```
You write code → Save file → VCS snapshots the change → You can go back to any snapshot
```

**Types:**

| Type | How it works | Example |
|------|-------------|---------|
| **Local** | One machine, no sharing | RCS (ancient) |
| **Centralized** | One central server, everyone pushes/pulls | SVN, Perforce |
| **Distributed** | Everyone has full copy of history | Git |

**Git vs GitHub vs GitLab vs Bitbucket:**
```
Git = Engine (tool on your laptop)
GitHub/GitLab/Bitbucket = Garage (hosting platform with UI, PRs, CI/CD)
```

**Why Git is distributed?** → Every clone is a FULL backup. Work offline. No single point of failure.

**Repository** = Project folder tracked by Git.

**System Flow — Git Areas:**
```
Working Directory → git add → Staging Area (Index) → git commit → Local Repository → git push → Remote Repository

Working Directory: Files you edit now
Staging Area: Files you want in next commit (snapshot preview)
Local Repository: Committed history on your machine
Remote Repository: Shared history on GitHub/GitLab
```

---

## 2. Git Architecture (Internals)

**System Flow — What happens when you commit?**
```
File content → SHA-1 hash → Blob object stored in .git/objects/
Directory structure → Tree object (points to blobs + subtrees)
Commit object → Points to tree + parent commit + author + message + timestamp
HEAD → Points to latest commit on current branch
```

**Git Objects:**

| Object | What it stores | Analogy |
|--------|---------------|---------|
| **Blob** | File content (not filename) | File body |
| **Tree** | Directory listing (blobs + subtrees) | Folder structure |
| **Commit** | Tree + parent + metadata | Snapshot pointer |
| **Tag** | Named reference to a commit | Bookmark |

**Key Insight:** Git stores **snapshots**, not diffs. Every commit is a full picture of the project at that moment.

**HEAD** = Pointer to current branch's latest commit. `HEAD~1` = parent commit.

**Refs** = Pointers (branches, tags, HEAD). Stored as files in `.git/refs/`.

**Why Git is fast?** → Snapshots + SHA-1 addressing + compression (pack files). Deduplication: same content = same hash = stored once.

**Why Git is immutable?** → Objects are identified by hash. Changing content changes hash → new object. Old objects remain.

---

## 3. Git Workflow

**System Flow — Daily Workflow:**
```
git clone <url>          → Download entire repo + history
git status               → What's changed? (red = unstaged, green = staged)
[edit files]             → Working directory changes
git add <file>           → Move to staging area
git add .                → Stage all changes
git commit -m "msg"      → Save snapshot to local repo
git push origin main     → Upload to remote
git pull origin main     → Download + merge remote changes
```

**git add internal flow:**
```
File modified → git add → Git computes SHA-1 of content → Stores blob in .git/objects/ → Adds entry to staging index
```

**git pull vs git fetch:**
```
git fetch origin main    → Downloads remote commits → Updates remote-tracking branch → Does NOT touch your working branch
git pull origin main     → git fetch + git merge → Downloads AND merges into current branch
```

| Command | Downloads? | Merges? | Safe? |
|---------|-----------|---------|-------|
| `fetch` | Yes | No | Yes (preview changes) |
| `pull` | Yes | Yes | Risk (auto-merge conflicts) |

**Best practice:** `git fetch` first → review → then `git merge` or `git rebase`.

---

# Priority 2 — Branching & Merging

## 4. Branches

**System Flow:**
```
main branch (stable) → git branch feature → feature branch (isolated work) → git merge feature → back to main
```

**How branches work internally?**
```
Branch = File in .git/refs/heads/ containing a commit hash
main   → abc123 (latest commit hash)
feature→ def456 (different commit hash)
```

Branches are just **lightweight pointers**. Switching branches = moving HEAD to a different commit.

**Commands:**
```bash
git branch feature          # Create branch
git switch feature          # Switch to branch (modern, preferred)
git checkout feature        # Old way (also switches)
git branch -m new-name      # Rename
git branch -d feature       # Delete (merged)
git branch -D feature       # Force delete (unmerged)
```

**Tracking Branches:**
```
origin/main  → Remote branch (what's on GitHub)
main         → Local branch (what's on your machine)
git branch -u origin/main   # Set upstream tracking
```

---

## 5. Merge

**System Flow:**
```
main: A---B---C
             feature:      D---E
                                       F (merge commit)
```

**Fast-Forward Merge:**
```
main: A---B---C
feature:       D---E

No new commits on main since branch → Just move main pointer to E
Result: A---B---C---D---E (linear, no merge commit)
```

**Three-Way Merge:**
```
main:    A---B---C
              feature:      D---E
                                       M (merge commit with 2 parents)
```

| Merge Type | When | Result |
|------------|------|--------|
| **Fast-Forward** | No diverging commits on target | Linear history, no merge commit |
| **Three-Way** | Both branches have new commits | Merge commit, preserves branch history |

**Merge Conflicts:**
```
Same file, same lines changed in both branches → Git can't decide → Conflict markers appear

<<<<<<< HEAD
Your changes (current branch)
=======
Their changes (branch being merged)
>>>>>>> feature
```

**Resolution flow:**
```
Conflict detected → Open file → Edit and remove markers → git add <file> → git commit
```

---

## 6. Rebase

**System Flow:**
```
Before rebase:
main:    A---B---C
              feature:      D---E

After git rebase main:
main:    A---B---C
                  feature:          D'---E' (replayed on top of C)
```

**What rebase does:**

1. Saves your branch commits as patches
2. Moves branch pointer to target branch tip
3. Re-applies patches one by one

**Result:** Linear history (no merge commits). Clean log.

**Interactive Rebase:**
```bash
git rebase -i HEAD~3    # Last 3 commits
```

**Operations in interactive mode:**

| Command | Action |
|---------|--------|
| `pick` | Keep commit as-is |
| `reword` | Edit commit message |
| `squash` | Combine with previous commit |
| `fixup` | Like squash, discard message |
| `drop` | Remove commit |
| `reorder` | Change order in file |


**Merge vs Rebase:**

| Aspect | Merge | Rebase |
|--------|-------|--------|
| History | Preserves branch structure | Linear, rewritten |
| Safety | Safe for shared branches | Dangerous for shared branches |
| Use case | Public branches, team work | Private branches, cleaning history |
| Conflicts | One merge conflict | May resolve conflicts per commit |

**Golden Rule:** Never rebase branches that others have pulled. It rewrites history → others' work breaks.

---

# Priority 3 — History Manipulation

## 7. Cherry Pick

**System Flow:**
```
main:    A---B---C---D
feature:      E---F---G

Need only F on main:
git checkout main
git cherry-pick <F-commit-hash>

main:    A---B---C---D---F'
```

**When to use:**

- Bug fix committed to wrong branch → cherry-pick to release branch
- Need ONE commit, not entire branch merge

**Cherry Pick vs Merge:**

| Cherry Pick | Merge |
|-------------|-------|
| Copies ONE commit | Brings ALL commits |
| New hash (different commit) | Preserves original hashes |
| Use: selective fixes | Use: integrating feature branches |

---

## 8. Reset

**System Flow:**
```
Working Directory → Staging Area → Local Repository
       ↑               ↑              ↑
    --hard          --mixed         --soft
```

| Reset Type | Moves HEAD? | Staging Area? | Working Directory? | Use Case |
|------------|-------------|---------------|-------------------|----------|
| **Soft** | Yes | No change | No change | Undo commit, keep changes staged |
| **Mixed** | Yes | Cleared | No change | Undo commit, unstage changes (default) |
| **Hard** | Yes | Cleared | Cleared | Destroy all changes, go back to commit |

**Examples:**
```bash
git reset --soft HEAD~1     # Undo last commit, changes stay staged (recommit)
git reset --mixed HEAD~1    # Undo last commit, changes unstaged (re-add selectively)
git reset --hard HEAD~1     # DESTROY last commit + changes (irreversible!)
```

**System Flow — Soft Reset:**
```
Commit C exists → git reset --soft HEAD~1 → Commit C gone → Changes still in staging area → Ready to recommit
```

**System Flow — Hard Reset:**
```
Commit C exists → git reset --hard HEAD~1 → Commit C gone → Working directory wiped → Changes LOST (unless recovered via reflog)
```

---

## 9. Revert

**System Flow:**
```
main: A---B---C (bad commit)

git revert C

main: A---B---C---C' (new commit that undoes C)
```

**What revert does:** Creates a NEW commit that is the opposite of the target commit. Safe for shared branches because it doesn't rewrite history.

**Reset vs Revert:**

| Reset | Revert |
|-------|--------|
| Removes commits from history | Adds new "undo" commit |
| Rewrites history | Preserves history |
| Dangerous on shared branches | Safe on shared branches |
| `git reset --hard HEAD~1` | `git revert <commit-hash>` |

**When to use revert?** → Public/shared branches where history must be preserved.

---

## 10. Amend

**System Flow:**
```
Last commit has typo in message → git commit --amend -m "fixed message" → Same commit, new message
Forgot to add file → git add forgotten.txt → git commit --amend --no-edit → Same commit, extra file
```

**What it does:** Replaces the last commit with a new one (new hash).

**Caution:** Only amend commits that haven't been pushed. Amending pushed commits = history rewrite.

---

# Priority 4 — Temporary Work

## 11. Stash

**System Flow:**
```
Working on feature → Boss says fix urgent bug → git stash → Switch to main → Fix bug → git stash pop → Continue feature
```

**What stash does:** Saves working directory + staging area → Cleans working directory → You can switch branches → Later restore.

**Commands:**
```bash
git stash                    # Save current work
git stash push -m "name"     # Save with message
git stash list               # View all stashes
git stash pop                # Apply latest stash + DELETE it from list
git stash apply              # Apply latest stash + KEEP it in list
git stash drop stash@{0}     # Delete specific stash
git stash clear              # Delete all stashes
```

**Pop vs Apply:**

| Pop | Apply |
|-----|-------|
| Applies + removes from stash list | Applies + keeps in stash list |
| One-time use | Can apply same stash multiple times |

**Stash is NOT a commit.** It's a stack of temporary snapshots.

---

# Priority 5 — Tags & Releases

## 12. Tags

**System Flow:**
```
Code ready for release → git tag v1.0.0 → Push tags → GitHub creates release → Users download v1.0.0
```

**Types:**

| Type | What it stores | Use |
|------|---------------|-----|
| **Lightweight** | Just a commit pointer | Quick bookmark |
| **Annotated** | Pointer + tagger info + message + GPG sign | Official releases |

```bash
git tag v1.0.0                    # Lightweight
git tag -a v1.0.0 -m "Release"    # Annotated
git push origin v1.0.0            # Push one tag
git push origin --tags            # Push all tags
```


**Branch vs Tag:**

| Branch | Tag |
|--------|-----|
| Moves forward with commits | Fixed to one commit |
| Used for ongoing work | Used for marking releases |
| `main`, `feature-x` | `v1.0.0`, `release-2024` |

**Semantic Versioning:** `MAJOR.MINOR.PATCH` (e.g., `v2.1.3`)

- MAJOR = Breaking changes
- MINOR = New features, backward compatible
- PATCH = Bug fixes

---

# Priority 6 — Remote Repositories

## 13. Remote Operations

**System Flow:**
```
Your laptop (local) ←→ origin (your fork) ←→ upstream (original repo)
```

**Key Concepts:**

| Term | Meaning |
|------|---------|
| **origin** | Default name for your remote repo |
| **upstream** | Original repo you forked from |
| **Remote-tracking branch** | Local copy of remote branch (e.g., `origin/main`) |

**Commands:**
```bash
git remote -v                     # List remotes
git remote add upstream <url>     # Add upstream remote
git fetch upstream                # Download upstream changes
git merge upstream/main           # Merge upstream into local main
git push origin main              # Push to your fork
```

**Fork Workflow (Open Source):**
```
Fork repo → Clone YOUR fork → Create branch → Make changes → Push to YOUR fork → Open Pull Request → upstream maintainer reviews → Merge
```

---

# Priority 7 — Collaboration Workflow

## Pull Requests

**System Flow:**
```
Feature branch ready → git push origin feature → Open PR on GitHub → Code review → CI checks pass → Approved → Merge to main → Delete branch
```

**Why PRs?** → Code review, discussion, CI validation, approval gate before merging.

## Branching Strategies

| Strategy | Flow | Best For |
|----------|------|----------|
| **Feature Branch** | `main` + `feature/*` branches → PR → merge | Small teams, simple projects |
| **Git Flow** | `main` (production) + `develop` (integration) + `feature/*` + `release/*` + `hotfix/*` | Large teams, scheduled releases |
| **GitHub Flow** | `main` + `feature/*` → PR → merge → deploy | CI/CD, continuous deployment |
| **Trunk-Based** | Everyone commits to `main` → short-lived branches (<1 day) → feature flags | High velocity, experienced teams |

**Git Flow vs GitHub Flow:**
```
Git Flow:        main ← release ← develop ← feature → merge back
GitHub Flow:     main ← feature → PR → merge → deploy immediately
```

**Startup choice?** → GitHub Flow. Simple, fast, continuous deployment.

---

# Priority 8 — History Inspection

## Key Commands

| Command | What it shows | System Flow |
|---------|--------------|-------------|
| `git log` | Commit history (oldest→newest or newest→oldest) | `git log --oneline --graph --all` |
| `git log --oneline` | One line per commit | Quick overview |
| `git log --graph` | ASCII graph of branches | Visual branch structure |
| `git diff` | Changes between commits/working dir | `git diff HEAD~1` = last commit changes |
| `git show <hash>` | Full details of one commit | Commit + diff |
| `git blame <file>` | Who changed each line + when | Track down bug introducer |
| `git reflog` | ALL HEAD movements (even "lost" commits) | Safety net for recovery |

**git log vs git reflog:**

| git log | git reflog |
|---------|-----------|
| Commit history (DAG) | HEAD movement history |
| Only reachable commits | Includes orphaned commits |
| Shared across clones | Local only |
| `git log` | `git reflog` |

**Recover lost commit:**
```bash
git reflog                          # Find commit hash before reset
git checkout <hash>                 # View it
git checkout -b recovery-branch     # Create branch from it
```

---

# Priority 9 — Undoing Mistakes

## Recovery Scenarios

**Scenario 1: Deleted file (not committed)**
```bash
git restore <file>                  # Restore from staging area
git restore --source=HEAD <file>   # Restore from last commit
```

**Scenario 2: Accidentally committed to wrong branch**
```bash
git reset --soft HEAD~1             # Undo commit, keep changes
git checkout correct-branch
git commit -m "message"
```

**Scenario 3: Hard reset gone wrong**
```bash
git reflog                          # Find commit before reset
git reset --hard <commit-hash>     # Go back to it
```

**Scenario 4: Detached HEAD**
```
What: HEAD points directly to commit, not branch
How: git checkout <commit-hash>
Fix: git checkout -b new-branch     # Create branch from detached state
```

**Recovery Cheat Sheet:**

| Mistake | Recovery |
|---------|----------|
| Deleted uncommitted file | `git restore <file>` |
| Deleted committed file | `git checkout HEAD -- <file>` |
| Bad commit message | `git commit --amend` |
| Committed to wrong branch | `git reset --soft HEAD~1` → switch → recommit |
| Hard reset lost work | `git reflog` → find hash → `git checkout -b recovery <hash>` |
| Merge conflict resolved wrong | `git merge --abort` (if not committed yet) |
| Pushed bad commit | `git revert <hash>` (don't reset!) |

---

# Priority 10 — Git Internals (Basic)

## How Git Actually Works

**System Flow — Commit Internals:**
```
You: git commit -m "fix bug"

Git internally:
1. For each staged file → compute SHA-1 hash of content → store as blob object
2. Create tree object → lists all blobs + filenames + permissions
3. Create commit object → tree hash + parent commit hash + author + message + timestamp
4. Update branch ref → point to new commit hash
5. Move HEAD → point to new commit
```

**Snapshots vs Deltas:**
```
Delta (SVN): Store change from previous version
  v1: file.txt = "hello"
  v2: file.txt = "hello world" → store "+ world"

Snapshot (Git): Store full content each time
  v1: blob_a = "hello"
  v2: blob_b = "hello world" (both stored independently)

Optimization: Same content = same hash = stored once (deduplication)
Pack files compress similar blobs later (background gc)
```

**DAG (Directed Acyclic Graph):**
```
Commit A → Commit B → Commit C
                ↘ Commit D → Commit E (merge)
                        ↘ Commit F
```

No cycles allowed (can't be its own ancestor). Every commit has 1+ parents.

**Why Git is immutable?** → Objects are keyed by hash. Changing content = new hash = new object. Old objects stay until garbage collection.

**Pack Files:** Background process (`git gc`) finds similar blobs, stores one full + deltas for others. Transparent to users.

---

# Common Interview Scenarios — Quick Answers

| Question | One-Liner Answer |
|----------|-----------------|
| Git vs GitHub | Git = tool, GitHub = hosting platform |
| Working vs Staging vs Repo | Working = edited files, Staging = next commit preview, Repo = committed history |
| What happens during commit? | Blobs → Tree → Commit object → Update branch ref → Move HEAD |
| Branch vs Tag | Branch moves forward, Tag is fixed |
| Merge vs Rebase | Merge preserves history, Rebase rewrites for linear history |
| Fast-forward vs 3-way | FF = no diverge, linear. 3-way = both changed, merge commit |
| Pull vs Fetch | Fetch downloads only, Pull downloads + merges |
| Reset vs Revert | Reset removes commits (dangerous), Revert adds undo commit (safe) |
| Cherry-pick vs Merge | Cherry-pick copies ONE commit, Merge brings ALL |
| Soft vs Mixed vs Hard | Soft=keep staged, Mixed=unstage, Hard=destroy everything |
| Stash vs Commit | Stash = temporary, no message, not in history. Commit = permanent snapshot |
| Pop vs Apply | Pop applies + deletes stash, Apply applies + keeps stash |
| Why interactive rebase? | Clean history: squash, reword, reorder, drop commits |
| Detached HEAD? | HEAD points to commit, not branch. Create branch to save work |
| Recover deleted commits? | `git reflog` → find hash → `git checkout -b recovery <hash>` |
| How Git detects conflicts? | Same file, overlapping lines changed in both branches |
| Why avoid rebasing public? | Rewrites commit hashes → others' references break |
| How branches stored? | Files in `.git/refs/heads/` containing commit hashes |
| What is reflog? | Local log of ALL HEAD movements, including "lost" commits |
| Typical team workflow? | Pull main → Branch → Commit → Push → PR → Review → Merge → Delete branch |

---

# Quick Command Reference

## Daily Commands
```bash
git status, git add, git commit, git push, git pull, git log --oneline
```

## Branching
```bash
git branch, git switch, git checkout, git merge, git rebase
```

## History
```bash
git log, git diff, git show, git blame, git reflog
```

## Undo
```bash
git reset --soft/--mixed/--hard, git revert, git restore, git checkout -- <file>
```

## Temporary
```bash
git stash, git stash pop, git stash apply, git stash list
```

## Tags
```bash
git tag -a v1.0.0 -m "Release", git push --tags
```

## Remote
```bash
git remote -v, git fetch, git pull, git push, git remote add upstream <url>
```

---

# Final Tip: Interview Flow for Git Questions

```
1. Start with areas: Working → Staging → Local → Remote
2. Explain what happens internally (blobs, trees, commits)
3. Compare options (merge vs rebase, reset vs revert)
4. Mention safety (never rebase public, use revert not reset on shared)
5. Give real scenario ("If I'm on a team, I'd use...")
```

> **Always remember:** Git stores snapshots, not diffs. Everything is an object with a hash. Branches are just pointers.
