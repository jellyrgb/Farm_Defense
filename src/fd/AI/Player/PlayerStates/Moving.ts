import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../../../Wolfie2D/Events/GameEvent";
import { PlayerStateType, PlayerAnimationType } from "./PlayerState";
import PlayerState from "./PlayerState";

export default class Moving extends PlayerState {

    public override onEnter(options: Record<string, any>): void {

    }

    public override handleInput(event: GameEvent): void {

    }

    public override update(deltaT: number): void {
        super.update(deltaT);
        const moveDir = this.parent.controller.moveDir;

        if (moveDir.equals(Vec2.ZERO)) {
            this.finished(PlayerStateType.IDLE);
            return;
        }

        if (moveDir.y < 0) {
            this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.MOVE_UP, true);
        } else if (moveDir.y > 0) {
            this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.MOVE_DOWN, true);
        }

        if (moveDir.x < 0) {
            this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.MOVE_LEFT, true);
        } else if (moveDir.x > 0) {
            this.parent.owner.animation.playIfNotAlready(PlayerAnimationType.MOVE_RIGHT, true);
        }
    }

    public override onExit(): Record<string, any> {
        return {};
    }
}    
