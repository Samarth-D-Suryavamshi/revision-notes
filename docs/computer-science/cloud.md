
# CLOUD COMPUTING — SYSTEM FLOW NOTES
## How to read: Follow the arrow (→) flow. Every concept traces a request's journey through the cloud.

---

# PRIORITY 1 — CLOUD FUNDAMENTALS

## 1. Introduction to Cloud Computing

**1-liner:** Cloud = rent someone else's computers (AWS/Azure/GCP) instead of buying your own.

**On-Premises vs Cloud Flow:**
```
On-Premises:
    Need server → Buy hardware ($10K) → Wait 2 weeks delivery → 
    → Install in data center → Configure → Use → Maintain forever → 
    → Peak traffic? → Buy more (over-provision) → Idle 70% of time → Waste money

Cloud:
    Need server → Open AWS console → Click launch → Server ready in 2 min → 
    → Pay per hour → Peak traffic? → Auto-scale up → Traffic drops? → Auto-scale down → 
    → Pay only for what you use
```

**Cloud Types:**
| Type | Flow | Example |
|------|------|---------|
| **Public** | Anyone rents shared infrastructure | AWS, Azure, GCP |
| **Private** | You own the cloud (on-prem or hosted) | OpenStack in your data center |
| **Hybrid** | Sensitive data on private → Public for burst | Bank: core DB private, marketing site public |
| **Multi-Cloud** | Use AWS + Azure + GCP → Avoid vendor lock-in | Netflix on AWS + backup on GCP |

**Service Models (The Pizza Analogy):**
| Model | You manage | Provider manages | Pizza Analogy |
|-------|-----------|------------------|---------------|
| **IaaS** | OS, App, Data | Hardware, Network, Virtualization | They provide kitchen, you cook |
| **PaaS** | App, Data | OS, Runtime, Middleware, Hardware | They provide kitchen + ingredients, you bake |
| **SaaS** | Nothing (just use it) | Everything | They deliver cooked pizza, you eat |
| **FaaS** | Function code only | Everything else | They provide kitchen, you just add toppings |

**Examples:**
- IaaS: AWS EC2, Azure VMs — you manage OS, patches, security.
- PaaS: Heroku, AWS Elastic Beanstalk — you deploy code, they manage runtime.
- SaaS: Gmail, Slack, Salesforce — login and use.
- FaaS: AWS Lambda — upload function, runs on trigger, pay per invocation.

**Why migrate to cloud?** No upfront cost, instant scaling, global reach, managed services, pay-as-you-go.

---

## 2. Cloud Architecture Basics

**1-liner:** Cloud architecture = how compute, storage, network, and security work together.

**Request Flow Through Cloud Architecture:**
```
User Request → DNS → CDN (cached?) → 
    → Load Balancer → Auto Scaling Group → 
    → EC2 Instance (Compute) → 
    → Application Code → 
    → Database (RDS/DynamoDB) → 
    → Response back up the chain
```

**Components:**
| Component | Role | Example |
|-----------|------|---------|
| **Compute** | Run your code | EC2, Lambda, ECS |
| **Storage** | Store data | S3, EBS, EFS |
| **Networking** | Connect everything | VPC, Subnets, Security Groups, LB |
| **Databases** | Persist structured data | RDS (SQL), DynamoDB (NoSQL) |
| **Security** | Control access | IAM, Encryption, WAF |
| **Scalability** | Handle more load | Auto Scaling, Load Balancer |
| **High Availability** | Survive failures | Multi-AZ, Multi-Region |

---

# PRIORITY 2 — VIRTUALIZATION

## 3. Virtual Machines

**1-liner:** VM = software computer running inside a physical computer.

**VM Flow:**
```
Physical Server (Host) → Hypervisor installed → 
    → VM1: Ubuntu + 2GB RAM + 2 CPU → Guest OS thinks it owns hardware
    → VM2: Windows + 4GB RAM + 2 CPU → Completely isolated from VM1
    → VM3: CentOS + 2GB RAM + 1 CPU → All share physical resources
```

