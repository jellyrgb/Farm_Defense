import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Layer from "../../Wolfie2D/Scene/Layer";
import Scene from "../../Wolfie2D/Scene/Scene";
import Color from "../../Wolfie2D/Utils/Color";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Level1 from "./Level1";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
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
    private help: Layer;
    private level : Layer;


    public loadScene(){

        this.load.image("logo", "fd_assets/sprites/logo.png");
        this.load.image("title", "fd_assets/sprites/title.png");
        this.load.image("splash", "fd_assets/sprites/splash.png");
        this.load.image("backgroundImage", "fd_assets/sprites/background.png");
    }

    public startScene(){
        const center = this.viewport.getCenter();

        // Splash screen
        this.splash = this.addUILayer("splash");
        const backphoto = this.add.sprite("splash", "splash");
        backphoto.position.set(center.x, center.y)
        
        const splashLogo = this.add.sprite("logo", "splash");
        splashLogo.position.set(center.x, center.y - 400);

        const splashTitle = this.add.sprite("title", "splash");
        splashTitle.position.set(center.x, center.y - 330);

        const splashintext = "Touch To Start"
        const splashTetxt = <Label>this.add.uiElement(UIElementType.LABEL, "splash", {position: new Vec2(center.x, center.y + 300), text: splashintext});
        splashTetxt.fontSize = 35;
        

        // main menu
        this.mainMenu = this.addUILayer("mainMenu");
        this.mainMenu.setHidden(true);

        const photo = this.add.sprite("backgroundImage", "mainMenu");
        photo.position.set(center.x, center.y);

        const logo = this.add.sprite("logo", "mainMenu");
        logo.position.set(center.x, center.y - 400);

        const title = this.add.sprite("title", "mainMenu");
        title.position.set(center.x, center.y - 330);


        const backgroundStart = new Rect(new Vec2(center.x , center.y - 180), new Vec2(300, 90));
        backgroundStart.color = new Color(192, 192, 192);
        backgroundStart.borderWidth = 1;
        backgroundStart.borderColor = new Color(128, 128, 128);
        this.mainMenu.addNode(backgroundStart);


        //Add start button
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 180), text: "GAME START"});
        (play as Label).setTextColor(Color.BLACK);
        console.log((play as Label).getFontString())
        play.size.set(300, 100);
        play.borderWidth = 0;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";


        

        const backControl = new Rect(new Vec2(center.x , center.y + 20), new Vec2(300, 90));
        backControl.color = new Color(192, 192, 192);
        backControl.borderWidth = 1;
        backControl.borderColor = new Color(128, 128, 128);
        this.mainMenu.addNode(backControl);


        // Add controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 20), text: "Controls"});
        (controls as Label).setTextColor(Color.BLACK);
        controls.size.set(200, 50);
        controls.borderWidth = 0;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "control";


        // add help background and help button 
        const backHelp = new Rect(new Vec2(center.x , center.y + 220), new Vec2(300, 90));
        backHelp.color = new Color(192, 192, 192);
        backHelp.borderWidth = 1;
        backHelp.borderColor = new Color(128, 128, 128);
        this.mainMenu.addNode(backHelp);

        const help = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 220), text: "HELP"});
        (help as Label).setTextColor(Color.BLACK);
        help.size.set(200, 50);
        help.borderWidth = 0;
        help.backgroundColor = Color.TRANSPARENT;
        help.onClickEventId = "help";


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
            levelRect.color = new Color(153, 153, 255, 0.9);
            levelRect.borderWidth = 1;
            levelRect.borderColor = new Color(128, 128, 128);
            this.level.addNode(levelRect);
        
            const levelButton = this.add.uiElement(UIElementType.BUTTON, "levelSelect", {
                position: new Vec2(xPosition, yPosition),
                text: lev            
            });
        
            levelButton.size.set(250, 200);
            (levelButton as Label).setTextColor(Color.WHITE);
            levelButton.backgroundColor = Color.TRANSPARENT;
            levelButton.onClickEventId = "level" + (index + 1);
        });

        // Controls screen
        this.controls = this.addUILayer("controls");
        this.controls.setHidden(true);

        const controlPhoto = this.add.sprite("backgroundImage", "controls");
        controlPhoto.position.set(center.x, center.y);

        const controlBack = new Rect(new Vec2(center.x , center.y - 20), new Vec2(400, 420));
        controlBack.borderWidth = 2;
        controlBack.borderColor = new Color(128, 128, 128);
        controlBack.color = new Color(192, 192, 192);
        this.controls.addNode(controlBack);

        const header = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 200), text: "CONTROL"});
        header.textColor = Color.BLACK;


        const w = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 150), text: "W : Move Up  "});
        const s = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 100), text: "S : Move Down"});
        const a = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y - 50), text: "A : Move Left"});
        const d = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y ), text: " D : Move Right"});
        const q = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 50 ), text: "  E : Pickup Item"});
        const e = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 100), text: "Q : Drop Item"});
        const sh = <Label>this.add.uiElement(UIElementType.LABEL, "controls", {position: new Vec2(center.x, center.y + 150), text: "Shift : Run  "});
        w.textColor = new Color(102, 102, 255);
        s.textColor = new Color(102, 102, 255);
        a.textColor = new Color(102, 102, 255);
        d.textColor = new Color(102, 102, 255);
        q.textColor = new Color(102, 102, 255);
        e.textColor = new Color(102, 102, 255);
        sh.textColor = new Color(102, 102, 255);


        const back = this.add.uiElement(UIElementType.BUTTON, "controls", {position: new Vec2(center.x, center.y + 250), text: "Back"});
        (back as Label).setTextColor(Color.BLACK);
        back.size.set(200, 100);
        back.backgroundColor = Color.TRANSPARENT;
        back.onClickEventId = "menu";


        // About screen
        this.help = this.addUILayer("help");
        this.help.setHidden(true);


        const helpPhoto = this.add.sprite("backgroundImage", "help");
        helpPhoto.position.set(center.x, center.y);


        const storyRect = new Rect(new Vec2(center.x , center.y - 280), new Vec2(1000, 410));
        storyRect.borderWidth = 2;
        storyRect.borderColor = new Color(128, 128, 128);
        storyRect.color = new Color(192, 192, 192);
        this.help.addNode(storyRect);

        const helpHeader = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 450), text: "Story"});
        helpHeader.textColor = new Color(102, 102, 255);

        const text1 = "One day, strange things began happening around a peaceful village,";
        const text2 = "accompanied by unusual sounds from the forest behind it. New,     ";
        const text3 = "unidentified types of insects ravaging crops and damaging farms.  ";
        const text4 = "These insects seemed to possess mysterious energy, becoming larger";
        const text5 = "and more menacing under the moonlight. Kevin decided to transform ";
        const text6 = "the harvested crops into defense towers to protect the village.   ";
        const text7 = "Will Kevin be able to protect his farm and village ?              ";

        const line1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 400), text: text1});
        const line2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 350), text: text2});
        const line3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 300), text: text3});
        const line4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 250), text: text4});
        const line5 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 200), text: text5});
        const line6 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 150), text: text6});
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 100), text: text7});

        line1.textColor = Color.BLACK; line1.fontSize=22;line2.textColor = Color.BLACK; line2.fontSize=22;
        line3.textColor = Color.BLACK; line3.fontSize=22;line4.textColor = Color.BLACK; line4.fontSize=22;
        line5.textColor = Color.BLACK; line5.fontSize=22;line6.textColor = Color.BLACK; line6.fontSize=22;
        line7.textColor = Color.BLACK; line7.fontSize=22;


        const teamRect = new Rect(new Vec2(center.x , center.y + 5), new Vec2(1000, 130));
        teamRect.borderWidth = 2;
        teamRect.borderColor = new Color(128, 128, 128);
        teamRect.color = new Color(192, 192, 192);
        this.help.addNode(teamRect);


        const DevelopmentTeam = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 25), text: "Development Team"});
        DevelopmentTeam.textColor = new Color(102, 102, 255);

        const name1 = "Developed by Taeyoung Kim, Hyomin Kim, Minwoo Son"
        const nameline1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 30), text: name1});
        nameline1.textColor = Color.BLACK;  nameline1.fontSize = 24;



        const cheatRect = new Rect(new Vec2(center.x , center.y + 200 ), new Vec2(1000, 240));
        cheatRect.borderWidth = 2;
        cheatRect.borderColor = new Color(128, 128, 128);
        cheatRect.color = new Color(192, 192, 192);
        this.help.addNode(cheatRect);

        const Cheat = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 110), text: "Cheat Code"});
        Cheat.textColor = new Color(102, 102, 255);

        const cheat1 = "SHOWMETHEMONEY : Money Max"
        const cheat2 = "ATTACK : Damage Max"
        const cheat3 = "IMNOTHURT : Defense Max"
        const cheat4 = "UNlOCK : Unlock all levels"

        const cheatname1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 160), text: cheat1});
        const cheatname2 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 200), text: cheat2});
        const cheatname3 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 240), text: cheat3});
        const cheatname4 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 280), text: cheat4});
        cheatname1.textColor = Color.BLACK; cheatname1.fontSize = 24;
        cheatname2.textColor = Color.BLACK; cheatname2.fontSize = 24;
        cheatname3.textColor = Color.BLACK;  cheatname3.fontSize = 24;
        cheatname4.textColor = Color.BLACK;  cheatname4.fontSize = 24;

        


        const helpBack = this.add.uiElement(UIElementType.BUTTON, "help", {position: new Vec2(center.x, center.y + 420), text: "Back"});
        (helpBack as Label).setTextColor(Color.BLACK);
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
                this.mainMenu.setHidden(true);
                this.level.setHidden(false);
                // this.sceneManager.changeToScene(MainScene);
                break;
            }
            case "control": {
                this.mainMenu.setHidden(true);
                this.controls.setHidden(false);
                break;
            }
            case "help": {
                this.mainMenu.setHidden(true);
                this.help.setHidden(false);
                break;
            }
            case "menu": {
                this.controls.setHidden(true);
                this.help.setHidden(true);
                this.mainMenu.setHidden(false);
                break;
            }
            case "level1": {
                console.log("1레벨 진입");
                this.sceneManager.changeToScene(Level1);
                break;
            }
            case "level2": {
                this.sceneManager.changeToScene(Level2);
                break;
            }
            case "level3": {
                this.sceneManager.changeToScene(Level3);
                break;
            }
            case "level4": {
                this.sceneManager.changeToScene(Level4);
                break;
            }
            case "level5": {
                this.sceneManager.changeToScene(Level5);
                break;
            }
            case "level6": {
                this.sceneManager.changeToScene(Level6);
                break;
            }
        }
    }
}