import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import Input from "../../Wolfie2D/Input/Input";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import MainMenu from "./MainMenu";

export default class GameOver extends Scene {

    startScene() {
        // Play game over sound
        this.load.audio("game_over", "fd_assets/sounds/game_over.mp3");
        this.emitter.fireEvent("play_sound", {key: "game_over", loop: false, holdReference: false});

        const center = this.viewport.getCenter();

        this.addUILayer("primary");

        const gameOver = <Label>this.add.uiElement(UIElementType.LABEL, "primary", {position: new Vec2(center.x, center.y), text: "Game Over"});
        gameOver.textColor = Color.WHITE;

        setTimeout(() => {
            this.viewport.setZoomLevel(1);
            this.sceneManager.changeToScene(MainMenu);
        }, 3000);
    }
}