**Hypervisor Types:**
| Type | Name | Flow | Speed | Example |
|------|------|------|-------|---------|
| **Type 1** | Bare Metal | Hypervisor → Directly on hardware → VMs | Fast | VMware ESXi, Hyper-V, KVM |
| **Type 2** | Hosted | Host OS → Hypervisor → VMs | Slower (extra layer) | VirtualBox, VMware Workstation |

**VM vs Physical Machine:**
- Physical: One OS, one machine, dedicated hardware.
- VM: Multiple OS on one machine, shared hardware, isolated, snapshot/clone capable.

**Why VMs slower than containers?**
```
VM: App → Guest OS → Hypervisor → Host OS → Hardware (4 layers)
Container: App → Container Runtime → Host OS → Hardware (3 layers, shares kernel)
    → VMs need full OS per instance → Heavy (GBs)
    → Containers share host kernel → Light (MBs)
```

---

## 4. Containers

**1-liner:** Container = lightweight, portable package of app + dependencies sharing the host OS kernel.

**Container Flow:**
```
Host OS (Linux Kernel) → 
    → Container Runtime (Docker) → 
        → Namespace isolation (PID, Network, Mount) → Container thinks it's alone
        → cgroup limits (CPU: 0.5 core, RAM: 512MB) → Can't hog resources
        → Container 1: Node.js app + dependencies
        → Container 2: Python app + dependencies
        → Container 3: Nginx + config
    → All share same kernel → No guest OS overhead
```

**VM vs Container:**
| | VM | Container |
|---|---|---|
| Size | GBs (full OS) | MBs (app + libs) |
| Boot time | Minutes | Seconds |
| Isolation | Strong (hardware-level) | Process-level (weaker) |
| OS | Each VM has own OS | Share host kernel |
| Use case | Different OS needs, strong isolation | Microservices, same OS, fast scaling |

**How containers isolated?**
- **Namespaces:** PID (process IDs), Network (interfaces), Mount (filesystem), User (UIDs) — each container sees its own isolated view.
- **cgroups:** Control groups — limit CPU, memory, disk I/O per container.

---

# PRIORITY 3 — DOCKER

## Docker Architecture

**1-liner:** Docker = platform to build, ship, and run containers.

**Flow:**
```
Developer writes Dockerfile → docker build → Docker Image (blueprint) → 
    → docker push → Docker Hub (registry) → 
    → docker pull → Any machine → docker run → Container (running instance)
```

**Components:**
| Component | What it is | Flow |
|-----------|-----------|------|
| **Docker Engine** | Runtime that runs containers | Docker Daemon listens → Client sends commands |
| **Docker Client** | CLI you type into | `docker run` → Client talks to Daemon via socket |
| **Docker Daemon** | Background service | Receives commands → Manages containers, images, networks, volumes |
| **Docker Hub** | Public registry | Store images → `docker pull nginx` → Downloads from Hub |
| **Image** | Read-only blueprint | Layers stacked → Base OS → Dependencies → App code |
| **Container** | Running instance of image | Image + writable layer → Processes running → Isolated |
| **Volume** | Persistent storage | Container writes to volume → Data survives container deletion |
| **Network** | Container communication | Bridge (default), Host, None, Custom → Containers talk via IPs |

**Image vs Container:**
- Image = Class (blueprint, read-only, stored).
- Container = Object (running instance, writable layer on top, ephemeral).

---

## Dockerfile

**1-liner:** Dockerfile = recipe to build a Docker image layer by layer.

**Flow:**
```
Dockerfile instructions → Each instruction creates a layer → Cached if unchanged → 
    → Final image = stacked layers → Smaller, faster builds
```

**Instructions:**
| Instruction | Flow | Example |
|-------------|------|---------|
| `FROM node:18` | Start from base image | Like inheritance — base OS + Node.js pre-installed |
| `RUN npm install` | Execute command during build | Creates new layer with installed packages |
| `COPY . /app` | Copy files from host to image | Source code added to image |
| `ADD . /app` | COPY + auto-extract tar + download URLs | Prefer COPY (explicit, predictable) |
| `WORKDIR /app` | Set working directory | All subsequent commands run here |
| `EXPOSE 3000` | Document port (info only) | `docker run -p 8080:3000` maps host:container |
| `ENV NODE_ENV=production` | Set environment variable | Available inside container |
| `CMD ["node", "app.js"]` | Default command when container starts | Overridable by `docker run` args |
| `ENTRYPOINT ["node"]` | Fixed command prefix | `docker run image app.js` → runs `node app.js` |

