// Section highlighting stays independent of WebGL and uses the real page anchors.
export function initSectionNavigation() {
  const links=[...document.querySelectorAll<HTMLAnchorElement>('[data-section-link]')]
  const ids=[...new Set(links.map(link=>link.hash.slice(1)))]
  const sections=ids.map(id=>document.getElementById(id)).filter((node):node is HTMLElement=>!!node)
    .sort((a,b)=>a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING?-1:1)
  if(!sections.length)return
  const select=(id:string)=>{
    for(const link of links) {
      if(link.hash===`#${id}`)link.setAttribute('aria-current','location')
      else link.removeAttribute('aria-current')
    }
  }
  const update=()=>{
    const header=document.querySelector<HTMLElement>('.site-nav')
    const threshold=Math.max((header?.getBoundingClientRect().height??72)+24,innerHeight*.25)
    let active=sections[0]
    for(const section of sections)if(section.getBoundingClientRect().top<=threshold)active=section
    if(scrollY+innerHeight>=document.documentElement.scrollHeight-2)active=sections.at(-1)!
    select(active.id)
  }
  let queued=false
  const schedule=()=>{
    if(queued)return
    queued=true;requestAnimationFrame(()=>{queued=false;update()})
  }
  for(const link of links)link.addEventListener('click',()=>select(link.hash.slice(1)))
  addEventListener('scroll',schedule,{passive:true})
  addEventListener('resize',schedule)
  addEventListener('hashchange',schedule)
  update()
}
