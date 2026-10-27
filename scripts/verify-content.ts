// Re-run only declared, allowlisted checks. This never changes source or human assessments.
import { writeFileSync, renameSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { loadEntries } from '../src/library/load.ts'
import { exampleChecks, type CheckId } from '../src/library/checks.ts'
import { checkHash, reviewFile } from '../src/library/review.ts'
const save=(file:string,value:unknown)=>{writeFileSync(`${file}.tmp`,JSON.stringify(value,null,2)+'\n');renameSync(`${file}.tmp`,file)}
const entries=loadEntries(undefined,{allowStaleChecks:true})
const ids=[...new Set(entries.flatMap(e=>e.verification?.examples.map(x=>x.check) ?? []))]
// Clear attestations first: an interrupted or failed run must not retain a pass.
for(const entry of entries) {
  const review=entry.verification
  if(!review)continue
  for(const result of review.examples) {result.result='not-run';delete result.checkedAt;delete result.evidenceHash}
  save(reviewFile(entry),review)
}
const results=new Set<CheckId>()
for(const id of ids) {
  const check=exampleChecks[id]
  const result=spawnSync(process.execPath,['--test','--test-reporter=tap',`--test-name-pattern=${check.name}`,check.file],{encoding:'utf8'})
  process.stdout.write(result.stdout ?? '');process.stderr.write(result.stderr ?? '')
  if(result.status!==0 || !/^# pass [1-9]\d*$/m.test(result.stdout ?? '')) throw Error(`Content check failed: ${id}; previous pass records were cleared`)
  results.add(id)
}
const checkedAt=new Date().toISOString().slice(0,10)
for(const entry of entries) {
  const review=entry.verification
  if(!review)continue
  for(const result of review.examples) if(results.has(result.check)) {
    result.result='passed';result.checkedAt=checkedAt;result.evidenceHash=checkHash(result.check)
  }
  save(reviewFile(entry),review)
}
console.log(`Recorded ${results.size} reproducible check groups for ${entries.length} article assessments. Human reviews remain unchanged.`)
