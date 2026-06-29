
# 🖥️ Operating Systems
## 1. INTRODUCTION TO OPERATING SYSTEMS

**What is an OS?**
→ Software that manages hardware resources and provides services to applications.

**Why can't apps directly access hardware?**
→ Security (malware protection), stability (crash isolation), fairness (resource sharing).

**Types:**

- **Batch:** Jobs queued, executed sequentially (old mainframes)
- **Multiprogramming:** CPU switches to another job while one waits for I/O
- **Multitasking:** Rapid switching gives illusion of parallel execution
- **Time Sharing:** Each user gets a time slice (Unix terminals)
- **Real-Time:** Guaranteed response time (airbag systems, pacemakers)
- **Distributed:** Multiple machines appear as one (Google File System)

**User Mode vs Kernel Mode:**
```
User Mode: App runs here — restricted (can't touch hardware directly)
    ↓ System Call (trap)
Kernel Mode: OS runs here — full control (memory, CPU, I/O)
    ↓ Return
User Mode: App continues
```
→ Mode bit in CPU: 0 = kernel, 1 = user. Violation = trap → OS kills app.

---

## 2. PROCESSES

**Program vs Process:**

- Program: Static file on disk (recipe)
- Process: Program in execution (cooking the recipe)

**Process Life Cycle:**
```
New → Ready → Running → Waiting → Terminated
         ↑___________|
```

- **New:** Being created

- **Ready:** Waiting for CPU

- **Running:** Executing on CPU

- **Waiting:** Blocked for I/O

- **Terminated:** Finished

**Process Control Block (PCB):**
→ OS data structure storing process state: PID, registers, memory info, open files, scheduling info.

**Context Switching:**
```
Process A running → Timer interrupt → Save A's state to PCB → Load B's state from PCB → Process B running
```
**Why expensive?** Save/restore registers, cache invalidation, TLB flush.

**Process Creation (fork()):**
```
Parent Process
    ↓ fork()
Parent continues ←──┬──→ Child Process (copy of parent, new PID)
                    │
            Copy-on-Write: Pages shared until either writes
```

**Process Termination:**

- Normal: exit() called
- Abnormal: killed by OS/signal


**Zombie Process:**
→ Child terminated but parent hasn't called wait(). PCB remains.

**Orphan Process:**
→ Parent terminated before child. Child adopted by init (PID 1).

**Daemon Process:**
→ Background service (sshd, nginx). Parent = init, no terminal.

---

## 3. THREADS

**Process vs Thread:**

| Process | Thread |
|---------|--------|
| Separate address space | Shares address space |
| Heavy (PCB, memory tables) | Light (registers + stack) |
| IPC needed for communication | Direct memory access |
| OS manages | Can be user/kernel managed |

**Why threads are lighter:**
→ Share code, data, heap. Only need own stack + registers.

**When processes over threads:**
→ Security isolation (Chrome tabs), different privilege levels, crash containment.

**Thread Lifecycle:**
New → Ready → Running → Blocked → Terminated

**Thread Pools:**
→ Pre-created threads waiting for tasks. Avoids creation overhead.

---

## 4. CPU SCHEDULING

**Metrics:**

- **Waiting Time:** Time in ready queue
- **Turnaround Time:** Submission to completion
- **Response Time:** Submission to first response
- **Throughput:** Processes completed per unit time
- **CPU Utilization:** % time CPU is busy

**Algorithms:**

| Algorithm | How It Works | Pros | Cons |
|-----------|-------------|------|------|
| **FCFS** | First come, first served | Simple | Convoy effect (short jobs wait behind long) |
| **SJF** | Shortest job first | Min avg waiting time | Need to know burst time, starvation of long jobs |
| **SRTF** | Preemptive SJF | Better response | More context switches |
| **Priority** | Higher priority runs first | Important jobs first | Starvation of low priority |
| **Round Robin** | Time slice (quantum) each | Fair, good response | High context switching if quantum too small |
| **MLQ** | Multiple ready queues (fixed) | Separates job types | Rigid |
| **MLFQ** | Queues with dynamic priority | Adapts to behavior | Complex |

> **Why Round Robin?** Time-sharing systems. Fair, responsive.

> **Which minimizes waiting time?** SJF (theoretically optimal).

---

## 5. PROCESS SYNCHRONIZATION

**Critical Section:**
→ Code segment accessing shared resource. Only one process at a time.

**Race Condition:**
```
Balance = 100
Process A: read(100) → add(50) → write(150)
Process B: read(100) → subtract(30) → write(70)
Result: 70 (not 120) — A's update lost!
```

