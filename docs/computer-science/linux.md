
# LINUX — SYSTEM FLOW NOTES
## How to read: Follow the arrow (→) flow. Every command is a story of what the system does.

---

# PRIORITY 1 — LINUX FUNDAMENTALS

## 1. Introduction to Linux

**1-liner:** Linux = open-source OS kernel + GNU tools → powers 90% of servers worldwide.

**Linux Architecture Flow:**
```
User types command → Shell (bash/zsh) interprets → 
    → System Calls → Linux Kernel → Hardware (CPU, RAM, Disk, Network)

    Kernel manages: Processes, Memory, Filesystem, Device Drivers, Network Stack
    Shell provides: Commands, Scripting, User Interface to Kernel
```

**Kernel vs Shell:**
| Kernel | Shell |
|--------|-------|
| Core of OS, talks to hardware | Command interpreter, talks to user |
| `fork()`, `exec()`, `open()` | `ls`, `cd`, `grep` |
| Written in C | Bash, Zsh, Fish |
| One per system | Many choices, swappable |

**Why servers use Linux:**
- Free, open-source, stable, secure, lightweight, great CLI, container-native (Docker runs on Linux kernel features).

**Distributions:** Ubuntu (user-friendly), CentOS/RHEL (enterprise), Debian (stable), Alpine (containers, tiny).

**GNU/Linux:** GNU = tools (gcc, bash, coreutils) + Linux = kernel. Together = full OS.

**CLI vs GUI:** Servers have no monitor → CLI only. Faster, scriptable, remote-friendly (SSH).

---

## 2. Linux File System Hierarchy

**The Tree (everything starts at `/`):**
```
/                           ← Root, top of everything
├── /bin                    ← Essential commands (ls, cat, cp) — needed for boot
├── /sbin                   ← System admin commands (fdisk, reboot) — root only
├── /usr/bin                ← User-installed apps (git, docker) — most commands live here
├── /usr/sbin               ← User-installed system tools
├── /etc                    ← Config files (nginx.conf, passwd, hosts)
├── /var                    ← Variable data (logs, caches, databases, mail)
├── /tmp                    ← Temporary files — wiped on reboot
├── /opt                    ← Optional software (third-party apps)
├── /dev                    ← Device files (/dev/sda = disk, /dev/null = black hole)
├── /proc                   ← Virtual filesystem → Process info as files (live kernel data)
│   ├── /proc/1234/         ← Process 1234 details (memory, status, cmdline)
│   └── /proc/cpuinfo       ← CPU info (not real file, generated on read)
├── /sys                    ← System hardware info (devices, drivers, kernel params)
├── /boot                   ← Boot loader files (kernel image, grub config)
├── /home                   ← User home directories (/home/alice, /home/bob)
└── /root                   ← Root user's home (separate from /home)
```

**Key Diffs:**
- `/bin` vs `/usr/bin`: Historically separate; modern systems often symlinked together.
- `/proc`: Not real files — reading triggers kernel to generate data live.

---

## 3. Navigation & File Operations

**Commands as Flows:**

| Command | What it does | Flow |
|---------|-------------|------|
| `pwd` | Print Working Directory | Shows where you are → `/home/alice/projects` |
| `ls -la` | List files | Shows all files (-a) with details (-l) → permissions, owner, size, date |
| `cd /var/log` | Change Directory | Moves you to `/var/log` → `pwd` now shows `/var/log` |
| `mkdir app` | Make Directory | Creates folder `app` → `ls` shows it |
| `rmdir empty_dir` | Remove empty directory | Deletes only if empty → Error if files inside |
| `touch file.txt` | Create empty file / Update timestamp | File exists? → Update time. No? → Create empty file |
| `cp file.txt backup.txt` | Copy | Reads file.txt → Writes identical content to backup.txt |
| `mv file.txt newname.txt` | Move/Rename | Updates directory entry → Same inode, new name |
| `rm file.txt` | Remove | Deletes file → Space freed (if no hard links) |
| `cat file.txt` | Concatenate/Print | Reads entire file → Dumps to terminal |
| `less file.txt` | Page through file | Opens interactive viewer → Scroll with arrows, `q` to quit |
| `head -20 log.txt` | First 20 lines | Reads from start → Stops at line 20 |
| `tail -20 log.txt` | Last 20 lines | Seeks to end → Reads backwards 20 lines |
| `tail -f app.log` | Follow log | Opens file → Watches for new lines → Prints in real-time |
| `ln file.txt hardlink` | Hard Link | Same inode, same data, different name → Deleting one doesn't delete data |
| `ln -s file.txt symlink` | Symbolic Link | Points to filename → Breaking original breaks symlink |

