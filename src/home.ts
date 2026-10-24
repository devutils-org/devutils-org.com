import { tools } from './tools.ts'
import type { Lang } from './i18n.ts'
import { esc, icon } from './html.ts'

interface Situation { id:string; tag:[string,string]; question:[string,string]; benefit:[string,string]; limit?:[string,string] }
const situations:Situation[] = [
  {id:'omn',tag:['A program slows down','Un programme ralentit'],question:['Where is the time going?','Qu’est-ce qui ralentit ?'],benefit:['See what a program is using while it runs, and follow the clues about where its time goes.','Observer ce qu’un programme utilise pendant qu’il tourne, pour orienter la recherche et décider quoi examiner.']},
  {id:'atfq',tag:['An unfamiliar number','Un chiffre difficile à comprendre'],question:['Should I worry about this?','Est-ce inquiétant ?'],benefit:['Get an explanation of what your computer is reporting, put the number in context and learn what to inspect next.','Comprendre ce que votre ordinateur indique, remettre le chiffre dans son contexte et savoir quoi regarder ensuite.']},
  {id:'distroproof',tag:['Software to share','Un programme à partager'],question:['Will it work elsewhere?','Ça marchera ailleurs ?'],benefit:['Try your program in different Linux setups. Compare what works, what fails and what changes between them.','Essayer votre programme sur différentes installations de Linux. Comparer ce qui fonctionne, ce qui échoue et ce qui change entre elles.']},
  {id:'xpac',tag:['A computer that has grown messy','Un ordinateur qui s’est rempli'],question:['What is installed, and why?','Qu’ai-je installé, et pourquoi ?'],benefit:['See which software is there and what needs it. Review proposed changes before you apply them.','Voir quels logiciels sont présents et lesquels en ont besoin. Examiner les changements proposés avant de les appliquer.']},
  {id:'vmanyware',tag:['A place to experiment','Un espace pour expérimenter'],question:['Can I set up a separate workspace?','Et si je testais dans un espace à part ?'],benefit:['A project for preparing a working environment on your own server and reaching it from another device.','Un projet pour préparer un environnement de travail sur votre propre serveur et le retrouver depuis un autre appareil.']},
]

// The home page starts with recognizable situations; specifications live in Tools.
export function homeHtml(lang:Lang='en') {
  const fr=lang==='fr',prefix=fr?'/fr':'',column=fr?1:0
  return {
    'use-cases':situations.map((s,i)=>{
      const tool=tools.find(t=>t.id===s.id)!
      return `<article class="use-case glass reveal" style="--tc:${tool.color};--d:${i*.06}s">
        <div class="use-case-top"><span class="tool-glyph" aria-hidden="true">${tool.glyph}</span><small>${esc(s.tag[column])}</small></div>
        <h3>${esc(s.question[column])}</h3><p>${esc(s.benefit[column])}</p>
        <div class="use-case-footer"><a href="${prefix}/tools/${tool.id}/">${fr?'Découvrir':'Explore'} ${esc(tool.name)} ${icon('arrow-right')}</a>${s.limit?`<small>${esc(s.limit[column])}</small>`:''}</div>
      </article>`
    }).join(''),
  }
}