**Mutual Exclusion:**
→ Only one process in critical section at a time.

**Busy Waiting:**
→ Process spins checking condition. Wastes CPU.

**Spin Lock:**
→ Busy-wait lock. Use when wait time < context switch cost.

**Mutex:**
→ Binary lock (0/1). Lock → enter CS → Unlock.

**Semaphore:**
→ Integer variable + two atomic ops:

- wait(P): decrement, block if negative
- signal(V): increment, wake if waiting

**Binary Semaphore:** Value 0 or 1 (like mutex)

**Counting Semaphore:** Value 0 to N (e.g., limit 10 DB connections)

**Monitor:**
→ High-level construct: mutex + condition variables. Java synchronized blocks.

**Producer-Consumer Problem:**
```
Buffer (size N)
Producer: produce item → wait(empty) → wait(mutex) → add → signal(mutex) → signal(full)
Consumer: wait(full) → wait(mutex) → remove → signal(mutex) → signal(empty) → consume
```

**Readers-Writers Problem:**
→ Multiple readers simultaneously, but writers need exclusive access.

**Dining Philosophers:**
→ 5 philosophers, 5 chopsticks. Deadlock if all pick left first. Solution: Pick lower-numbered first.

**Mutex vs Semaphore:**

| Mutex | Semaphore |
|-------|-----------|
| Owner must unlock | Any process can signal |
| Binary only | Can be counting |
| For mutual exclusion | For resource counting |

---

## 6. DEADLOCKS

**Four Necessary Conditions (ALL must hold):**

1. **Mutual Exclusion:** Resource non-sharable
2. **Hold and Wait:** Holding one, waiting for another
3. **No Preemption:** Can't forcefully take resource
4. **Circular Wait:** Circular chain of waiting

**Deadlock Handling:**

- **Prevention:** Break one condition (e.g., request all resources at once)
- **Avoidance:** Banker's Algorithm — safe state check before granting
- **Detection:** Resource allocation graph cycle detection
- **Recovery:** Kill process, preempt resources

**Banker's Algorithm:**
```
Before granting request:
1. Pretend to allocate
2. Check if safe state exists (some order finishes all)
3. If safe → grant; else → make process wait
```

**How databases avoid deadlocks:**
→ Timeout + rollback, lock ordering, optimistic locking (no locks, check at commit).

**Deadlock vs Starvation:**

- Deadlock: Everyone waiting, no progress
- Starvation: One process never gets resource (unfair scheduling)

---

## 7. MEMORY MANAGEMENT

**Logical Address:** Address generated by CPU (what program sees)

**Physical Address:** Actual RAM location (what hardware sees)

**Address Translation:**
```
CPU → Logical Address → MMU → Physical Address → RAM
```

**Memory Allocation:**

- **Contiguous:** Process gets one continuous block
- **Non-contiguous:** Process scattered across memory (paging)

**Fragmentation:**

- **Internal:** Wasted space inside allocated block (paging)
- **External:** Wasted space between allocated blocks (segmentation)

**Paging:**
→ Divide memory into fixed-size pages (logical) and frames (physical).

**Segmentation:**
→ Divide by logical units: code segment, data segment, stack segment.

**Virtual Memory:**
→ Illusion of infinite RAM. Uses disk as extension.

**Demand Paging:**
→ Load page only when needed (lazy loading).

**Page Fault:**
```
CPU wants page X → Check page table → Not in RAM (valid bit = 0)
    ↓
Page Fault Trap → OS finds free frame → Load page from disk → Update page table → Restart instruction
```

**Swapping:**
→ Move entire process to disk when RAM full.

**Thrashing:**
→ Excessive page faults. CPU busy swapping, not computing. Fix: reduce processes or increase RAM.

**Why virtual memory?**
→ Larger address space, isolation, sharing, simplified loading.

---

## 8. PAGING (Deep Dive)

**Page Table:**
→ Maps page number → frame number. Per process.

**Frame:** Physical memory block (e.g., 4KB)

**Page:** Logical memory block (same size as frame)

**Address Translation:**
```
Logical Address: [Page Number | Offset]
                    ↓
              Page Table
                    ↓
Physical Address: [Frame Number | Offset]
```

**TLB (Translation Lookaside Buffer):**
→ Hardware cache for page table entries. Speeds up translation.
```
CPU wants address → Check TLB → Hit? → Use frame directly
                                    Miss? → Check page table → Update TLB
```
> **Why TLB?** Page table in RAM = 2 memory accesses per fetch. TLB = near CPU, nanoseconds.

