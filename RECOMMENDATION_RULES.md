# Tag-driven recommendation rules
Updated: 2026-09-09

Use data/tag_scoring.json, supplied v0.1, for General Tags to Mood/Taste mapping. Do not invent tags or use historical personal categories.

1. Hard filters come first. No Gore, No Heavy CGI and Low Romance exclude mapped tags. Finished-only requires known finished airing and excludes Unfinished Story; this does not guarantee complete source-story adaptation. Episode limits require known counts.
2. Mood requires positive configured evidence. Taste uses selected dimensions. Like uses selected reasons actually tagged on the source, excludes the source, and requires a matching reason.
3. Weights: mood x3, taste x2, like x3, matching pace +1. No unrelated tag-count/popularity bonus. Ties use title for stable output.
4. AniMood Match is qualitative, not an arbitrary percentage. Show actual matching tags, why it fits, cautions, optional editor note and fingerprint.
5. Fingerprints measure recorded tag weight, not formal intensity ratings. Missing tags never prove absence.
6. Keep payoff separate from ambiguity and gore from emotional heaviness. Do not infer scalar axes from tags. Ambiguity is not a measured dimension in this tag release.
7. Editor's Take is explicit approved public copy and optional. Do not fabricate it.

These rules supersede the old ten-only public gate without changing the ten formal approvals.
