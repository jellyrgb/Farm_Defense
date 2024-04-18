import StateMachineGoapAI from "../../../Wolfie2D/AI/Goap/StateMachineGoapAI";
import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";
import GameNode from "../../../Wolfie2D/Nodes/GameNode";
import Line from "../../../Wolfie2D/Nodes/Graphics/Line";
import Timer from "../../../Wolfie2D/Timing/Timer";
import NPCActor from "../../Actors/NPCActor";
import { BattlerEvent } from "../../Events";
import NPCAction from "./NPCActions/NPCAction";


/**
 * An abstract implementation of behavior for an NPC. Each concrete implementation of the
 * NPCBehavior class should define some new behavior for an NPCActor. 
 */
export default abstract class NPCBehavior extends StateMachineGoapAI<NPCAction>  {

    protected override owner: NPCActor;

    public initializeAI(owner: NPCActor, options: Record<string, any>): void {
        this.owner = owner;
        this.receiver.subscribe(BattlerEvent.BATTLER_ATTACK);
        this.receiver.subscribe(BattlerEvent.BATTLER_DAMAGED);
    }

    public activate(options: Record<string, any>): void {}

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    /**
     * @param event the game event
     */
    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case BattlerEvent.BATTLER_ATTACK: {
                console.log("Catching and handling battler attacking event");
                this.handleBattlerAttack(event.data.get("attacker"), event.data.get("target"), event.data.get("damage"));
                break;
            }
            case BattlerEvent.BATTLER_DAMAGED: {
                console.log("Catching and handling battler damaged event");
                this.handleBattlerDamaged(event.data.get("attacker"), event.data.get("target"), event.data.get("damage"));
                break;
            }
            default: {
                super.handleEvent(event);
                break;
            }
        }
    }

    protected handleBattlerAttack(attacker: NPCActor, target: NPCActor, damage: number): void {
        if (this.owner === attacker) {
            console.log("NPC attacked target");
            // Send a damage event
            this.emitter.fireEvent(BattlerEvent.BATTLER_DAMAGED, {
                attacker: attacker,
                target: target,
                damage: damage
            });
        }
    }

    protected handleBattlerDamaged(attacker: NPCActor, target: NPCActor, damage: number): void {
        if (this.owner === target) {
            console.log("NPC damaged by target");
            // Subtract the damage from the health of the NPC
            this.owner.health -= damage;
        }
    }
    
}