import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Level1 from "./Level1";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import { GameEventType } from "../../Wolfie2D/Events/GameEventType";
import Input from "../../Wolfie2D/Input/Input";
import Button from "../../Wolfie2D/Nodes/UIElements/Button";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect"; 
import Level2 from "../Scenes/Level2";
import Level3 from "../Scenes/Level3";
import Level4 from "../Scenes/Level4";
import Level5 from "../Scenes/Level5";
import Level6 from "../Scenes/Level6";

export default class MainMenu extends Scene {
    // Layers, for multiple main menu screens
    private splash: Layer;
    private mainMenu: Layer;
    private controls: Layer;
    private guide: Layer;
    private help: Layer;
    private level : Layer;
    public static maxLevelUnlocked: number = 1;
    private steelBlue: Color = new Color(70, 130, 180, 0.9);
    private steelBlueBorder: Color = new Color(57, 103, 141);

    public loadScene(){
        this.load.image("logo", "fd_assets/sprites/logo.png");
        this.load.image("title", "fd_assets/sprites/title.png");
        this.load.image("splash", "fd_assets/sprites/splash.png");
        this.load.image("backgroundImage", "fd_assets/sprites/background.png");
        this.load.image("buttonImage", "fd_assets/sprites/button.png");

        this.load.audio("bgm", "fd_assets/sounds/main_menu_music.mp3");
        this.load.audio("click", "fd_assets/sounds/main_menu_button.mp3");
    }

