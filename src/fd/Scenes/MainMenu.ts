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

        this.load.image("controlsImage", "fd_assets/sprites/400420.png");
        this.load.image("tutorialImage", "fd_assets/sprites/450350.png");
        this.load.image("tutorialImageTwo", "fd_assets/sprites/700700.png");
        this.load.image("storyImage", "fd_assets/sprites/1000410.png");
        this.load.image("devImage", "fd_assets/sprites/1000130.png");
        this.load.image("cheatImage", "fd_assets/sprites/1000240.png");
        this.load.image("levelImage", "fd_assets/sprites/250200.png");

        this.load.image("monsterA" , "fd_assets/sprites/monsterA.png");
        this.load.image("monsterB" , "fd_assets/sprites/monsterB.png");
        this.load.image("monsterC" , "fd_assets/sprites/monsterC.png");

        this.load.image("tomato", "fd_assets/sprites/tomato.png");
        this.load.image("watermelon", "fd_assets/sprites/watermelon.png");
        this.load.image("peach", "fd_assets/sprites/peach.png");
        this.load.image("lemon", "fd_assets/sprites/lemon.png");

        this.load.audio("bgm", "fd_assets/sounds/main_menu_music.mp3");
        this.load.audio("click", "fd_assets/sounds/main_menu_button.mp3");
    }

    public startScene(){
        // Play the background music
        this.emitter.fireEvent("play_music", {key: "bgm", loop: true, holdReference: true});

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

        // Add version number in the right bottom
        const version = <Label>this.add.uiElement(UIElementType.LABEL, "splash", {position: new Vec2(center.x + 430, center.y + 440), text: "v1.0"});
        version.textColor = Color.WHITE;
        (version as Label).fontSize = 25;


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
        (play as Label).fontSize = 30;
        console.log((play as Label).getFontString())
        play.size.set(300, 100);
        play.borderWidth = 2;
        play.backgroundColor = Color.TRANSPARENT;
        play.onClickEventId = "play";


        // Add Controls button
        const controls = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y - 30), text: "CONTROLS"});
        (controls as Label).setTextColor(Color.WHITE);
        (controls as Label).fontSize = 30;
        controls.size.set(200, 50);
        controls.borderWidth = 0;
        controls.backgroundColor = Color.TRANSPARENT;
        controls.onClickEventId = "control";


        // Add Guide button
        const guide = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 110), text: "GUIDE"});
        (guide as Label).setTextColor(Color.WHITE);
        (guide as Label).fontSize = 30;
        guide.size.set(200, 50);
        guide.borderWidth = 0;
        guide.backgroundColor = Color.TRANSPARENT;
        guide.onClickEventId = "tutorial";

        // Add Info button
        const info = this.add.uiElement(UIElementType.BUTTON, "mainMenu", {position: new Vec2(center.x, center.y + 250), text: "INFO"});
        (info as Label).setTextColor(Color.WHITE);
        (info as Label).fontSize = 30;
        info.size.set(200, 50);
        info.borderWidth = 0;
        info.backgroundColor = Color.TRANSPARENT;
        info.onClickEventId = "help";


        // Level selection screen
        const levelColor = new Color(120,181,149);
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
        
            const levelRect = this.add.sprite("levelImage", "levelSelect");
            levelRect.position.set(xPosition, yPosition);
        
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
                (levelButton as Label).setTextColor(new Color(204, 204, 204)); 
                (levelButton as Label).fontSize = 25;
                (levelButton as Label).setText(lev + "\n(Locked)");
                levelButton.onClick = () => {
                    const tempRect = new Rect(new Vec2(500, 500), new Vec2(800, 400));
                    tempRect.borderWidth = 3;
                    tempRect.borderColor = Color.WHITE;
                    tempRect.color = levelColor
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

        const controlBack = this.add.sprite("controlsImage", "controls");
        controlBack.position.set(center.x, center.y - 22);

        // const controlBack2 = new Rect(new Vec2(center.x , center.y - 20), new Vec2(390, 410));
        // controlBack2.borderWidth = 0;
        // controlBack2.color = Color.WHITE;
        // this.controls.addNode(controlBack2);

        // const controlBack3 = new Rect(new Vec2(center.x , center.y - 20), new Vec2(380, 400));
        // controlBack3.borderWidth = 0;
        // controlBack3.color = new Color(120,181,149);
        // this.controls.addNode(controlBack3);

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


        const guideRect = this.add.sprite("tutorialImageTwo", "guide");
        guideRect.position.set(center.x, center.y);

        const guideHeader = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 300), text: "HOW TO PLAY"});
        guideHeader.textColor = Color.CYAN;

        const guideText1 = "  Pick up seeds and place them on your field.  ";
        const guideText2 = "  You have 60 seconds to prevent your farm      ";
        const guideText3 = "  from being destroyed by monsters.             ";
        const guideText4 = "  Once you destory all the monsters, you can    ";
        const guideText5 = "  move on to the next level.                    ";
        const guideText6 = "  You can upgrade your turrets using the money  ";
        const guideText7 = "  you earn.                                     ";
        const guideText8 = "  Turrets with silver and gold stars are        ";
        const guideText9 = "  stronger than the normal ones.                ";
        // const guideText10 = "  Tomato < Watermelon < Peach < Lemon            ";

        const guideLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 240), text: guideText1});
        const guideLine2 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 190), text: guideText2});
        const guideLine3 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 140), text: guideText3});
        const guideLine4 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 90), text: guideText4});
        const guideLine5 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y - 40), text: guideText5});
        const guideLine6 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 10), text: guideText6});
        const guideLine7 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 60), text: guideText7});
        const guideLine8 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 110), text: guideText8});
        const guideLine9 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 160), text: guideText9});
        //const guideLine10 = <Label>this.add.uiElement(UIElementType.LABEL, "guide", {position: new Vec2(center.x, center.y + 210), text: guideText10});
        guideLine1.textColor = Color.WHITE; guideLine1.fontSize = 28;
        guideLine2.textColor = Color.WHITE; guideLine2.fontSize = 28;
        guideLine3.textColor = Color.WHITE; guideLine3.fontSize = 28;
        guideLine4.textColor = Color.WHITE; guideLine4.fontSize = 28;
        guideLine5.textColor = Color.WHITE; guideLine5.fontSize = 28;
        guideLine6.textColor = Color.WHITE; guideLine6.fontSize = 28;
        guideLine7.textColor = Color.WHITE; guideLine7.fontSize = 28;
        guideLine8.textColor = Color.WHITE; guideLine8.fontSize = 28;
        guideLine9.textColor = Color.WHITE; guideLine9.fontSize = 28;
        //guideLine10.textColor = Color.WHITE; guideLine10.fontSize = 28;

        const guideBack = this.add.uiElement(UIElementType.BUTTON, "guide", {position: new Vec2(center.x, center.y + 400), text: "Back"});
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
        const storyRect = this.add.sprite("storyImage", "help");
        storyRect.position.set(center.x, center.y - 281);

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
        const line7 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 110), text: text7});

        line1.textColor = Color.WHITE; line1.fontSize = 22;
        line2.textColor = Color.WHITE; line2.fontSize = 22;
        line3.textColor = Color.WHITE; line3.fontSize = 22;
        line4.textColor = Color.WHITE; line4.fontSize = 22;
        line5.textColor = Color.WHITE; line5.fontSize = 22;
        line6.textColor = Color.WHITE; line6.fontSize = 22;
        line7.textColor = Color.WHITE; line7.fontSize = 22;

        // Development Team
        const teamRect = this.add.sprite("devImage", "help");
        teamRect.position.set(center.x, center.y);

        const devTeam = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y - 25), text: "Development Team"});
        devTeam.textColor = Color.CYAN;

        const devTeamName = "Developed by Taeyoung Kim, Hyomin Kim, and Minwoo Son"
        const devTeamLine1 = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 30), text: devTeamName});
        devTeamLine1.textColor = Color.WHITE;  devTeamLine1.fontSize = 24;

        // Cheat Codes
        const cheatRect = this.add.sprite("cheatImage", "help");
        cheatRect.position.set(center.x, center.y + 200);

        const Cheat = <Label>this.add.uiElement(UIElementType.LABEL, "help", {position: new Vec2(center.x, center.y + 110), text: "Cheat Codes"});
        Cheat.textColor = Color.CYAN;

        const cheat1 = "A single number: Level Select";
        const cheat2 = "UNLOCK: Unlock all levels";
        const cheat3 = "INVISIBLE: Become invisible, VISIBLE: Become visible";
        const cheat4 = "MONEY : Currnet money + 10000";

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

        const tutorialRect = this.add.sprite("tutorialImage", "tutorial");
        tutorialRect.position.set(center.x, center.y);

        //const tutorialHeader = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x, center.y - 430), text: "TUTORIAL"});
        //tutorialHeader.textColor = Color.BLACK;

        const toGuideButton = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y - 100), text: "HOW TO PLAY"});
        (back as Label).setTextColor(Color.WHITE);
        toGuideButton.size.set(580, 100);
        toGuideButton.backgroundColor = Color.TRANSPARENT;
        toGuideButton.onClickEventId = "guide";

        const toMonsterButton = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y), text: "MONSTER DICTIONARY"});
        (back as Label).setTextColor(Color.WHITE);
        toMonsterButton.size.set(580, 100);
        toMonsterButton.backgroundColor = Color.TRANSPARENT;
        toMonsterButton.onClickEventId = "monster";

        const toPlantButton = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y + 100), text: "PLANT DICTIONARY"});
        (back as Label).setTextColor(Color.WHITE);
        toPlantButton.size.set(580, 100);
        toPlantButton.backgroundColor = Color.TRANSPARENT;
        toPlantButton.onClickEventId = "plant";

        const tutorialBack = this.add.uiElement(UIElementType.BUTTON, "tutorial", {position: new Vec2(center.x, center.y + 220), text: "Back"});
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

        const monsterRect = this.add.sprite("tutorialImageTwo", "monster");
        monsterRect.position.set(center.x, center.y);

        // const monsterRectHeader = <Label>this.add.uiElement(UIElementType.LABEL, "tutorial", {position: new Vec2(center.x, center.y - 430), text: "TUTORIAL"});
        // monsterRectHeader.textColor = Color.CYAN;

        // Monster B Dictionary
        const m1 = new Rect(new Vec2(center.x , center.y - 220), new Vec2(600, 170));
        m1.borderWidth = 2;
        m1.borderColor = Color.TRANSPARENT;
        m1.color = Color.WHITE;
        this.monster.addNode(m1);

        const monsterB = this.add.sprite("monsterB", "monster");
        monsterB.position.set(center.x - 220, center.y - 220);

        // Add text next to monsterB image
        const Btext1 = "Monster \"Blue Ball\"";
        const monsterBLabel = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y - 280), text: Btext1});
        monsterBLabel.textColor = Color.BLACK;
        monsterBLabel.fontSize = 25;

        const Btext2 = "Appears in: Level 1, Level 4";
        const monsterBLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y - 240), text: Btext2});
        monsterBLabel2.textColor = Color.BLACK;
        monsterBLabel2.fontSize = 22;

        const Btext3 = "Attack: 20 (Lvl 1), 50 (Lvl 4)";
        const monsterBLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y - 200), text: Btext3});
        monsterBLabel3.textColor = Color.BLACK;
        monsterBLabel3.fontSize = 22;

        const Btext4 = "Health: 36 (Lvl 1), 69 (Lvl 4)";
        const monsterBLabel4 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y - 160), text: Btext4});
        monsterBLabel4.textColor = Color.BLACK;
        monsterBLabel4.fontSize = 22;


        // Monster A Dictionary
        const m2 = new Rect(new Vec2(center.x , center.y), new Vec2(600, 170));
        m2.borderWidth = 2;
        m2.borderColor = Color.TRANSPARENT;
        m2.color = Color.WHITE;
        this.monster.addNode(m2);

        const monsterA = this.add.sprite("monsterA", "monster");
        monsterA.position.set(center.x - 220, center.y);

        // Add text next to monsterA image
        const Atext1 = "Monster \"Purple Slime\"";
        const monsterALabel = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y - 60), text: Atext1});
        monsterALabel.textColor = Color.BLACK;
        monsterALabel.fontSize = 25;

        const Atext2 = "Appears in: Level 2, Level 5";
        const monsterALabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y - 20), text: Atext2});
        monsterALabel2.textColor = Color.BLACK;
        monsterALabel2.fontSize = 22;

        const Atext3 = "Attack: 30 (Lvl 2), 160 (Lvl 5)";
        const monsterALabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y + 20), text: Atext3});
        monsterALabel3.textColor = Color.BLACK;
        monsterALabel3.fontSize = 22;

        const Atext4 = "Health: 42 (Lvl 2), 500 (Lvl 5)";
        const monsterALabel4 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y + 60), text: Atext4});
        monsterALabel4.textColor = Color.BLACK;
        monsterALabel4.fontSize = 22;


        // Monster C Dictionary
        const m3 = new Rect(new Vec2(center.x , center.y + 220), new Vec2(600, 170));
        m3.borderWidth = 2;
        m3.borderColor = Color.TRANSPARENT;
        m3.color = Color.WHITE;
        this.monster.addNode(m3);

        const monsterC = this.add.sprite("monsterC", "monster");
        monsterC.position.set(center.x - 220, center.y + 220);

        // Add text next to monsterC image
        const Ctext1 = "Monster \"Red Tripod\"";
        const monsterCLabel = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y + 160), text: Ctext1});
        monsterCLabel.textColor = Color.BLACK;
        monsterCLabel.fontSize = 25;

        const Ctext2 = "Appears in: Level 3, Level 6";
        const monsterCLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y + 200), text: Ctext2});
        monsterCLabel2.textColor = Color.BLACK;
        monsterCLabel2.fontSize = 22;

        const Ctext3 = "Attack: 40 (Lvl 3), 210 (Lvl 6)";
        const monsterCLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y + 240), text: Ctext3});
        monsterCLabel3.textColor = Color.BLACK;
        monsterCLabel3.fontSize = 22;

        const Ctext4 = "Health: 54 (Lvl 3), 500 (Lvl 6)";
        const monsterCLabel4 = <Label>this.add.uiElement(UIElementType.LABEL, "monster", {position: new Vec2(center.x + 65, center.y + 280), text: Ctext4});
        monsterCLabel4.textColor = Color.BLACK;
        monsterCLabel4.fontSize = 22;

        const monsterBack = this.add.uiElement(UIElementType.BUTTON, "monster", {position: new Vec2(center.x, center.y + 400), text: "Back"});
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

        const plantRect = this.add.sprite("tutorialImageTwo", "plant");
        plantRect.position.set(center.x, center.y);


        // Tomato Dictionary
        const plant1 = new Rect(new Vec2(center.x , center.y - 240), new Vec2(600, 140));
        plant1.borderWidth = 2;
        plant1.borderColor = Color.TRANSPARENT;
        plant1.color = Color.WHITE;
        this.plant.addNode(plant1);

        const tomatoImg = this.add.sprite("tomato", "plant");
        tomatoImg.position.set(center.x - 220, center.y - 240);

        // Add text next to tomato image
        const Ttext1 = "The Tenacious Tomato";
        const tomatoLabel = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y - 280), text: Ttext1});
        tomatoLabel.textColor = Color.BLACK;
        tomatoLabel.fontSize = 25;

        const Ttext2 = "Attack: 10 / 12 (Silver) / 14 (Gold)";
        const tomatoLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y - 240), text: Ttext2});
        tomatoLabel2.textColor = Color.BLACK;
        tomatoLabel2.fontSize = 22;

        const Ttext3 = "Health: 100, Cooldown: 2.0s/1.95s/1.9s";
        const tomatoLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y - 200), text: Ttext3});
        tomatoLabel3.textColor = Color.BLACK;
        tomatoLabel3.fontSize = 22;


        // Watermelon Dictionary
        const plant2 = new Rect(new Vec2(center.x , center.y - 80), new Vec2(600, 140));
        plant2.borderWidth = 2;
        plant2.borderColor = Color.TRANSPARENT;
        plant2.color = Color.WHITE;
        this.plant.addNode(plant2);

        const watermelonImg = this.add.sprite("watermelon", "plant");
        watermelonImg.position.set(center.x - 220, center.y - 80);

        // Add text next to watermelon image
        const Wtext1 = "The Wonderful Watermelon";
        const watermelonLabel = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y - 120), text: Wtext1});
        watermelonLabel.textColor = Color.BLACK;
        watermelonLabel.fontSize = 25;

        const Wtext2 = "Attack: 15 / 18 (Silver) / 21 (Gold)";
        const watermelonLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y - 80), text: Wtext2});
        watermelonLabel2.textColor = Color.BLACK;
        watermelonLabel2.fontSize = 22;

        const Wtext3 = "Health: 200, Cooldown: 2.0s/1.95s/1.9s";
        const watermelonLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y - 40), text: Wtext3});
        watermelonLabel3.textColor = Color.BLACK;
        watermelonLabel3.fontSize = 22;


        // Peach Dictionary
        const plant3 = new Rect(new Vec2(center.x , center.y + 80), new Vec2(600, 140));
        plant3.borderWidth = 2;
        plant3.borderColor = Color.TRANSPARENT;
        plant3.color = Color.WHITE;
        this.plant.addNode(plant3);

        const peachImg = this.add.sprite("peach", "plant");
        peachImg.position.set(center.x - 220, center.y + 80);

        // Add text next to peach image
        const Ptext1 = "The Pretty Peach";
        const peachLabel = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y + 40), text: Ptext1});
        peachLabel.textColor = Color.BLACK;
        peachLabel.fontSize = 25;

        const Ptext2 = "Attack: 23 / 27 (Silver) / 31 (Gold)";
        const peachLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y + 80), text: Ptext2});
        peachLabel2.textColor = Color.BLACK;
        peachLabel2.fontSize = 22;

        const Ptext3 = "Health: 150, Cooldown: 1.9s/1.8s/1.7s";
        const peachLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y + 120), text: Ptext3});
        peachLabel3.textColor = Color.BLACK;
        peachLabel3.fontSize = 22;


        // Lemon Dictionary
        const plant4 = new Rect(new Vec2(center.x , center.y + 240), new Vec2(600, 140));
        plant4.borderWidth = 2;
        plant4.borderColor = Color.TRANSPARENT;
        plant4.color = Color.WHITE;
        this.plant.addNode(plant4);

        const lemonImg = this.add.sprite("lemon", "plant");
        lemonImg.position.set(center.x - 220, center.y + 240);

        // Add text next to lemon image
        const Ltext1 = "The Lively Lemon";
        const lemonLabel = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y + 200), text: Ltext1});
        lemonLabel.textColor = Color.BLACK;
        lemonLabel.fontSize = 25;

        const Ltext2 = "Attack: 25";
        const lemonLabel2 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y + 240), text: Ltext2});
        lemonLabel2.textColor = Color.BLACK;
        lemonLabel2.fontSize = 22;

        const Ltext3 = "Health: 200, Cooldown: 1.5s/1.2s/0.9s";
        const lemonLabel3 = <Label>this.add.uiElement(UIElementType.LABEL, "plant", {position: new Vec2(center.x + 65, center.y + 280), text: Ltext3});
        lemonLabel3.textColor = Color.BLACK;
        lemonLabel3.fontSize = 22;


        const plantBack = this.add.uiElement(UIElementType.BUTTON, "plant", {position: new Vec2(center.x, center.y + 400), text: "Back"});
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
                this.emitter.fireEvent("stop_sound", {key: "bgm"});
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

    public unloadScene(): void {
        this.emitter.fireEvent("stop_sound", {key: "bgm"});
    }
    
}