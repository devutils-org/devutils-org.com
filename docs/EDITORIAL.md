# Editorial verification standard

An audit record is evidence of specific work, not a guarantee of absolute truth.
Published records have scoped source assessments by Codex. No
independent human review has been performed or claimed.

## AI provenance notice

Every library page displays an English/French note explaining that its content is
AI-generated, intended as an initial foundation and overview, and subject to errors,
omissions and progressive corrections. Planned subjects remain distinct from
published articles. The note points to a GitHub issue form prefilled with the page
URL and prompts for the passage, proposed correction and supporting reference.
Opening that link does not publish a report automatically. The repeated note is
excluded from the internal Pagefind index and marked with `data-nosnippet` on a
supported `div` so it does not replace the article subject in Google snippets.
This does not exclude the page from Google indexing. The full provenance notice
remains visible without JavaScript.

## What a reader sees

Each article has a **Verification record** section. Its native HTML disclosure
works without JavaScript and preserves the site’s design. It separates:

- Source assessment: selected claims, the assessor's identity/type and date.
- Reproducible example checks: exact command, scope and recorded result/date.
- Independent human review: pending until a real named reviewer supplies a record.

Claims link to an article section and a numbered source, with an exact page or
section locator, observed access status, assessor finding and scope note. They are
classified as definitions, history, models or interpretation. A blocked source is
never counted as read. A passed example check does not validate historical facts.
The count of supported selected claims is not a percentage of all article content.

## Source selection and assessment

Use primary specifications, original publications and first-party manuals for
technical behavior. Use archival records, original work and scholarly biographies
for history. Exact references matter more than an institution's reputation: a
university page may simplify a topic or contain an error.

For each important claim, record the passage supporting it. Distinguish a direct
source statement from a mathematical derivation or an original teaching scenario.
For dates, priority claims, disputed attributions and performance, seek an independent
account and explain its provenance. Two pages quoting one paper are not independent
confirmations. If the evidence is insufficient, use `needs-review`, qualify the
article and record what remains to be established. Avoid first-ever claims without
specific historical evidence. Do not convert original estimates into measurements.

Only claim a passage was read when it was actually inspected. Search snippets can
help locate sources, but blocked direct access must remain visible. Do not copy
copyrighted texts or images into the repository to make an evidence archive.

## Existing audit observations

- Shannon's scanned 1938 paper was visually inspected at printed pp. 471–472.
  Its hindrance variable uses 1 for an open circuit. Our Boolean lesson now states
  that its conducting-path convention is different.
- The historical entries distinguish 1937 thesis work, 1938 paper publication and
  the 1940 degree award. MIT News and the AMS memoir supplement the original links.
- Direct Michigan biography retrieval returned 403; the 1948 publisher DOI reached
  a robot-check page; the older MIT student-notes PDF failed retrieval. Those limits
  are recorded. Accessible MIT, AMS, Bell Labs and Cornell passages support the
  scoped claims instead of treating blocked pages as verified.
- Numerical examples remain models. Counter timing values are fictional; neither
  arithmetic checks nor browser tests establish real hardware performance.

## Files and change detection

Each published `(id, locale)` needs `content/reviews/<id>.<locale>.json`.
`src/knowledge/review.ts` validates its schema, source indices, article anchors,
dates, identities and results. A SHA-256 fingerprint covers the normalized article
metadata, body, sources and relationships. Whitespace in prose is included.
Changing an article invalidates its assessment and stops the build until a fresh
assessment is recorded. Updating the fingerprint without re-reading the changes
would defeat this process; the software cannot establish editorial honesty.

A new record starts with source claims honestly assessed, examples marked `not-run`
and human review `pending`. For the complete schema, see the `Verification` type
and the existing JSON records. Obtain the normalized fingerprint without loading
an old audit:

```sh
node --input-type=module -e 'import {readFileSync} from "node:fs"; import {parseEntry} from "./src/knowledge/load.ts"; import {contentHash} from "./src/knowledge/review.ts"; const file=process.argv[1]; console.log(contentHash(parseEntry(readFileSync(file,"utf8"),file)))' content/knowledge/digital-logic/boolean-algebra.md
```

## Run reproducible checks

```sh
npm run verify:content
npm test
npm run build
```

`verify:content` runs the allowlisted check groups in `src/knowledge/checks.ts`.
It clears old pass attestations first, requires an actual passing test (zero matches
are not accepted), and writes results atomically after all groups pass. It never
changes source findings, content fingerprints or human-review status.

The recorded evidence hash covers the selected test and declared model files.
Changing a check/model invalidates its result. `verify:content` may load stale test
results to replace them; it still rejects stale article/source assessments. Add a
new check group when an example needs a new kind of executable evidence. A passing
command is limited to its declared scope; it is not a truth test for every sentence.

The browser evidence remains separate:

```sh
CHROME_PATH=/path/to/chrome node bench/reviews.ts
```

This opens all published records on desktop/mobile, checks their expanded disclosures
with axe-core and verifies no-JavaScript access. It does not certify factual accuracy.

## Human signoff

A qualified reviewer should read the full article, independently inspect the cited
passages, reproduce the examples and record unresolved points. Store their dated
review under `docs/reviews/signoffs/`, with article ID/locale, content fingerprint,
reviewer name, expertise, relationship to the author, scope, findings and limits.
Only then set `humanReview.status` to `completed` with `reviewer`, `reviewedAt`,
`scope` and the `record` path. Do not mark an assistant assessment as independent
human approval. The validator requires a signoff file and identity fields; it cannot
prove the person's identity, expertise or independence.

A later article change invalidates that signoff together with the source assessment.
Retain prior review records for history and set the new version's human status back
to pending unless the reviewer has reviewed the new version. No external reviewer
has been contacted and no such signoff currently exists.

## External-source availability

The build's link checker validates local pages, files and anchors; it does not
request external URLs. External timeouts therefore do not currently fail CI.

Automated access to these electronics references has been reported to time out
intermittently, even when browser access works:

- https://www.analog.com/en/resources/analog-dialogue/articles/understand-ldo-concepts.html
- https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html
- https://www.analog.com/media/en/training-seminars/tutorials/mt-101.pdf

If an external-link checker is introduced, track these exact URLs for manual
availability review on timeout or access denial. Do not treat that transport
failure as proof of a broken reference, automatically claim successful access,
or exclude the entire domain from review. A confirmed missing page still needs
a corrected URL or replacement source.