**Absolute vs Relative Paths:**
```
Absolute: /home/alice/projects/app.js  ← Starts from root `/`, works from anywhere
Relative: ./app.js  or  ../config.js   ← Relative to current directory
    ./  = current dir
    ../ = parent dir
```

**Hard Link vs Symbolic Link:**
| | Hard Link | Symbolic Link |
|---|---|---|
| Points to | Inode (actual data) | File path (name) |
| Cross filesystem? | No (same FS only) | Yes |
| Original deleted? | Data still accessible | Broken link (dangling) |
| Directory link? | No (usually) | Yes |
| `ls -l` shows | Normal file | `symlink -> target` |

**cp vs mv:**
- `cp` = duplicate data (new inode, new blocks).
- `mv` = rename directory entry (same inode, instant even for huge files).

---

# PRIORITY 2 — FILE PERMISSIONS

## 4. Linux Permissions

**1-liner:** Every file has 3 permission groups × 3 actions = 9 permission bits.

**Permission Flow:**
```
User tries to read /etc/shadow → 
    → Are you owner? → No → 
    → Are you in owner's group? → No → 
    → Check "others" permissions → r-- → 
    → Read allowed? → Yes for read, No for write
```

**The 9 Bits:**
```
-rwxr-xr--  1 alice dev  1234 Jan 15 10:00 script.sh
 │││││││││
 │││││││└┴─ Others:  r--  (read only)
 │││││└┴─── Group:   r-x  (read + execute)
 │││└┴───── User:    rwx  (read + write + execute)
 │└───────── File type: - = file, d = directory, l = symlink
```

**Numeric Notation:**
```
Read=4, Write=2, Execute=1 → Sum them
rwx = 4+2+1 = 7
r-x = 4+0+1 = 5
r-- = 4+0+0 = 4

chmod 755 file → rwxr-xr-x
chmod 644 file → rw-r--r--
chmod 600 file → rw------- (owner only)
chmod 777 file → rwxrwxrwx (everyone — dangerous!)
```

**Commands:**
| Command | Flow |
|---------|------|
| `chmod 755 script.sh` | Change mode → Owner: rwx, Group: r-x, Others: r-x |
| `chmod u+x script.sh` | Add execute (+x) for user (u) |
| `chown alice:dev file.txt` | Change owner to alice, group to dev |
| `chgrp dev file.txt` | Change group to dev |
| `umask 022` | New files get 644 (666-022), dirs get 755 (777-022) |

**chmod vs chown:**
- `chmod` = WHAT can be done (permissions).
- `chown` = WHO can do it (owner/group).

---

# PRIORITY 3 — PROCESS MANAGEMENT

## 5. Processes

**1-liner:** Process = running instance of a program. Everything in Linux is a process.

**Process Lifecycle Flow:**
```
Program on disk (binary) → fork() creates copy → exec() loads new program → 
    → Process runs → exits → Parent calls wait() → Process cleaned up
    → Parent doesn't wait? → Zombie process
    → Parent dies first? → Orphan adopted by init (PID 1)
```

**Key Concepts:**
| Term | Meaning | Flow |
|------|---------|------|
| **PID** | Process ID | Unique number assigned at creation → `ps` shows it |
| **PPID** | Parent PID | Who spawned this process → `pstree` shows tree |
| **Foreground** | Attached to terminal | `python app.py` → Blocks terminal → Ctrl+C kills it |
| **Background** | Detached from terminal | `python app.py &` → Terminal free → `jobs` lists it |
| **Daemon** | Background service | Starts at boot → No terminal → `systemd` manages it |
| **Zombie** | Dead but not reaped | Process exited → Parent hasn't called wait() → Still in process table |
| **Orphan** | Parent died | Parent crashed → Adopted by init (PID 1) → init calls wait() → Cleaned up |

**Commands:**
| Command | Flow |
|---------|------|
| `ps aux` | Snapshot of all processes → CPU%, MEM%, PID, Command |
| `top` | Interactive process viewer → Updates every few seconds → Sort by CPU/MEM |
| `htop` | Better top → Colors, mouse support, tree view |
| `pstree` | Show process tree → Parent-child relationships |
| `jobs` | List background jobs in current shell |
| `bg %1` | Resume job 1 in background |
| `fg %1` | Bring job 1 to foreground |

