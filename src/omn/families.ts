// The nine families and the story each one tells. Source names and summaries
// from omniscient's catalog/*.yaml; the stories, commands and outputs from its
// docs/families/*.md and examples/. Nothing here is paraphrased into a claim
// the repository does not make.

export interface Family {
  glyph: string
  id: string
  name: string
  sources: number
  // the card's line
  text: string
  // the story: its title, paragraphs (HTML), the sources it names, a real run and its limit
  title: string
  story: string[]
  highlights: [string, string][]
  example: string
  limit: string
  // the same story in French: what each highlighted source does, in its order
  fr: { name: string; text: string; title: string; story: string[]; highlights: string[]; limit: string }
}

export const families: Family[] = [
  {
    glyph: '⌘', id: 'cpu', name: 'CPU', sources: 15,
    text: 'Go from a busy core to the call stacks, instructions and counter evidence behind it.',
    title: 'Busy is not the same as productive.',
    story: [
      'Cycles, instructions, branch and cache misses, top-down slots and an on-CPU profile with call stacks — beside the time the machine spent by state, its pressure and a cgroup’s throttling.',
      'The counters of one source are opened as a group, so the kernel schedules them together: <code>cpu.ipc</code> is a ratio of one window, not two. Counts are inherited, so a program that works in a thread pool is counted rather than reported as idle.',
    ],
    highlights: [
      ['cpu.ipc', 'Instructions per cycle (derived)'],
      ['cpu.topdown', 'Front-end / back-end / bad-spec / retiring'],
      ['cpu.profile', 'On-CPU profile with call stacks'],
      ['cpu.throttle', 'CFS cgroup throttling'],
    ],
    example: `$ omn cpu.ipc -m count -e summary -- ./prog
work per cycle  via pmu  (cpu.ipc)
  1 events over 814.76ms, stopped because the launched program exited with exit status 0
  no loss: every read succeeded and no tick ran late`,
    limit: 'When more counters are open than the hardware has, the kernel time-shares them. The scaled value is an extrapolation, so the raw count travels beside it and the run says so.',
    fr: {
      name: 'Processeur',
      text: 'Partir d’un cœur occupé pour remonter aux piles d’appels, aux instructions et aux compteurs qui l’expliquent.',
      title: 'Occupé ne veut pas dire productif.',
      story: [
        'Cycles, instructions, erreurs de prédiction et défauts de cache, analyse top-down et profil sur le processeur avec les piles d’appels — à côté du temps passé par la machine dans chaque état, de sa pression et du bridage d’un cgroup.',
        'Les compteurs d’une même source sont ouverts en groupe, pour que le noyau les planifie ensemble : <code>cpu.ipc</code> est le rapport d’une seule fenêtre de temps, pas de deux. Les comptes sont hérités : un programme qui travaille avec un pool de threads est compté, au lieu d’être déclaré inactif.',
      ],
      highlights: ['Instructions par cycle (dérivé)', 'Front-end / back-end / mauvaise spéculation / retrait', 'Profil sur le processeur avec piles d’appels', 'Bridage CFS d’un cgroup'],
      limit: 'Quand plus de compteurs sont ouverts que le matériel n’en possède, le noyau les fait tourner à tour de rôle. La valeur mise à l’échelle est une extrapolation : le compte brut l’accompagne, et l’exécution le signale.',
    },
  },
  {
    glyph: '▥', id: 'mem', name: 'Memory', sources: 26,
    text: 'Separate resident pages, allocator activity, shared memory and the working set.',
    title: 'Which memory is really yours?',
    story: [
      'Three footprints, one file read three ways: <code>mem.rss</code> counts shared pages in full, <code>mem.pss</code> divides them by their mappers, <code>mem.uss</code> keeps only what dies with the process — and every event says which lines of <code>smaps_rollup</code> it added up.',
      'Around them: page faults, kernel and userspace allocations by call site, memory the allocator retains, caches and TLB, false sharing, reclaim, compaction, swap and pressure.',
    ],
    highlights: [
      ['mem.uss', 'Private footprint (what dies with the process)'],
      ['mem.heap.alloc', 'Userspace allocations by call site'],
      ['mem.heap.retained', 'Retained by the allocator but no longer live'],
      ['mem.wss', 'Real working set (pages actually touched)'],
    ],
    example: `$ omn -f examples/mem-footprints.yml`,
    limit: 'A working set cannot be measured without perturbing the thing measured. The cost is part of the result.',
    fr: {
      name: 'Mémoire',
      text: 'Distinguer les pages résidentes, l’activité de l’allocateur, la mémoire partagée et l’ensemble de travail.',
      title: 'Quelle mémoire est vraiment la vôtre ?',
      story: [
        'Trois empreintes, un seul fichier lu de trois façons : <code>mem.rss</code> compte entièrement les pages partagées, <code>mem.pss</code> les divise entre ceux qui les utilisent, <code>mem.uss</code> ne garde que ce qui disparaît avec le processus — et chaque événement dit quelles lignes de <code>smaps_rollup</code> il a additionnées.',
        'Autour d’elles : défauts de page, allocations du noyau et de l’espace utilisateur par point d’appel, mémoire retenue par l’allocateur, caches et TLB, faux partage, récupération, compactage, swap et pression.',
      ],
      highlights: ['Empreinte privée (ce qui disparaît avec le processus)', 'Allocations de l’espace utilisateur par point d’appel', 'Retenu par l’allocateur mais plus utilisé', 'Ensemble de travail réel (pages vraiment touchées)'],
      limit: 'On ne peut pas mesurer un ensemble de travail sans perturber ce qu’on mesure. Ce coût fait partie du résultat.',
    },
  },
  {
    glyph: '⇄', id: 'sched', name: 'Scheduler', sources: 14,
    text: 'Distinguish runnable time, blocked time, wakeups and lock contention.',
    title: 'The time a program spends not running.',
    story: [
      'A thread blocked on a lock, on a disk or on another thread costs nothing in a CPU profile and everything in latency. That is why this family is the one most often missing from an investigation that went nowhere.',
      'Off-CPU time with the blocking stack, run-queue wait, who wakes whom, kernel locks, futexes and pthread mutexes with their wait and their hold.',
    ],
    highlights: [
      ['sched.offcpu', 'Blocked time with the blocking stack'],
      ['sched.runqlat', 'Run queue wait: wakeup → on-CPU'],
      ['sched.wakeup', 'Wakeup chain: who unblocks whom'],
      ['sched.mutex', 'pthread mutex contention'],
    ],
    example: `$ omn -f examples/sched-blocking-stack.yml`,
    limit: '<code>sched.irq</code> measures the hard half of interrupts only, and <code>sched.numa_balance</code> cannot fire on a machine with a single NUMA node.',
    fr: {
      name: 'Ordonnanceur',
      text: 'Distinguer le temps en attente de son tour, le temps bloqué, les réveils et la contention sur les verrous.',
      title: 'Le temps qu’un programme passe à ne pas tourner.',
      story: [
        'Un thread bloqué sur un verrou, sur un disque ou sur un autre thread ne coûte rien dans un profil du processeur et tout dans la latence. C’est pourquoi cette famille est celle qui manque le plus souvent aux enquêtes qui n’aboutissent pas.',
        'Le temps hors du processeur avec la pile qui bloque, l’attente dans la file d’exécution, qui réveille qui, les verrous du noyau, les futex et les mutex pthread avec leur attente et leur durée de détention.',
      ],
      highlights: ['Temps bloqué avec la pile qui bloque', 'Attente dans la file : réveil → sur le processeur', 'Chaîne de réveils : qui débloque qui', 'Contention sur les mutex pthread'],
      limit: '<code>sched.irq</code> ne mesure que la partie matérielle des interruptions, et <code>sched.numa_balance</code> ne peut pas se déclencher sur une machine à un seul nœud NUMA.',
    },
  },
  {
    glyph: '▱', id: 'io', name: 'Storage & I/O', sources: 16,
    text: 'Separate syscall time, filesystem activity, queueing, device latency and durability.',
    title: 'Slow at the syscall, fast at the disk.',
    story: [
      'Three layers that are never reported as one another: what the application asked for, what the filesystem did with it, and what the device actually performed.',
      'A read that takes 40 ms at the syscall and 2 ms at the device was not slow because of the disk — the gap between the layers is the diagnosis, not an error to smooth over.',
    ],
    highlights: [
      ['io.syscall', 'I/O latency as the application sees it'],
      ['io.fs', 'VFS and filesystem latency'],
      ['io.latency', 'Block request latency, submit → completion'],
      ['io.fsync', 'Synchronization latency'],
    ],
    example: `$ omn io.bytes --system -m poll@300ms -e timeline,summary -d 2s --backend force:fs:proc
io.bytes  via fs:proc  (io.bytes)
  8 events over 2.10s, stopped because the requested duration elapsed
  no loss: every read succeeded and no tick ran late
  degraded: fs:proc: system-wide, per device`,
    limit: 'A backend that sees less says so: <code>degraded</code> states that <code>fs:proc</code> answers system-wide, per device.',
    fr: {
      name: 'Stockage & E/S',
      text: 'Distinguer le temps des appels système, l’activité du système de fichiers, l’attente en file, la latence du disque et la durabilité.',
      title: 'Lent à l’appel système, rapide au disque.',
      story: [
        'Trois couches qui ne sont jamais présentées l’une pour l’autre : ce que l’application a demandé, ce que le système de fichiers en a fait, et ce que le disque a réellement accompli.',
        'Une lecture qui prend 40 ms à l’appel système et 2 ms au disque n’était pas lente à cause du disque — l’écart entre les couches est le diagnostic, pas une erreur à lisser.',
      ],
      highlights: ['Latence des E/S vue par l’application', 'Latence du VFS et du système de fichiers', 'Latence des requêtes bloc, envoi → fin', 'Latence de synchronisation'],
      limit: 'Une source qui voit moins le dit : <code>degraded</code> indique que <code>fs:proc</code> répond pour tout le système, par périphérique.',
    },
  },
  {
    glyph: '↙', id: 'net', name: 'Network', sources: 20,
    text: 'Inspect connection setup, socket waits, traffic, retransmissions and declared request boundaries.',
    title: 'From the handshake to the drop reason.',
    story: [
      'Connection setup and lifetime, socket read and write latency, transmit queueing, retransmissions and dropped packets with the kernel’s reason — and one request’s life across all of it.',
      'Each collector is checked against a scenario it caused: 50 ms injected by <code>netem</code> recovered as 50.0018 ms, 512 datagrams to a closed port matched against <code>Udp: NoPorts</code>.',
    ],
    highlights: [
      ['net.tcp.connect', 'TCP connection setup latency'],
      ['net.socket', 'Socket read and write latency'],
      ['net.qdisc', 'Transmit scheduling latency'],
      ['net.drops', 'Dropped packets with drop reason'],
    ],
    example: `$ omn -f examples/net-queue-delay.yml`,
    limit: 'Raw capture needs <code>CAP_NET_RAW</code>. Without a ground truth to check it against, no collector was written for it.',
    fr: {
      name: 'Réseau',
      text: 'Examiner l’ouverture des connexions, les attentes des sockets, le trafic, les retransmissions et les limites de requêtes déclarées.',
      title: 'De la poignée de main à la raison de la perte.',
      story: [
        'L’ouverture et la durée des connexions, la latence de lecture et d’écriture des sockets, l’attente avant émission, les retransmissions et les paquets perdus avec la raison donnée par le noyau — et la vie d’une requête à travers tout cela.',
        'Chaque collecteur est vérifié sur un scénario qu’il a lui-même provoqué : 50 ms injectées par <code>netem</code> retrouvées à 50,0018 ms, 512 datagrammes vers un port fermé comparés à <code>Udp: NoPorts</code>.',
      ],
      highlights: ['Latence d’ouverture des connexions TCP', 'Latence de lecture et d’écriture des sockets', 'Latence de planification à l’émission', 'Paquets perdus avec la raison'],
      limit: 'La capture brute demande <code>CAP_NET_RAW</code>. Sans vérité de terrain pour la contrôler, aucun collecteur n’a été écrit pour elle.',
    },
  },
  {
    glyph: '◇', id: 'gpu', name: 'GPU', sources: 13,
    text: 'Read device gauges and inspect program activity with the backend your hardware exposes.',
    title: 'The asymmetry is the design.',
    story: [
      'AMD and Intel expose a DRM scheduler, kernel PMUs and hwmon: their GPU numbers come from the kernel like every other family’s. NVIDIA’s proprietary driver exposes none of that, so it is read through NVML and CUPTI.',
      'What each path costs is measured and stated: compute kernels through CUPTI add 67 % to the run’s time against the control.',
    ],
    highlights: [
      ['gpu.job', 'DRM job latency, submit → fence'],
      ['gpu.engine_busy', 'Per-engine occupancy'],
      ['gpu.kernel', 'GPU time per compute kernel'],
      ['gpu.api', 'Host-side submission latency (CUDA / Vulkan)'],
    ],
    example: `$ omn gpu.job --system -m trace -e hist -d 1s
error: \`gpu.job\` has no viable backend on this machine:
  bpf:tp: tracepoint:gpu_scheduler:drm_run_job: missing: tracefs is mounted but
  not readable by uid 1000, ...
  hint: the request is valid; it is this machine that cannot serve it.`,
    limit: 'A valid request on a machine that cannot serve it is refused with the reason — never answered with a different number.',
    fr: {
      name: 'Carte graphique',
      text: 'Lire les jauges de la carte et examiner l’activité des programmes avec ce que votre matériel expose.',
      title: 'L’asymétrie est voulue.',
      story: [
        'AMD et Intel exposent un ordonnanceur DRM, des PMU du noyau et hwmon : leurs chiffres viennent du noyau, comme ceux de toutes les autres familles. Le pilote propriétaire de NVIDIA n’expose rien de tout cela ; il est donc lu à travers NVML et CUPTI.',
        'Le coût de chaque chemin est mesuré et indiqué : les noyaux de calcul suivis par CUPTI ajoutent 67 % au temps d’exécution par rapport au témoin.',
      ],
      highlights: ['Latence des tâches DRM, envoi → barrière', 'Occupation par moteur', 'Temps de carte par noyau de calcul', 'Latence d’envoi côté processeur (CUDA / Vulkan)'],
      limit: 'Une demande valide sur une machine qui ne peut pas y répondre est refusée avec sa raison — jamais remplacée par un autre chiffre.',
    },
  },
  {
    glyph: '⑂', id: 'proc', name: 'Processes', sources: 8,
    text: 'Inspect syscalls, execs, descriptors, threads and signals around a workload.',
    title: 'Counts that can be checked exactly.',
    story: [
      'Descriptors and threads, execs and exits, signals and every syscall with its latency. These are the only counts in the catalog that can be checked exactly, and they are: a thousand <code>getppid</code> calls, counted to the call.',
      'Send <code>SIGUSR1</code> five times to a process that has not handled the first: five signals generated, one queued, four already pending — and each event says which.',
    ],
    highlights: [
      ['proc.syscall', 'Per-syscall latency and count'],
      ['proc.exec', 'Process execution events'],
      ['proc.exit', 'Process exit events with exit code'],
      ['proc.fd', 'Open file descriptors against the limit'],
    ],
    example: `$ omn -f examples/proc-syscall.yml`,
    limit: 'A count without its limit is not a measurement: open descriptors are reported against the process’s limit.',
    fr: {
      name: 'Processus',
      text: 'Examiner les appels système, les lancements de programmes, les descripteurs, les threads et les signaux autour d’un programme.',
      title: 'Des comptes vérifiables à l’unité près.',
      story: [
        'Descripteurs et threads, lancements et fins de programmes, signaux et chaque appel système avec sa latence. Ce sont les seuls comptes du catalogue qu’on peut vérifier exactement, et ils le sont : mille appels <code>getppid</code>, comptés à l’appel près.',
        'Envoyez <code>SIGUSR1</code> cinq fois à un processus qui n’a pas encore traité le premier : cinq signaux émis, un mis en file, quatre déjà en attente — et chaque événement dit lequel.',
      ],
      highlights: ['Latence et nombre de chaque appel système', 'Lancements de programmes', 'Fins de processus avec leur code de sortie', 'Descripteurs ouverts face à la limite'],
      limit: 'Un compte sans sa limite n’est pas une mesure : les descripteurs ouverts sont rapportés face à la limite du processus.',
    },
  },
  {
    glyph: 'ϟ', id: 'power', name: 'Power', sources: 7,
    text: 'Measure package energy, frequency, idle residency, temperatures and throttling.',
    title: 'The confounder behind every number.',
    story: [
      'A processor that throttled, or ran at a lower frequency under one instruction mix than another, moves a CPU, a memory and a GPU measurement at once — for a reason that appears in none of them.',
      'A run that throttled is not a slower run. It is a different run.',
    ],
    highlights: [
      ['power.energy', 'Energy per RAPL domain (pkg / cores / dram / gpu)'],
      ['power.freq', 'Effective CPU frequency'],
      ['power.cstate', 'Idle state residency'],
      ['power.throttle', 'Thermal and power-limit throttling'],
    ],
    example: `$ omn power.temp --system -m poll@300ms -e timeline -d 1s
  timeline
    system
      +0ns        59 celsius
      +305ms      56 celsius
      ...
  unverified requirement: hwmon`,
    limit: 'What could not be verified is printed with the result: here, the hwmon requirement.',
    fr: {
      name: 'Énergie',
      text: 'Mesurer l’énergie du processeur, sa fréquence, ses temps de repos, les températures et le bridage.',
      title: 'Le facteur caché derrière chaque chiffre.',
      story: [
        'Un processeur qui a été bridé, ou qui a tourné moins vite avec un mélange d’instructions qu’avec un autre, fait bouger d’un coup une mesure du processeur, de la mémoire et de la carte graphique — pour une raison qui n’apparaît dans aucune d’elles.',
        'Une exécution bridée n’est pas une exécution plus lente. C’est une autre exécution.',
      ],
      highlights: ['Énergie par domaine RAPL (pkg / cores / dram / gpu)', 'Fréquence effective du processeur', 'Temps passé dans chaque état de repos', 'Bridage thermique et par limite de puissance'],
      limit: 'Ce qui n’a pas pu être vérifié est affiché avec le résultat : ici, l’exigence hwmon.',
    },
  },
  {
    glyph: '{ }', id: 'runtime', name: 'Runtimes', sources: 4,
    text: 'Read GC, JIT and custom runtime probes alongside system measurements.',
    title: 'Inside the runtime, at a stated price.',
    story: [
      'Garbage-collection pauses, JIT events, runtime-level allocations and your own USDT markers, read beside the system measurements.',
      'USDT is not the cheap path: a probe site is a <code>nop</code>, and attaching turns it into a breakpoint. Streamed to userspace, a hit costs about 700 ns, against 2 ns for the loop without a probe.',
    ],
    highlights: [
      ['runtime.gc', 'Garbage collection pauses'],
      ['runtime.jit', 'JIT compilation and deoptimization events'],
      ['runtime.alloc', 'Runtime-level allocation activity'],
      ['runtime.custom', 'User-declared probe on a symbol or USDT marker'],
    ],
    example: `$ omn list runtime
runtime.gc      trace         low    low     yes   all
runtime.jit     trace         free   low     yes   1 of 2
runtime.alloc   trace, poll   med    high    yes   all
runtime.custom  trace, count  med    low     yes   1 of 2`,
    limit: 'A probe on an arbitrary symbol is not built yet: it needs a symbol declaration and <code>CAP_SYS_ADMIN</code>.',
    fr: {
      name: 'Environnements d’exécution',
      text: 'Lire le ramasse-miettes, le JIT et vos propres sondes à côté des mesures du système.',
      title: 'À l’intérieur du runtime, à un prix annoncé.',
      story: [
        'Les pauses du ramasse-miettes, les événements du JIT, les allocations du runtime et vos propres marqueurs USDT, lus à côté des mesures du système.',
        'USDT n’est pas le chemin bon marché : un point de sonde est un <code>nop</code>, et s’y attacher le transforme en point d’arrêt. Envoyé à l’espace utilisateur, chaque passage coûte environ 700 ns, contre 2 ns pour la boucle sans sonde.',
      ],
      highlights: ['Pauses du ramasse-miettes', 'Compilation JIT et désoptimisation', 'Activité d’allocation du runtime', 'Sonde déclarée sur un symbole ou un marqueur USDT'],
      limit: 'Une sonde sur un symbole quelconque n’existe pas encore : elle demande la déclaration du symbole et <code>CAP_SYS_ADMIN</code>.',
    },
  },
]
