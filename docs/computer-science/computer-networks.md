
# 🌐 Computer Networks
## 1. NETWORKING FUNDAMENTALS

**What is a Computer Network?**
→ Two+ devices connected to share resources (files, internet, printers).

**Types:**

- **LAN** (Local): Home/Office WiFi — fast, private
- **WAN** (Wide): Internet — spans cities/countries
- **MAN** (Metropolitan): City-wide cable network
- **PAN** (Personal): Bluetooth earbuds ↔ phone

**Client-Server vs P2P:**

- Client-Server: You (client) → request → Google Server → response
- P2P: Torrent — your PC downloads from 50 other PCs simultaneously

**Bandwidth vs Throughput:**

- Bandwidth = pipe width (100 Mbps plan)
- Throughput = actual water flow (80 Mbps due to congestion)

**Latency vs Delay vs Jitter:**

- Latency = total round-trip time (ping)
- Delay = one-way time
- Jitter = latency variation (bad for video calls)

**Packet Loss:**

→ Data packets dropped due to congestion. TCP retransmits, UDP loses it.

---

## 2. OSI MODEL (7 Layers — Bottom to Top)

**Mnemonic: "Please Do Not Throw Sausage Pizza Away"**

| Layer | Name | What It Does | Protocols | Devices |
|-------|------|-------------|-----------|---------|
| 7 | Application | User interface | HTTP, FTP, DNS, SMTP | — |
| 6 | Presentation | Encryption, compression | SSL/TLS, JPEG, ASCII | — |
| 5 | Session | Session management | NetBIOS, RPC | — |
| 4 | Transport | End-to-end delivery | TCP, UDP | — |
| 3 | Network | Routing, IP addressing | IP, ICMP, OSPF | Router |
| 2 | Data Link | MAC addressing, framing | Ethernet, ARP | Switch |
| 1 | Physical | Bits on wire | USB, Ethernet cable | Hub, NIC |

**Data Encapsulation (Sending):**
Data → Segment (L4) → Packet (L3) → Frame (L2) → Bits (L1)

**Decapsulation (Receiving):**
Bits → Frame → Packet → Segment → Data

**Key Q&A:**

- TCP works on **Layer 4 (Transport)**
- Router operates on **Layer 3 (Network)**
- Switch operates on **Layer 2 (Data Link)**

---

## 3. TCP/IP MODEL

**4 Layers (merged from OSI):**

| TCP/IP Layer | OSI Equivalent | Protocols |
|-------------|----------------|-----------|
| Application (L4) | L5+L6+L7 | HTTP, DNS, FTP |
| Transport (L3) | L4 | TCP, UDP |
| Internet (L2) | L3 | IP, ICMP |
| Link (L1) | L1+L2 | Ethernet, ARP, WiFi |

**Why TCP/IP over OSI?**
→ TCP/IP was built first, works, and is simpler. OSI is theoretical; TCP/IP is practical.

---

## 4. IP ADDRESSING

**IPv4:** 32-bit, ~4.3 billion addresses (e.g., 192.168.1.1)

**IPv6:** 128-bit, unlimited (e.g., 2001:0db8::1)

**Public vs Private IP:**