**Zombie vs Orphan:**
- Zombie = Dead child, living parent forgot to clean up. Harmless but leaks PID.
- Orphan = Living child, parent died. init adopts and cleans up properly.

**High CPU Process:**
```
top → Sort by CPU% (press P) → Identify PID → 
    → ps -fp <PID> → See command details → 
    → strace -p <PID> → See what system calls it's making
```

---

## 6. Process Control

**Signals = Software Interrupts:**
```
User presses Ctrl+C → SIGINT sent to foreground process → Process catches or dies
User presses Ctrl+Z → SIGSTOP sent → Process paused → `fg` resumes it
```

**Signal Table:**
| Signal | Number | Action | Flow |
|--------|--------|--------|------|
| **SIGTERM** | 15 | Graceful shutdown | "Please exit" → Process can cleanup → Save state → Exit |
| **SIGKILL** | 9 | Force kill | "Die now" → Kernel terminates immediately → No cleanup possible |
| **SIGINT** | 2 | Interrupt (Ctrl+C) | "Stop running" → Process can handle or exit |
| **SIGSTOP** | 19 | Pause (Ctrl+Z) | Freeze process → `SIGCONT` resumes |
| **SIGCONT** | 18 | Continue | Resume paused process |

**SIGTERM vs SIGKILL:**
- SIGTERM = polite ask. Process can save data, close files, clean up. Use first.
- SIGKILL = murder. Immediate, uncatchable. Use when SIGTERM ignored.

**Commands:**
| Command | Flow |
|---------|------|
| `kill 1234` | Send SIGTERM to PID 1234 → Graceful shutdown |
| `kill -9 1234` | Send SIGKILL → Force kill immediately |
| `killall python` | Kill all processes named "python" |
| `pkill -f "app.py"` | Kill matching process by full command line |
| `nice -n 10 python app.py` | Start with lower priority (higher nice = less CPU) |
| `renice 5 -p 1234` | Change priority of running process |
| `nohup python app.py &` | No Hang Up → Ignores SIGHUP when terminal closes → Output to nohup.out |

---

# PRIORITY 4 — SHELL BASICS

## 7. Shell Operators

**1-liner:** Shell operators chain commands and control data flow.

**Operator Flows:**

| Operator | Name | Flow | Example |
|----------|------|------|---------|
| `\|` | Pipe | Command1 output → Command2 input | `cat log.txt \| grep ERROR` → Only error lines |
| `&&` | AND | Run next only if previous succeeds | `mkdir dir && cd dir` → cd only if mkdir worked |
| `\|\|` | OR | Run next only if previous fails | `command \|\| echo "Failed"` → Print error if command fails |
| `;` | Sequence | Run all, ignore success/failure | `cmd1 ; cmd2` → Run both regardless |
| `>` | Redirect stdout | Overwrite file with output | `echo "hi" > file.txt` → file.txt = "hi" |
| `>>` | Redirect stdout append | Append to file | `echo "bye" >> file.txt` → file.txt = "hi
bye" |
| `<` | Redirect stdin | File as input | `sort < names.txt` → Sorts file contents |
| `2>` | Redirect stderr | Error to file | `python bad.py 2> errors.log` → Errors saved, output shown |
| `&` | Background | Run without blocking terminal | `python app.py &` → Terminal free immediately |
| `2>&1` | Merge stderr to stdout | Both outputs together | `cmd > output.log 2>&1` → All output in one file |

**`&&` vs `;`:**
- `&&` = conditional chain. `make && make install` → Install only if build succeeds.
- `;` = unconditional chain. `make ; make install` → Install even if build failed.

**`>` vs `>>`:**
- `>` = Overwrite (destroy old content).
- `>>` = Append (keep old content, add new).

---

## 8. Environment Variables

**1-liner:** Environment variables = configuration that programs inherit from the shell.

**Key Variables:**
| Variable | Purpose | Example |
|----------|---------|---------|
| **PATH** | Where to find executables | `/usr/local/bin:/usr/bin:/bin` → `ls` found in /usr/bin |
| **HOME** | Your home directory | `/home/alice` → `cd ~` goes here |
| **USER** | Current username | `alice` |
| **PWD** | Present Working Directory | `/home/alice/projects` |
| **SHELL** | Current shell | `/bin/bash` |

