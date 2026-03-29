# Black Templars Data — Status

## Completed

### Structural Fixes
- **`parentFaction: "spacemarines"`** added — BT units now inherit SM shared units
- **13 units removed** from blacktemplars.json:
  - 9 SM duplicates: gladiator-lancer/reaper/valiant, impulsor, repulsor, repulsor-executioner, terminator-squad, land-raider-crusader, sternguard-veteran-squad
  - 4 Legends: crusader-squad-legends, execrator, crusade-ancient, emperor-s-champion-anointed
- **`lastUpdated`** bumped to `2026-03`

### Points Fixed (MFM v2.7)
- Chaplain Grimaldus: `{"1": 110}` → `{"4": 120}` (4 models including Cenobyte Servitors)
- Emperor's Champion: 100 → 75
- Marshal: 80 → 75
- Castellan: 70 → 60
- Enhancement: Tannhauser's Bones 10 → 35
- Enhancement: Witchseeker Bolts 5 → 10

### Unit Renames
- `crusader-squad` → `primaris-crusader-squad` (was Primaris data with wrong id), points keys fixed to `{"10": 150, "20": 310}`
- `sword-brethren-squad` → `primaris-sword-brethren`, points fixed to `{"5": 140, "10": 270}`
- All leader `eligibleUnits` references updated to match new ids

### New Unit: Firstborn Crusader Squad
- id: `crusader-squad`
- Points: `{"5": 85, "10": 150, "10n": 135, "20": 290}`
  - `10n` key = 10-model variant with Neophytes (1 SB + 4 Initiates + 5 Neophytes)
- Full weapon loadout: 11 weapons (SB, Initiate, Neophyte weapons + options)
- Righteous Zeal ability (reactive D6+2 movement version)
- Keywords: Infantry, Battleline, Grenades, Imperium, Crusader Squad (no Tacticus)
- loadoutOptions for SB pistol, Initiate weapon, special weapon, Neophyte weapon

### Unit Data Fixes
- **Grimaldus**: Removed broken loadoutGroup/loadoutOptions, fixed sv `"3"` → `"3+"`, fixed keywords (added Epic Hero, Character, Grenades, Chaplain Grimaldus)
- **Emperor's Champion**: Removed broken loadoutGroup from weapons
- **Marshal**: Fixed master-crafted power weapon A:7→5, removed erroneous Lethal Hits from weapon, fixed plasma supercharge AP:-2→-3, added combi-weapon option, added loadoutOptions, added `invuln: "4+"`
- **Castellan**: Replaced wrong abilities (Vehement Aggression/Prioritised Eradication → Tactical Precision/Target Priority), fixed weapon attack values (chainsword A:7→5, MCW A:6→4), removed erroneous weapon abilities, added combi-weapon + heavy bolt pistol as ranged options, added loadoutOptions
- **Primaris Crusader Squad**: Full weapon rebuild (10 weapons), fixed Righteous Zeal to Primaris version ("re-roll Advance and Charge"), added Scouts 6" keyword, added loadoutOptions
- **Primaris Sword Brethren**: Full weapon rebuild (10 weapons), fixed ability to Vow-sworn Bladesmen, added loadoutOptions

### Tests
- All BT data integrity tests pass
- parentFaction relationship validated

## Known Limitations / Future Work

### Data Format Constraints
- Neophyte stats (Sv4+, W1 firstborn / Sv4+, W2 Primaris) can't be represented in the single `stats` block — uses Initiate stats as primary
- Firstborn Crusader Squad `"10n"` points key is a workaround for two 10-model configs at different prices

### Detachments
- File has 3 detachments: Righteous Crusaders, Companions of Vehemence, Vindication Task Force
- MFM v2.7 lists enhancements only for Righteous Crusaders and Wrathful Procession
- Wrathful Procession may need to replace or supplement Vindication Task Force — needs codex verification

### Warboard Integration (Not Done)
- Add to `availableArmies` in `warboard/src/stores/armyStore.ts`
- Add theme in `warboard/src/app/globals.css` (theme class may already exist)
- Add to `LandingPage.tsx` faction selector

### Research Sources Used
- MFM v2.7: page 10 (points, detachment enhancements)
- October 2024 BT Index PDF (via web research)
- December 2024 BT Index PDF (via web research)
- Wahapedia, Goonhammer reviews (weapon profiles, abilities)
