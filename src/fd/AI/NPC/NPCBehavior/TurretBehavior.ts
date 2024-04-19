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
import TurretAttack from "../NPCActions/TurretAttack";


export default class TurretBehavior extends NPCBehavior {

    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: TurretOptions): void {
        super.initializeAI(owner, options);

        // Initialize the targetable entity the monster should try to attack and the range to the target
        this.target = options.target
        this.range = options.range;

        // Initialize statuses
        this.initializeStatuses();
        // Initialize actions
        this.initializeActions();
        // Set the goal
        this.goal = TurretStatuses.GOAL;

        // Initialize the behavior
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

        // A status checking if there is an enemy in the scene
        this.addStatus(TurretStatuses.TARGETABLE_ENEMY_EXISTS, new TargetExists(scene.getBattlers(), new BasicFinder<Battler>()));
    
        // Add the goal status 
        this.addStatus(TurretStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {

        let scene = this.owner.getScene();

        // An action for attacking enemy in the scene
        let attackMonster = new TurretAttack(this, this.owner);
        attackMonster.targets = scene.getBattlers();
        attackMonster.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range));
        attackMonster.addPrecondition(TurretStatuses.TARGETABLE_ENEMY_EXISTS);
        attackMonster.addEffect(TurretStatuses.GOAL);
        attackMonster.cost = 1;
        this.addState(TurretActions.ATTACK, attackMonster);

        // An action for guarding the location that the turret is currently at
        let idle = new Idle(this, this.owner);
        idle.targets = [this.target];
        idle.targetFinder = new BasicFinder();
        idle.addEffect(TurretStatuses.GOAL);
        idle.cost = 1000;
        this.addState(TurretActions.IDLE, idle);
    }

    public override addState(stateName: TurretAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public override addStatus(statusName: TurretStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }
}

export interface TurretOptions {
    target: TargetableEntity
    range: number;
}

export type TurretStatus = typeof TurretStatuses[keyof typeof TurretStatuses];
export const TurretStatuses = {

    ENEMY_IN_GUARD_POSITION: "enemy-in-guard-position",

    TARGETABLE_ENEMY_EXISTS: "targetable-enemy-exists",

    GOAL: "goal"

} as const;

export type TurretAction = typeof TurretActions[keyof typeof TurretActions];
export const TurretActions = {

    ATTACK: "attack",

    IDLE: "idle",

} as const;