**PATH Flow:**
```
User types "git" → Shell checks: /usr/local/bin/git? → No → 
    → /usr/bin/git? → Yes → Execute /usr/bin/git
    → Not found anywhere? → "command not found"
```

**Commands:**
| Command | Flow |
|---------|------|
| `env` | Show all environment variables |
| `printenv PATH` | Show specific variable |
| `export MY_VAR=hello` | Set variable → Available to child processes |
| `MY_VAR=hello` | Set variable → Only in current shell, children don't see it |

**Why `export`?**
```
Without export: VAR=1 → Child process doesn't see VAR
With export:    export VAR=1 → Child process inherits VAR=1
```

---

# PRIORITY 5 — TEXT PROCESSING

## 9. grep

**1-liner:** grep = Global Regular Expression Print → Search text for patterns.

**Flow:**
```
Input stream → grep scans line by line → Pattern match? → Print line → Continue
```

**Examples:**
```bash
grep "ERROR" app.log              # Find lines containing "ERROR"
grep -i "error" app.log           # Case-insensitive (-i)
grep -r "TODO" ./src              # Recursive search in directory (-r)
grep -n "function" app.js         # Show line numbers (-n)
grep -v "DEBUG" app.log           # Invert match — exclude DEBUG lines (-v)
grep -E "error|fail|crash" log    # Extended regex — match any of these (-E)
grep "^2024-01" log.txt           # Lines starting with "2024-01" (^ = start)
grep "\.com$" urls.txt            # Lines ending with ".com" ($ = end)
```

---

## 10. find

**1-liner:** find = Search filesystem by name, type, size, time.

**Flow:**
```
Start directory → Recurse into subdirs → Check criteria → Match? → Print path
```

**Examples:**
```bash
find /var/log -name "*.log"       # Find files ending with .log
find . -type f -size +100M        # Files over 100MB
find . -type d -name "node_modules" # Find directories named node_modules
find . -mtime -7                  # Modified in last 7 days
find . -name "*.tmp" -delete      # Find and delete .tmp files
find . -name "*.js" -exec grep -l "TODO" {} \;  # Find JS files containing "TODO"
```

---

## 11. awk

**1-liner:** awk = pattern scanning and processing language → Extract columns, calculate, filter.

**Flow:**
```
Input line → Split by delimiter → Access fields ($1, $2, ...) → Apply action → Print result
```

**Examples:**
```bash
awk '{print $1}' file.txt         # Print first column (space-delimited)
awk -F',' '{print $2}' data.csv   # Print second column (comma-delimited)
awk '{print $1, $3}' file.txt     # Print columns 1 and 3
awk '$3 > 100 {print $1}' data    # Print column 1 where column 3 > 100
awk '{sum += $2} END {print sum}' nums  # Sum column 2, print total
awk 'NR==1 {print}' file.txt      # Print first line (NR = line number)
```

---

## 12. sed

**1-liner:** sed = Stream Editor → Search and replace in streams.

**Flow:**
```
Input line → Match pattern → Apply substitution → Output modified line
```

**Examples:**
```bash
sed 's/foo/bar/' file.txt         # Replace first "foo" with "bar" per line
sed 's/foo/bar/g' file.txt        # Replace ALL "foo" with "bar" per line (g = global)
sed -i 's/foo/bar/g' file.txt     # Edit file in-place (-i)
sed '2d' file.txt                 # Delete line 2
sed -n '5,10p' file.txt           # Print only lines 5-10 (-n = suppress auto-print)
sed '/^#/d' file.txt              # Delete lines starting with # (comments)
```

**grep vs find:**
- `grep` = Search **inside** file content.
- `find` = Search **filesystem** by name/type/size.

**awk vs sed:**
- `awk` = Column-based processing, calculations, filtering by value.
- `sed` = Line-based text transformation, search/replace, delete lines.

---

# PRIORITY 6 — PIPES & REDIRECTION

## 13. Pipes

**1-liner:** Pipe = connect stdout of one command to stdin of another.

**Flow:**
```
Command1 → stdout → [pipe] → stdin → Command2 → stdout → Terminal
```

**Examples:**
```bash
cat access.log | grep "404" | sort | uniq -c | sort -rn
# Read log → Filter 404s → Sort → Count unique → Sort by count (descending)

ps aux | grep python | awk '{print $2}' | xargs kill -9
# List processes → Find python → Extract PIDs → Kill them all
```

