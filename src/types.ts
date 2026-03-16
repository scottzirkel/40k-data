// ============================================================================
// Stat Modifiers
// ============================================================================

export type ModifierOperation = 'add' | 'subtract' | 'multiply' | 'set';
export type ModifierScope = 'model' | 'unit' | 'melee' | 'ranged' | 'weapon' | 'all';
export type StatKey = 'm' | 't' | 'sv' | 'w' | 'ld' | 'oc' | 'a' | 's' | 'ap' | 'd' | 'bs' | 'ws' | 'range';
export type ModifierDuration = 'permanent' | 'battle' | 'round' | 'phase';
export type ModifierCondition = 'below_starting_strength' | 'below_half_strength' | 'none';

export interface Modifier {
  stat: StatKey;
  operation: ModifierOperation;
  value: number;
  scope: ModifierScope;
  source?: string;
  condition?: string;
  duration?: ModifierDuration;
}

// ============================================================================
// Weapon Types
// ============================================================================

export type WeaponType = 'melee' | 'ranged' | 'equipment';

export interface RangedWeaponStats {
  range: number;
  a: number | string; // Can be "D6", "D6+1", etc.
  bs: string; // "2+", "3+", "N/A"
  s: number;
  ap: number;
  d: number | string; // Can be "D6", "D6+1", etc.
}

export interface MeleeWeaponStats {
  a: number | string; // Can be "D6", "D6+1", etc.
  ws: string; // "2+", "3+"
  s: number;
  ap: number;
  d: number | string; // Can be "D6", "D6+1", etc.
}

export interface EquipmentStats {
  // Empty object for equipment type weapons - represents equipment with no stats
}

export type WeaponStats = RangedWeaponStats | MeleeWeaponStats | EquipmentStats;

export interface Weapon {
  id: string;
  name: string;
  type: WeaponType;
  stats: WeaponStats;
  abilities: string[];
  loadoutGroup?: string;
  modifiers?: Modifier[];
}

// ============================================================================
// Abilities
// ============================================================================

export interface Ability {
  id: string;
  name: string;
  description: string;
  loadoutGroup?: string;
  eligibleUnits?: string[]; // For Leader ability
}

// ============================================================================
// Loadout Options
// ============================================================================

export type LoadoutOptionType = 'choice' | 'optional';
export type LoadoutPattern = 'replacement' | 'addition';

export interface LoadoutChoice {
  id: string;
  name: string;
  default?: boolean;
  maxModels?: number;
  paired?: boolean;
  /** When this choice is selected, exclude those models from another loadout option's requirements */
  excludesFromOption?: string;
}

export interface LoadoutOption {
  id: string;
  name: string;
  type: LoadoutOptionType;
  pattern: LoadoutPattern;
  choices: LoadoutChoice[];
  /** Cap total non-default choices per N models. E.g. { max: 1, per: 5 } = 1 heavy weapon per 5 models */
  maxNonDefaultPerModels?: { max: number; per: number };
}

// ============================================================================
// Units
// ============================================================================

export interface UnitStats {
  m: number;
  t: number;
  sv: string; // "2+", "3+"
  w: number;
  ld: string; // "6+", "5+"
  oc: number;
}

/**
 * Represents a distinct model type within a unit.
 * Used for units like Gretchin (Gretchin + Runtherd) or Squighog Boyz (Squighog Boy + Nob).
 * Each model type can have different stats, weapons, and be targeted separately (Precision).
 */
export interface ModelType {
  id: string;
  name: string;
  stats: UnitStats;
  invuln?: string | null;
  /** How many of this model type in the unit configuration */
  count?: { min: number; max: number };
  /** Weapon IDs that belong to this model type */
  weaponIds?: string[];
  /** Model-specific keywords (e.g., "Character" for Nob) */
  keywords?: string[];
  /** If true, this model can be targeted by Precision attacks */
  isLeader?: boolean;
}

export interface Unit {
  id: string;
  bsdataId?: string; // BSData entry ID for .rosz export
  name: string;
  points: Record<string, number>; // { "4": 150, "5": 190 }
  baseSize?: { shape: 'round' | 'oval'; mm: number; mmMinor?: number };
  modelCountOptions?: number[];
  stats: UnitStats;
  invuln: string | null; // "4+", "5+", or null
  weapons: Weapon[];
  loadoutOptions?: LoadoutOption[];
  abilities: Ability[];
  keywords: string[];
  /** For units with multiple model types (e.g., Gretchin has Gretchin + Runtherd) */
  modelTypes?: ModelType[];
}

// ============================================================================
// Enhancements
// ============================================================================

export interface Enhancement {
  id: string;
  name: string;
  points: number;
  description: string;
  modifiers?: Modifier[];
  eligibleKeywords?: string[]; // Unit must have at least one of these keywords
}

// ============================================================================
// Stratagems
// ============================================================================

export type StratagemUsageLimit = 'unlimited' | 'once_per_battle' | 'twice_per_battle' | 'once_per_phase';

export interface Stratagem {
  id: string;
  name: string;
  cost: number;
  phase: string;
  description: string;
  modifiers?: Modifier[];
  usageLimit?: StratagemUsageLimit;
}

