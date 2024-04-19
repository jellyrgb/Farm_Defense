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


export default class BaseBehavior extends NPCBehavior {

    /** The target the guard should guard */
    protected target: TargetableEntity;
    /** The range the guard should be from the target they're guarding to be considered guarding the target */
    protected range: number;

    /** Initialize the NPC AI */
    public initializeAI(owner: NPCActor): void {
        super.initializeAI(owner, {});

        // Initialize statuses
        this.initializeStatuses();
        // Initialize actions
        this.initializeActions();
        // Set the goal
        this.goal = BaseStatuses.GOAL;

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

        // Add the goal status 
        this.addStatus(BaseStatuses.GOAL, new FalseStatus());
    }

    protected initializeActions(): void {

        let scene = this.owner.getScene();

        // An action for just idling
        let idle = new Idle(this, this.owner);
        idle.addEffect(BaseStatuses.GOAL);
        idle.cost = 1000;
        this.addState(BaseActions.IDLE, idle);
    }

    public override addState(stateName: BaseAction, state: GoapAction): void {
        super.addState(stateName, state);
    }

    public override addStatus(statusName: BaseStatus, status: GoapState): void {
        super.addStatus(statusName, status);
    }
}

export type BaseStatus = typeof BaseStatuses[keyof typeof BaseStatuses];
export const BaseStatuses = {

    GOAL: "goal"

} as const;

export type BaseAction = typeof BaseActions[keyof typeof BaseActions];
export const BaseActions = {

    IDLE: "idle",

} as const;

