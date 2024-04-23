import PositionGraph from "../../Wolfie2D/DataTypes/Graphs/PositionGraph";
import Actor from "../../Wolfie2D/DataTypes/Interfaces/Actor";
import AABB from "../../Wolfie2D/DataTypes/Shapes/AABB";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import GameEvent from "../../Wolfie2D/Events/GameEvent";
import GameNode from "../../Wolfie2D/Nodes/GameNode";
import { GraphicType } from "../../Wolfie2D/Nodes/Graphics/GraphicTypes";
import Line from "../../Wolfie2D/Nodes/Graphics/Line";
import OrthogonalTilemap from "../../Wolfie2D/Nodes/Tilemaps/OrthogonalTilemap";
import Navmesh from "../../Wolfie2D/Pathfinding/Navmesh";
import DirectStrategy from "../../Wolfie2D/Pathfinding/Strategies/DirectStrategy";
import RenderingManager from "../../Wolfie2D/Rendering/RenderingManager";
import SceneManager from "../../Wolfie2D/Scene/SceneManager";
import Viewport from "../../Wolfie2D/SceneGraph/Viewport";
import Timer from "../../Wolfie2D/Timing/Timer";
import Color from "../../Wolfie2D/Utils/Color";
import MathUtils from "../../Wolfie2D/Utils/MathUtils";
import NPCActor from "../Actors/NPCActor";
import PlayerActor from "../Actors/PlayerActor";
import PlayerAI from "../AI/Player/PlayerAI";
import EnemyBehavior from "../AI/NPC/NPCBehavior/EnemyBehavior";
import { ItemEvent, PlayerEvent, BattlerEvent, CooldownEvent } from "../Events";
import Battler from "../GameSystems/BattleSystem/Battler";
import BattlerBase from "../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import InventoryHUD from "../GameSystems/HUD/InventoryHUD";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Item from "../GameSystems/ItemSystem/Item";
import Seed from "../GameSystems/ItemSystem/Items/Seed";
import Pearl from "../GameSystems/ItemSystem/Items/Pearl";
import Shop from "../GameSystems/ItemSystem/Items/Shop";
import { ClosestPositioned } from "../GameSystems/Searching/Reducers";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import Position from "../GameSystems/Targeting/Position";
import AstarStrategy from "../Pathfinding/AstarStrategy";
import Scene from "./Scene";
import Layer from "../../Wolfie2D/Scene/Layer";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";
import Label from "../../Wolfie2D/Nodes/UIElements/Label";
import Rect from "../../Wolfie2D/Nodes/Graphics/Rect";
import TextInput from "../../Wolfie2D/Nodes/UIElements/TextInput";
import TurretBehavior from "../AI/NPC/NPCBehavior/TurretBehavior";
import BaseBehavior from "../AI/NPC/NPCBehavior/BaseBehavior";
import Level2 from "../Scenes/Level2";
import Level3 from "../Scenes/Level3";
import Level4 from "../Scenes/Level4";
import Level5 from "../Scenes/Level5";
import Level6 from "../Scenes/Level6"; 
import GameOver from "./GameOver";

const BattlerGroups = {
    TURRET: 1,
    ENEMY: 2
} as const;

export default class Level1 extends Scene {

    /** GameSystems in the Scene */
    private inventoryHud: InventoryHUD;

    /** All the battlers in the Scene (including the player) */
    private battlers: (Battler & Actor)[];
    /** Healthbars for the battlers */
    private healthbars: Map<number, HealthbarHUD>;

    private seeds: Array<Seed>;
    private pearls: Array<Pearl>;

    private shop: Shop;
    private dollar: number;
    private shopMenu: Layer;

    // The wall layer of the tilemap
    private walls: OrthogonalTilemap;

    // The position graph for the navmesh
    private graph: PositionGraph;
    
    // pause menu layer
    private pauseMenu: Layer;

    private textInput: Layer;

    private blueEnemyCount: number;

    private turret: NPCActor;

    private enemyCount : Layer;

    private floors: OrthogonalTilemap;

    private timer : Layer;

    private night: boolean;

    private levelEnded: boolean;

    private baseId: number;
    private shopId: number;

    private enemyCountLabel: Label;

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();

        this.seeds = new Array<Seed>();
        this.pearls = new Array<Pearl>();
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // Load the player and enemy spritesheets
        this.load.spritesheet("player", "fd_assets/spritesheets/kevin.json");
        this.load.spritesheet("home", "fd_assets/spritesheets/home.json");

        // Load in the enemy sprites
        // this.load.spritesheet("monsterA", "fd_assets/spritesheets/monsterA.json");
        this.load.spritesheet("monsterB", "fd_assets/spritesheets/monsterB.json");
        // this.load.spritesheet("monsterC", "fd_assets/spritesheets/monsterC.json");

        // Load turret sprites
        this.load.spritesheet("turretA", "fd_assets/spritesheets/turretA.json");
        this.load.spritesheet("turretB", "fd_assets/spritesheets/turretB.json");
        this.load.spritesheet("turretC", "fd_assets/spritesheets/turretC.json");
        this.load.spritesheet("turretD", "fd_assets/spritesheets/turretD.json");

