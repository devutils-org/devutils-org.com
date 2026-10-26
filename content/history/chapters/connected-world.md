---
id: history.connected-world
type: history
history_kind: chapter
locale: en
slug: connected-world
category: connected-world
title: Connected world — signals, packets, internets and the Web
summary: Follow telegraph systems, parallel packet-network research, ARPANET, TCP/IP and the Web, then examine why distributed applications must handle delay and uncertainty.
status: published
updated: 2026-10-26
prerequisites: [history.information-revolution, history.software-revolution]
related: [history.electronic-computing]
sources:
  - title: The Transcontinental Telegraph — U.S. National Park Service
    url: https://home.nps.gov/articles/000/the-transcontinental-telegraph.htm
  - title: Paul Baran, On Distributed Communications I (1964) — RAND
    url: https://www.rand.org/pubs/research_memoranda/RM3420.html
  - title: NPL history timeline — Donald Davies and packet switching
    url: https://www.npl.co.uk/about-us/history/timeline
  - title: A Brief History of the Internet (1997), by participants — Internet Society
    url: https://www.internetsociety.org/internet/history-internet/brief-history-internet/
  - title: The birth of the Web — CERN
    url: https://home.cern/science/computing/the-birth-of-the-web
  - title: Leslie Lamport, Time, Clocks and the Ordering of Events in a Distributed System — publication and author commentary
    url: https://www.microsoft.com/en-us/research/publication/time-clocks-ordering-events-distributed-system/
---
## A connection requires more than a wire

A sender and receiver need a physical path and shared conventions for interpreting what crosses it. A network adds choices about addressing, sharing links, forwarding messages and responding to failure. The Internet and the Web depend on these layers but do not name the same thing.

Historical networks also depend on operators, maintenance, investment and institutions. A successful demonstration is not equivalent to universal access. This chapter follows selected developments rather than claiming that every network descends through one uninterrupted chain of inventors.

## Telegraph systems separate movement from message delivery

Telegraphy allowed a message to travel by signaling rather than being carried the entire distance as a physical letter. The National Park Service account describes semaphore predecessors, multiple contributors to electrical telegraphy and the Washington–Baltimore line used by Morse and Vail in May 1844. It also distinguishes American and International Morse conventions.

Those distinctions matter. A familiar modern code should not be projected unchanged onto every nineteenth-century artifact. Nor should one well-documented American demonstration be called the invention of all electrical communication. Building a network required lines, rights of way, operators, common codes and business arrangements as well as an instrument.

An original four-message code illustrates agreement: left = 00, right = 01, stop = 10 and repeat = 11. Transmitting 10 is useful only if both parties share the code and know where a message begins and ends. This is an invented binary example, not a Morse alphabet or a historical telegraph specification.

## Packet switching shares the transport

Instead of reserving one end-to-end path for a whole exchange, a packet network can forward bounded pieces of data through shared equipment. Pieces may wait in queues, and an endpoint may need to restore order or recover losses. A packet's existence alone does not guarantee delivery, authentication or an available route.

Baran's 1964 RAND memorandum studies distributed communication, standardized message blocks and adaptive store-and-forward routing in a survivability setting. NPL's history identifies Davies and his team's packet-switching work in 1965. The Internet Society's participant account describes parallel research and later exchanges among groups. A single-origin story would miss both independent work and the subsequent combination of ideas.

Here is an original serialization model. A link carries 1000 bytes per millisecond, and each packet has 100 bytes of payload plus 20 bytes of overhead. One packet occupies the link for 120 / 1000 = 0.12 ms. Two users each sending two packets can occupy four consecutive slots in order A1, B1, A2, B2. The four transmissions require 0.48 ms on that link, excluding propagation, queueing and processing.

A long application message does not become four times faster merely because it is split into packets. Sharing improves how the link can be used by different senders; overhead consumes capacity too. This toy link does not model the historical ARPANET's packet format or speed.

## ARPANET and TCP/IP solve related but different problems

The Internet Society account records four host computers connected to the initial ARPANET by the end of 1969 and describes the roles of research sites, ARPA and BBN's interface message processors. It also explains an open-network approach to interconnecting networks. One packet network and an internet joining different networks are distinct architectural steps.

TCP/IP separates responsibilities across layers. IP provides an internetwork packet service; TCP adds an ordered reliable byte-stream abstraction under its operating assumptions. Applications still need to define their messages and what a completed exchange means. Other transport protocols and applications can use IP without TCP.

The same history describes the ARPANET's planned transition from NCP to TCP/IP on 1 January 1983. This was a coordinated conversion in an existing community, not a date on which every modern networking practice appeared at once. Standards, implementations, operations and adoption moved together over time.

The participant account is not a neutral inventory of every network worldwide. Its authors' direct involvement makes it valuable, while its coverage and retrospective judgments remain scoped.

## The Web uses the network rather than replacing it

CERN dates Berners-Lee's Web work to 1989 and describes the information-sharing need among researchers. It distinguishes that work from the browser written in 1990 and the release of Web software into the public domain on 30 April 1993. A proposal, implementation and distribution decision are different milestones.

The Web links resources that clients can request from servers. The Internet supplies underlying communication; a hyperlink is not an IP route. Email and other networked services need not be Web pages. Likewise, an HTML document can exist as a local file without a live Internet connection.

In an original example, a page contains a link to a second resource. Clicking it starts a new retrieval according to the browser's rules. If the link is well formed but the destination server is unavailable, the page can still display correctly while retrieval fails. Correct document structure, name resolution, transport and application availability answer separate questions.

## Distributed work adds partial failure

Lamport's 1978 paper and later author commentary connect event ordering with distributed state machines. When separate processes exchange messages, one process's observations do not automatically give it a complete instantaneous view of all others.

Consider an original counter service. A client sends “increment by one.” The server changes 0 to 1, but its reply is lost. The client's timeout cannot distinguish that outcome from a request that never arrived. Blindly retrying the operation can change the count to 2 even though the client intended only one increment.

A request identifier and a server-side record of completed requests can suppress repeats. If identifier R7 is applied twice and the service atomically records its first result with the state change, the toy counter remains 1. But if the record is lost on a crash, or recording and updating are not atomic, the guarantee no longer follows. This is a teaching example of a deduplication requirement, not a universal exactly-once delivery protocol.

Ordering has a similarly explicit contract. Suppose process A performs event a1, then sends message m; process B receives m and then performs b1. The send must precede the receive, and local order creates a causal chain. Two unrelated events at separate processes may have no such causal relation. Clock readings alone should not be assumed to settle every meaningful order without a stated synchronization model.

## Reading checks and answers

1. In the invented four-message code, what does 10 mean? Stop. It says nothing about any historical Morse symbol.
2. What fraction of the toy packet is payload? 100 / 120 = 5/6, about 83.33 percent. Headers consume the rest in this model.
3. If B2 arrives before B1, can an application assume their arrival order is the sender's order? No. The relevant layer must supply or reconstruct the required ordering.
4. Does a received TCP byte stream alone prove an application committed a transaction? No. Application acknowledgement and durable effects have their own contract.
5. Why can a retried increment execute twice? The first request may have succeeded even when its response was lost. Deduplication requires stable identities and correctly coordinated state.

The final History chapter considers mobile systems, shared software ecosystems, accelerators, AI and the physical limits that shape modern computing.
