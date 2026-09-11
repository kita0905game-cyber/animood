# Public schema v2
Updated: 2026-09-09

data/anime.json: {schemaVersion:2,generatedAt,count,anime:[]}. Timestamp changes only with public data.
Item fields: id, title (English Title), titleJa (Title), generalTags, mediaType, episodes, releaseYear, airingStatus, editorsTake, sources.
Source IDs are linking keys, not displayed. Unknown metadata remains null. Tag weights live separately in data/tag_scoring.json.

Eligibility: nonempty English Title and General Tags. Airtable may contain an editorial backlog; rows missing either public requirement are excluded from the derived website catalog and remain in Airtable for later enrichment. Empty public output and unexpected catalog shrinkage still stop export.
Editor's Take requires 評価済み + Public Ready. No fallback to notes or Public Profile. The ten prior approvals remain valid even when Editor's Take is empty.

Never publish User Review, Reference Notes, Evaluation Evidence, Legacy Category, Viewing State, Public Profile, credentials or operator identity. Free-form source strings become the neutral Editorial seed label; update dates are retained. Review public copy for personal identifiers in Airtable before export. Contact/credential patterns are also rejected in code.
Formal scalar fields remain separate in Airtable. General Tags do not infer formal ratings.