**Multi-Level Paging:**
→ Page table too big. Use page directory → page table → frame.

**Huge Pages:**
→ 2MB/1GB pages instead of 4KB. Fewer TLB entries, faster for large DB buffers.

---

## 9. VIRTUAL MEMORY (Deep Dive)

**Address Space:**
→ Range of addresses a process can use (0 to 2^64 - 1 on 64-bit).

**Copy-on-Write (fork):**
```
Parent Process (pages in RAM)
    ↓ fork()
Child shares parent's pages (read-only)
    ↓ Child writes to page X
OS copies page X → gives child own copy
Parent's page X unchanged
```
→ Efficient: Only modified pages copied.

**Shared Memory:**
→ Two processes map same physical pages. Fast IPC (no kernel copy).

**Memory Mapping (mmap):**
```
File on Disk ←───mmap──→ Process Address Space
    ↑                          ↓
    └──── Page Fault loads ────┘
```
→ File appears as memory. Lazy loading. Shared libraries use this.

**What happens when RAM is full?**
→ Page replacement algorithm selects victim page → Write to disk (if dirty) → Load new page.

---

## 10. PAGE REPLACEMENT ALGORITHMS

| Algorithm | How It Works | Issue |
|-----------|-------------|-------|
| **FIFO** | Oldest page out | Belady's anomaly (more frames = more faults) |
| **LRU** | Least recently used out | Near-optimal, needs tracking |
| **Optimal** | Farthest future use out | Theoretical, not implementable |
| **Clock** | Second chance (reference bit) | Approximation of LRU, efficient |
| **LFU** | Least frequently used out | Stale data stays if used heavily once |

> **Why not FIFO?** Belady's anomaly — counterintuitive behavior.

> **Why LRU widely used?** Good approximation of optimal, practical to implement.

---

## 11. FILE SYSTEMS

**File:** Named collection of data
**Directory:** Named collection of files

**Inode:**
→ Data structure storing file metadata: size, permissions, timestamps, pointers to data blocks.
```
Filename → Directory → Inode Number → Inode Table → Data Blocks
```

**File Allocation:**

- **Contiguous:** One continuous block (fast seek, fragmentation)
- **Linked:** Blocks linked via pointers (no fragmentation, slow seek)
- **Indexed:** Index block points to all data blocks (best balance)

**Journaling:**
→ Log changes before applying. Crash recovery: replay log.

**Mounting:**
→ Attach filesystem to directory tree. /dev/sda1 → /home

**Permissions:**
```
-rwxr-xr--  owner  group  others
 r=read, w=write, x=execute
```

**How Linux locates a file:**
```
/home/user/file.txt
    ↓
/ → inode of root → dentry → inode of home → dentry → inode of user → dentry → inode of file.txt → data blocks
```

---

## 12. DISK SCHEDULING

| Algorithm | How It Works | Pros | Cons |
|-----------|-------------|------|------|
| **FCFS** | Request order | Fair | Long seeks |
| **SSTF** | Shortest seek first | Better throughput | Starvation |
| **SCAN** (Elevator) | Arm moves back and forth | No starvation, good avg | Wait at ends |
| **C-SCAN** | Circular SCAN (return to start) | Uniform wait | Empty trip back |
| **LOOK** | SCAN but only to last request | More efficient | |
| **C-LOOK** | C-SCAN but only to last request | Best of both | |

> **Why SCAN > FCFS?** Reduces total head movement, better throughput.

---

## 13. SYSTEM CALLS

**What is a System Call?**
→ Request from user program to kernel for privileged operation.

**Trap:**
→ Software-generated interrupt switching to kernel mode.

**Flow:**
```
App calls read()
    ↓
Library wrapper puts args in registers
    ↓
SYSCALL instruction (trap)
    ↓
CPU switches to kernel mode
    ↓
Kernel handler executes read()
    ↓
Return to user mode with result
```

**Why expensive?** Mode switch, cache effects, security checks.

**Common Calls:**

| Call | What It Does |
|------|-------------|
| fork() | Create child process |
| exec() | Replace process image |
| wait() | Wait for child termination |
| open() | Open file |
| read() | Read from file |
| write() | Write to file |
| close() | Close file |
| mmap() | Map file to memory |

**System Call vs Function Call:**