**CMD vs ENTRYPOINT:**
```
CMD ["node", "app.js"] → docker run myimage → Runs: node app.js
                        → docker run myimage python → Runs: python (replaces CMD)

ENTRYPOINT ["node"] + CMD ["app.js"] → docker run myimage → Runs: node app.js
                                      → docker run myimage server.js → Runs: node server.js
    → ENTRYPOINT = fixed prefix; CMD = default args (overridable)
```

**COPY vs ADD:**
- COPY = simple file copy (preferred, predictable).
- ADD = COPY + auto-extract archives + download from URL (magic, less predictable).

**Why Volumes?**
```
Without volume: Container writes to writable layer → Container deleted → Data gone
With volume:    Container writes to /data (mounted volume) → Container deleted → Data persists on host
    → Use for: databases, uploaded files, logs
```

---

## Docker Commands

| Command | Flow |
|---------|------|
| `docker build -t myapp .` | Read Dockerfile → Build layers → Tag as `myapp` |
| `docker run -d -p 8080:3000 myapp` | Pull image if needed → Create container → Map host:8080→container:3000 → Run detached (-d) |
| `docker ps` | List running containers → ID, Image, Ports, Status |
| `docker ps -a` | List all containers (including stopped) |
| `docker images` | List local images → Repository, Tag, Size |
| `docker logs -f container_id` | Stream container stdout/stderr |
| `docker exec -it container_id bash` | Execute bash inside running container → Interactive terminal |
| `docker stop container_id` | Send SIGTERM → Wait 10s → SIGKILL if not stopped |
| `docker rm container_id` | Delete stopped container → Free resources |
| `docker rmi image_id` | Delete image → Free disk space |
| `docker pull nginx` | Download image from Docker Hub |
| `docker push myrepo/myapp:v1` | Upload image to registry |

---

# PRIORITY 4 — KUBERNETES (High-Level)

**1-liner:** Kubernetes (K8s) = orchestrator that manages 100s of containers across multiple machines.

**Why Kubernetes?**
```
Docker alone: 1 server → Run 10 containers → Manual management
Kubernetes:   10 servers → Cluster → Auto-place containers → Auto-heal → Auto-scale → Load balance
    → You describe desired state → K8s makes it happen
```

**Architecture Flow:**
```
User runs: kubectl apply -f deployment.yaml
    → kubectl talks to API Server (Control Plane)
    → Scheduler decides which Worker Node to place Pod on
    → Controller Manager ensures desired state = actual state
    → etcd stores cluster state (source of truth)
    → Kubelet on Worker Node receives instruction → Starts Pod
    → Kube-Proxy routes traffic to Pod
```

**Core Components:**
| Component | What it does | Flow |
|-----------|-----------|------|
| **Pod** | Smallest deployable unit → 1+ containers sharing network/storage | Container(s) + shared IP + shared volumes |
| **Deployment** | Manages Pods → Ensures N replicas running | Declares: "I want 3 Pods of my app" → K8s maintains it |
| **ReplicaSet** | Ensures exact number of Pods running | Deployment creates/manages ReplicaSet |
| **Service** | Stable network endpoint for Pods | Pods come and go (IPs change) → Service provides constant IP + DNS + load balances |
| **Namespace** | Logical isolation → Dev/Staging/Prod in same cluster | `kubectl get pods -n production` |
| **ConfigMap** | Non-sensitive config (env vars, config files) | Injected into Pods as env or files |
| **Secret** | Sensitive data (passwords, tokens, keys) | Base64 encoded (not encrypted by default), mounted as files |

**Pod vs Container:**
- Container = single running process.
- Pod = wrapper around 1+ containers → Shared IP, shared storage, same lifecycle.
- Example: App container + Sidecar container (logging) in same Pod.