    public startScene(){
        // Play the background music
        // this.emitter.fireEvent("play_sound", {key: "bgm", loop: false, holdReference: false});

        const center = this.viewport.getCenter();

        // Splash screen
        this.splash = this.addUILayer("splash");
        const backphoto = this.add.sprite("splash", "splash");
        backphoto.position.set(center.x, center.y)
        
        const splashLogo = this.add.sprite("logo", "splash");
        splashLogo.position.set(center.x, center.y - 400);

        const splashTitle = this.add.sprite("title", "splash");
        splashTitle.position.set(center.x, center.y - 330);

        const splashintext = "Touch To Start!"
        const splashText = <Label>this.add.uiElement(UIElementType.LABEL, "splash", {position: new Vec2(center.x, center.y + 300), text: splashintext});
        splashText.fontSize = 45;
        splashText.textColor = Color.WHITE;

        // Main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setHidden(true);

        const photo = this.add.sprite("backgroundImage", "mainMenu");
        photo.position.set(center.x, center.y);

        const logo = this.add.sprite("logo", "mainMenu");
        logo.position.set(center.x, center.y - 400);

        const title = this.add.sprite("title", "mainMenu");
        title.position.set(center.x, center.y - 330);


        const startImage = this.add.sprite("buttonImage", "mainMenu");
        startImage.position.set(center.x - 10 , center.y - 170)

        const ctrlImage = this.add.sprite("buttonImage", "mainMenu");
        ctrlImage.position.set(center.x - 10 , center.y - 30)

        const guideImage = this.add.sprite("buttonImage", "mainMenu");
        guideImage.position.set(center.x - 10 , center.y + 110)

        const infoImage = this.add.sprite("buttonImage", "mainMenu");
        infoImage.position.set(center.x - 10 , center.y + 250)

        // Game Start
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 170), text: "Game Start"});
        (play as Label).setTextColor(Color.WHITE);
        (play as Label).fontSize = 30;
        console.log((play as Label).getFontString())
        play.size.set(300, 100);
        play.borderWidth = 2;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";


        // Add Controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 30), text: "Controls"});
        (controls as Label).setTextColor(Color.WHITE);
        controls.size.set(200, 50);
        controls.borderWidth = 0;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "control";


        // Add Guide button
        const guide = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 110), text: "Guide"});
        (guide as Label).setTextColor(Color.WHITE);
        guide.size.set(200, 50);
        guide.borderWidth = 0;
        guide.backgroundColor = Color.TRANSPARENT;
        guide.onClickEventId = "guide";

        // Add Info button
        const info = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "Info"});
        (info as Label).setTextColor(Color.WHITE);
        info.size.set(200, 50);
        info.borderWidth = 0;
        info.backgroundColor = Color.TRANSPARENT;
        info.onClickEventId = "help";


        // Level selection screen
        this.level = this.addUILayer("levelSelect");
        this.level.setHidden(true);

        const levelPhoto = this.add.sprite("backgroundImage", "levelSelect");
        levelPhoto.position.set(center.x, center.y);
        const numCols = 3;

        const levels = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6"];
        levels.forEach((lev, index) => {
            const row = Math.floor(index / numCols);
            const col = index % numCols;

            const xPosition = center.x - 300 + col * 300;
            const yPosition = center.y - 150 + row * 300; 
        
            const levelRect = new Rect(new Vec2(xPosition, yPosition), new Vec2(250, 200));
            levelRect.color = this.steelBlue;
            levelRect.borderWidth = 2;
            levelRect.borderColor = this.steelBlueBorder;
            this.level.addNode(levelRect);
        
            const levelButton = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {
                position: new Vec2(xPosition, yPosition),
                text: lev            
            });
        
            levelButton.size.set(250, 200);
            (levelButton as Label).setTextColor(Color.WHITE);
            levelButton.backgroundColor = Color.TRANSPARENT;

            if (index + 1 <= MainMenu.maxLevelUnlocked) {
                (levelButton as Label).setTextColor(Color.WHITE);
                levelButton.onClickEventId = "level" + (index + 1);
            } else {
                (levelButton as Label).setTextColor(new Color(188, 188, 188)); 
                (levelButton as Label).fontSize = 20;
                (levelButton as Label).setText(lev + "\n(Locked)");
                levelButton.onClick = () => {
                    const tempRect = new Rect(new Vec2(500, 500), new Vec2(800, 400));
                    tempRect.borderWidth = 2;
                    tempRect.borderColor = new Color(14, 18, 55);
                    tempRect.color = new Color(21, 27, 84);
                    this.level.addNode(tempRect);
                
                    const tempLabel = <Label>this.add.uiElement(UIElementType.LABEL, "levelSelect", {
                        position: new Vec2(500, 500),
                        text: `You should clear Level ${index}!`
                    });
                    tempLabel.textColor = Color.WHITE;

                    setTimeout(() => {
                        this.level.removeNode(tempRect);
                        tempLabel.destroy();
                    }, 1000);
                }
            }
        });

        const levelBack = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {position: new Vec2(center.x, center.y + 320), text: "Back"});
        (levelBack as Label).setTextColor(Color.WHITE);
        levelBack.size.set(200, 100);
        levelBack.backgroundColor = Color.TRANSPARENT;
        levelBack.onClickEventId = "menu";

        // Controls screen
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const controlPhoto = this.add.sprite("backgroundImage", "controls");
        controlPhoto.position.set(center.x, center.y);

        const controlBack = new Rect(new Vec2(center.x , center.y - 20), new Vec2(400, 420));
        controlBack.borderWidth = 2;
        controlBack.borderColor = this.steelBlueBorder;
        controlBack.color = this.steelBlue;
        this.controls.addNode(controlBack);

        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 200), text: "Controls"});
        header.textColor = Color.CYAN;

        const w = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 150), text: "W : Move Up  "});
        const s = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 100), text: "S : Move Down"});
        const a = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 50), text: "A : Move Left"});
        const d = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y ), text: " D : Move Right"});
        const q = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 50 ), text: "  E : Pickup Item"});
        const e = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 100), text: "Q : Drop Item"});
        const sh = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 150), text: "Shift : Run  "});
        w.textColor = Color.WHITE;
        s.textColor = Color.WHITE;
        a.textColor = Color.WHITE;
        d.textColor = Color.WHITE;
        q.textColor = Color.WHITE;
        e.textColor = Color.WHITE;
        sh.textColor = Color.WHITE;


        const back = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        (back as Label).setTextColor(Color.WHITE);
        back.size.set(200, 100);
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "menu";

        // Guide screen
        this.guide = this.addUILayer("guide");
        this.guide.setHidden(true);

        const guidePhoto = this.add.sprite("backgroundImage", "guide");
        guidePhoto.position.set(center.x, center.y);

        const guideRect = new Rect(new Vec2(center.x , center.y - 60), new Vec2(800, 800));
        guideRect.borderWidth = 2;
        guideRect.borderColor = this.steelBlueBorder;
        guideRect.color = this.steelBlue;
        this.guide.addNode(guideRect);

        const guideHeader = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 410), text: "Guide"});
        guideHeader.textColor = Color.CYAN;

        const guideText1 = "  Pick up seeds and place them on your ground.  ";
        const guideText2 = "  You have 90 seconds to prevent your farm      ";
        const guideText3 = "  from being destroyed.                         ";
        const guideText4 = "  Once you destory all the monsters, you can    ";
        const guideText5 = "  move on to the next level.                    ";
        const guideText6 = "  You can upgrade your turrets using the money  ";
        const guideText7 = "  you earn.                                     ";
        const guideText8 = "  Turrets with silver and gold stars are        ";
        const guideText9 = "  stronger than the normal ones.                ";
        const guideText10 = "  Tomato < Watermelon < Peach < Lemon            ";

        const guideLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 350), text: guideText1});
        const guideLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 300), text: guideText2});
        const guideLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 250), text: guideText3});
        const guideLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 200), text: guideText4});
        const guideLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 150), text: guideText5});
        const guideLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 100), text: guideText6});
        const guideLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 50), text: guideText7});
        const guideLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y), text: guideText8});
        const guideLine9 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 50), text: guideText9});
        const guideLine10 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 100), text: guideText10});
        guideLine1.textColor = Color.WHITE; guideLine1.fontSize = 24;
        guideLine2.textColor = Color.WHITE; guideLine2.fontSize = 24;
        guideLine3.textColor = Color.WHITE; guideLine3.fontSize = 24;
        guideLine4.textColor = Color.WHITE; guideLine4.fontSize = 24;
        guideLine5.textColor = Color.WHITE; guideLine5.fontSize = 24;
        guideLine6.textColor = Color.WHITE; guideLine6.fontSize = 24;
        guideLine7.textColor = Color.WHITE; guideLine7.fontSize = 24;
        guideLine8.textColor = Color.WHITE; guideLine8.fontSize = 24;
        guideLine9.textColor = Color.WHITE; guideLine9.fontSize = 24;
        guideLine10.textColor = Color.WHITE; guideLine10.fontSize = 24;

        const guideBack = this.add.uiElement(UIElementType.BUTTON, "guide", {position: new Vec2(center.x, center.y + 400), text: "Back"});
        (guideBack as Label).setTextColor(Color.WHITE);
        guideBack.size.set(200, 100);
        guideBack.backgroundColor = Color.TRANSPARENT;
        guideBack.onClickEventId = "menu";

        // Info screen
        this.help = this.addUILayer("help");
        this.help.setHidden(true);

        const helpPhoto = this.add.sprite("backgroundImage", "help");
        helpPhoto.position.set(center.x, center.y);


        // Story
        const storyRect = new Rect(new Vec2(center.x , center.y - 280), new Vec2(1000, 410));
        storyRect.borderWidth = 2;
        storyRect.borderColor = this.steelBlueBorder;
        storyRect.color = this.steelBlue;
        this.help.addNode(storyRect);

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 450), text: "Story"});
        helpHeader.textColor = Color.CYAN;

        const text1 = "  One day, strange things began happening around a peaceful       ";
        const text2 = "village, accompanied by unusual sounds from the forest behind it. ";
        const text3 = "New, unidentified types of insects ravaging crops and damaging    ";
        const text4 = "farms. These insects seemed to possess mysterious energy, becoming";
        const text5 = "larger and more menacing under the moonlight. Kevin decided to    ";
        const text6 = "transform the harvested crops into defense towers to protect the  ";
        const text7 = "village. Will Kevin be able to protect his farm and village?      ";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 400), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 350), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 300), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 250), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 200), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 150), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 100), text: text7});

        line1.textColor = Color.WHITE; line1.fontSize = 22;
        line2.textColor = Color.WHITE; line2.fontSize = 22;
        line3.textColor = Color.WHITE; line3.fontSize = 22;
        line4.textColor = Color.WHITE; line4.fontSize = 22;
        line5.textColor = Color.WHITE; line5.fontSize = 22;
        line6.textColor = Color.WHITE; line6.fontSize = 22;
        line7.textColor = Color.WHITE; line7.fontSize = 22;

        // Development Team
        const teamRect = new Rect(new Vec2(center.x , center.y + 5), new Vec2(1000, 130));
        teamRect.borderWidth = 2;
        teamRect.borderColor = this.steelBlueBorder;
        teamRect.color = this.steelBlue;
        this.help.addNode(teamRect);

        const devTeam = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 25), text: "Development Team"});
        devTeam.textColor = Color.CYAN;

        const devTeamName = "Developed by Taeyoung Kim, Hyomin Kim, and Minwoo Son"
        const devTeamLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 30), text: devTeamName});
        devTeamLine1.textColor = Color.WHITE;  devTeamLine1.fontSize = 24;

        // Cheat Codes
        const cheatRect = new Rect(new Vec2(center.x , center.y + 200 ), new Vec2(1000, 240));
        cheatRect.borderWidth = 2;
        cheatRect.borderColor = this.steelBlueBorder;
        cheatRect.color = this.steelBlue;
        this.help.addNode(cheatRect);

        const Cheat = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 110), text: "Cheat Codes"});
        Cheat.textColor = Color.CYAN;

        const cheat1 = "A single number: Level Select";
        const cheat2 = "UNLOCK: Unlock all levels";
        const cheat3 = "INVISIBLE: Become invisible";
        const cheat4 = "VISIBLE: Become visible";

        const cheatname1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 160), text: cheat1});
        const cheatname2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 200), text: cheat2});
        const cheatname3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 240), text: cheat3});
        const cheatname4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 280), text: cheat4});
        cheatname1.textColor = Color.WHITE; cheatname1.fontSize = 24;
        cheatname2.textColor = Color.WHITE; cheatname2.fontSize = 24;
        cheatname3.textColor = Color.WHITE;  cheatname3.fontSize = 24;
        cheatname4.textColor = Color.WHITE;  cheatname4.fontSize = 24;

        // Back button
        const helpBack = this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y + 370), text: "Back"});
        (helpBack as Label).setTextColor(Color.WHITE);
        helpBack.size.set(200, 100);
        helpBack.backgroundColor = Color.TRANSPARENT;
        helpBack.onClickEventId = "menu";


        // Subscribe to the button events
        this.receiver.subscribe("play");
        this.receiver.subscribe("control");
        this.receiver.subscribe("help");
        this.receiver.subscribe("menu");
        this.receiver.subscribe("click");
        this.receiver.subscribe("level1");
        this.receiver.subscribe("level2");
        this.receiver.subscribe("level3");
        this.receiver.subscribe("level4");
        this.receiver.subscribe("level5");
        this.receiver.subscribe("level6");
        this.receiver.subscribe("guide");
    }

    public updateScene(deltaT : number){
        if (Input.isMouseJustPressed() && this.splash.isHidden() == false) {
            this.splash.setHidden(true);
            this.mainMenu.setHidden(false);
        }
        
        while(this.receiver.hasNextEvent()){
            this.handleEvent(this.receiver.getNextEvent());
        }
    }

    public handleEvent(event: GameEvent): void {
        switch(event.type) {
            case "play": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});

                this.mainMenu.setHidden(true);
                this.level.setHidden(false);
                // this.sceneManager.changeToScene(MainScene);
                break;
            }
            case "control": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.mainMenu.setHidden(true);
                this.controls.setHidden(false);
                break;
            }
            case "help": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.mainMenu.setHidden(true);
                this.help.setHidden(false);
                break;
            }
            case "menu": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.controls.setHidden(true);
                this.guide.setHidden(true);
                this.level.setHidden(true);
                this.help.setHidden(true);
                this.mainMenu.setHidden(false);
                break;
            }
            case "guide": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.mainMenu.setHidden(true);
                this.guide.setHidden(false);
                break;
            }
            case "level1": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});

                this.sceneManager.changeToScene(Level1);
                break;
            }
            case "level2": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.sceneManager.changeToScene(Level2);
                break;
            }
            case "level3": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});

                this.sceneManager.changeToScene(Level3);
                break;
            }
            case "level4": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});

                this.sceneManager.changeToScene(Level4);
                break;
            }
            case "level5": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});

                this.sceneManager.changeToScene(Level5);
                break;
            }
            case "level6": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.sceneManager.changeToScene(Level6);
                break;
            }
        }
        
    }

    unloadScene(): void {
        // The scene is being destroyed, so we can stop playing the song
        // this.emitter.fireEvent(GameEventType.STOP_SOUND, {key: "bgm"});
    }
    
}