**Standard Streams:**
| Stream | Number | Default | Redirect |
|--------|--------|---------|----------|
| stdin  | 0 | Keyboard | `< file` |
| stdout | 1 | Terminal | `> file` |
| stderr | 2 | Terminal | `2> file` |

---

## 14. Redirection

**1-liner:** Redirection = Send output/input to files instead of terminal.

**Flow:**
```
Command → stdout (1) → > file.txt    (overwrite)
Command → stdout (1) → >> file.txt   (append)
Command → stderr (2) → 2> errors.log (errors only)
Command → stdout+stderr → &> all.log (both together)
```

**`2>&1` Explained:**
```
`cmd > output.log 2>&1` means:
    1. stdout (1) → output.log
    2. stderr (2) → wherever stdout (1) is going → also output.log
    Result: Both stdout and stderr in output.log

Order matters! `cmd 2>&1 > output.log` → stderr goes to terminal (where stdout currently is), then stdout redirected to file.
```

**Why pipes?** Chain small tools into powerful workflows. Unix philosophy: "Do one thing well."

---

# PRIORITY 7 — DISK & MEMORY

**Commands:**

| Command | Flow | Use |
|---------|------|-----|
| `df -h` | Check filesystem usage | `/dev/sda1 50G 30G 20G 60% /` → Disk 60% full |
| `du -sh /var/log` | Directory size | Recurse dir → Sum sizes → Show total human-readable |
| `free -h` | Memory usage | Total RAM, used, free, shared, buffers, cache |
| `vmstat 1` | Virtual memory stats | Every 1 sec: CPU, memory, IO, processes |
| `iostat` | Disk IO stats | Read/write rates per device |

**df vs du:**
- `df` = Disk Free — how much space on filesystem (mount point level).
- `du` = Disk Usage — how much space a directory tree uses.

**Check Memory:**
```
free -h → Shows: total 16G, used 8G, free 2G, available 10G
    → "available" includes cache that can be freed → More useful than "free"
```

---

# PRIORITY 8 — NETWORKING COMMANDS

| Command | Flow | Use |
|---------|------|-----|
| `ping google.com` | Send ICMP echo → Wait reply → Measure RTT | Is server reachable? |
| `curl -I https://api.com` | HTTP HEAD request → Show headers only | Test API, check status |
| `curl -X POST -d '{"key":"val"}' https://api.com` | Send POST with JSON body | API testing |
| `wget https://file.zip` | Download file | Non-interactive download |
| `ss -tlnp` | Show TCP listening sockets + process names | What's listening on which port? |
| `ip addr` | Show network interfaces and IPs | What IPs does this machine have? |
| `ip route` | Show routing table | How packets leave this machine |
| `nslookup google.com` | DNS query → Get IP address | Resolve domain to IP |
| `dig google.com` | Detailed DNS query → Show all records | Debug DNS issues |

**curl vs wget:**
- `curl` = Swiss army knife. Supports all HTTP methods, headers, auth, uploads. Interactive testing.
- `wget` = Download specialist. Recursive downloads, resumes, mirrors. Non-interactive.

**Test Server Reachable:**
```
ping server.com → 0% packet loss? → Reachable
ss -tlnp | grep :80 → LISTEN? → Web server running
curl -I http://server.com → 200 OK? → HTTP working
```

---

# PRIORITY 9 — FILE SEARCH & LOGS

| Command | Flow |
|---------|------|
| `locate app.conf` | Search prebuilt database → Instant results (run `updatedb` first) |
| `which python` | Search PATH → Find executable location → `/usr/bin/python` |
| `whereis python` | Find binary, source, man page locations |
| `tail -f /var/log/app.log` | Open log → Watch for new lines → Print in real-time |
| `journalctl -u nginx` | View systemd logs for nginx service |
| `journalctl -f` | Follow all system logs (like tail -f for systemd) |

**Monitor Logs in Real-Time:**
```
tail -f /var/log/nginx/access.log | grep "500"
# Watch access log → Filter 500 errors → See them as they happen
```

**Locate Executable:**
```
which node → /usr/local/bin/node (the one that runs when you type "node")
whereis node → /usr/local/bin/node /usr/local/lib/node (binary + libs)
```

---

# PRIORITY 10 — BASIC SHELL SCRIPTING

**1-liner:** Shell script = text file with multiple commands that can be executed.