**Deployment vs ReplicaSet:**
- ReplicaSet = ensures N Pods running (low-level).
- Deployment = manages ReplicaSet + supports rolling updates + rollback (higher-level).
- You always use Deployment, never ReplicaSet directly.

**Scaling & Self-Healing:**
```
Horizontal Scaling: Deployment replicas: 3 → 10 → K8s creates 7 new Pods → Distributes across nodes
Rolling Update:     v1 Pods running → Deploy v2 → K8s replaces one by one → Zero downtime
Self-Healing:       Pod crashes → K8s detects (health check fails) → Creates replacement Pod automatically
```

---

# PRIORITY 5 — AWS BASICS

## Compute

**EC2 Flow:**
```
Launch EC2 → Choose AMI (OS image) → Pick instance type (t3.micro = 1 CPU, 1GB RAM) → 
    → Configure VPC/Subnet → Attach Security Group → 
    → Launch → SSH in → Install app → Run
```

**Lambda Flow:**
```
Upload function code → Set trigger (API Gateway, S3 upload, Cron) → 
    → Event occurs → AWS spins up container → Runs function → 
    → Returns result → Container destroyed (or kept warm) → Pay per invocation + duration
```

**EC2 vs Lambda:**
| | EC2 | Lambda |
|---|---|---|
| Model | Always-on server | Event-driven function |
| Management | You manage OS, patches, scaling | AWS manages everything |
| Billing | Per hour (running) | Per invocation + compute time |
| Use case | Long-running, complex apps | Short tasks, APIs, event processing |
| Cold start | None | Yes (100ms-1s delay) |

---

## Storage

**S3 Flow:**
```
Create Bucket (global unique name) → Upload file → Object stored → 
    → Get URL → https://bucket.s3.amazonaws.com/file.jpg → 
    → Public? → Direct access → Private? → Signed URL or IAM policy
```

**S3 vs EBS vs EFS:**
| | S3 | EBS | EFS |
|---|---|---|---|
| Type | Object Storage | Block Storage | File Storage |
| Access | HTTP/API | Attached to 1 EC2 | Mounted to many EC2s |
| Use case | Images, backups, static files | Database disks, app storage | Shared config, content |
| Durability | 99.999999999% (11 9s) | 99.8-99.9% | 99.9% |
| Size | Unlimited | Up to 64TB | Elastic growth |

---

## Database

**RDS Flow:**
```
Choose engine (MySQL/PostgreSQL) → Select instance size → 
    → Enable Multi-AZ (standby in another zone) → 
    → Automated backups → Connect via endpoint → Use like normal DB
```

**DynamoDB Flow:**
```
Create table → Define partition key → 
    → No servers to manage → Auto-scales → 
    → Read/Write capacity on-demand → Pay per request
```

---

## Networking

**VPC Flow:**
```
VPC (Virtual Private Cloud) → 10.0.0.0/16 → 
    → Public Subnet (10.0.1.0/24) → Internet Gateway → Accessible from internet
    → Private Subnet (10.0.2.0/24) → NAT Gateway → Outbound only (security)
    → Security Group (firewall at instance level) → Allow port 80, 443, 22
```

**Security Group vs Firewall:**
- Security Group = AWS cloud firewall (stateful, allow rules only, attached to instances).
- Traditional Firewall = Hardware/software, stateful or stateless, more complex rules.

---

## IAM

**1-liner:** IAM = Identity and Access Management → Who can do what in your AWS account.

**Flow:**
```
User/Role tries to access S3 → IAM checks policy → 
    → Policy allows? → Grant access
    → Policy denies? → 403 Forbidden
    → No policy? → Implicit deny
```

| Component | Purpose |
|-----------|---------|
| **User** | Person/entity with long-term credentials |
| **Role** | Temporary credentials → Assumed by services/users (e.g., EC2 assumes role to access S3) |
| **Policy** | JSON document defining permissions (Allow/Deny + Actions + Resources) |

**Principle of Least Privilege:** Give minimum permissions needed → `s3:GetObject` on specific bucket, NOT `s3:*` on `*`.