- Public: Unique globally (your router's WAN IP)
- Private: Reusable locally (192.168.x.x, 10.x.x.x)

**Static vs Dynamic:**

- Static: Fixed (servers)
- Dynamic: Changes (your phone via DHCP)

**CIDR Notation:**
→ 192.168.1.0/24 = first 24 bits = network, last 8 = hosts (256 IPs)

**Subnet Mask:**
→ /24 = 255.255.255.0 (separates network from host portion)

**Network ID:** First IP in subnet (192.168.1.0)

**Broadcast Address:** Last IP (192.168.1.255)

**Loopback:** 127.0.0.1 (talks to yourself)

**Default Gateway:** Router's IP (exit door from LAN)

**NAT (Network Address Translation):**
→ Your 5 devices (private IPs) → Router → 1 public IP → Internet

**PAT (Port Address Translation):**
→ NAT + port numbers to track which device made which request

> **Why NAT?** IPv4 shortage. Many private devices share one public IP.

---

## 5. TCP (Transmission Control Protocol)

**Three-Way Handshake (Connection Setup):**
```
Client → SYN → Server
Client ← SYN-ACK ← Server
Client → ACK → Server
[Connection ESTABLISHED]
```

**Why 3-way?** Both sides must confirm they can send AND receive.

**Four-Way Termination:**
```
Client → FIN → Server
Client ← ACK ← Server
Client ← FIN ← Server
Client → ACK → Server
[Connection CLOSED]
```

>**Why 4-way?** Each side must close independently. Server may still have data to send.

>**Why TIME_WAIT (2MSL)?**
→ Ensures last ACK reaches server. Prevents old duplicate packets from confusing new connections.

>**What if ACK is lost?**
→ Server retransmits FIN. Client in TIME_WAIT resends ACK.

**Reliability Mechanisms:**

- **ACK:** "I got packet #5"
- **Sequence Numbers:** Track packet order
- **Flow Control (Sliding Window):** Receiver tells sender its buffer size
- **Congestion Control:** Slows down when network is congested
- **Retransmission:** Resend if ACK not received in timeout

**MSS (Max Segment Size):** Max data per TCP segment (~1460 bytes)

**MTU (Max Transmission Unit):** Max packet size on link (~1500 bytes)

---

## 6. UDP (User Datagram Protocol)

**Characteristics:**

- No handshake → faster
- No ACK → unreliable
- No ordering → packets may arrive jumbled
- No congestion control → keeps sending
- Supports broadcast/multicast

**Header:** 8 bytes only (vs TCP's 20+ bytes)

**Use Cases:**

- **DNS:** One request, one response — overhead not worth TCP
- **Video Streaming:** Lost frame? Skip it, don't wait
- **Gaming:** Speed > reliability
- **VoIP:** Real-time, can't wait for retransmission

**Why DNS uses UDP?**
→ Single query/response. UDP is faster. Falls back to TCP for large responses (>512 bytes).

---

## 7. DNS (Domain Name System)

**Full Resolution Flow:**
```
You type: google.com
    ↓
Browser Cache → OS Cache → Router Cache
    ↓ (miss)
Resolver (ISP DNS: 8.8.8.8)
    ↓
Root Server (.)
    ↓
TLD Server (.com)
    ↓
Authoritative Server (google.com)
    ↓
IP: 142.250.185.78
```

**Query Types:**

- **Recursive:** "Find me the IP, I don't care how" (resolver does all work)
- **Iterative:** "Here's who to ask next" (resolver asks step by step)

**DNS Records:**

| Record | Purpose |
|--------|---------|
| A | IPv4 address |
| AAAA | IPv6 address |
| CNAME | Alias (www → example.com) |
| MX | Mail server |
| NS | Name server |
| TXT | Verification/SPF |
| PTR | Reverse DNS (IP → name) |

**TTL:** Cache duration. Lower = faster updates, higher = less load.

---

## 8. HTTP / HTTPS

**HTTP Methods:**

- GET: Read
- POST: Create
- PUT: Update (full)
- PATCH: Update (partial)
- DELETE: Remove

**Status Codes:**

- 2xx: Success (200 OK, 201 Created)
- 3xx: Redirect (301 Moved, 302 Found)
- 4xx: Client Error (404 Not Found, 401 Unauthorized)
- 5xx: Server Error (500 Internal, 502 Bad Gateway, 503 Unavailable)

**Cookies vs Sessions:**

- Cookie: Data stored on client ("remember me")
- Session: Data stored on server, session ID in cookie

**Persistent Connections (HTTP/1.1):**
→ Keep TCP connection alive for multiple requests (vs HTTP/1.0: one request = one connection)

**HTTP/1.1 vs HTTP/2 vs HTTP/3:**

| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---------|----------|--------|--------|
| Multiplexing | No | Yes | Yes |
| Server Push | No | Yes | No |
| Compression | Headers | Headers (HPACK) | Headers (QPACK) |
| Transport | TCP | TCP | QUIC (UDP) |
| Head-of-line blocking | Yes | Yes (TCP-level) | No |

---

## 9. TLS / SSL (HTTPS Security)

**TLS Handshake:**
```
Client → ClientHello (supported cipher suites) → Server
Client ← ServerHello + Certificate ← Server
Client verifies certificate (CA signed? valid?)
Client → Pre-master secret (encrypted with server's public key) → Server
Both derive session key
Client → Finished (encrypted with session key) → Server
Client ← Finished ← Server
[Secure channel established]
```

**Key Concepts:**

- **Asymmetric Encryption:** Public key encrypts, private key decrypts (handshake)
- **Symmetric Encryption:** Same key both ways (session — faster for data)
- **Certificate:** Server's ID card signed by CA
- **CA (Certificate Authority):** Trusted third party (Let's Encrypt, DigiCert)

**How HTTPS works:**
→ DNS → TCP handshake → TLS handshake → HTTP over encrypted channel

---

## 10. ROUTING BASICS

**Router:** Forwards packets between networks using IP addresses

**Routing Table:** Map of "destination → next hop"

**Default Route:** 0.0.0.0/0 → "If you don't know, send to gateway"

**Static Routing:** Admin manually sets routes

**Dynamic Routing:** Routers talk to each other (OSPF, BGP — skip details)

**Longest Prefix Match:**
→ Packet for 10.1.2.3 matches 10.1.2.0/24 better than 10.0.0.0/8

---

## 11. ARP (Address Resolution Protocol)

**How a computer finds MAC address:**
```
PC wants to send to 192.168.1.5
    ↓
Checks ARP cache — miss
    ↓
Broadcasts: "Who has 192.168.1.5?"
    ↓
Target replies: "I do, my MAC is AA:BB:CC:DD:EE:FF"
    ↓
PC caches it, sends frame
```

**ARP Cache:** Stores IP→MAC mappings to avoid repeated broadcasts

---

## 12. MAC ADDRESS

**MAC:** 48-bit physical address burned into NIC (AA:BB:CC:DD:EE:FF)

**IP:** Logical address assigned by network admin/DHCP

**MAC vs IP:**

- MAC = flat, permanent, works within LAN
- IP = hierarchical, changeable, works across networks

**Why both?** IP routes across internet; MAC delivers within LAN.

---

## 13. ETHERNET

**Ethernet Frame:**
```
[Preamble][Dest MAC][Src MAC][Type][Data][FCS]
```

**MTU:** 1500 bytes max payload

**Broadcast Domain:** All devices that receive a broadcast (limited by router)

---

## 14. SWITCHING

**Switch learns MAC addresses:**
```
PC-A sends to PC-B
    ↓
Switch sees PC-A's MAC on Port 1 → records in MAC table
    ↓
Switch doesn't know PC-B's port → floods to all ports
    ↓
PC-B replies → Switch learns PC-B is on Port 2
    ↓
Next time: direct forwarding, no flooding
```

**MAC Table:** Port ↔ MAC mapping

**Flooding:** Send to all ports when destination unknown

---

## 15. ICMP

**Ping:** "Are you alive?" → Echo request/reply

**Traceroute:** Sends packets with increasing TTL to map route hops

**Error Reporting:** Destination unreachable, time exceeded

---

## 16. DHCP (Dynamic Host Configuration Protocol)

**DORA Process:**
```
Client → DHCP Discover (broadcast: "I need an IP!")
    ↓
Server → DHCP Offer ("Here's 192.168.1.100")
    ↓
Client → DHCP Request ("I'll take it!")
    ↓
Server → DHCP ACK ("It's yours for 24 hours")
```

---

## 17. NETWORK DEVICES

| Device | Layer | Function |
|--------|-------|----------|
| Hub | L1 | Repeats signal to all ports (dumb) |
| Switch | L2 | Forwards based on MAC (smart) |
| Router | L3 | Routes based on IP (smarter) |
| Bridge | L2 | Connects two LAN segments |
| Gateway | L4-L7 | Protocol translator (e.g., API gateway) |
| Firewall | L3-L7 | Filters traffic by rules |
| Proxy | L7 | Intermediary for requests |
| Load Balancer | L4/L7 | Distributes traffic across servers |

**Hub vs Switch:**

- Hub: Broadcasts to everyone (collision domain = all ports)
- Switch: Sends only to destination (collision domain = per port)

**Router vs Switch:**

- Router: Connects networks, uses IP
- Switch: Connects devices within network, uses MAC

---

## 18. FIREWALLS

**Stateless:** Checks each packet independently (ACL rules)

**Stateful:** Tracks connection state ("This ACK belongs to that SYN")

**Packet Filtering:** Allow/deny based on IP/port/protocol

---

## 19. LOAD BALANCING

**L4 (Transport):** Balances based on IP + port (TCP/UDP level)

**L7 (Application):** Balances based on URL, cookie, header (HTTP level)

**Algorithms:**

- Round Robin: A → B → C → A → B → C
- Least Connections: Send to least busy server
- Sticky Sessions: Same user → same server

**Reverse Proxy:**
→ Client → LB/Proxy → Backend servers (hides backend)

---

## 20. CDN (Content Delivery Network)

**How Netflix reduces latency:**
```
User in Mumbai requests movie
    ↓
DNS routes to nearest edge server (Mumbai POP)
    ↓
Cache hit? → Stream immediately
Cache miss? → Fetch from origin, cache for next user
```

**Edge Server:** Local cache server

**TTL:** How long content stays cached

**Static Content:** Images, CSS, JS (cache heavily)

**Dynamic Content:** Personalized API responses (cache lightly)

---

## PRIORITY 3 — MODERN BACKEND NETWORKING

### HTTP Versions Deep Dive

**HTTP/1.1:**

- Persistent connections
- Pipelining (flawed)
- Head-of-line blocking

**HTTP/2:**

- Binary framing (not text)
- Multiplexing: multiple streams on one TCP connection
- Server push
- Header compression (HPACK)

**HTTP/3:**

- QUIC over UDP (not TCP)
- 0-RTT connection setup
- No head-of-line blocking
- Built-in encryption

### WebSockets

**Upgrade from HTTP:**
```
Client: GET /chat HTTP/1.1
        Upgrade: websocket
        Connection: Upgrade
Server: 101 Switching Protocols
[Now full-duplex persistent connection]
```

**Use:** Real-time chat, live updates, gaming

### gRPC

- **HTTP/2** transport
- **Protocol Buffers** serialization (binary, compact)
- **Unary:** Request → Response
- **Streaming:** Client streaming, server streaming, bidirectional

**REST vs gRPC:**

| REST | gRPC |
|------|------|
| HTTP/1.1 or HTTP/2 | HTTP/2 only |
| JSON/XML | Protobuf (binary) |
| Text-readable | Not human-readable |
| Loose contract | Strict .proto contract |
| Universal support | Needs client library |

### Reverse Proxy vs Forward Proxy

**Forward Proxy:**
→ You → Proxy → Internet (hides client, e.g., corporate proxy)

**Reverse Proxy:**
→ Internet → Proxy → Server (hides server, e.g., Nginx, Cloudflare)

### API Gateway

**Purpose:**

- Single entry point for microservices
- Authentication, rate limiting, routing, SSL termination
- Example: AWS API Gateway, Kong

### Service Discovery

**Problem:** Microservices need to find each other's IPs

**Solution:**
- Client-side: Service queries registry (Eureka, Consul)
- Server-side: Load balancer knows all backends

### Keep Alive

**Purpose:** Reuse TCP connection for multiple HTTP requests
→ Avoid connection setup overhead

### Connection Pooling

**Why?**

→ Opening TCP + TLS for every DB query = slow
→ Pool maintains open connections, app borrows/returns
→ Same for HTTP clients (e.g., axios keep-alive)

---

## PRIORITY 4 — PRODUCTION NETWORKING

| Concept | What It Means |
|---------|--------------|
| Latency | Time for packet to travel |
| Throughput | Data transferred per second |
| Bandwidth | Max capacity of link |
| Bottleneck | Slowest point in path |
| Network Timeout | Gave up waiting for response |
| Retries | Try again on failure |
| Exponential Backoff | Wait 1s → 2s → 4s → 8s between retries |
| Circuit Breaker | Stop calling failing service temporarily |
| Idempotency | Same request = same result (safe to retry) |

---

## TROUBLESHOOTING COMMANDS

| Command | What It Does |
|---------|-------------|
| `ping` | Check if host is reachable |
| `traceroute` / `tracert` | Show route hops |
| `nslookup` | Query DNS |
| `dig` | Detailed DNS query |
| `netstat` | Show connections (legacy) |
| `ss` | Show sockets (modern) |
| `ip` / `ifconfig` | Network interface config |
| `tcpdump` | Capture packets |
| `curl` | Test HTTP requests |
| `wget` | Download files |

---

## 🔄 THE COMPLETE WORKFLOW: "What happens when you type google.com?"

```
1. BROWSER CACHE CHECK
   "Have I been here before?"

2. DNS RESOLUTION
   Browser → OS → Router → ISP Resolver → Root → TLD → Authoritative
   google.com → 142.250.185.78

3. TCP THREE-WAY HANDSHAKE
   Client SYN → Server
   Server SYN-ACK → Client
   Client ACK → Server

4. TLS HANDSHAKE (HTTPS)
   ClientHello → ServerHello + Certificate → Key Exchange → Session Key

5. HTTP REQUEST
   GET / HTTP/1.1
   Host: google.com

6. SERVER PROCESSING
   Load Balancer → Reverse Proxy → App Server → Database

7. HTTP RESPONSE
   200 OK + HTML

8. RENDERING
   Browser parses HTML → fetches CSS/JS/images → renders page

   For images/JS: CDN edge server serves cached static content
```

---

## 🔥 QUICK ANSWER CHEAT SHEET

| Question | Answer |
|----------|--------|
| Why TCP reliable? | ACKs, sequence numbers, retransmission, flow control |
| Why 3-way handshake? | Both sides confirm send+receive capability |
| Why 4-way close? | Independent close for each direction |
| Why TIME_WAIT? | Ensure last ACK arrives, prevent old packets |
| Why UDP faster? | No handshake, no ACK, no congestion control |
| Why DNS uses UDP? | Single query/response, speed matters |
| Router vs Switch? | Router = IP, inter-network; Switch = MAC, intra-network |
| Hub vs Switch? | Hub broadcasts; Switch forwards selectively |
| MAC vs IP? | MAC = physical/LAN; IP = logical/WAN |
| Why NAT? | IPv4 shortage; many private → one public |
| HTTP vs HTTPS? | HTTPS = HTTP + TLS encryption |
| Why sequence numbers? | Reorder packets, detect duplicates |
| What causes latency? | Distance, congestion, processing, queuing |
| Load balancer? | Distributes traffic across servers |
| Reverse proxy? | Hides backend, routes requests |
| CDN? | Caches content at edge servers near users |
| Cookies vs Sessions? | Cookie = client-side; Session = server-side |
| HTTP/1.1 vs HTTP/2? | HTTP/2 = multiplexing, binary, server push |
| HTTP/2 vs HTTP/3? | HTTP/3 = QUIC/UDP, no head-of-line blocking |

---

## ❌ SKIP THESE (Unless Networking Role)

BGP, OSPF, RIP, MPLS, VLAN config, STP, QoS internals, SDN, VXLAN, GRE tunnels, IPsec details, Deep packet inspection, Cisco CLI

---

> **Revision Order:** TCP/IP → OSI → TCP → UDP → IP/Subnet → DNS → HTTP/HTTPS → TLS → ARP → DHCP → Routing → Devices → LB → Proxy → CDN → HTTP/2/3/WebSockets/gRPC → Commands → Production Concepts
