import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import Idle from "../NPCActions/GotoAction";
import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
import { BattlerActiveFilter, EnemyFilter, ItemFilter, RangeFilter, VisibleItemFilter } from "../../../GameSystems/Searching/Filters";
import Item from "../../../GameSystems/ItemSystem/Item";
import PickupItem from "../NPCActions/PickupItem";
import { ClosestPositioned } from "../../../GameSystems/Searching/Reducers";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import { TargetExists } from "../NPCStatuses/TargetExists";
import FalseStatus from "../NPCStatuses/FalseStatus";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
import Battler from "../../../GameSystems/BattleSystem/Battler";
import MonsterAttack from "../NPCActions/MonsterAttack";


export default class EnemyBehavior extends NPCBehavior {

    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: EnemyOptions): void {
        super.initializeAI(owner, options);

        // Initialize the targetable entity the guard should try to protect and the range to the target
        this.target = options.target
        this.range = options.range;

        // Initialize guard statuses
        this.initializeStatuses();
        // Initialize guard actions
        this.initializeActions();
        // Set the guards goal
        this.goal = EnemyStatuses.GOAL;

        // Initialize the guard behavior
        this.initialize();
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    protected initializeStatuses(): void {

        let scene = this.owner.getScene();

        // A status checking if there are any enemies at target the guard is guarding
        let enemyBattlerFinder = new BasicFinder<Battler>(null, BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range))
        let enemyAtGuardPosition = new TargetExists(scene.getBattlers(), enemyBattlerFinder)
        this.addStatus(EnemyStatuses.ENEMY_IN_GUARD_POSITION, enemyAtGuardPosition);

        // Add the goal status 
        this.addStatus(EnemyStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {

        let scene = this.owner.getScene();

        // An action for shooting an enemy in the guards guard area
        let attackTurret = new MonsterAttack(this, this.owner);
        attackTurret.targets = scene.getBattlers();
        attackTurret.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range));
        attackTurret.addPrecondition(EnemyStatuses.HAS_WEAPON);
        attackTurret.addPrecondition(EnemyStatuses.ENEMY_IN_GUARD_POSITION);
        attackTurret.addEffect(EnemyStatuses.GOAL);
        attackTurret.cost = 1;
        this.addState(GuardActions.ATTACK, attackTurret);

        // An action for guarding the guard's guard location
        let guard = new Idle(this, this.owner);
        guard.targets = [this.target];
        guard.targetFinder = new BasicFinder();
        guard.addPrecondition(EnemyStatuses.HAS_WEAPON);
        guard.addEffect(EnemyStatuses.GOAL);
        guard.cost = 1000;
        this.addState(GuardActions.GUARD, guard);
    }

    public override addState(stateName: EnemyAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public override addStatus(statusName: EnemyStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }
}

export interface EnemyOptions {
    target: TargetableEntity
    range: number;
}

export type EnemyStatus = typeof EnemyStatuses[keyof typeof EnemyStatuses];
export const EnemyStatuses = {

    ENEMY_IN_GUARD_POSITION: "enemy-at-guard-position",

    HAS_WEAPON: "has-weapon",

    LASERGUN_EXISTS: "laser-gun-exists",

    GOAL: "goal"

} as const;

export type EnemyAction = typeof GuardActions[keyof typeof GuardActions];
export const GuardActions = {

    PICKUP_LASER_GUN: "pickup-lasergun",

    ATTACK: "attack",

    GUARD: "guard",

} as const;