---

# PRIORITY 6 — STORAGE TYPES

**Block vs File vs Object Storage:**

| Type | Unit | Access | Use Case | Cloud Example |
|------|------|--------|----------|---------------|
| **Block** | Fixed-size blocks (512B-4KB) | Mounted as disk | OS boot, databases | EBS |
| **File** | Files and folders | NFS/SMB protocol | Shared files across servers | EFS, NFS |
| **Object** | Objects (file + metadata + ID) | HTTP/API | Images, videos, backups, static assets | S3 |

**Why Object Storage for images?**
```
Image uploaded → Stored as object → URL generated → 
    → CDN caches it globally → Users download from nearest edge → 
    → 11 9s durability → Versioning → Lifecycle (auto-archive old images to Glacier)
```

**S3 Features:**
- **Versioning:** Keep all versions → Delete = add delete marker → Restore old version.
- **Lifecycle:** After 30 days → Move to cheaper storage (S3 Standard-IA) → After 1 year → Archive to Glacier.

---

# PRIORITY 7 — NETWORKING

**Load Balancer Flow:**
```
User Request → DNS resolves to LB IP → 
    → LB receives request → Health check: Which targets are healthy? → 
    → Route to healthy target (round-robin / least connections) → 
    → Target processes → Response back through LB → User
```

**Layer 4 vs Layer 7:**
| | Layer 4 (NLB) | Layer 7 (ALB) |
|---|---|---|
| OSI Layer | Transport (TCP/UDP) | Application (HTTP/HTTPS) |
| Routing | By IP + Port | By URL path, host header, query params |
| Speed | Faster (less processing) | Smarter (content-based routing) |
| Example | `api.com:443` → Any backend | `/api/*` → API servers, `/web/*` → Web servers |

**LB vs Reverse Proxy:**
- LB = distributes across multiple servers (scalability).
- Reverse Proxy = sits in front of one server, can cache, SSL termination, security (enhancement).
- Often combined: ALB (LB) → Nginx (Reverse Proxy) → App Server.

---

# PRIORITY 8 — CLOUD SCALABILITY

**Auto Scaling Flow:**
```
CloudWatch monitors CPU → CPU > 70% for 5 min? → 
    → CloudWatch Alarm triggers → Auto Scaling Group adds 2 instances → 
    → Load Balancer registers new instances → Traffic distributed → CPU drops → 
    → CPU < 30% for 10 min? → Remove 1 instance → Save cost
```

**Scalability vs Elasticity:**
- Scalability = Ability to handle growth (plan for more capacity).
- Elasticity = Auto-scale up AND down based on demand (pay for what you use).

**High Availability vs Fault Tolerance:**
| | High Availability | Fault Tolerance |
|---|---|---|
| Goal | Minimize downtime | Zero downtime |
| Method | Redundancy + failover | Full redundancy (hot standby) |
| Downtime | Seconds to minutes | Zero |
| Cost | Medium | High (duplicate everything) |
| Example | Multi-AZ RDS (failover in 60s) | Active-active across regions |

**Multi-AZ vs Multi-Region:**
- Multi-AZ: Same region, different data centers (availability zones) → Low latency failover.
- Multi-Region: Different geographic regions → Disaster recovery, global latency.

---

# PRIORITY 9 — CLOUD SECURITY

**Security Flow:**
```
Data at Rest (on disk):    S3 object → Server-Side Encryption (SSE-S3/SSE-KMS) → Encrypted storage
Data in Transit (network): Browser → HTTPS/TLS 1.3 → Encrypted connection → Server
Access Control:            IAM Policy → Role → Assumed by EC2 → Can access S3 bucket
Secrets:                   Password in Secret Manager → App retrieves at runtime → Never hardcoded
```

**Why no hardcoded access keys?**
```
Hardcoded in GitHub → Attacker scans repos → Finds AKIA... key → 
    → Spins up 1000 EC2 instances for crypto mining → $50K bill → You get fired

Solution: IAM Roles → EC2 assumes role → Temporary credentials → Auto-rotated → No keys in code
```

---

# PRIORITY 10 — CI/CD & DEPLOYMENT