// ============================================================================
// Secondary Missions (Chapter Approved)
// ============================================================================

export interface ScoringCondition {
  condition: string;
  vp: string;
  fixedVp?: string;
  tacticalVp?: string;
  cumulative?: boolean;
  maxVp?: string;
}

export interface ScoringBlock {
  round: string;
  when: string;
  conditions: ScoringCondition[];
}

export interface MissionAction {
  name: string;
  starts: string;
  units: string;
  completes: string;
  ifCompleted: string;
}

export interface SecondaryMission {
  id: string;
  name: string;
  flavor: string;
  whenDrawn?: string;
  action?: MissionAction;
  scoringBlocks: ScoringBlock[];
  fixedOnly?: boolean;
  tacticalOnly?: boolean;
  noFixedTournament?: boolean;
}

// ============================================================================
// Challenger Cards (Chapter Approved)
// ============================================================================

export interface ChallengerStratagem {
  name: string;
  cost: number;
  phase: string;
  when: string;
  effect: string;
}

export interface ChallengerMission {
  scoringBlocks?: ScoringBlock[];
  action?: MissionAction;
}

export interface ChallengerCard {
  id: string;
  name: string;
  stratagem: ChallengerStratagem;
  mission: ChallengerMission;
}

// ============================================================================
// Mission Data (Full Chapter Approved JSON)
// ============================================================================

export interface MissionDeployment {
  id: string;
  name: string;
}

export interface PrimaryMission {
  id: string;
  name: string;
  flavor?: string;
  setup?: string;
  action?: MissionAction;
  scoringBlocks?: ScoringBlock[];
}

export interface MissionData {
  name: string;
  version: string;
  twists: MissionTwist[];
  deployments: MissionDeployment[];
  primaryMissions: PrimaryMission[];
  secondaryMissions: SecondaryMission[];
  challengerCards: ChallengerCard[];
}

// ============================================================================
// Mission Twists (Chapter Approved)
// ============================================================================

export interface MissionTwist {
  id: string;
  name: string;
  description: string;
  /** Which player this affects: 'both', 'attacker', 'defender', 'overlord', 'underdog' */
  affects: 'both' | 'attacker' | 'defender' | 'overlord' | 'underdog';
  /** If true, modifiers only apply to the designated Warlord unit */
  appliesToWarlord?: boolean;
  modifiers?: Modifier[];
}

// ============================================================================
// Detachment Rules
// ============================================================================

export type DetachmentRuleType = 'passive' | 'aura' | 'selection';

export interface DetachmentRuleBonus {
  condition: string;
  effect: string;
}

export interface DetachmentRuleChoice {
  id: string;
  name: string;
  effect: string;
  modifiers?: Modifier[];
}

export interface DetachmentRule {
  id: string;
  name: string;
  description: string;
  type?: DetachmentRuleType;
  modifiers?: Modifier[];
  bonuses?: DetachmentRuleBonus[];
  choices?: DetachmentRuleChoice[];
  /** If true, selection resets each round (preserved but marked as needing confirmation) */
  resetsEachRound?: boolean;
}

// ============================================================================
// Detachments
// ============================================================================

export interface Detachment {
  name: string;
  rules: DetachmentRule[];
  stratagems: Stratagem[];
  enhancements: Enhancement[];
}

// ============================================================================
// Army Rules
// ============================================================================

export interface ArmyRuleStance {
  id: string;
  name: string;
  description: string;
  modifiers?: Modifier[];
}

export interface ArmyRule {
  name: string;
  description: string;
  range?: number;
  keywords?: string[];
  oncePerBattle?: boolean;
  stances?: ArmyRuleStance[];
  /** If true, selection resets each round (preserved but marked as needing confirmation) */
  resetsEachRound?: boolean;
}

// ============================================================================
// Keyword Glossary
// ============================================================================

export interface KeywordDefinition {
  name: string;
  description: string;
}

export interface KeywordGlossary {
  faction?: Record<string, KeywordDefinition>;
  unit?: KeywordDefinition[];
  weapon?: KeywordDefinition[];
}

// ============================================================================
// Weapon Keywords
// ============================================================================

export interface WeaponKeyword {
  name: string;
  description: string;
}

// ============================================================================
// Army Data (Full Faction JSON)
// ============================================================================

export interface AllyFaction {
  name: string;
  description: string;
  units: Unit[];
}

export interface ArmyData {
  faction: string;
  lastUpdated: string;
  /** Parent faction ID whose units this army also has access to (e.g., "spacemarines") */
  parentFaction?: string;
  // BSData metadata for .rosz export
  catalogueId?: string; // BSData catalogue ID (e.g., "1f19-6509-d906-ca10")
  gameSystemId?: string; // BSData game system ID (e.g., "sys-352e-adc2-7639-d6a9")
  armyRules?: Record<string, ArmyRule>;
  coreStratagems?: Stratagem[]; // Universal 10th edition stratagems
  units: Unit[];
  detachments: Record<string, Detachment>;
  allies?: Record<string, AllyFaction>;
  weaponKeywords?: Record<string, WeaponKeyword>;
  keywordGlossary?: KeywordGlossary;
  glossary?: Record<string, unknown>;
}
