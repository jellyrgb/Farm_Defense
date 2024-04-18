import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Scene from "../../Wolfie2D/Scene/Scene";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Seed from "../GameSystems/ItemSystem/Items/Seed";
import Battler from "../GameSystems/BattleSystem/Battler";


export default abstract class FDScene extends Scene {

    public abstract getBattlers(): Battler[];

    public abstract getWalls(): OrthogonalTilemap;

    public abstract getHealthpacks(): Seed[];

    public abstract isTargetVisible(position: Vec2, target: Vec2): boolean;
    
}