**Script Flow:**
```bash
#!/bin/bash                    # Shebang — tells system which interpreter
NAME="Alice"                   # Variable
if [ "$NAME" == "Alice" ]; then   # Conditional
    echo "Hello, $NAME"
else
    echo "Who are you?"
fi

for i in 1 2 3; do            # Loop
    echo "Number: $i"
done

function greet() {            # Function
    echo "Hello, $1"          # $1 = first argument
}
greet "Bob"                   # Call function

echo "Exit code: $?"          # $? = exit code of last command (0 = success)
```

**Positional Parameters:**
```
./script.sh arg1 arg2 arg3
    $0 = ./script.sh
    $1 = arg1
    $2 = arg2
    $3 = arg3
    $@ = all arguments
    $# = number of arguments
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Misuse of command |
| 126 | Command not executable |
| 127 | Command not found |
| 130 | Ctrl+C (SIGINT) |
| 137 | SIGKILL (kill -9) |

---

# PRIORITY 11 — PACKAGE MANAGEMENT

| Distro | Command | Flow |
|--------|---------|------|
| **Ubuntu/Debian** | `apt install nginx` | Search repo → Download → Install + dependencies |
| | `apt update` | Refresh package list from repos |
| | `apt upgrade` | Upgrade installed packages |
| | `dpkg -i package.deb` | Install local .deb file (no dependency resolution) |
| **RHEL/CentOS** | `yum install nginx` | Search repo → Download → Install |
| | `dnf install nginx` | Modern replacement for yum (faster, better deps) |
| | `rpm -i package.rpm` | Install local .rpm file |

**apt vs dpkg:**
- `apt` = High-level, handles dependencies, fetches from repos.
- `dpkg` = Low-level, installs single package, no dependency resolution.

---

# PRIORITY 12 — LINUX FOR DEVELOPERS

**SSH Flow:**
```
Local machine → ssh user@server.com → 
    → Server verifies identity (password or key) → 
    → Encrypted session established → Remote shell access
```

**SSH Key Auth:**
```
Local: ssh-keygen → Creates ~/.ssh/id_rsa (private) + id_rsa.pub (public)
Local: ssh-copy-id user@server → Copies public key to server ~/.ssh/authorized_keys
Next login: ssh user@server → Server checks key match → No password needed
```

**SCP Flow:**
```
Local → scp file.txt user@server:/home/user/ → File copied over SSH
Server → scp user@server:/var/log/app.log ./ → Download log file
```

**Cron Jobs:**
```
crontab -e → Edit cron table

