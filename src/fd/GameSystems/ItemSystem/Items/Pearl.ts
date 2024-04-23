import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../Scenes/Scene";
import Item from "../Item";

export default class Pearl extends Item {
    
    protected st: number;

    public constructor(sprite: Sprite) {
        super(sprite);
    }

    public get star(): number { return this.st; }
    public set star(st: number) { this.st = st; }

}