**Docker-based Deployment Flow:**
```
Developer pushes code → GitHub Actions triggered → 
    → Build Docker image → Run tests → Push to ECR (registry) → 
    → Deploy to ECS/K8s → Rolling update → Health checks pass → Traffic switched
```

**Deployment Strategies:**

| Strategy | Flow | Risk | Use Case |
|----------|------|------|----------|
| **Rolling** | v1 running → Replace 1 by 1 with v2 → All v2 | Medium | Standard, zero downtime |
| **Blue-Green** | Blue (v1) active → Deploy Green (v2) → Test Green → Switch traffic instantly → Rollback = switch back | Low | Critical systems, instant rollback |
| **Canary** | 95% v1 + 5% v2 → Monitor → 80/20 → 50/50 → 0/100 | Low | Test in production, gradual rollout |

---

# PRIORITY 11 — INFRASTRUCTURE AS CODE (Basic)

**1-liner:** IaC = define infrastructure in code files → Version controlled → Reproducible.

**Terraform Flow:**
```
Write main.tf (HCL language) → terraform init → terraform plan (preview changes) → 
    → terraform apply → AWS resources created → terraform destroy → Clean up
```

**CloudFormation Flow:**
```
Write template.yaml (JSON/YAML) → Upload to AWS → CloudFormation creates stack → 
    → All resources provisioned → Update stack for changes → Delete stack to clean up
```

---

# PRIORITY 12 — CLOUD COST OPTIMIZATION

**Instance Types:**
| Type | Flow | Cost | Use Case |
|------|------|------|----------|
| **On-Demand** | Launch anytime → Pay per hour | Highest | Dev/test, unpredictable workloads |
| **Reserved** | Commit 1-3 years upfront | 40-60% cheaper | Steady-state production |
| **Spot** | Bid on unused capacity → Can be interrupted | 90% cheaper | Fault-tolerant batch jobs |

**S3 Storage Classes:**
| Class | Use Case | Cost |
|-------|----------|------|
| Standard | Frequently accessed | Highest |
| Standard-IA | Infrequently accessed | Lower |
| Glacier | Archives (retrieval minutes-hours) | Lowest |
| Glacier Deep Archive | Rare access (retrieval hours) | Cheapest |

---

# COMMON INTERVIEW SCENARIOS — QUICK ANSWERS

| # | Question | Answer |
|---|----------|--------|
| 1 | Cloud vs On-Premises? | Cloud = rent, scale on demand, managed; On-Prem = own, fixed capacity, you manage |
| 2 | IaaS vs PaaS vs SaaS? | IaaS = infrastructure; PaaS = platform; SaaS = software ready to use |
| 3 | VM vs Container? | VM = full OS, GBs, minutes; Container = shared kernel, MBs, seconds |
| 4 | Type 1 vs Type 2 Hypervisor? | Type 1 = bare metal (fast); Type 2 = hosted on OS (slower) |
| 5 | Docker Image vs Container? | Image = blueprint (class); Container = running instance (object) |
| 6 | Dockerfile vs Container? | Dockerfile = recipe to build image; Container = runtime instance |
| 7 | CMD vs ENTRYPOINT? | CMD = default args (overridable); ENTRYPOINT = fixed command prefix |
| 8 | Pod vs Container? | Pod = wrapper around 1+ containers sharing network/storage |
| 9 | Kubernetes vs Docker? | Docker = run containers; K8s = orchestrate 100s of containers across machines |
| 10 | Deployment vs ReplicaSet? | Deployment manages ReplicaSet + rolling updates; ReplicaSet ensures Pod count |
| 11 | EC2 vs Lambda? | EC2 = always-on server; Lambda = event-driven, pay per invocation |
| 12 | S3 vs EBS vs EFS? | S3 = object (HTTP); EBS = block (1 EC2); EFS = file (many EC2s) |
| 13 | Object vs Block Storage? | Object = file+metadata+URL; Block = raw disk blocks mounted as drive |
| 14 | Why Kubernetes? | Auto-scale, self-heal, rolling updates, service discovery across cluster |
| 15 | Why Docker? | Consistent environment, portable, lightweight, easy CI/CD integration |
| 16 | What is Auto Scaling? | Monitor metrics → Add/remove instances based on demand → Save cost |
| 17 | HA vs Fault Tolerance? | HA = minimize downtime; FT = zero downtime (hot standby) |
| 18 | What is IAM? | Who can do what in AWS → Users, Roles, Policies |
| 19 | Why Load Balancer? | Distribute traffic, health checks, SSL termination, no single point of failure |
| 20 | Deploy backend to AWS? | Dockerize → ECR → ECS/Fargate or EC2 → ALB → Route 53 → CloudWatch |

