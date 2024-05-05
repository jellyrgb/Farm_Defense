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

    /** The target the enemy should attack */
    protected target: TargetableEntity;
    /** The range of the enemy */
    protected range: number;
    protected level: number;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor, options: EnemyOptions): void {
        super.initializeAI(owner, options);

        // Initialize the targetable entity the monster should try to attack and the range to the target
        this.target = options.target
        this.range = options.range;
        this.level = options.level;

        // Initialize statuses
        this.initializeStatuses();
        // Initialize actions
        this.initializeActions();
        // Set the goal
        this.goal = EnemyStatuses.GOAL;

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
        
        // If there is turret in the scene, attack the turret first
        if (this.owner.getScene().getBattlers().length > 0) {
            this.owner.getScene().getBattlers().forEach(battler => {
                if ((battler as any).type === "turret") {
                    this.target = battler;
                }
            });
        }


        super.update(deltaT);
    }

    protected initializeStatuses(): void {

        let scene = this.owner.getScene();

        // A status checking if there is an enemy in the scene
        this.addStatus(EnemyStatuses.TARGETABLE_ENEMY_EXISTS, new TargetExists(scene.getBattlers(), new BasicFinder<Battler>()));
    
        // Add the goal status 
        this.addStatus(EnemyStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {

        let scene = this.owner.getScene();

        // An action for attacking turret in the scene
        let attackTurret = new MonsterAttack(this, this.owner, this.level);
        attackTurret.targets = scene.getBattlers();
        attackTurret.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range));
        attackTurret.addPrecondition(EnemyStatuses.TARGETABLE_ENEMY_EXISTS);
        attackTurret.addEffect(EnemyStatuses.GOAL);
        attackTurret.cost = 1;
        this.addState(EnemyActions.ATTACK, attackTurret);

        // An action for just idling
        let idle = new Idle(this, this.owner);
        idle.targets = [this.target];
        idle.targetFinder = new BasicFinder();
        idle.addEffect(EnemyStatuses.GOAL);
        idle.cost = 1000;
        this.addState(EnemyActions.IDLE, idle);

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
    level: number;
}

export type EnemyStatus = typeof EnemyStatuses[keyof typeof EnemyStatuses];
export const EnemyStatuses = {

    TARGETABLE_ENEMY_EXISTS: "targetable-enemy-exists",

    GOAL: "goal"

} as const;

export type EnemyAction = typeof EnemyActions[keyof typeof EnemyActions];
export const EnemyActions = {

    ATTACK: "attack",

    IDLE: "idle",

} as const;