        this.load.spritesheet("turretAS", "fd_assets/spritesheets/turretAS.json");
        this.load.spritesheet("turretBS", "fd_assets/spritesheets/turretBS.json");
        this.load.spritesheet("turretCS", "fd_assets/spritesheets/turretCS.json");
        this.load.spritesheet("turretDS", "fd_assets/spritesheets/turretDS.json");

        this.load.spritesheet("turretAG", "fd_assets/spritesheets/turretAG.json");
        this.load.spritesheet("turretBG", "fd_assets/spritesheets/turretBG.json");
        this.load.spritesheet("turretCG", "fd_assets/spritesheets/turretCG.json");
        this.load.spritesheet("turretDG", "fd_assets/spritesheets/turretDG.json");

        this.load.image("monsterBLogo", "fd_assets/sprites/logoB.png")

        // Load the tilemap
        this.load.tilemap("level1", "fd_assets/tilemaps/level1.json");

        // Load the enemy locations
        this.load.object("enemy_location", "fd_assets/data/enemies/enemy_location.json");

        // Load the seed locations
        this.load.object("seeds", "fd_assets/data/items/seeds.json");
        this.load.object("shop", "fd_assets/data/items/shop.json");
        this.load.object("pearls", "fd_assets/data/items/pearls.json");

        // Load the image sprites
        this.load.image("seed", "fd_assets/sprites/seed.png");
        this.load.image("inventorySlot", "fd_assets/sprites/inventory.png");
        this.load.image("timer", "fd_assets/sprites/moon.png");
        this.load.image("shop", "fd_assets/sprites/shop.png");
        this.load.image("pearl", "fd_assets/sprites/pearl.png");

        // Load the sounds
        this.load.audio("background_music", "fd_assets/sounds/level1.mp3");
        this.load.audio("level_clear", "fd_assets/sounds/level_clear.mp3");
        this.load.audio("pause", "fd_assets/sounds/pause.mp3");
        this.load.audio("night_start", "fd_assets/sounds/night_start.mp3");

        this.load.audio("pick_up", "fd_assets/sounds/item_pick_up.mp3");
        this.load.audio("drop", "fd_assets/sounds/item_drop.mp3");
        this.load.audio("monster_attack", "fd_assets/sounds/monster_attack.mp3");

