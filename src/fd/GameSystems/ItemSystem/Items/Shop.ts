import Vec2 from "../../../../Wolfie2D/DataTypes/Vec2";
import Sprite from "../../../../Wolfie2D/Nodes/Sprites/Sprite";
import Scene from "../../../Scenes/Scene";
import Item from "../Item";

export default class Shop extends Item {

    protected _m: number;
    
    public constructor(sprite: Sprite, money: number) {
        super(sprite);
        this._m = money;
    }

    public get money(): number { return this._m; }
    public set money(amount: number) { this._m = amount; }

}