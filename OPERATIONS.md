# Operations

## Rule check
Run python tools/check_rules.py before work. Fetch failure or changed rule hashes requires review. Reconcile/read changes before --accept-reviewed. This is not continuous monitoring of ChatGPT source files.

## Data refresh
Use Airtable connectors to read the public field allowlist, all pages. Normalize IDs to names in a private snapshot: {complete:true,totalRecordCount,records:[{id,fields}]}.
Run node scripts/export-airtable.mjs --snapshot .local/current.json.
The same exporter uses REST with AIRTABLE_PAT in GitHub Actions. Only rows with both English Title and General Tags are exported; incomplete backlog rows stay in Airtable. Errors preserve existing data. Identical records preserve generatedAt. Unexpected catalog shrinkage requires review.

## Activate remote sync
1. Register AIRTABLE_PAT in repository Actions secrets with read-only AniMood access.
2. Run Export AniMood data manually; inspect success and public output.
3. Only then set repository Actions variable ANIMOOD_SYNC_ENABLED=true.
4. Daily JST 05:17 execution can be delayed by GitHub. Missing PAT never affects static site builds.

## Test and deploy
Run node --test tests/v05.test.mjs; node --check assets/app.js; python tools/build_site.py.
Cloudflare build: python3 tools/build_site.py. Output: .local/site.
Only public assets/data and generated SEO pages, sitemap and robots.txt ship. Private snapshots, tools and rules do not.
Check desktop/mobile, English/Japanese, three routes, exclusions, no-match states and editor-note gating.

## Analytics
track() records local event counters and emits animood:track. GA4 is configured with measurement ID `G-VMBE5RM50C`. It receives only the event name, `screen_type` (`home` or `seo_page`), and a numeric result count when applicable. Never send free-form input, account data, anime titles, public IDs, selected answers, or query-string data. The standard GA4 automatic page view is disabled; AniMood sends a page view with the query string removed.
