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
export type WeaponType = 'melee' | 'ranged' | 'equipment';
export interface RangedWeaponStats {
    range: number;
    a: number | string;
    bs: string;
    s: number;
    ap: number;
    d: number | string;
}
export interface MeleeWeaponStats {
    a: number | string;
    ws: string;
    s: number;
    ap: number;
    d: number | string;
}
export interface EquipmentStats {
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
export interface Ability {
    id: string;
    name: string;
    description: string;
    loadoutGroup?: string;
    eligibleUnits?: string[];
}
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
}
export interface UnitStats {
    m: number;
    t: number;
    sv: string;
    w: number;
    ld: string;
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
    count?: {
        min: number;
        max: number;
    };
    /** Weapon IDs that belong to this model type */
    weaponIds?: string[];
    /** Model-specific keywords (e.g., "Character" for Nob) */
    keywords?: string[];
    /** If true, this model can be targeted by Precision attacks */
    isLeader?: boolean;
}
export interface Unit {
    id: string;
    bsdataId?: string;
    name: string;
    points: Record<string, number>;
    baseSize?: {
        shape: 'round' | 'oval';
        mm: number;
        mmMinor?: number;
    };
    modelCountOptions?: number[];
    stats: UnitStats;
    invuln: string | null;
    weapons: Weapon[];
    loadoutOptions?: LoadoutOption[];
    abilities: Ability[];
    keywords: string[];
    /** For units with multiple model types (e.g., Gretchin has Gretchin + Runtherd) */
    modelTypes?: ModelType[];
}
export interface Enhancement {
    id: string;
    name: string;
    points: number;
    description: string;
    modifiers?: Modifier[];
    eligibleKeywords?: string[];
}
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
export interface Detachment {
    name: string;
    rules: DetachmentRule[];
    stratagems: Stratagem[];
    enhancements: Enhancement[];
}
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
export interface KeywordDefinition {
    name: string;
    description: string;
}
export interface KeywordGlossary {
    faction?: Record<string, KeywordDefinition>;
    unit?: KeywordDefinition[];
    weapon?: KeywordDefinition[];
}
export interface WeaponKeyword {
    name: string;
    description: string;
}
export interface AllyFaction {
    name: string;
    description: string;
    units: Unit[];
}
export interface ArmyData {
    faction: string;
    lastUpdated: string;
    catalogueId?: string;
    gameSystemId?: string;
    armyRules?: Record<string, ArmyRule>;
    coreStratagems?: Stratagem[];
    units: Unit[];
    detachments: Record<string, Detachment>;
    allies?: Record<string, AllyFaction>;
    weaponKeywords?: Record<string, WeaponKeyword>;
    keywordGlossary?: KeywordGlossary;
    glossary?: Record<string, unknown>;
}
//# sourceMappingURL=types.d.ts.map