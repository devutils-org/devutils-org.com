// Editorial evidence, not customer testimonials. Paths are relative to sibling
// repositories; keep observed results distinct from illustrative use cases.

import { chainResults } from '../toolpage/chain-results.ts'
import runs from '../toolpage/chain-runs.json' with { type: 'json' }

export interface Case {
  // the tab's label
  target: string
  kind: string
  title: string
  problem: string
  finding: string
  outcome: string
  // what the story does not show
  limit: string
  evidence: string
  // [href, label]
  link?: [string, string]
  // the same story in French; the target keeps its name unless it says otherwise
  fr: Omit<Case, 'fr' | 'target'> & { target?: string }
}

const chain = chainResults(runs, {})
const chainFr = chainResults(runs, { lang: 'fr' })

export const cases: Record<string, Case[]> = {
  distroproof: [
    {
      target: 'Omniscient', kind: 'Portability campaign',
      title: 'It worked on Arch. The release failed elsewhere.',
      problem: 'A kernel observability tool had been developed on one machine. Its release would not even start on a third of the distro images.',
      finding: 'Running the installed archives on 17 images and 5 variants, 3 arm64 images and 8 rootless containers exposed 27 defects: 13 in the tool and 14 in its tests. The environment reports explained loader failures, Debian’s perf policy, a 64 KiB memlock limit and Alpine’s missing function tracer.',
      outcome: 'The release gained glibc 2.17 and musl builds. Across the rerun, none of the 158 initially misadvertised source runs still refused at start; refusal reasons agreed with envprobe on all 21 targets. The latest run passed 25 of 25 targets, 33 cells.',
      limit: `Omniscient’s reference pairs now run on the devutils chain: ${chain.summary.toLowerCase()} in the latest runs, with a pair skipping where a distro lacks its witness or the witness does not load. arm64 images are emulated on an x86_64 host.`,
      evidence: 'Omniscient · docs/distroproof.md · October 2026',
      link: ['/tools/omn/#portability', 'See Omniscient’s portability results'],
      fr: {
        kind: 'Campagne de portabilité',
        title: 'Ça marchait sur Arch. La version publiée échouait ailleurs.',
        problem: 'Un outil d’observation du noyau avait été développé sur une seule machine. Sa version publiée ne démarrait même pas sur un tiers des images de distributions.',
        finding: 'Lancer les archives installées sur 17 images et 5 variantes, 3 images arm64 et 8 conteneurs sans root a révélé 27 défauts : 13 dans l’outil et 14 dans ses tests. Les rapports d’environnement ont expliqué les échecs du chargeur, la politique perf de Debian, une limite memlock de 64 Kio et l’absence de traceur de fonctions sur Alpine.',
        outcome: 'La version publiée a gagné des compilations pour glibc 2.17 et musl. À la relance, aucune des 158 exécutions de sources annoncées à tort comme utilisables n’était encore refusée au démarrage ; les raisons des refus concordaient avec envprobe sur les 21 cibles. La dernière exécution a réussi sur 25 cibles sur 25, soit 33 cellules.',
        limit: `Les paires de référence d’Omniscient tournent désormais sur la chaîne devutils : ${chainFr.summary.toLowerCase()} dans les dernières exécutions, une paire étant ignorée quand une distribution n’a pas son outil témoin ou que celui-ci ne se charge pas. Les images arm64 sont émulées sur une machine x86_64.`,
        evidence: 'Omniscient · docs/distroproof.md · octobre 2026',
        link: ['/fr/tools/omn/#portability', 'Voir les résultats de portabilité d’Omniscient'],
      },
    },
    {
      target: 'envprobe', kind: 'Feedback from the Omniscient campaign',
      title: 'The report was missing the facts that explained the failure.',
      problem: 'A BPF map failed despite the required capabilities. On another guest, fentry would not attach even though CONFIG_FTRACE was enabled.',
      finding: 'The missing facts were the process’s memlock limit and CONFIG_FUNCTION_TRACER. CONFIG_FTRACE alone did not prove that functions had trampoline call sites.',
      outcome: 'envprobe gained soft/hard memlock limits and function-tracer configuration. Comparing it with Omniscient also caught an incorrect “no ftrace” diagnosis on Debian 11.',
      limit: 'These are two specific probe improvements from the same campaign, rather than a second deployment.',
      evidence: 'Omniscient · docs/distroproof.md, findings 4 and 6 · distroproof PR #5',
      link: ['https://github.com/devutils-org/distroproof/pull/5', 'Read the probe and collection changes'],
      fr: {
        kind: 'Retour de la campagne Omniscient',
        title: 'Le rapport ne contenait pas les faits qui expliquaient l’échec.',
        problem: 'Une table BPF échouait malgré les droits nécessaires. Sur une autre machine, fentry refusait de s’attacher alors que CONFIG_FTRACE était activé.',
        finding: 'Les faits manquants étaient la limite memlock du processus et CONFIG_FUNCTION_TRACER. CONFIG_FTRACE seul ne prouvait pas que les fonctions avaient des points d’appel pour les trampolines.',
        outcome: 'envprobe a gagné les limites memlock souple et stricte et la configuration du traceur de fonctions. La comparaison avec Omniscient a aussi repéré un diagnostic « pas de ftrace » erroné sur Debian 11.',
        limit: 'Il s’agit de deux améliorations précises de la sonde issues de la même campagne, pas d’un second déploiement.',
        evidence: 'Omniscient · docs/distroproof.md, constats 4 et 6 · distroproof PR #5',
        link: ['https://github.com/devutils-org/distroproof/pull/5', 'Lire les changements de la sonde et de la collecte'],
      },
    },
  ],
  omn: [
    {
      target: 'HTTP server', kind: 'Controlled validation workload',
      title: 'A slow request, traced to the lock and its holder.',
      problem: 'A request can wait in the application, the scheduler or the block layer. A total duration does not say which part delayed it.',
      finding: 'A loopback server declared request identities through USDT and carried them into downstream work. A deliberately injected lock delay appeared in the request’s own row: 40.06 ms, with the holder thread named.',
      outcome: 'The measurement attributed the wait using propagated identity. The injected delay supplied a known value to check the result against.',
      limit: 'A controlled server scenario; this is not a production incident or the planned Suzanne rendering integration.',
      evidence: 'Omniscient · docs/dev/STATE.md, vertical case · docs/dev/briefs/wave-9-vertical.md',
      fr: {
        target: 'Serveur HTTP',
        kind: 'Charge de validation contrôlée',
        title: 'Une requête lente, remontée jusqu’au verrou et à qui le tenait.',
        problem: 'Une requête peut attendre dans l’application, dans l’ordonnanceur ou dans la couche des disques. Une durée totale ne dit pas quelle partie l’a retardée.',
        finding: 'Un serveur local déclarait l’identité de ses requêtes par USDT et la transmettait au travail qui en découlait. Un délai de verrou injecté volontairement est apparu sur la ligne de la requête elle-même : 40,06 ms, avec le nom du thread qui tenait le verrou.',
        outcome: 'La mesure a attribué l’attente grâce à l’identité transmise. Le délai injecté donnait une valeur connue pour vérifier le résultat.',
        limit: 'Un scénario de serveur contrôlé : ce n’est ni un incident de production, ni l’intégration de rendu Suzanne prévue.',
        evidence: 'Omniscient · docs/dev/STATE.md, cas vertical · docs/dev/briefs/wave-9-vertical.md',
      },
    },
    {
      target: 'CPU workload', kind: 'Controlled validation workload',
      title: 'Where did one task’s wall time go?',
      problem: 'CPU samples alone leave runnable and blocked time unexplained. Adding durations can also count the same wait twice.',
      finding: 'Omniscient decomposed a task into 198.60 ms on CPU, 1.48 ms runnable and 161.68 ms blocked, against the program’s independently measured lifetime.',
      outcome: 'The parts totalled 361.76 ms against 361.21 ms of lifetime. The −550.68 µs residue lay within the stated ±1.58 ms resolution.',
      limit: 'These are the documented workload’s measurements, not accuracy guarantees for arbitrary programs.',
      evidence: 'Omniscient · docs/dev/STATE.md, task wall-clock decomposition',
      fr: {
        target: 'Charge processeur',
        kind: 'Charge de validation contrôlée',
        title: 'Où est passé le temps réel d’une tâche ?',
        problem: 'Les seuls échantillons du processeur laissent inexpliqués le temps passé à attendre son tour et le temps bloqué. Additionner des durées peut aussi compter deux fois la même attente.',
        finding: 'Omniscient a décomposé une tâche en 198,60 ms sur le processeur, 1,48 ms en attente de son tour et 161,68 ms bloquée, face à la durée de vie du programme mesurée de façon indépendante.',
        outcome: 'Les parties totalisaient 361,76 ms pour 361,21 ms de durée de vie. Le reste de −550,68 µs tenait dans la résolution annoncée de ±1,58 ms.',
        limit: 'Ce sont les mesures de la charge documentée, pas une garantie de précision pour n’importe quel programme.',
        evidence: 'Omniscient · docs/dev/STATE.md, décomposition du temps réel d’une tâche',
      },
    },
  ],
  atfq: [
    {
      target: 'Linux demo VM', kind: 'Documented walkthrough',
      title: 'Low “free” memory did not mean the RAM was full.',
      problem: 'The VM showed only 1.0 GiB completely free out of 3.9 GiB. Reading that column alone made the memory situation look worse than it was.',
      finding: 'atfq free explained the distinction and read 2.6 GiB available on the same machine. The walkthrough checked both figures against free -h.',
      outcome: 'The explanation pointed the reader to available memory and swap activity before treating page cache as a shortage.',
      limit: 'A teaching walkthrough with recorded figures, not evidence of a memory leak being repaired.',
      evidence: 'ATFQ · docs/demo.md, act 1',
      link: ['https://github.com/devutils-org/atfq/blob/main/docs/demo.md', 'Read the walkthrough'],
      fr: {
        target: 'Machine virtuelle de démo',
        kind: 'Démonstration documentée',
        title: 'Peu de mémoire « libre » ne voulait pas dire RAM pleine.',
        problem: 'La machine virtuelle n’affichait que 1,0 Gio entièrement libre sur 3,9 Gio. Lire cette seule colonne faisait paraître la mémoire bien plus juste qu’elle ne l’était.',
        finding: 'atfq free a expliqué la différence et lu 2,6 Gio disponibles sur la même machine. La démonstration a vérifié les deux chiffres avec free -h.',
        outcome: 'L’explication a orienté le lecteur vers la mémoire disponible et l’activité du swap, avant de prendre le cache pour un manque de mémoire.',
        limit: 'Une démonstration pédagogique avec des chiffres enregistrés, pas la preuve qu’une fuite de mémoire a été réparée.',
        evidence: 'ATFQ · docs/demo.md, acte 1',
        link: ['https://github.com/devutils-org/atfq/blob/main/docs/demo.md', 'Lire la démonstration (en anglais)'],
      },
    },
    {
      target: 'Zombie fixture', kind: 'Controlled demonstration',
      title: 'The dead process was waiting for its parent.',
      problem: 'A deliberately created zombie remained in the process list. Trying to kill that already-exited process would not reap it.',
      finding: 'atfq zombie identified the child and its parent. The walkthrough verified the same PIDs and Z state with ps.',
      outcome: 'The card explained that the parent must reap the child and directed the reader toward fixing or restarting the parent.',
      limit: 'The fixture supplies the known answer. ATFQ explains and inspects; it does not kill or restart processes.',
      evidence: 'ATFQ · docs/demo.md, act 2',
      link: ['https://github.com/devutils-org/atfq/blob/main/docs/demo.md', 'Read the zombie demonstration'],
      fr: {
        target: 'Zombie de test',
        kind: 'Démonstration contrôlée',
        title: 'Le processus mort attendait son parent.',
        problem: 'Un processus zombie créé volontairement restait dans la liste des processus. Essayer de tuer ce processus déjà terminé ne le faisait pas disparaître.',
        finding: 'atfq zombie a identifié l’enfant et son parent. La démonstration a vérifié les mêmes PID et l’état Z avec ps.',
        outcome: 'La fiche a expliqué que c’est au parent de recueillir l’enfant, et a orienté le lecteur vers la correction ou le redémarrage du parent.',
        limit: 'Le cas de test fournit la bonne réponse. ATFQ explique et inspecte ; il ne tue ni ne redémarre aucun processus.',
        evidence: 'ATFQ · docs/demo.md, acte 2',
        link: ['https://github.com/devutils-org/atfq/blob/main/docs/demo.md', 'Lire la démonstration du zombie (en anglais)'],
      },
    },
  ],
  xpac: [
    {
      target: 'Debian / Ubuntu lab', kind: 'Disposable sandbox validation',
      title: 'A familiar package name exposed an identity-parser bug.',
      problem: 'Packages named apt, flatpak or dnf were misparsed or rejected by the APT identity parser.',
      finding: 'Rootless Debian bookworm and Ubuntu noble runs exercised real package inventories and transactions in disposable roots, revealing the collision.',
      outcome: 'The parser was corrected. The documented runs passed inspection, reviewed install/removal, idempotent reapply and stale-plan refusal checks.',
      limit: 'Sandbox validation on Linux, not an external project deployment; host package databases were not transaction targets.',
      evidence: 'xpac · docs/validation.md, rootless Debian, Ubuntu and Fedora roots',
      link: ['https://github.com/devutils-org/xpac/blob/main/docs/validation.md', 'Read the validation record'],
      fr: {
        target: 'Labo Debian / Ubuntu',
        kind: 'Validation en bac à sable jetable',
        title: 'Un nom de paquet familier a révélé un bug dans la lecture des identités.',
        problem: 'Les paquets nommés apt, flatpak ou dnf étaient mal lus ou refusés par l’analyseur d’identités APT.',
        finding: 'Des exécutions sans root sous Debian bookworm et Ubuntu noble ont manipulé de vrais inventaires et de vraies transactions dans des environnements jetables, ce qui a révélé la collision.',
        outcome: 'L’analyseur a été corrigé. Les exécutions documentées ont passé l’inspection, l’installation et la suppression revues, la réapplication sans effet et le refus des plans périmés.',
        limit: 'Une validation en bac à sable sous Linux, pas un déploiement dans un projet extérieur ; les bases de paquets de la machine hôte n’ont jamais été modifiées.',
        evidence: 'xpac · docs/validation.md, environnements Debian, Ubuntu et Fedora sans root',
        link: ['https://github.com/devutils-org/xpac/blob/main/docs/validation.md', 'Lire le compte rendu de validation (en anglais)'],
      },
    },
    {
      target: 'Fedora lab', kind: 'Disposable sandbox validation',
      title: 'One signed install broke the next inventory.',
      problem: 'RPM inventories failed after the first signed package install because key headers appeared as gpg-pubkey entries.',
      finding: 'The Fedora 44 sandbox exercised an install followed by inventory and reapply, exposing the unexpected header records.',
      outcome: 'The inventory handling was corrected. The documented DNF5 run passed confirmed install, idempotent reapply, protected-package refusal and reviewed removal.',
      limit: 'Observed in a disposable Fedora root; it does not establish macOS or every RPM distribution’s behavior.',
      evidence: 'xpac · docs/validation.md, rootless Debian, Ubuntu and Fedora roots',
      link: ['https://github.com/devutils-org/xpac/blob/main/docs/validation.md', 'Read the Fedora findings'],
      fr: {
        target: 'Labo Fedora',
        kind: 'Validation en bac à sable jetable',
        title: 'Une installation signée cassait l’inventaire suivant.',
        problem: 'Les inventaires RPM échouaient après la première installation d’un paquet signé, parce que les en-têtes de clés apparaissaient comme des entrées gpg-pubkey.',
        finding: 'Le bac à sable Fedora 44 a enchaîné une installation, un inventaire et une réapplication, ce qui a fait apparaître ces enregistrements inattendus.',
        outcome: 'La lecture de l’inventaire a été corrigée. L’exécution DNF5 documentée a passé l’installation confirmée, la réapplication sans effet, le refus sur un paquet protégé et la suppression revue.',
        limit: 'Observé dans un environnement Fedora jetable ; cela ne dit rien de macOS ni du comportement de toutes les distributions RPM.',
        evidence: 'xpac · docs/validation.md, environnements Debian, Ubuntu et Fedora sans root',
        link: ['https://github.com/devutils-org/xpac/blob/main/docs/validation.md', 'Lire les constats sur Fedora (en anglais)'],
      },
    },
  ],
  vmanyware: [
    {
      target: 'Linux native client', kind: 'Isolated integration validation',
      title: 'A lost reply must not become a second VM action.',
      problem: 'When a start request loses its reply, the client cannot safely assume failure and submit a fresh operation.',
      finding: 'The lifecycle walkthrough exercised persisted request identity, lost replies and explicit resume. Native Linux validation connected the real Tauri UI and production commands to Axum and a generated HTTPS provider fixture.',
      outcome: 'The documented validation checked start and graceful shutdown through the native stack. Retained operation identity makes an uncertain result reviewable and resumable.',
      limit: 'The provider is a local fixture. Real Proxmox lifecycle writes and end-to-end provisioning remain unverified.',
      evidence: 'VMAnyware · docs/lifecycle-execution.md, real Linux WebView/IPC evidence',
      link: ['https://github.com/devutils-org/VMAnyware/blob/main/docs/lifecycle-execution.md', 'Read the integration evidence'],
      fr: {
        target: 'Application native Linux',
        kind: 'Validation d’intégration isolée',
        title: 'Une réponse perdue ne doit pas devenir une seconde action sur la machine.',
        problem: 'Quand une demande de démarrage perd sa réponse, l’application ne peut pas supposer un échec et relancer une nouvelle opération sans risque.',
        finding: 'Le parcours du cycle de vie a mis à l’épreuve l’identité des demandes enregistrée, les réponses perdues et la reprise explicite. La validation native sous Linux a relié la vraie interface Tauri et les commandes de production à Axum et à un faux fournisseur HTTPS généré.',
        outcome: 'La validation documentée a vérifié le démarrage et l’arrêt propre à travers toute la pile native. Garder l’identité de l’opération permet de revoir et de reprendre un résultat incertain.',
        limit: 'Le fournisseur est un faux, en local. Les vraies actions sur Proxmox et la création complète des machines restent à vérifier.',
        evidence: 'VMAnyware · docs/lifecycle-execution.md, preuves WebView/IPC sous Linux réel',
        link: ['https://github.com/devutils-org/VMAnyware/blob/main/docs/lifecycle-execution.md', 'Lire les preuves d’intégration (en anglais)'],
      },
    },
  ],
}