Format: minute hour day month weekday command
Example: 0 2 * * * /backup.sh  → Run backup.sh at 2:00 AM daily
Example: */5 * * * * /health-check.sh → Run every 5 minutes
```

**Background Services:**
```
systemctl start nginx    → Start service
systemctl stop nginx     → Stop service
systemctl restart nginx  → Restart service
systemctl enable nginx   → Start on boot
systemctl status nginx   → Check status, logs, PID
```

---

# COMMON INTERVIEW SCENARIOS — QUICK ANSWERS

| # | Question | Answer |
|---|----------|--------|
| 1 | Kernel vs Shell? | Kernel talks to hardware; Shell is user interface to kernel |
| 2 | Linux directory structure? | /bin=essential cmds, /etc=config, /var=logs, /tmp=temp, /proc=live process data |
| 3 | Absolute vs Relative paths? | Absolute starts with / (root); Relative starts from current dir (./ or ../) |
| 4 | Hard Link vs Symbolic Link? | Hard link = same inode (data); Symlink = points to filename (breaks if target deleted) |
| 5 | chmod vs chown? | chmod = change permissions; chown = change owner/group |
| 6 | chmod 755? | rwxr-xr-x → Owner: full, Group: read+execute, Others: read+execute |
| 7 | Zombie vs Orphan? | Zombie = dead child, parent didn't wait(); Orphan = parent died, adopted by init |
| 8 | SIGTERM vs SIGKILL? | SIGTERM (15) = graceful, cleanup allowed; SIGKILL (9) = force, no cleanup |
| 9 | ps vs top? | ps = snapshot of processes; top = interactive, real-time updating |
| 10 | kill vs kill -9? | kill = SIGTERM (graceful); kill -9 = SIGKILL (force) |
| 11 | grep vs find? | grep = search inside files; find = search filesystem by name/type/size |
| 12 | awk vs sed? | awk = column processing, calculations; sed = line-based search/replace |
| 13 | Pipes vs Redirection? | Pipe = connect commands (cmd1 \| cmd2); Redirection = send to file (cmd > file) |
| 14 | > vs >>? | > = overwrite; >> = append |
| 15 | df vs du? | df = disk free (filesystem level); du = disk usage (directory tree level) |
| 16 | curl vs wget? | curl = HTTP swiss army knife (all methods, headers); wget = download specialist |
| 17 | Inspect running process? | ps aux \| grep <name> or top/htop → Find PID → cat /proc/<PID>/status |
| 18 | Monitor logs real-time? | tail -f /var/log/app.log or journalctl -f -u service |
| 19 | PATH variable? | Colon-separated list of directories where shell looks for executables |
| 20 | Debug Linux app? | Check logs (journalctl/tail), check processes (ps/top), check resources (free/df), strace -p PID |

---

# REVISION ORDER (Highest ROI)

1. File System Hierarchy (/bin, /etc, /var, /proc, /tmp)
2. File Operations (ls, cd, cp, mv, rm, cat, less, head, tail)
3. Hard Link vs Symbolic Link (inode vs filename pointer)
4. Permissions (rwx, 755, 644, chmod, chown, umask)
5. Process Lifecycle (fork → exec → run → exit → wait)
6. Zombie vs Orphan (parent didn't wait vs parent died)
7. Signals (SIGTERM=15 graceful, SIGKILL=9 force, SIGINT=Ctrl+C)
8. Process Commands (ps, top, kill, killall, nohup, nice)
9. Shell Operators (\|, &&, ;, >, >>, 2>&1)
10. Environment Variables (PATH, HOME, export)
11. grep (pattern matching, -i, -r, -n, regex basics)
12. find (name, type, size, time, -exec)
13. awk (columns $1, $2, -F delimiter, filtering)
14. sed (s/old/new/g, -i in-place, delete lines)
15. Pipes & Redirection (connect commands, stdout/stderr)
16. Disk & Memory (df, du, free, vmstat)
17. Networking (ping, curl, ss, ip, dig)
18. Log Monitoring (tail -f, journalctl)
19. Shell Scripting (variables, if, for, functions, $1, $?)
20. Package Management (apt vs dpkg, yum vs rpm)

---

# HANDS-ON PRACTICE TASKS

1. **Navigate & Manipulate Files:**
   ```
   cd /var/log → ls -la → cat syslog → less auth.log → head -50 syslog → tail -f syslog
   ```

2. **Permissions:**
   ```
   touch script.sh → chmod 755 script.sh → chown user:group script.sh → ls -l script.sh
   ```

3. **Links:**
   ```
   echo "data" > original.txt → ln original.txt hardlink → ln -s original.txt symlink → 
   ls -li → rm original.txt → cat hardlink (works) → cat symlink (broken)
   ```

4. **Process Monitoring:**
   ```
   python -m http.server 8000 & → ps aux | grep python → top → kill -15 <PID>
   ```

5. **Text Processing Pipeline:**
   ```
   cat access.log | grep "404" | awk '{print $1}' | sort | uniq -c | sort -rn
   # Most frequent IPs causing 404 errors
   ```

6. **Disk & Memory:**
   ```
   df -h → du -sh /home → free -h → vmstat 1 5
   ```

7. **Network Debug:**
   ```
   ping 8.8.8.8 → curl -I https://google.com → ss -tlnp → dig google.com
   ```

8. **Log Monitoring:**
   ```
   tail -f /var/log/syslog | grep "error" → Ctrl+C to stop
   ```

9. **Shell Script:**
   ```bash
   #!/bin/bash
   echo "Hello, $1"
   echo "You passed $# arguments"
   for arg in "$@"; do
       echo "Arg: $arg"
   done
   ```

10. **Cron Job:**
    ```
    crontab -e → Add: */5 * * * * echo $(date) >> /tmp/heartbeat.log → 
    → Saves heartbeat every 5 minutes
    ```

---

**REMEMBER:** Interviewers care about:
1. **Can you navigate a Linux system confidently?** (Know the filesystem, basic commands)
2. **Do you understand permissions?** (rwx, numeric, security implications)
3. **Can you debug a running system?** (ps, top, logs, network, disk)
4. **Can you chain commands?** (Pipes, redirection, text processing)
5. **Do you understand processes?** (Lifecycle, signals, zombies, background)

Tell the story of what happens when you run a command — where the data flows, what the kernel does, what the output means.
