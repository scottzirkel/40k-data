import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

// ---------------------------------------------------------------------------
// Load all faction data
// ---------------------------------------------------------------------------

const DATA_DIR = new URL('../data', import.meta.url).pathname;
const factionFiles = readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));

function loadFaction(filename) {
  return JSON.parse(readFileSync(join(DATA_DIR, filename), 'utf8'));
}

const factions = Object.fromEntries(
  factionFiles.map(f => [basename(f, '.json'), loadFaction(f)])
);

// ---------------------------------------------------------------------------
// Cross-faction leader relationships
//
// These are hand-crafted relationships that can't be derived from BSData
// catalogues. If a regeneration/audit wipes them, these tests catch it.
// ---------------------------------------------------------------------------

describe('cross-faction leader eligibility', () => {
  const SM_TERMINATOR_LEADERS_FOR_DEATHWING = [
    'captain-in-terminator-armour',
    'librarian-in-terminator-armour',
    'chaplain-in-terminator-armour',
    'ancient-in-terminator-armor',
  ];

  for (const unitId of SM_TERMINATOR_LEADERS_FOR_DEATHWING) {
    it(`${unitId} can lead deathwing-terminator-squad`, () => {
      const sm = factions.spacemarines;
      const unit = sm.units.find(u => u.id === unitId);
      assert.ok(unit, `Unit ${unitId} not found in spacemarines.json`);

      const leader = unit.abilities?.find(a => a.id === 'leader');
      assert.ok(leader, `${unitId} has no leader ability`);
      assert.ok(
        leader.eligibleUnits?.includes('deathwing-terminator-squad'),
        `${unitId} eligibleUnits must include deathwing-terminator-squad. Got: ${JSON.stringify(leader.eligibleUnits)}`
      );
    });
  }
});

// ---------------------------------------------------------------------------
// Unit data structure integrity
// ---------------------------------------------------------------------------

describe('unit data integrity', () => {
  for (const [factionId, data] of Object.entries(factions)) {
    describe(factionId, () => {
      it('all units have required stats', () => {
        const requiredStats = ['m', 't', 'sv', 'w', 'ld', 'oc'];
        for (const unit of data.units) {
          for (const stat of requiredStats) {
            assert.ok(
              unit.stats[stat] !== undefined,
              `${unit.name} (${unit.id}) missing stat: ${stat}`
            );
          }
        }
      });

      it('all units have points', () => {
        for (const unit of data.units) {
          const pointKeys = Object.keys(unit.points || {});
          assert.ok(
            pointKeys.length > 0,
            `${unit.name} (${unit.id}) has no points`
          );
        }
      });

      it('leader abilities reference existing units', { todo: 'some factions have units not yet added to data' }, () => {
        // Collect all unit IDs across this faction and its parent
        const allUnitIds = new Set(data.units.map(u => u.id));
        if (data.parentFaction && factions[data.parentFaction]) {
          for (const u of factions[data.parentFaction].units) {
            allUnitIds.add(u.id);
          }
        }

        for (const unit of data.units) {
          const leader = unit.abilities?.find(a => a.id === 'leader');
          if (!leader?.eligibleUnits) continue;

          for (const targetId of leader.eligibleUnits) {
            assert.ok(
              allUnitIds.has(targetId),
              `${unit.name} (${unit.id}) leader ability references non-existent unit: ${targetId}`
            );
          }
        }
      });

      it('weapon loadoutGroups match loadoutOption choices (for units with options)', { todo: 'some factions have BSData generation quirks' }, () => {
        for (const unit of data.units) {
          if (!unit.loadoutOptions || unit.loadoutOptions.length === 0) continue;

          const allChoiceIds = new Set();
          for (const opt of unit.loadoutOptions) {
            for (const choice of opt.choices) {
              allChoiceIds.add(choice.id);
            }
          }

          for (const weapon of unit.weapons) {
            if (!weapon.loadoutGroup) continue;
            assert.ok(
              allChoiceIds.has(weapon.loadoutGroup),
              `${unit.name} (${unit.id}) weapon "${weapon.name}" has loadoutGroup "${weapon.loadoutGroup}" with no matching choice`
            );
          }
        }
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Detachment rule selections must have choices
// ---------------------------------------------------------------------------

describe('detachment rule selections have choices', () => {
  for (const [factionId, data] of Object.entries(factions)) {
    if (!data.detachments) continue;

    for (const [detId, det] of Object.entries(data.detachments)) {
      if (!det.rules) continue;

      for (const rule of det.rules) {
        if (rule.type !== 'selection') continue;

        it(`${factionId} > ${det.name} > ${rule.name} has choices array`, () => {
          assert.ok(
            rule.choices && rule.choices.length > 0,
            `Selection rule "${rule.name}" in ${det.name} (${factionId}) has no choices`
          );
        });

        if (rule.resetsEachRound) {
          it(`${factionId} > ${det.name} > ${rule.name} choices have effects`, () => {
            for (const choice of rule.choices || []) {
              assert.ok(
                choice.effect,
                `Choice "${choice.name}" in ${rule.name} (${det.name}) has no effect text`
              );
            }
          });
        }
      }
    }
  }
});

// ---------------------------------------------------------------------------
// Parent faction inheritance
// ---------------------------------------------------------------------------

describe('parent faction relationships', () => {
  for (const [factionId, data] of Object.entries(factions)) {
    if (!data.parentFaction) continue;

    it(`${factionId} parent "${data.parentFaction}" exists`, () => {
      assert.ok(
        factions[data.parentFaction],
        `${factionId} references parent faction "${data.parentFaction}" which has no data file`
      );
    });
  }
});