| System Call | Function Call |
|-------------|-------------|
| Kernel mode switch | User mode only |
| Privileged operations | Regular computation |
| Expensive | Cheap |
| OS provides | Library provides |

---

## 14. INTERRUPTS

**Hardware Interrupt:**
→ External device signals CPU (keyboard press, disk ready).

**Software Interrupt (Trap):**
→ Program triggers (system call, division by zero).

**What happens:**
```
Device signals → CPU stops current → Save state → Run interrupt handler → Restore state → Resume
```

**Interrupt Vector:**
→ Table of handler addresses. IRQ 1 = keyboard handler.

**Interrupt Handler:**
→ Quick execution or schedule deferred work (top-half/bottom-half in Linux).

---

## 15. I/O MANAGEMENT

**Polling:**
→ CPU repeatedly checks device status. Wastes cycles.

**Interrupt-Driven I/O:**
→ Device interrupts when ready. CPU does other work meanwhile.

**DMA (Direct Memory Access):**
```
CPU tells DMA: "Transfer 1KB from disk to addr 0x1000"
    ↓
DMA does transfer independently
    ↓
DMA interrupts CPU: "Done!"
```
→ CPU free during transfer. Used for bulk I/O.

**Buffering:**
→ Temporary storage area. Decouples producer/consumer speeds.

**Spooling:**
→ Queue print jobs. Printer works independently.

**Caching:**
→ Keep frequently accessed data in fast memory.

---

## 16. IPC (INTER-PROCESS COMMUNICATION)

| Method | How It Works | Use Case |
|--------|-------------|----------|
| **Pipes** | Unidirectional, parent-child | ls \| grep |
| **Named Pipes** | Unidirectional, any processes | Cross-process communication |
| **Shared Memory** | Common memory region | Fastest, needs synchronization |
| **Message Queues** | Structured message passing | Decoupled communication |
| **Sockets** | Network or local endpoints | Cross-machine or local |
| **Signals** | Async notification | Kill, interrupt |

**Why shared memory?**
→ No kernel copy. Direct memory access. Fastest IPC.

**Pipes vs Sockets:**
- Pipes: Local only, simpler
- Sockets: Local + network, more flexible

---

## PRIORITY 3 — BACKEND/SYSTEM DESIGN

### Synchronization Primitives

**Read-Write Lock:**
→ Multiple readers OR one writer. Good for read-heavy data.

**Atomic Operations:**
→ Indivisible hardware instructions (test-and-set, compare-and-swap).

**CAS (Compare-And-Swap):**
```
Expected = current value
New = desired value
If memory == expected: memory = new (success)
Else: fail, retry
```
→ Lock-free programming foundation.

### Memory Mapping (mmap)

```
fd = open("file.txt")
mmap(addr, length, prot, flags, fd, offset)
    ↓
File mapped to virtual address space
    ↓
Access as array — page faults load from disk
```

**Shared Libraries:**
→ libc.so mapped into every process. Shared read-only pages.

### Copy-on-Write (fork efficiency)

```
Parent: pages marked read-only
    ↓ fork()
Child: shares same pages
    ↓ Either writes
OS: copies only modified page
```
→ fork() of large process is fast (no immediate copy).

### Concurrency Issues

**Thread Safety:**
→ Correct behavior with multiple threads. Use locks, atomics, or immutable data.

**Lock Contention:**
→ Multiple threads waiting for same lock. Solution: finer locks, lock-free.

**False Sharing:**
→ Two threads modify different variables on same cache line. Cache invalidates unnecessarily. Fix: pad to cache line size (64 bytes).

### Context Switching (Complete)

```
1. Save CPU registers to PCB (kernel stack)
2. Update PCB state (Running → Ready/Blocked)
3. Move PCB to appropriate queue
4. Select next process (scheduler)
5. Update PCB state (Ready → Running)
6. Restore registers from PCB
7. Jump to saved PC
```

### Kernel Architecture

| Type | Structure | Examples |
|------|-----------|----------|
| **Monolithic** | All in one kernel space | Linux, early Windows |
| **Microkernel** | Minimal kernel, services in user space | Minix, QNX |
| **Hybrid** | Mix of both | Windows NT, macOS (XNU) |

**Linux:** Monolithic with loadable modules.

**Windows:** Hybrid (NT kernel + user services).

**macOS:** Hybrid (XNU = Mach microkernel + BSD layer).

---

## PRIORITY 4 — MODERN OS CONCEPTS

### Virtualization

**Hypervisor:**
→ Software creating/running VMs.