---

# REVISION ORDER (Highest ROI)

1. IaaS vs PaaS vs SaaS (service models)
2. VM vs Container (hypervisor, namespaces, cgroups)
3. Docker Architecture (image, container, volume, registry)
4. Dockerfile instructions (FROM, RUN, COPY, CMD, ENTRYPOINT, EXPOSE)
5. Docker Commands (build, run, ps, exec, logs, stop)
6. Kubernetes Basics (Pod, Deployment, Service, ReplicaSet)
7. K8s Architecture (Control Plane, Worker Node, etcd)
8. AWS EC2 vs Lambda (compute models)
9. AWS S3 vs EBS vs EFS (storage types)
10. AWS RDS vs DynamoDB (database types)
11. AWS VPC + Security Groups (networking)
12. AWS IAM (users, roles, policies, least privilege)
13. Load Balancer (Layer 4 vs Layer 7)
14. Auto Scaling + CloudWatch (scaling flow)
15. High Availability + Fault Tolerance (concepts)
16. Cloud Security (encryption at rest/transit, secrets)
17. CI/CD Deployment (rolling, blue-green, canary)
18. Infrastructure as Code (Terraform basics)
19. Cost Optimization (on-demand, reserved, spot, S3 classes)
20. All comparison tables

---

# HANDS-ON PRACTICE PROJECT

**Deploy a Backend App to AWS:**
```
1. Dockerize App:
   Write Dockerfile → FROM node:18 → COPY . /app → RUN npm install → EXPOSE 3000 → CMD ["node", "app.js"]
   docker build -t myapp . → docker run -p 3000:3000 myapp → Test locally

2. Push to Registry:
   docker tag myapp username/myapp:v1 → docker push username/myapp:v1

3. Deploy on EC2:
   Launch EC2 (t3.micro) → SSH in → Install Docker → docker pull username/myapp:v1 → 
   → docker run -d -p 80:3000 myapp → Security Group allow port 80 → Access via public IP

4. Store Files in S3:
   Create bucket → Upload images → Set policy → Get URL → App stores/retrieves from S3

5. Add Load Balancer:
   Launch 2nd EC2 with same app → Create Target Group → Create ALB → 
   → Register both instances → DNS points to ALB → Traffic distributed

6. HTTPS with Nginx:
   Install Nginx → Reverse proxy to app → SSL certificate (Let's Encrypt) → 
   → Nginx handles HTTPS → Forwards HTTP to app internally

7. CI/CD with GitHub Actions:
   .github/workflows/deploy.yml → On push to main → Build image → Push to ECR → 
   → SSH to EC2 → Pull new image → Restart container

8. Monitor with CloudWatch:
   CloudWatch Agent → Collect CPU, memory, logs → Set alarms → Alert on high CPU
```

---

**REMEMBER:** Interviewers care about:
1. **Can you explain the cloud journey?** (User → DNS → CDN → LB → Compute → DB → Response)
2. **VM vs Container vs Serverless?** (When to use which, trade-offs)
3. **Docker flow?** (Dockerfile → Image → Registry → Container → Volume)
4. **Why Kubernetes?** (Orchestration, self-healing, scaling)
5. **AWS core services?** (EC2, S3, RDS, IAM, LB, Auto Scaling)
6. **Deployment strategies?** (Rolling vs Blue-Green vs Canary)
7. **Security basics?** (IAM least privilege, encryption, no hardcoded keys)

Tell the story of how a request flows through your cloud architecture.
