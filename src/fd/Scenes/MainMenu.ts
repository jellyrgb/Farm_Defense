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
    private tutorial : Layer;
    private monster : Layer;
    private plant : Layer;
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


        // Main menu ==========================================================================================================================================

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
        const play = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 170), text: "GAME START"});
        (play as Label).setTextColor(Color.WHITE);
        (play as Label).fontSize = 26;
        console.log((play as Label).getFontString())
        play.size.set(300, 100);
        play.borderWidth = 2;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";


        // Add Controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 30), text: "CONROLS"});
        (controls as Label).setTextColor(Color.WHITE);
        (controls as Label).fontSize = 26;
        controls.size.set(200, 50);
        controls.borderWidth = 0;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "control";


        // Add Guide button
        const guide = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 110), text: "TUTORIAL"});
        (guide as Label).setTextColor(Color.WHITE);
        (guide as Label).fontSize = 26;
        guide.size.set(200, 50);
        guide.borderWidth = 0;
        guide.backgroundColor = Color.TRANSPARENT;
        guide.onClickEventId = "tutorial";

        // Add Info button
        const info = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "INFO"});
        (info as Label).setTextColor(Color.WHITE);
        (info as Label).fontSize = 26;
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


        const guideRect = new Rect(new Vec2(center.x , center.y), new Vec2(700, 700));
        guideRect.borderWidth = 0;
        guideRect.color = new Color(120,181,149);
        this.guide.addNode(guideRect);

        const guideRect2 = new Rect(new Vec2(center.x , center.y), new Vec2(680, 680));
        guideRect2.borderWidth = 0;
        guideRect2.color = Color.WHITE;
        this.guide.addNode(guideRect2);

        const guideRect3 = new Rect(new Vec2(center.x , center.y), new Vec2(670, 670));
        guideRect3.borderWidth = 0;
        guideRect3.color = new Color(120,181,149);
        this.guide.addNode(guideRect3);


        const guideHeader = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 300), text: "Guide"});
        guideHeader.textColor = Color.WHITE;

        const guideText1 = "  Pick up seeds and place them on your field.  ";
        const guideText2 = "  You have 90 seconds to prevent your farm      ";
        const guideText3 = "  from being destroyed by monsters.             ";
        const guideText4 = "  Once you destory all the monsters, you can    ";
        const guideText5 = "  move on to the next level.                    ";
        const guideText6 = "  You can upgrade your turrets using the money  ";
        const guideText7 = "  you earn.                                     ";
        //const guideText8 = "  Turrets with silver and gold stars are        ";
        //const guideText9 = "  stronger than the normal ones.                ";
        //const guideText10 = "  Tomato < Watermelon < Peach < Lemon            ";

        const guideLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 240), text: guideText1});
        const guideLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 190), text: guideText2});
        const guideLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 140), text: guideText3});
        const guideLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 90), text: guideText4});
        const guideLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 40), text: guideText5});
        const guideLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 10), text: guideText6});
        const guideLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 60), text: guideText7});
        //const guideLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 110), text: guideText8});
        //const guideLine9 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 160), text: guideText9});
        //const guideLine10 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 210), text: guideText10});
        guideLine1.textColor = Color.WHITE; guideLine1.fontSize = 24;
        guideLine2.textColor = Color.WHITE; guideLine2.fontSize = 24;
        guideLine3.textColor = Color.WHITE; guideLine3.fontSize = 24;
        guideLine4.textColor = Color.WHITE; guideLine4.fontSize = 24;
        guideLine5.textColor = Color.WHITE; guideLine5.fontSize = 24;
        guideLine6.textColor = Color.WHITE; guideLine6.fontSize = 24;
        guideLine7.textColor = Color.WHITE; guideLine7.fontSize = 24;
        //guideLine8.textColor = Color.WHITE; guideLine8.fontSize = 24;
        //guideLine9.textColor = Color.WHITE; guideLine9.fontSize = 24;
        //guideLine10.textColor = Color.WHITE; guideLine10.fontSize = 24;

        const guideBack = this.add.uiElement(UIElementType.BUTTON, "guide", {position: new Vec2(center.x, center.y + 300), text: "Back"});
        (guideBack as Label).setTextColor(Color.WHITE);
        guideBack.size.set(200, 100);
        guideBack.backgroundColor = Color.TRANSPARENT;
        guideBack.onClickEventId = "tutorial";

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


        // Tutorial menu ==========================================================================================================================================

        this.tutorial = this.addUILayer("tutorial");
        this.tutorial.setHidden(true);
        const tutorialBackground = this.add.sprite("backgroundImage", "tutorial");
        tutorialBackground.position.set(center.x, center.y);


        const rectColor = new Color(120,181,149);

        const tutorialRect = new Rect(new Vec2(center.x , center.y), new Vec2(700, 700));
        tutorialRect.borderWidth = 0;
        tutorialRect.color = rectColor;
        this.tutorial.addNode(tutorialRect);

        //const tutorialHeader = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x, center.y - 430), text: "TUTORIAL"});
        //tutorialHeader.textColor = Color.BLACK;

        const toGuide = new Rect(new Vec2(center.x , center.y - 220), new Vec2(600, 120));
        toGuide.borderWidth = 2;
        toGuide.borderColor = rectColor;
        toGuide.color = Color.WHITE;
        this.tutorial.addNode(toGuide);

        const toGuideText = new Rect(new Vec2(center.x , center.y - 220), new Vec2(580, 100));
        toGuideText.borderWidth = 0;
        toGuideText.color = rectColor;
        this.tutorial.addNode(toGuideText);

        const toGuideButton = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y - 220), text: "GUIDE"});
        (back as Label).setTextColor(Color.WHITE);
        toGuideButton.size.set(580, 100);
        toGuideButton.backgroundColor = Color.TRANSPARENT;
        toGuideButton.onClickEventId = "guide";

        const toMonster = new Rect(new Vec2(center.x , center.y - 40), new Vec2(600, 120));
        toMonster.borderWidth = 2;
        toMonster.borderColor = rectColor;
        toMonster.color = Color.WHITE;
        this.tutorial.addNode(toMonster);

        const toMonsterText = new Rect(new Vec2(center.x , center.y - 40), new Vec2(580, 100));
        toMonsterText.borderWidth = 0;
        toMonsterText.color = rectColor;
        this.tutorial.addNode(toMonsterText);

        const toMonsterButton = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y - 40), text: "MONSTER DICTIONARY"});
        (back as Label).setTextColor(Color.WHITE);
        toMonsterButton.size.set(580, 100);
        toMonsterButton.backgroundColor = Color.TRANSPARENT;
        toMonsterButton.onClickEventId = "monster";

        const toPlant = new Rect(new Vec2(center.x , center.y + 140), new Vec2(600, 120));
        toPlant.borderWidth = 2;
        toPlant.borderColor = rectColor;
        toPlant.color = Color.WHITE;
        this.tutorial.addNode(toPlant);

        const toPlantText = new Rect(new Vec2(center.x , center.y + 140), new Vec2(580, 100));
        toPlantText.borderWidth = 0;
        toPlantText.color = rectColor;
        this.tutorial.addNode(toPlantText);

        const toPlantButton = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y + 140), text: "PLANT DICTIONARY"});
        (back as Label).setTextColor(Color.WHITE);
        toPlantButton.size.set(580, 100);
        toPlantButton.backgroundColor = Color.TRANSPARENT;
        toPlantButton.onClickEventId = "plant";



        const tutorialBack = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y + 320), text: "Back"});
        (back as Label).setTextColor(Color.WHITE);
        tutorialBack.size.set(200, 100);
        tutorialBack.backgroundColor = Color.TRANSPARENT;
        tutorialBack.onClickEventId = "menu";

        // Tutorial End ==================================================================================================================================


        // Monster menu =========================================================================================================================================

        this.monster = this.addUILayer("monster");
        this.monster.setHidden(true);
        const monsterBackground = this.add.sprite("backgroundImage", "monster");
        monsterBackground.position.set(center.x, center.y);

        const monsterRect = new Rect(new Vec2(center.x , center.y), new Vec2(700, 700));
        monsterRect.borderWidth = 0;
        monsterRect.color = rectColor;
        this.monster.addNode(monsterRect);

        //const tutorialHeader = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x, center.y - 430), text: "TUTORIAL"});
        //tutorialHeader.textColor = Color.BLACK;

        const m1 = new Rect(new Vec2(center.x , center.y - 220), new Vec2(600, 120));
        m1.borderWidth = 2;
        m1.borderColor = rectColor;
        m1.color = Color.WHITE;
        this.monster.addNode(m1);

        const m12 = new Rect(new Vec2(center.x - 230 , center.y - 220), new Vec2(120, 100));
        m12.borderWidth = 0;
        m12.color = rectColor;
        this.monster.addNode(m12);

        const m13 = new Rect(new Vec2(center.x +65, center.y - 220), new Vec2(445, 100));
        m13.borderWidth = 0;
        m13.color = rectColor;
        this.monster.addNode(m13);

        const m2 = new Rect(new Vec2(center.x , center.y - 20), new Vec2(600, 120));
        m2.borderWidth = 2;
        m2.borderColor = rectColor;
        m2.color = Color.WHITE;
        this.monster.addNode(m2);

        const m22 = new Rect(new Vec2(center.x - 230 , center.y - 20), new Vec2(120, 100));
        m22.borderWidth = 0;
        m22.color = rectColor;
        this.monster.addNode(m22);

        const m23 = new Rect(new Vec2(center.x +65, center.y - 20), new Vec2(445, 100));
        m23.borderWidth = 0;
        m23.color = rectColor;
        this.monster.addNode(m23);


        const m3 = new Rect(new Vec2(center.x , center.y + 160), new Vec2(600, 120));
        m3.borderWidth = 2;
        m3.borderColor = rectColor;
        m3.color = Color.WHITE;
        this.monster.addNode(m3);

        const m32 = new Rect(new Vec2(center.x - 230 , center.y + 160), new Vec2(120, 100));
        m32.borderWidth = 0;
        m32.color = rectColor;
        this.monster.addNode(m32);

        const m33 = new Rect(new Vec2(center.x +65, center.y + 160), new Vec2(445, 100));
        m33.borderWidth = 0;
        m33.color = rectColor;
        this.monster.addNode(m33);







        const monsterBack = this.add.uiElement(UIElementType.BUTTON, "monster", {position: new Vec2(center.x, center.y + 320), text: "Back"});
        (back as Label).setTextColor(Color.WHITE);
        monsterBack.size.set(200, 100);
        monsterBack.backgroundColor = Color.TRANSPARENT;
        monsterBack.onClickEventId = "tutorial";

        // Monster End ==========================================================================================================================================


        // Plant menu ==========================================================================================================================================


        this.plant = this.addUILayer("plant");
        this.plant.setHidden(true);
        const plantBackground = this.add.sprite("backgroundImage", "plant");
        plantBackground.position.set(center.x, center.y);

        const plantRect = new Rect(new Vec2(center.x , center.y), new Vec2(700, 700));
        plantRect.borderWidth = 0;
        plantRect.color = rectColor;
        this.plant.addNode(plantRect);

        const plant1 = new Rect(new Vec2(center.x , center.y - 240), new Vec2(600, 120));
        plant1.borderWidth = 2;
        plant1.borderColor = rectColor;
        plant1.color = Color.WHITE;
        this.plant.addNode(plant1);

        const plant12 = new Rect(new Vec2(center.x - 230 , center.y - 240), new Vec2(120, 100));
        plant12.borderWidth = 0;
        plant12.color = rectColor;
        this.plant.addNode(plant12);

        const plant13 = new Rect(new Vec2(center.x +65, center.y - 240), new Vec2(445, 100));
        plant13.borderWidth = 0;
        plant13.color = rectColor;
        this.plant.addNode(plant13);

        const plant2 = new Rect(new Vec2(center.x , center.y - 100), new Vec2(600, 120));
        plant2.borderWidth = 2;
        plant2.borderColor = rectColor;
        plant2.color = Color.WHITE;
        this.plant.addNode(plant2);

        const plant22 = new Rect(new Vec2(center.x - 230 , center.y - 100), new Vec2(120, 100));
        plant22.borderWidth = 0;
        plant22.color = rectColor;
        this.plant.addNode(plant22);

        const plant23 = new Rect(new Vec2(center.x +65, center.y - 100), new Vec2(445, 100));
        plant23.borderWidth = 0;
        plant23.color = rectColor;
        this.plant.addNode(plant23);

        const plant3 = new Rect(new Vec2(center.x , center.y + 40), new Vec2(600, 120));
        plant3.borderWidth = 2;
        plant3.borderColor = rectColor;
        plant3.color = Color.WHITE;
        this.plant.addNode(plant3);

        const plant32 = new Rect(new Vec2(center.x - 230 , center.y + 40), new Vec2(120, 100));
        plant32.borderWidth = 0;
        plant32.color = rectColor;
        this.plant.addNode(plant32);

        const plant33 = new Rect(new Vec2(center.x +65, center.y + 40), new Vec2(445, 100));
        plant33.borderWidth = 0;
        plant33.color = rectColor;
        this.plant.addNode(plant33);


        const plant4 = new Rect(new Vec2(center.x , center.y + 180), new Vec2(600, 120));
        plant4.borderWidth = 2;
        plant4.borderColor = rectColor;
        plant4.color = Color.WHITE;
        this.plant.addNode(plant4);

        const plant42 = new Rect(new Vec2(center.x - 230 , center.y + 180), new Vec2(120, 100));
        plant42.borderWidth = 0;
        plant42.color = rectColor;
        this.plant.addNode(plant42);

        const plant43 = new Rect(new Vec2(center.x +65, center.y + 180), new Vec2(445, 100));
        plant43.borderWidth = 0;
        plant43.color = rectColor;
        this.plant.addNode(plant43);






        const plantBack = this.add.uiElement(UIElementType.BUTTON, "plant", {position: new Vec2(center.x, center.y + 320), text: "Back"});
        (back as Label).setTextColor(Color.WHITE);
        plantBack.size.set(200, 100);
        plantBack.backgroundColor = Color.TRANSPARENT;
        plantBack.onClickEventId = "tutorial";

        // Plant End ==========================================================================================================================================


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
        this.receiver.subscribe("monster");
        this.receiver.subscribe("plant");
        this.receiver.subscribe("tutorial");
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
            case "guide": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.tutorial.setHidden(true);
                this.guide.setHidden(false);
                break;
            }
            case "monster": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.tutorial.setHidden(true);
                this.monster.setHidden(false);
                break;
            }
            case "plant": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                this.tutorial.setHidden(true);
                this.plant.setHidden(false);
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
                this.tutorial.setHidden(true);
                this.mainMenu.setHidden(false);
                break;
            }
            case "tutorial": {
                // Play the click sound
                this.emitter.fireEvent("play_sound", {key: "click", loop: false, holdReference: false});
                
                if(!this.guide.isHidden()){
                    this.guide.setHidden(true);
                }
                if(!this.monster.isHidden()){
                    this.monster.setHidden(true);
                }
                if(!this.plant.isHidden()){
                    this.plant.setHidden(true);
                }
                this.mainMenu.setHidden(true);
                this.tutorial.setHidden(false);
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