**Type 1 (Bare Metal):**
→ Runs directly on hardware. VMware ESXi, Xen, Hyper-V.

**Type 2 (Hosted):**
→ Runs on host OS. VMware Workstation, VirtualBox.

**Guest OS:**
→ OS running inside VM. Thinks it has real hardware.

### Containers

**Namespace:**
→ Isolation of PID, network, mount, user. Process sees only its namespace.

**cgroups:**
→ Limit CPU, memory, I/O per group of processes.

**Container Isolation:**
```
App + Libraries → Container Runtime (Docker) → Host OS Kernel
    ↓
Namespaces isolate view
cgroups limit resources
```
→ Shares host kernel. Lightweight vs VMs.

### Linux CFS (Completely Fair Scheduler)

→ Each task gets "virtual runtime" proportional to weight.
→ Pick task with smallest vruntime. Fair share of CPU.

### NUMA (Non-Uniform Memory Access)

→ Multi-CPU systems: each CPU has local RAM.
→ Accessing remote CPU's RAM = slower.
→ OS tries to allocate memory on same node as CPU.

### Huge Pages

→ Why databases use them: Fewer TLB entries, fewer page faults, better performance for large contiguous memory.

### Cache Coherence

→ Multiple CPU cores have separate caches. Coherence protocol (MESI) ensures all see same value.

---

## LINUX CONCEPTS

**Process IDs:**

- PID: Process ID
- PPID: Parent PID
- PID 1: init/systemd

**Signals:**

- SIGKILL (9): Force kill, can't catch
- SIGTERM (15): Graceful shutdown
- SIGSEGV: Segmentation fault

**/proc:**
→ Virtual filesystem exposing kernel data. /proc/PID/ for process info.

**Process Tree:**
```
systemd (1)
  ├─ sshd
  │   └─ bash
  │       └─ python app.py
  └─ nginx
      ├─ worker 1
      └─ worker 2
```

**File Permissions:**
```
-rwxr-xr--  user group others
chmod 754 file
```

**Environment Variables:**
→ KEY=VALUE pairs. PATH, HOME, etc. Inherited by child processes.

**Background Processes:**
→ `command &` — runs detached. `fg` to bring back.

---

## PRACTICAL COMMANDS

| Command | Purpose |
|---------|---------|
| `ps` | List processes |
| `top` / `htop` | Real-time process viewer |
| `kill PID` | Send signal to process |
| `killall name` | Kill by name |
| `nice` / `renice` | Adjust priority |
| `free` | Memory usage |
| `vmstat` | Virtual memory stats |
| `iostat` | I/O statistics |
| `strace` | Trace system calls |
| `lsof` | List open files |
| `df` | Disk free space |
| `du` | Directory usage |

---

## 🔄 THE COMPLETE WORKFLOW: "What happens when you run a program?"

```
1. SHELL PARSING
   You type: ./myapp
   Shell parses command, finds executable

2. FORK()
   Shell forks → Parent shell + Child shell (identical)

3. EXEC()
   Child calls execve("./myapp")
   Replaces child memory with myapp's code/data

4. LOADER
   OS loader:

   - Allocates virtual address space
   - Maps executable segments (text, data, bss)
   - Maps shared libraries (ld-linux.so)
   - Sets up stack, heap
   - Jumps to _start

5. RUNTIME INITIALIZATION

   - Dynamic linker resolves symbols
   - Constructors run
   - main() called

6. EXECUTION
   Process runs in user mode
   System calls trap to kernel

7. TERMINATION
   main() returns → exit() → Kernel frees resources
   Parent wait() collects status
   If parent dead: child → orphan → adopted by init
   If parent doesn't wait: zombie briefly
```

---

## 🔄 COMPLETE WORKFLOW: "What happens after fork()?"

```
Parent Process (PID 100)
    ↓ fork()
    ↓
Kernel:
  1. Allocates new PID (101)
  2. Creates child PCB
  3. Copies parent's page table (COW)
  4. Marks all pages read-only
  5. Adds child to ready queue
    ↓
Parent returns: PID = 101 (child's PID)
Child returns: PID = 0
    ↓
Both continue from same instruction after fork()
    ↓
Whoever writes first → Page fault → OS copies page → marks writable
```

---

## 🔥 QUICK ANSWER CHEAT SHEET

