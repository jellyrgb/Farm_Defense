// import NPCActor from "../../../Actors/NPCActor";
// import NPCBehavior from "../NPCBehavior";
// import Idle from "../NPCActions/GotoAction";
// import BasicFinder from "../../../GameSystems/Searching/BasicFinder";
// import { BattlerActiveFilter, EnemyFilter, ItemFilter, RangeFilter, VisibleItemFilter } from "../../../GameSystems/Searching/Filters";
// import Item from "../../../GameSystems/ItemSystem/Item";
// import PickupItem from "../NPCActions/PickupItem";
// import { ClosestPositioned } from "../../../GameSystems/Searching/Reducers";
// import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
// import { TargetExists } from "../NPCStatuses/TargetExists";
// import FalseStatus from "../NPCStatuses/FalseStatus";
// import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
// import GoapAction from "../../../../Wolfie2D/AI/Goap/GoapAction";
// import GoapState from "../../../../Wolfie2D/AI/Goap/GoapState";
// import Battler from "../../../GameSystems/BattleSystem/Battler";
// import TurretAttack from "../NPCActions/TurretAttack";


// export default class BabyBehavior extends NPCBehavior {

//     protected target: TargetableEntity;
//     protected range: number;
//     protected name: number;

//     /** Initialize the NPC AI */
//     public initializeAI(owner: NPCActor, options: BabyOptions): void {
//         super.initializeAI(owner, options);

//         // Initialize statuses
//         this.initializeStatuses();
//         // Initialize actions
//         this.initializeActions();

//         this.target = options.target;
//         this.range = options.range;
//         this.name = options.name;

//         // Set the goal
//         this.goal = BabyStatuses.GOAL;

//         // Initialize the behavior
//         this.initialize();
//     }

//     public handleEvent(event: GameEvent): void {
//         switch(event.type) {
//             default: {
//                 super.handleEvent(event);
//                 break;
//             }
//         }
//     }

//     public update(deltaT: number): void {
//         super.update(deltaT);
//     }

//     protected initializeStatuses(): void {

//         let scene = this.owner.getScene();

//         this.addStatus(BabyStatuses.GROWING, new TargetExists(scene.getBattlers(), new BasicFinder<Battler>()));
    
//         // Add the goal status 
//         this.addStatus(BabyStatuses.GOAL, new FalseStatus());
//     }

//     protected initializeActions(): void {

//         let scene = this.owner.getScene();

//         // An action for attacking enemy in the scene
//         let attackMonster = new TurretAttack(this, this.owner);
//         attackMonster.targets = scene.getBattlers();
//         attackMonster.targetFinder = new BasicFinder<Battler>(ClosestPositioned(this.owner), BattlerActiveFilter(), EnemyFilter(this.owner), RangeFilter(this.target, 0, this.range*this.range));
//         attackMonster.addPrecondition(BabyStatuses.GROWING);
//         attackMonster.addEffect(BabyStatuses.GOAL);
//         attackMonster.cost = 1;
//         this.addState(BabyActions.ATTACK, attackMonster);

//         // An action for guarding the location that the turret is currently at
//         let idle = new Idle(this, this.owner);
//         idle.targets = [this.target];
//         idle.targetFinder = new BasicFinder();
//         idle.addEffect(BabyStatuses.GOAL);
//         idle.cost = 1000;
//         this.addState(BabyActions.IDLE, idle);
//     }

//     public override addState(stateName: BabyAction, state: GoapAction): void {
//         super.addState(stateName, state);
//     }

//     public override addStatus(statusName: TurretStatus, status: GoapState): void {
//         super.addStatus(statusName, status);
//     }
// }

// export interface BabyOptions {
//     target: TargetableEntity
//     range: number;
//     name: number;
// }

// export type TurretStatus = typeof BabyStatuses[keyof typeof BabyStatuses];
// export const BabyStatuses = {

//     GROWING: "growing",

//     GOAL: "goal"

// } as const;

// export type BabyAction = typeof BabyActions[keyof typeof BabyActions];
// export const BabyActions = {

//     GROW: "grow",

//     IDLE: "idle",

// } as const;

