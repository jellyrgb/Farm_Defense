import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../Scenes/Scene";
import Item from "../Item";

export default class Seed extends Item {
    
    protected st: number;

    public constructor(sprite: Sprite) {
        super(sprite);
        // Choose it's star value randomly from 1-3
        // 1 has chance of 65%, 2 has chance of 25%, 3 has chance of 10%
        let rand = Math.random();
        if (rand < 0.65) {
            this.st = 1;
        } else if (rand < 0.9) {
            this.st = 2;
        } else {
            this.st = 3;
        }
    }

    public get star(): number { return this.st; }
    public set star(st: number) { this.st = st; }

}