import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../Scenes/Scene";
import Item from "../Item";

export default class Seed extends Item {
    
    protected st: number;

    public constructor(sprite: Sprite) {
        super(sprite);
        // Choose it's star value randomly from 1-3
        this.st = Math.floor(Math.random() * 3) + 1;
    }

    public get star(): number { return this.st; }
    public set star(st: number) { this.st = st; }

}