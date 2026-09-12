# OfficialCTO migration

OfficialCTO content is preserved in Kavriq under versioned routes. Kavriq already used the singular `/interview` namespace, so the migration follows that established convention instead of introducing a parallel `/interviews` tree.

## Route mapping

| OfficialCTO | Kavriq |
| --- | --- |
| `/` | `/interview/software-engineering/v1` |
| `/interview-section/` | `/interview/software-engineering/v1` |
| `/interview-section/<topic>` | `/interview/<topic>/v1` |
| `/interview-section/<topic>/<page>` | `/interview/<topic>/v1/<page>` |
| `/blogs/` | `/blogs` |
| `/blogs/2025/october/future-of-ai` | `/blogs/2025/10-06-future-of-ai` |
| `/my-works/` | `/engineering/case-studies/v1` |
| `/my-works/<company>/<page>` | `/engineering/case-studies/v1/<company>/<page>` |

The current OfficialCTO working tree is the migration source, including its uncommitted database rewrite. Blog posts follow Kavriq's `/blogs/YYYY/MM-DD-slug` convention. Images are namespaced below `/images/officialcto/` to avoid collisions with Kavriq assets.

Run `node scripts/migrate-officialcto.mjs /absolute/path/to/officialcto` to refresh the imported copy and generated interview navigation.

## Redirect behavior

OfficialCTO is hosted on GitHub Pages, which cannot emit origin-level HTTP 301 responses. Its VitePress build therefore adds a canonical destination, an immediate HTML refresh, and a `window.location.replace` fallback for every migrated page. If the domain later moves behind a host that supports redirect rules, the table above should be converted to permanent HTTP 301 rules.
