import { GoapActionStatus } from "../../../../Wolfie2D/DataTypes/Goap/GoapAction";
import AABB from "../../../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import OrthogonalTilemap from "../../../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import { TargetableEntity } from "../../../GameSystems/Targeting/TargetableEntity";
import NPCActor from "../../../Actors/NPCActor";
import NPCBehavior from "../NPCBehavior";
import NPCAction from "./NPCAction";
import { ItemEvent } from "../../../Events";
import Timer from "../../../../Wolfie2D/Timing/Timer";
import { BattlerEvent } from "../../../Events";

export default class TurretAttack extends NPCAction {

    protected timer: Timer;
    protected atk: number;
    protected cooldown: number;
    
    public constructor(parent: NPCBehavior, actor: NPCActor, type: string, star: string) {
        super(parent, actor);
        this._target = null;
        
        if (type == "tomato") {
            if (star == "normal") {
                this.atk = 10;
                this.cooldown = 2000;
            } else if (star == "silver") {
                this.atk = 12;
                this.cooldown = 1950;
            } else if (star == "gold") {
                this.atk = 14;
                this.cooldown = 1900;
            }
        } else if (type == "watermelon") {
            if (star == "normal") {
                this.atk = 15;
                this.cooldown = 2000;
            } else if (star == "silver") {
                this.atk = 18;
                this.cooldown = 1950;
            } else if (star == "gold") {
                this.atk = 21;
                this.cooldown = 1900;
            }
        } else if (type == "peach") {
            if (star == "normal") {
                this.atk = 23;
                this.cooldown = 1900;
            } else if (star == "silver") {
                this.atk = 27;
                this.cooldown = 1800;
            } else if (star == "gold") {
                this.atk = 31;
                this.cooldown = 1700;
            }
        } else if (type == "lemon") {
            if (star == "normal") {
                this.atk = 25;
                this.cooldown = 1500;
            } else if (star == "silver") {
                this.atk = 25;
                this.cooldown = 1200;
            } else if (star == "gold") {
                this.atk = 25;
                this.cooldown = 900;
            }
        }

        this.timer = new Timer(this.cooldown);
    }

    public performAction(target: TargetableEntity): void {
        //this.timer.isStopped() ? console.log("Turret attack cooling down!") : console.log("Turret attack ready!");

        if (this.timer.isStopped() && this.actor.position.distanceTo(target.position) < 300) {
            this.actor.animation.play("ATTACKING", false);

            // Send a attacked event
            this.emitter.fireEvent(BattlerEvent.BATTLER_ATTACK, {
                attacker: this.actor,
                target: target,
                damage: this.atk
            });

            this.timer.start();
        }

        setTimeout(() => {
            console.log("IDLE 실행");
            this.actor.animation.play("IDLE");
        }, 1000);

        // Finish the action
        this.finished();
    }

    public onEnter(options: Record<string, any>): void {
        super.onEnter(options);
    }

    public handleInput(event: GameEvent): void {
        switch(event.type) {
            default: {
                super.handleInput(event);
                break;
            }
        }
    }

    public update(deltaT: number): void {
        super.update(deltaT);
    }

    public onExit(): Record<string, any> {
        return super.onExit();
    }

}