        this.load.audio("gold_star_lemon", "fd_assets/sounds/gold_star_lemon.mp3");
        this.load.audio("lemon_attack", "fd_assets/sounds/lemon_attack.mp3");
        this.load.audio("peach_attack", "fd_assets/sounds/peach.mp3");
        this.load.audio("watermelon_attack", "fd_assets/sounds/watermelon.mp3");
        this.load.audio("tomato_attack", "fd_assets/sounds/tomato.mp3");
    }

    /**
     * @see Scene.startScene
     */
    public override startScene() {
        // Play level1 background music
        this.emitter.fireEvent("play_sound", {key: "background_music", loop: true, holdReference: true});

        const center = this.viewport.getCenter();

        this.night = false;
        this.levelEnded = false;
        let enemy = this.load.getObject("enemy_location");
        this.blueEnemyCount = enemy.enemies.length;
        
        // Initialize the shop
        this.shopMenu = this.addUILayer("shop");
        this.shopMenu.setHidden(true);

        const shopLayer = this.getLayer("shop");
        const centerShop = new Vec2(200, 200);

        const shopBackground = new Rect(new Vec2(centerShop.x - 25, centerShop.y - 25), new Vec2(200, 200));
        shopBackground.color = new Color(0, 0, 0, 0.9);
        shopBackground.borderColor = new Color(255, 255, 255);
        shopBackground.borderWidth = 2;
        shopLayer.addNode(shopBackground);

        const buyButton = this.add.uiElement(UIElementType.BUTTON, "shop", {position: new Vec2(centerShop.x - 25, centerShop.y - 65),text: "Buy"});
        buyButton.size.set(60, 60);
        buyButton.onClickEventId = "buy";

        const sellButton = this.add.uiElement(UIElementType.BUTTON, "shop", {position: new Vec2(centerShop.x - 25, centerShop.y - 25),text: "Sell"});
        sellButton.size.set(60, 60);
        sellButton.onClickEventId = "sell";

        const exitButton = this.add.uiElement(UIElementType.BUTTON, "shop", {position: new Vec2(centerShop.x - 25, centerShop.y + 15), text: "Exit"});
        exitButton.size.set(60, 60);
        exitButton.onClickEventId = "exitShop";

        // pause menu initialize
        this.pauseMenu = this.addUILayer("pauseMenu");
        this.pauseMenu.setHidden(true);
    
        const pauseMenuLayer = this.getLayer("pauseMenu");
        const centerESC = new Vec2(200, 200);

        const menuBackground = new Rect(new Vec2(centerESC.x - 25, centerESC.y - 25), new Vec2(150, 150));
        menuBackground.color = new Color(0, 0, 0, 0.9);
        menuBackground.borderColor = new Color(255, 255, 255);
        menuBackground.borderWidth = 2;
        pauseMenuLayer.addNode(menuBackground);

        // Create buttons
        const resumeButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(centerESC.x - 25, centerESC.y - 65),text: "Resume"});
        resumeButton.size.set(60, 60);
        resumeButton.onClickEventId = "resumeGame";

        const cheatButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(centerESC.x - 25, centerESC.y - 25),text: "Cheat Code"});
        cheatButton.size.set(60, 60);
        cheatButton.onClickEventId = "cheat";

        const mainMenuButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(centerESC.x - 25, centerESC.y + 15),text: "Main Menu"});
        mainMenuButton.size.set(60, 60);
        mainMenuButton.onClickEventId = "backToMainMenu";
        
        // Cheat text input
        this.textInput = this.addUILayer("textInput");
        this.textInput.setHidden(true);

        const textInputLayer = this.getLayer("textInput");

        const background = new Rect(new Vec2(centerESC.x - 25, centerESC.y - 25), new Vec2(270, 200));
        background.color = new Color(0, 0, 0);
        background.borderColor = new Color(255, 255, 255);
        background.borderWidth = 2;
        textInputLayer.addNode(background);

        const inputText = this.add.uiElement(UIElementType.TEXT_INPUT, "textInput", {position: new Vec2(centerESC.x - 60 , centerESC.y - 30)});
        inputText.size.set(400, 80);

        const submitButton = this.add.uiElement(UIElementType.BUTTON, "textInput", {position: new Vec2(255, 170), text: "Submit"});
        submitButton.onClickEventId = "submitCheat";
        submitButton.backgroundColor = Color.TRANSPARENT;
        submitButton.size.set(90, 40);

        this.receiver.subscribe("resumeGame");
        this.receiver.subscribe("backToMainMenu");
        this.receiver.subscribe("cheat");
        this.receiver.subscribe("submitCheat");
        this.receiver.subscribe("growFinish");
        this.receiver.subscribe("exitShop");
        this.receiver.subscribe("buy");
        this.receiver.subscribe("sell");


        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level1");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];
        this.floors = <OrthogonalTilemap>tilemapLayers[0].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(3);

        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        
        this.initializeItems();

        this.initializeNavmesh();

        // Create the NPCS
        this.initializeNPCs();

        // Make sure every characters are behind "leaves" layer
        this.getLayer("primary").setDepth(0);
        this.getLayer("leaves").setDepth(1);

        this.enemyCount = this.addUILayer("enemyCount");
        this.enemyCount.setHidden(false);

        const monsterPhoto = this.add.sprite("monsterBLogo", "enemyCount");
        monsterPhoto.position.set(300, 10);

        this.enemyCountLabel = <Label>this.add.uiElement(UIElementType.LABEL, "enemyCount", {
            position: new Vec2(324, 10),
            text: "x " + this.blueEnemyCount
        });
        this.enemyCountLabel.setTextColor(Color.WHITE);
        this.enemyCountLabel.fontSize = 24;

        this.timer = this.addUILayer("timer");
        this.timer.setHidden(false);

        const moonPhoto = this.add.sprite("timer", "timer");
        moonPhoto.position.set(155,10);

        const timerLabel = this.add.uiElement(UIElementType.LABEL, "timer", { position: new Vec2(180, 10), text: "1:30" });
        (timerLabel as Label).setTextColor(Color.WHITE);
        (timerLabel as Label).fontSize = 24;
    
        let dayDuration = 90;
        let interval = setInterval(() => {
            let minutes = Math.floor(dayDuration / 60);
            let seconds = dayDuration % 60;

            // Pad the seconds with leading zeros
            let secondsString = String(seconds).padStart(2, '0');

            if (timerLabel) {
                (timerLabel as Label).setText(`${minutes}:${secondsString}`);
            }
        
            if (dayDuration <= 0) {
                clearInterval(interval);
                if (timerLabel) {
                    (timerLabel as Label).setText(" ");
                    setTimeout(() => {
                        if (timerLabel) {
                            timerLabel.destroy();
                            this.timer.setHidden(true);
                        }
                    }, 1000);
                }
                this.night = true;
            }
            dayDuration -= 1;
        }, 1000)


        // Subscribe to relevant events
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(ItemEvent.ITEM_REQUEST);
        this.receiver.subscribe(ItemEvent.ITEM_GROW_UP);
        this.receiver.subscribe(ItemEvent.ITEM_PICKED_UP);
        this.receiver.subscribe(ItemEvent.ITEM_DROPPED);
        this.receiver.subscribe(ItemEvent.FINISH_GROW_UP);

        // Add a UI for health
        this.addUILayer("health");

        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(PlayerEvent.SHOP_ENTERED);
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_RESPAWN);
        this.receiver.subscribe(BattlerEvent.BATTLER_ATTACK);
        this.receiver.subscribe(CooldownEvent.COOLDOWN_MESSAGE);
    }

    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {
        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }

        // If the player collides with the shop, emit an event
        let player1 = this.battlers.find(b => b instanceof PlayerActor) as PlayerActor;
        if (player1 && player1.position.distanceTo(this.shop.position) < 20) {
            this.emitter.fireEvent(PlayerEvent.SHOP_ENTERED, {});
        }

        for (let i = 0; i < this.battlers.length; i++) {
            for (let j = i + 1; j < this.battlers.length; j++) {
                if (this.battlers[i].id === this.baseId || this.battlers[j].id === this.baseId) {
                    continue;
                }

                // If they are same type of battlers and they are colliding
                if (this.battlers[i].battleGroup === this.battlers[j].battleGroup &&
                    this.collides(this.battlers[i], this.battlers[j])) {
                    // Resolve the collision by moving the monsters apart
                    this.resolveCollision(this.battlers[i], this.battlers[j]);
                }
            }
        }

        this.updateEnemyCountLabel();

        // Esc menu 
        if (Input.isKeyJustPressed("escape")) {    
            // Play pause sound
            this.emitter.fireEvent("play_sound", {key: "pause", loop: false, holdReference: false});

            this.pause();
            this.togglePauseMenu();
            if (!this.textInput.isHidden()) {
                this.CheatInput();
            }
        }

        this.preventEscape();

        this.inventoryHud.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));

        
        if (this.blueEnemyCount === 0 && this.night) {
            // Play level clear sound
            // Reduce the sound volume
            this.emitter.fireEvent("play_sound", {key: "level_clear", loop: false, holdReference: false});

            // Output the screen message: You have survived the night!
            const nightBackground = new Rect(new Vec2(180, 180), new Vec2(220, 180));
            nightBackground.color = new Color(0, 0, 0, 0.5);
            this.enemyCount.addNode(nightBackground);

            let message = this.add.uiElement(UIElementType.LABEL, "enemyCount", {position: new Vec2(180, 180), text: "You have survived the night!"});
            (message as Label).setTextColor(Color.WHITE);
            (message as Label).fontSize = 30;

            // Proceed to the next level after 3 seconds
            setTimeout(() => {
                MainMenu.maxLevelUnlocked = Math.max(MainMenu.maxLevelUnlocked, 2);
                this.viewport.setZoomLevel(1);
                this.sceneManager.changeToScene(MainMenu);
                // this.sceneManager.changeToScene(Level2);
            }, 3000);
        }

        let player = this.battlers.find(b => b instanceof PlayerActor) as PlayerActor;
        if (Input.isKeyJustPressed("y")){
            console.log("Player Pos:", player.position.x , player.position.y);
        }
    }
    private updateEnemyCountLabel() {
        if (this.enemyCountLabel) {
            this.enemyCountLabel.setText("x " + this.blueEnemyCount);
        }
    }
    private preventEscape(): void {
        // Prevent player escape from map
        let player = this.battlers.find(b => b instanceof PlayerActor) as PlayerActor;
        let currentPosition = player.position.clone();

        // Boundary
        const maxX = 512;
        const maxY = 960;
    
        let adjusted = false;
        if (currentPosition.x < 0) {
            currentPosition.x = 0;
            adjusted = true;
        } else if (currentPosition.x > maxX) {
            currentPosition.x = maxX;
            adjusted = true;
        }
        if (currentPosition.y < 0) {
            currentPosition.y = 0;
            adjusted = true;
        } else if (currentPosition.y > maxY) {
            currentPosition.y = maxY;
            adjusted = true;
        }

        if (adjusted) {
            player.position = currentPosition;
        }
    }

    private resolveCollision(a: Battler & Actor, b: Battler & Actor): void {
        // Since a and b are colliding, we need to move them apart
        let direction = a.position.dirTo(b.position);
        let move = direction.scaled(0.5);
        a.position.sub(move);
        b.position.add(move);
    }

    private collides(a: Battler & Actor, b: Battler & Actor): boolean {
        return a.position.distanceTo(b.position) < 20;
    }

    private togglePauseMenu(): void {
        const pauseMenuLayer = this.getLayer("pauseMenu");
        const isHidden = pauseMenuLayer.isHidden();

        if (!isHidden) {
            this.paused = false;
            pauseMenuLayer.setHidden(true);
        } 
        else {
            pauseMenuLayer.setHidden(false);
        }
    }

    private toggleShopMenu(): void {
        const requestedLayer = this.getLayer("shop");
        const isHidden = requestedLayer.isHidden();

        if (!isHidden) {
            requestedLayer.setHidden(true);
            console.log("Shop is now hidden")
        } 
        else {
            requestedLayer.setHidden(false);
            console.log("Shop is now not hidden")
        }
    }

    private handleBuy(event: GameEvent): void {
        console.log("Implemented Soon!");
    }

    private handleSell(event: GameEvent): void {
        console.log("Implemented Soon!!");
    }

    private CheatInput(): void {
        const textInputLayer = this.getLayer("textInput");
        const isHidden = textInputLayer.isHidden();

        if (!this.paused) {
            this.paused = true;
        }
        
        if (isHidden) {
            textInputLayer.setHidden(false);
        }
        else {
            textInputLayer.setHidden(true);
        }
    }
    
    public handleCheatSubmission(cheatCode: string): void {
        let player = this.battlers.find(b => b instanceof PlayerActor) as PlayerActor;
        console.log("Cheat code handling: ", cheatCode);
        if(cheatCode == "2"){
            this.sceneManager.changeToScene(Level2);
        }
        if(cheatCode == "3"){
            this.sceneManager.changeToScene(Level3);
        }
        if(cheatCode == "4"){
            this.sceneManager.changeToScene(Level4);
        }
        if(cheatCode == "5"){
            this.sceneManager.changeToScene(Level5);
        }
        if(cheatCode == "6") {
            this.sceneManager.changeToScene(Level6);
        }
        if(cheatCode == "UNLOCK"){
            MainMenu.maxLevelUnlocked = Math.max(MainMenu.maxLevelUnlocked, 6);
        }
        if(cheatCode == "INVISIBLE"){
            player.visible = false;
        }
        if(cheatCode == "VISIBLE"){
            player.visible = true;
        }

    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {

        switch (event.type) {
            case "resumeGame": {
                this.resume(); // resume the game
                this.togglePauseMenu(); // hide the pausemenu
                break;
            }
            case "backToMainMenu": {
                this.viewport.setZoomLevel(1);
                this.sceneManager.changeToScene(MainMenu); // go to main menu
                break;
            }
            case "cheat": {
                this.togglePauseMenu();
                this.CheatInput();
                break;
            }
            case "submitCheat": {
                const textInputLayer = this.getLayer("textInput");
                const textInputNode = textInputLayer.getItems().find(node => node instanceof TextInput) as TextInput;
                if (textInputNode) {
                    console.log("Cheat code submitted:", textInputNode.text);
                    this.handleCheatSubmission(textInputNode.text);
                    textInputNode.text = "";
                }
                break;
            }

            case ItemEvent.FINISH_GROW_UP: {
                if (this.turret) {
                    this.turret.animation.play("IDLE", true);
                }
                break;
            }

            // Shop Events
            case PlayerEvent.SHOP_ENTERED: {
                this.handleShopEntered(event);
                break;
            }
            case "exitShop": {
                this.toggleShopMenu();
                break;
            }
            case "buy": {
                this.handleBuy(event);
                break;
            }
            case "sell": {
                this.handleSell(event);
                break;
            }

            // Battle Events
            case BattlerEvent.BATTLER_KILLED: {
                this.handleBattlerKilled(event);
                break;
            }
            case BattlerEvent.BATTLER_RESPAWN: {
                break;
            }
            case BattlerEvent.BATTLER_ATTACK: {
                this.handleBattlerAttack(event);
                break;
            }


            case CooldownEvent.COOLDOWN_MESSAGE: {
                const remainingTime = event.data.get("remainingTime");  // 값을 가져올 때 get 메서드 사용
                this.showCooldownMessage(remainingTime);
                break;
            }
        
            // Item Events
            case ItemEvent.ITEM_REQUEST: {
                this.handleItemRequest(event.data.get("node"), event.data.get("inventory"));
                break;
            }
            case ItemEvent.ITEM_GROW_UP: {
                this.handleItemGrowUp(event);
                break;
            }
            case ItemEvent.ITEM_PICKED_UP: {
                this.handleItemPickedUp(event);
                break;
            }
            case ItemEvent.ITEM_DROPPED: {
                let node = event.data.get("node");
                let inventory = event.data.get("inventory");
                this.handleItemDropped(event, node, inventory);
                break;
            }

            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in event handler`);
            }

        }
    }

    protected handleBattlerAttack(event: GameEvent): void {
        let attacker = event.data.get("attacker");

        // If attack is a monster
        if (attacker.type === "monster") {
            // Play monster attack sound
            this.emitter.fireEvent("play_sound", {key: "monster_attack", loop: false, holdReference: false});
        } else {
            if (attacker.maxHealth === 100) {
                this.emitter.fireEvent("play_sound", {key: "tomato_attack", loop: false, holdReference: false});
            } else if (attacker.maxHealth === 150) {
                this.emitter.fireEvent("play_sound", {key: "watermelon_attack", loop: false, holdReference: false});
            } else if (attacker.maxHealth === 200) {
                this.emitter.fireEvent("play_sound", {key: "peach_attack", loop: false, holdReference: false});
            } else {
                this.emitter.fireEvent("play_sound", {key: "lemon_attack", loop: false, holdReference: false});
            }
        }
    }

    protected handleItemRequest(node: GameNode, inventory: Inventory): void {
        let items: Item[] = new Array<Item>(...this.seeds).filter((item: Item) => {
            return item.inventory === null && item.position.distanceTo(node.position) <= 20;
        });

        let pearls: Item[] = new Array<Item>(...this.pearls).filter((item: Item) => {
            return item.inventory === null && item.position.distanceTo(node.position) <= 20;
        });

        if (pearls.length > 0) {
            inventory.add(pearls.reduce(ClosestPositioned(node)));
        }

        if (items.length > 0) {
            inventory.add(items.reduce(ClosestPositioned(node)));
        }
    }

    protected handleItemGrowUp(event: GameEvent): void {
        let item = event.data.get("item");
        
        let name = "";
        let health = 0;
        let itemType = "";
        let itemStar = "";

        if (item.st === 1) {
            name = "turretA";
            health = 100;
            itemType = "tomato";
            itemStar = "normal";
        } else if (item.st === 2) {
            name = "turretAS";
            health = 100;
            itemType = "tomato";
            itemStar = "silver";
        } else if (item.st === 2) {
            name = "turretAG";
            health = 100;
            itemType = "tomato";
            itemStar = "gold";
        } else if (item.st === 4) {
            name = "turretB";
            health = 150;
            itemType = "watermelon";
            itemStar = "normal";
        } else if (item.st === 5) {
            name = "turretBS";
            health = 150;
            itemType = "watermelon";
            itemStar = "silver";
        } else if (item.st === 6) {
            name = "turretBG";
            health = 150;
            itemType = "watermelon";
            itemStar = "gold";
        } else if (item.st === 7) {
            name = "turretC";
            health = 200;
            itemType = "peach";
            itemStar = "normal";
        } else if (item.st === 8) {
            name = "turretCS";
            health = 200;
            itemType = "peach";
            itemStar = "silver";
        } else if (item.st === 9) {
            name = "turretCG";
            health = 200;
            itemType = "peach";
            itemStar = "gold";
        } else if (item.st === 10) {
            name = "turretD";
            health = 250;
            itemType = "lemon";
            itemStar = "normal";
        } else if (item.st === 11) {
            name = "turretDS";
            health = 250;
            itemType = "lemon";
            itemStar = "silver";
        } else {
            // Play gold star lemon sound
            this.emitter.fireEvent("play_sound", {key: "gold_star_lemon", loop: false, holdReference: false});
            name = "turretDG";
            health = 250;
            itemType = "lemon";
            itemStar = "gold";
        }
        
        let turret = this.add.animatedSprite(NPCActor, name, "primary");
        this.turret = turret;
   
        turret.animation.play("GROW_UP", false, ItemEvent.FINISH_GROW_UP);

        turret.position.set(item.position.x, item.position.y);
        turret.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
        
        turret.battleGroup = 1;
        turret.type = "turret";
        turret.speed = 10;
        turret.health = health;
        turret.maxHealth = health;
        turret.navkey = "navmesh";

        // Give the NPCS their healthbars
        let healthbar = new HealthbarHUD(this, turret, "primary", {size: turret.size.clone().scaled(2, 1/2), offset: turret.size.clone().scaled(0, -1/2)});
        this.healthbars.set(turret.id, healthbar);

        setTimeout(() => {
            turret.addAI(TurretBehavior, {target: this.battlers[0], range: 150, type: itemType, star: itemStar});
            this.battlers.push(turret);
            this.turret = turret;
        }, 4000);
    }

    protected handleShopEntered(event: GameEvent): void {
        // If the shop UI Layer is already open, do nothing
        if (this.getLayer("shop").isHidden() === false) {
            return;
        }

        // Open the shop UI Layer
        this.toggleShopMenu();
    }

    protected handleItemPickedUp(event: GameEvent): void {
        // Play pick up sound
        this.emitter.fireEvent("play_sound", {key: "pick_up", loop: false, holdReference: false});

        let item = event.data.get("item");
        let inventory = event.data.get("inventory");
        let node = event.data.get("node");
        
        inventory.add(item);
    }

    protected handleItemDropped(event: GameEvent, node: GameNode, inventory: Inventory): void {
        // Play drop sound
        this.emitter.fireEvent("play_sound", {key: "drop", loop: false, holdReference: false});

        let item = event.data.get("item");
                
        // Get the col and row of the tile that the item is dropped
        let col = item.position.x;
        let row = item.position.y;
        let tile = this.floors.getTilemapPosition(col, row);

        // Upper land
        if (tile.y >= 9 && tile.y <= 13) {
            // If tile.x is 2~14 or 18~29
            if ((tile.x >= 2 && tile.x <= 14) || (tile.x >= 18 && tile.x <= 29)) {
                // Emit an event to make the item grow up
                inventory.remove(item);
                
                item.getSprite().destroy();

                this.seeds = this.seeds.filter(seed => seed !== item);
                this.emitter.fireEvent(ItemEvent.ITEM_GROW_UP, {item: item});
            }
        }

        // Lower land
        if (tile.y >= 15 && tile.y <= 19) {
            // If tile.x is 2~14 or 18~29
            if ((tile.x >= 2 && tile.x <= 14) || (tile.x >= 18 && tile.x <= 29)) {
                // Emit an event to make the item grow up
                inventory.remove(item);
                
                item.getSprite().destroy();

                this.seeds = this.seeds.filter(seed => seed !== item);
                this.emitter.fireEvent(ItemEvent.ITEM_GROW_UP, {item: item});
            }
        }
        
    }

    protected showCooldownMessage(remainingTime: string): void {
        const uiLayer = this.getLayer("enemyCount");

        const background = new Rect(new Vec2(180, 180), new Vec2(240, 25));
        background.color = new Color(0, 0, 0, 0.4);
        uiLayer.addNode(background);

        const message = this.add.uiElement(UIElementType.LABEL, "enemyCount", {
            position: new Vec2(180, 180),
            text: `Wait ${remainingTime} seconds to plant another seed.`
        });
        (message as Label).setTextColor(Color.WHITE);
        (message as Label).fontSize = 24;

        setTimeout(() => {
            message.destroy();
            background.color = new Color(0,0,0,0);
        }, 1000);
    }

    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */
    protected handleBattlerKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        let battler = this.battlers.find(b => b.id === id);

        if (battler.battleGroup === 2) {
            this.blueEnemyCount -= 1;
        }

        if (battler.id === this.baseId) {
            // Change scene to gameover
            // Stop bgm
            this.emitter.fireEvent("stop_sound", {key: "background_music"});
            this.sceneManager.changeToScene(GameOver);
        }

        if (battler) {
            battler.battlerActive = false;
            this.healthbars.get(id).visible = false;
        }
        
    }

    /** Initializes the layers in the scene */
    protected initLayers(): void {
        this.addLayer("primary", 10);
        this.addUILayer("items");
        this.addUILayer("slots");
        this.getLayer("slots").setDepth(2);
        this.getLayer("items").setDepth(3);
    }

    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        let player = this.add.animatedSprite(PlayerActor, "player", "primary");
        
        // Position of Kevin
        player.position.set(264, 227);
        player.battleGroup = 1;
        player.health = 10;
        player.maxHealth = 10;

        player.inventory.onChange = ItemEvent.INVENTORY_CHANGED
        // console.log(this.getLayer("slots").getDepth());
        // console.log(this.getLayer("items").getDepth());
        this.inventoryHud = new InventoryHUD(this, player.inventory, "inventorySlot", {
            start: new Vec2(232, 998),
            slotLayer: "slots",
            padding: 8,
            itemLayer: "items",

        });

        // Give the player physics
        player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        // Give the player a healthbar
        // let healthbar = new HealthbarHUD(this, player, "primary", {size: player.size.clone().scaled(2, 1/2), offset: player.size.clone().scaled(0, -1/2)});
        // this.healthbars.set(player.id, healthbar);

        // Give the player PlayerAI
        player.addAI(PlayerAI);

        // Start the player in the "IDLE" animation
        player.animation.play("IDLE");

        this.battlers.push(player);
        this.viewport.follow(player);
    }
    /**
     * Initialize the NPCs 
     */
    protected initializeNPCs(): void {
        // Initialize the base (home)
        let baseNPC = this.add.animatedSprite(NPCActor, "home", "primary");
        baseNPC.position.set(264, 95);
        baseNPC.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

        // Give the NPCS their healthbars
        let healthbar = new HealthbarHUD(this, baseNPC, "primary", {size: baseNPC.size.clone().scaled(4, 1/2), offset: baseNPC.size.clone().scaled(0, -1/2)});
        this.healthbars.set(baseNPC.id, healthbar);

        this.baseId = baseNPC.id;

        baseNPC.type = "base";
        baseNPC.battleGroup = 1;
        baseNPC.speed = 0;
        baseNPC.health = 1000;
        baseNPC.maxHealth = 1000;
        baseNPC.navkey = "navmesh";

        baseNPC.addAI(BaseBehavior);
        baseNPC.animation.play("IDLE");
        this.battlers.push(baseNPC);

        // Initialize the monsters
        let waveTime = 90000;

        setTimeout(() => {
            // Play the night start sound
            this.emitter.fireEvent("play_sound", {key: "night_start", loop: false, holdReference: false});

            // Output the screen message: The night has arrived...
            const nightBackground = new Rect(new Vec2(0, 0), new Vec2(1000, 1000));
            nightBackground.color = new Color(0, 0, 0, 0.5);
            this.enemyCount.addNode(nightBackground);
            let message = this.add.uiElement(UIElementType.LABEL, "enemyCount", {position: new Vec2(180, 180), text: "The night has arrived..."});
            (message as Label).setTextColor(Color.WHITE);
            (message as Label).fontSize = 30;
            setTimeout(() => {
                message.destroy();
                nightBackground.color = new Color(0, 0, 0, 0.2);
            }, 2000);
            this.initializeMonsters();
        }, waveTime);
    }

    protected initializeMonsters(): void {
        let enemy = this.load.getObject("enemy_location");

        for (let i = 0; i < enemy.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "monsterB", "primary");
            npc.position.set(enemy.enemies[i][0], enemy.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPCS their healthbars
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.type = "monster";
            npc.battleGroup = 2;
            npc.speed = 10;
            npc.health = 50;
            npc.maxHealth = 50;
            npc.navkey = "navmesh";

            // Give the NPCs their AI
            npc.addAI(EnemyBehavior, {target: this.battlers[0], range: 800});

            // Play the NPCs "IDLE" animation 
            npc.animation.play("IDLE");

            this.battlers.push(npc);
        }
    }

    /**
     * Initialize the items in the scene (healthpacks and laser guns)
     */
    protected initializeItems(): void {
        let seeds = this.load.getObject("seeds");
        this.seeds = new Array<Seed>(seeds.items.length);
        for (let i = 0; i < seeds.items.length; i++) {
            let sprite = this.add.sprite("seed", "primary");
            this.seeds[i] = new Seed(sprite);
            this.seeds[i].position.set(seeds.items[i][0], seeds.items[i][1]);
        }

        let shop = this.load.getObject("shop");
        let shopSprite = this.add.sprite("shop", "primary");
        this.shop = new Shop(shopSprite, this.dollar);
        this.shop.position.set(shop.location[0][0], shop.location[0][1]);

        let pearls = this.load.getObject("pearls");
        this.pearls = new Array<Pearl>(pearls.items.length);
        for (let i = 0; i < pearls.items.length; i++) {
            let sprite = this.add.sprite("pearl", "primary");
            this.pearls[i] = new Pearl(sprite);
            this.pearls[i].position.set(pearls.items[i][0], pearls.items[i][1]);
        }
    }

    protected initializeNavmesh(): void {
        // Create the graph
        this.graph = new PositionGraph();

        let dim: Vec2 = this.walls.getDimensions();
        for (let i = 0; i < dim.y; i++) {
            for (let j = 0; j < dim.x; j++) {
                let tile: AABB = this.walls.getTileCollider(j, i);
                this.graph.addPositionedNode(tile.center);
            }
        }

        let rc: Vec2;
        for (let i = 0; i < this.graph.numVertices; i++) {
            rc = this.walls.getTileColRow(i);
            if (!this.walls.isTileCollidable(rc.x, rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), rc.y) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(rc.x, MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y + 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x + 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1)) &&
                !this.walls.isTileCollidable(MathUtils.clamp(rc.x - 1, 0, dim.x - 1), MathUtils.clamp(rc.y - 1, 0, dim.y - 1))

            ) {
                // Create edge to the left
                rc = this.walls.getTileColRow(i + 1);
                if ((i + 1) % dim.x !== 0 && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + 1);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + 1)})
                }
                // Create edge below
                rc = this.walls.getTileColRow(i + dim.x);
                if (i + dim.x < this.graph.numVertices && !this.walls.isTileCollidable(rc.x, rc.y)) {
                    this.graph.addEdge(i, i + dim.x);
                    // this.add.graphic(GraphicType.LINE, "graph", {start: this.graph.getNodePosition(i), end: this.graph.getNodePosition(i + dim.x)})
                }


            }
        }

        // Set this graph as a navigable entity
        let navmesh = new Navmesh(this.graph);
        
        // Add different strategies to use for this navmesh
        navmesh.registerStrategy("direct", new DirectStrategy(navmesh));
        navmesh.registerStrategy("astar", new AstarStrategy(navmesh));
        navmesh.setStrategy("astar"); // change to astar

        // Add this navmesh to the navigation manager
        this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    public calculateBlueEnemies(): number {
        return this.battlers.filter(b => b instanceof NPCActor && b.battleGroup === BattlerGroups.ENEMY).length;
    }

    public getBattlers(): Battler[] { return this.battlers; }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    public getSeeds(): Seed[] { return this.seeds; }

    /**
     * Checks if the given target position is visible from the given position.
     * @param position 
     * @param target 
     * @returns 
     */
    public isTargetVisible(position: Vec2, target: Vec2): boolean {

        // Get the new player location
        let start = position.clone();
        let delta = target.clone().sub(start);

        // Iterate through the tilemap region until we find a collision
        let minX = Math.min(start.x, target.x);
        let maxX = Math.max(start.x, target.x);
        let minY = Math.min(start.y, target.y);
        let maxY = Math.max(start.y, target.y);

        // Get the wall tilemap
        let walls = this.getWalls();

        let minIndex = walls.getTilemapPosition(minX, minY);
        let maxIndex = walls.getTilemapPosition(maxX, maxY);

        let tileSize = walls.getScaledTileSize();

        for (let col = minIndex.x; col <= maxIndex.x; col++) {
            for (let row = minIndex.y; row <= maxIndex.y; row++) {
                if (walls.isTileCollidable(col, row)) {
                    // Get the position of this tile
                    let tilePos = new Vec2(col * tileSize.x + tileSize.x / 2, row * tileSize.y + tileSize.y / 2);

                    // Create a collider for this tile
                    let collider = new AABB(tilePos, tileSize.scaled(1 / 2));

                    let hit = collider.intersectSegment(start, delta, Vec2.ZERO);

                    if (hit !== null && start.distanceSqTo(hit.pos) < start.distanceSqTo(target)) {
                        // We hit a wall, we can't see the player
                        return false;
                    }
                }
            }
        }
        return true;

    }
}