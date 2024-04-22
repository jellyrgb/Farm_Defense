import State from "../../../../Wolfie2D/DataTypes/State/State";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { BattlerEvent, HudEvent, ItemEvent, CooldownEvent } from "../../../Events"
import Item from "../../../GameSystems/ItemSystem/Item";
import PlayerAI from "../PlayerAI";
import Rect from "../../../../Wolfie2D/Nodes/Graphics/Rect";
import Color from "../../../../Wolfie2D/Utils/Color";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import {UIElementType} from "../../../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Label from "../../../../Wolfie2D/Nodes/UIElements/Label";

export enum PlayerAnimationType {
    IDLE = "IDLE",
    MOVE_UP = "MOVE_UP",
    MOVE_DOWN = "MOVE_DOWN",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
    PICK_UP = "PICK_UP",
    DROP = "DROP"
}

export enum PlayerStateType {
    IDLE = "IDLE",
    INVINCIBLE = "INVINCIBLE",
    MOVING = "MOVING",
    MOVE_UP = "MOVE_UP",
    MOVE_DOWN = "MOVE_DOWN",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
    DEAD = "DEAD"
}

export default abstract class PlayerState extends State {

    protected parent: PlayerAI;
    protected owner: PlayerActor;

    public constructor(parent: PlayerAI, owner: PlayerActor) {
        super(parent);
        this.owner = owner;
    }

    private updateCount: number = 0;
    private interver : number = 40;

    public override onEnter(options: Record<string, any>): void {}
    public override onExit(): Record<string, any> { return {}; }
    public override update(deltaT: number): void {


        if (this.updateCount % this.interver === 0) {
            this.owner.animation.play("IDLE");
        }
        this.updateCount++;

        // Move the player
        this.parent.owner.move(this.parent.controller.moveDir);

        // Handle the player trying to pick up an item
        if (this.parent.controller.pickingUp) {
            // Play pick up animation
            this.owner.animation.play(PlayerAnimationType.PICK_UP, false);

            // Request an item from the scene
            this.emitter.fireEvent(ItemEvent.ITEM_REQUEST, {node: this.owner, inventory: this.owner.inventory});
        }

        // Handle the player trying to drop an item
        if (this.parent.controller.dropping) {
            const now = Date.now();
            const item = this.owner.inventory.find(item => item instanceof Item) as Item | null;
            const cooldownPeriod = 4000;
            const lastDrop = this.owner.lastItemDropped;
            const timeSinceLastDrop = now - lastDrop;


            if (timeSinceLastDrop < cooldownPeriod) {
                // 쿨타임이 남았다면 UI 메시지 표시
                const remainingTime = ((cooldownPeriod - timeSinceLastDrop) / 1000).toFixed(2);
                this.emitter.fireEvent(CooldownEvent.COOLDOWN_MESSAGE, {
                    remainingTime: remainingTime.toString()  // 또는 적절한 형식의 문자열
                });
            } else {
                // 쿨타임이 지났다면 아이템 드롭 실행
                const item = this.owner.inventory.find(item => item instanceof Item) as Item | null;
                if (item) {
                    this.owner.animation.play(PlayerAnimationType.DROP, false);
                    item.position.set(this.owner.position.x, this.owner.position.y);
                    this.owner.inventory.remove(item.id);
                    this.owner.lastItemDropped = now;
                    this.emitter.fireEvent(ItemEvent.ITEM_DROPPED, {item: item, node: this.owner, inventory: this.owner.inventory});
                }
            }
        }
        
    }


    public override handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                throw new Error(`Unhandled event of type ${event.type} caught in PlayerState!`);
            }
        }
    }

}

import Idle from "./Idle";
import Invincible from "./Invincible";
import Moving from "./Moving";
import Dead from "./Dead";
import PlayerActor from "../../../Actors/PlayerActor";
export { Idle, Invincible, Moving, Dead} 