| Question | Answer |
|----------|--------|
| What does OS do? | Manages hardware, provides services, isolates processes |
| Why can't apps access hardware directly? | Security, stability, fairness |
| What is PCB? | Process metadata: PID, registers, memory, files, state |
| Why context switching expensive? | Save/restore registers, cache/TLB flush |
| Program vs Process? | Program = file; Process = execution instance |
| Zombie vs Orphan? | Zombie = dead, parent didn't wait; Orphan = parent died, adopted by init |
| Why threads lighter? | Share address space, only need stack+registers |
| When processes over threads? | Security isolation, crash containment |
| Why Round Robin? | Fair time-sharing, responsive |
| What is race condition? | Unpredictable result from interleaved access |
| Mutex vs Semaphore? | Mutex = binary, owner unlocks; Semaphore = counting, any signals |
| Explain deadlock | Circular wait for resources, all 4 conditions hold |
| How DBs avoid deadlocks? | Timeouts, lock ordering, optimistic locking |
| Why virtual memory? | Larger space, isolation, sharing, simplified loading |
| What happens in page fault? | Trap → find frame → load from disk → update table → restart |
| Internal vs External fragmentation? | Internal = wasted inside block; External = wasted between blocks |
| Why TLB? | Cache page table entries, avoid 2 memory accesses |
| How address translation works? | Page number → frame via page table; offset stays same |
| What happens when RAM full? | Page replacement → swap victim to disk |
| Why not FIFO? | Belady's anomaly |
| Why LRU? | Near-optimal, practical |
| What is inode? | File metadata + pointers to data blocks |
| How Linux locates file? | Path → directories → inodes → data blocks |
| Why SCAN > FCFS? | Less head movement, better throughput |
| System call vs function call? | System call = kernel mode switch; Function call = user mode |
| Why system call expensive? | Mode switch, security checks, cache effects |
| What happens during interrupt? | Save state → run handler → restore state |
| Why DMA? | CPU free during bulk transfer |
| Why shared memory fastest IPC? | No kernel copy, direct access |
| Pipes vs Sockets? | Pipes = local only; Sockets = local + network |
| User vs Kernel mode? | User = restricted; Kernel = full hardware access |
| How scheduler decides? | Algorithm + priority + queue |
| Why fork() uses COW? | Avoid copying all pages immediately |
| How mmap works? | File mapped to address space, page faults load lazily |
| How Linux isolates containers? | Namespaces (view) + cgroups (resources) |
| Why locks in multithreading? | Prevent race conditions on shared data |
| Deadlock vs Starvation? | Deadlock = no progress; Starvation = one process excluded |
| What is Copy-on-Write? | Share pages until write, then copy only modified page |
| How does exec() work? | Replaces process image, keeps PID |
| Why are threads faster? | Less creation overhead, shared memory |
| What is context switching? | Saving one process state, loading another |
| What is virtual memory? | Illusion of large RAM using disk |
| Explain paging | Fixed-size blocks: pages (logical) → frames (physical) |
| What is TLB? | Cache for page table entries |
| Mutex vs Semaphore? | Mutex = 1 owner; Semaphore = N permits |
| What is thrashing? | Excessive page faults, CPU busy swapping |
| How does CFS work? | Pick task with smallest virtual runtime |
| What is NUMA? | CPU has local RAM; remote access slower |
| Why huge pages? | Fewer TLB entries, better for large memory |
| What is cache coherence? | All CPU caches see same value |
| Monolithic vs Microkernel? | Mono = all in kernel; Micro = minimal kernel, services user-space |
| How containers differ from VMs? | Containers share kernel; VMs have own kernel |
| What is a daemon? | Background process, no terminal, parent = init |
| What is spooling? | Queue I/O jobs for independent processing |
| What is journaling? | Log changes before applying for crash recovery |
| What is an atomic operation? | Indivisible, hardware-guaranteed |
| What is CAS? | Compare-And-Swap: lock-free synchronization |
| What is false sharing? | Different vars on same cache line cause invalidation |
| What is lock contention? | Multiple threads waiting for same lock |
| What is thread safety? | Correct behavior under concurrent access |

---

## SKIP THESE (Unless Systems/Kernel Role)

Linux kernel source internals, kernel module dev, device drivers, bootloader/BIOS, advanced NUMA, ext4 B-tree internals, interrupt controller architecture, scheduler implementation, SLAB/SLUB allocators, real-time kernel internals

---

> **Revision Order:** Processes → Threads → CPU Scheduling → Synchronization → Deadlocks → Memory Management → Paging → Virtual Memory → Page Replacement → System Calls → IPC → File Systems → Disk Scheduling → Interrupts → I/O → Kernel Architecture → Linux Process Management → Containers/Virtualization
