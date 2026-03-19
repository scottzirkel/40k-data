# Data Sources

Faction JSON data is compiled from official Games Workshop publications and cross-referenced against community databases.

## Primary Sources

- **Codex: Dark Angels** (10th Edition) — unit stats, weapons, abilities, keywords
- **Codex: Space Marines** (10th Edition) — unit stats, weapons, abilities, keywords
- **Munitorum Field Manual (MFM)** — official points values, updated quarterly
- **Balance Dataslate** — rules errata, stat changes, ability rewrites

## Current Versions (as of March 2026)

| Document | Version | Date |
|----------|---------|------|
| Munitorum Field Manual | v2.7 | March 2026 |
| Balance Dataslate | v3.4 | March 2026 |

MFM and Dataslate PDFs are published at:
- https://www.warhammer-community.com/en-gb/downloads/warhammer-40000/

## Cross-Reference Sources

When verifying data accuracy, we cross-reference against:

- [40k.app](https://www.40k.app/) — structured unit data, generally up to date with codex releases
- [Wahapedia](https://wahapedia.ru/wh40k10ed/) — comprehensive datasheets with full ability text
- [NewRecruit](https://www.newrecruit.eu/) — community list builder with datasheet data

**Note:** Community sources may lag behind the latest MFM/Dataslate by days or weeks after a quarterly update. Always verify points and changed rules against the official PDFs.

## Update Process

1. After each quarterly balance update, check the new MFM for points changes and the Dataslate for rules/stat changes
2. Update the relevant faction JSON files in `data/`
3. Run `npm run build` to verify TypeScript compilation
4. Copy updated files to `warboard/public/data/`

## Change Log

### March 2026
- **Dark Angels**: Full Codex audit — updated all 16 DA-specific units from Index-era data to Codex + Dataslate v3.4 profiles. Major rewrites: Lion El'Jonson (new keywords, weapons, abilities), Azrael, Belial, Ezekiel, Asmodai, Lazarus, Sammael. Vehicle stat corrections (Dark Talon, Nephilim, Darkshroud, LSV). Deathwing Knights weapon profiles updated (removed Strike/Sweep split). Inner Circle Companions: removed native invuln, added weapon keywords. DW Terminator Squad: "Inner Circle" ability replaced with "Deathwing".
- **Space Marines (Units)**: Added missing `invuln` field to Captain in Terminator Armour (4+), Librarian in Terminator Armour (4+), Bladeguard Veteran Squad (4+). Added missing weapons to Captain/Librarian in Terminator. Fixed model count keys for Bladeguard (4→6), Hellblaster (6→10), Infernus (6→10). Renamed Infernus "Purge the Foe" → "Incendiary Terror". Added "Target Elimination" to Intercessors.
- **Space Marines (Army Rule)**: Updated Oath of Moment from Index text to Codex version — re-roll Hit roll vs target; add 1 to Wound roll for pure SM armies (no BA/DA/DW/SW/BT chapter keywords).
- **Space Marines (Detachments)**: Full rewrite of all 8 detachments from Index-era to Codex + Dataslate v3.4. Major changes: Vanguard Spearhead (new Shadow Masters rule, 4 of 6 strats replaced), Firestorm Assault Force (new Close-range Eradication rule, all strats replaced), 1st Company Task Force (new Extremis-level Threat rule, all strats replaced). CP cost corrections across multiple detachments. All stratagem and enhancement text updated to full Codex descriptions.
- **Dark Angels (Detachments)**: Verified all 5 detachments (Unforgiven TF, Inner Circle TF, Company of Hunters, Lion's Blade TF, Wrath of the Rock) already match Codex + Dataslate v3.4. No changes needed.
