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
import { ItemEvent, PlayerEvent, BattlerEvent } from "../Events";
import Battler from "../GameSystems/BattleSystem/Battler";
import BattlerBase from "../GameSystems/BattleSystem/BattlerBase";
import HealthbarHUD from "../GameSystems/HUD/HealthbarHUD";
import InventoryHUD from "../GameSystems/HUD/InventoryHUD";
import Inventory from "../GameSystems/ItemSystem/Inventory";
import Item from "../GameSystems/ItemSystem/Item";
import Seed from "../GameSystems/ItemSystem/Items/Seed";
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

    private bases: BattlerBase[];

    private seeds: Array<Seed>;

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

    public constructor(viewport: Viewport, sceneManager: SceneManager, renderingManager: RenderingManager, options: Record<string, any>) {
        super(viewport, sceneManager, renderingManager, options);

        this.battlers = new Array<Battler & Actor>();
        this.healthbars = new Map<number, HealthbarHUD>();

        this.seeds = new Array<Seed>();
    }

    /**
     * @see Scene.update()
     */
    public override loadScene() {
        // Load the player and enemy spritesheets
        this.load.spritesheet("player", "fd_assets/spritesheets/kevin.json");
        this.load.spritesheet("home", "fd_assets/spritesheets/home.json");

        // Load in the enemy and turret sprites
        this.load.spritesheet("monsterA", "fd_assets/spritesheets/monsterA.json");
        this.load.spritesheet("monsterB", "fd_assets/spritesheets/monsterB.json");
        this.load.spritesheet("monsterC", "fd_assets/spritesheets/monsterC.json");
        this.load.spritesheet("turretA", "fd_assets/spritesheets/turretA.json");
        this.load.image("monsterBLogo", "fd_assets/sprites/logoB.png")

        // Load the tilemap
        this.load.tilemap("level1", "fd_assets/tilemaps/level1.json");
        this.load.tilemap("level1_night", "fd_assets/tilemaps/level1_night.json");

        // Load the enemy locations
        this.load.object("enemy_location", "fd_assets/data/enemies/enemy_location.json");
        this.load.object("test_location", "fd_assets/data/enemies/test_location.json")

        // Load the seed locations
        this.load.object("seeds", "fd_assets/data/items/seeds.json");

        // Load the seed sprites
        this.load.image("seed", "fd_assets/sprites/seed.png");
        this.load.image("inventorySlot", "fd_assets/sprites/inventory.png");
        this.load.image("tomato_sprite", "fd_assets/sprites/tomato_sprite.png");
        this.load.image("timer", "fd_assets/sprites/moon.png");

    }

    /**
     * @see Scene.startScene
     */
    public override startScene() {
        const center = this.viewport.getCenter();

        

        // pause menu initialize
        this.pauseMenu = this.addUILayer("pauseMenu");
        this.pauseMenu.setHidden(true);
    

        const pauseMenuLayer = this.getLayer("pauseMenu");

        const centerESC = new Vec2(200, 200);

        const menuBackground = new Rect(new Vec2(centerESC.x - 25, centerESC.y - 25), new Vec2(300, 300));
        menuBackground.color = new Color(0, 0, 0, 0.9);
        menuBackground.borderColor = new Color(255, 255, 255);
        menuBackground.borderWidth = 2;
        pauseMenuLayer.addNode(menuBackground);

        // Create buttons
        const resumeButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(centerESC.x - 25, centerESC.y - 95),text: "Resume"});
        resumeButton.size.set(100, 100);
        resumeButton.onClickEventId = "resumeGame";

        const cheatButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(centerESC.x - 25, centerESC.y - 25),text: "Cheat Code"});
        cheatButton.size.set(100, 100);
        cheatButton.onClickEventId = "cheat";

        const mainMenuButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(centerESC.x - 25, centerESC.y + 50),text: "Main Menu"});
        mainMenuButton.size.set(100, 100);
        mainMenuButton.onClickEventId = "backToMainMenu";
        

        // cheat text input
        this.textInput = this.addUILayer("textInput");
        this.textInput.setHidden(true);

        const textInputLayer = this.getLayer("textInput");

        const background = new Rect(new Vec2(centerESC.x - 25, centerESC.y - 25), new Vec2(500, 200));
        background.color = new Color(0, 0, 0);
        background.borderColor = new Color(255, 255, 255);
        background.borderWidth = 2;
        textInputLayer.addNode(background);


        const inputText = this.add.uiElement(UIElementType.TEXT_INPUT, "textInput", {position: new Vec2(centerESC.x - 60 , centerESC.y - 30)});
        inputText.size.set(600, 100);


        const submitButton = this.add.uiElement(UIElementType.BUTTON, "textInput", {position: new Vec2(300, 170),text: "Submit"});
        submitButton.onClickEventId = "submitCheat";
        submitButton.backgroundColor = Color.TRANSPARENT;
        submitButton.size.set(100, 50);

    
        this.receiver.subscribe("resumeGame");
        this.receiver.subscribe("backToMainMenu");
        this.receiver.subscribe("cheat");
        this.receiver.subscribe("submitCheat");
        this.receiver.subscribe("growFinish");

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


        this.enemyCount = this.addUILayer("enemyCount");
        this.enemyCount.setHidden(false);

        const monsterPhoto = this.add.sprite("monsterBLogo", "enemyCount");
        monsterPhoto.position.set(300, 10);

        this.blueEnemyCount = this.calculateBlueEnemies();


        const enemyCountLabel = this.add.uiElement(UIElementType.LABEL, "enemyCount", {position: new Vec2(324, 10),
            text: "x " + this.blueEnemyCount
        });
        (enemyCountLabel as Label).setTextColor(Color.WHITE);
        (enemyCountLabel as Label).fontSize = 24;

        this.timer = this.addUILayer("timer");
        this.timer.setHidden(false);

        const moonPhoto = this.add.sprite("timer", "timer");
        moonPhoto.position.set(155,10);

        const timerLabel = this.add.uiElement(UIElementType.LABEL, "timer", { position: new Vec2(180, 10), text: "2:01" });
        (timerLabel as Label).setTextColor(Color.WHITE);
        (timerLabel as Label).fontSize = 24;
    
        let duration = 120;
        let interval = setInterval(() => {
            let minutes = Math.floor(duration / 60);
            let seconds = duration % 60;
        
            if (timerLabel) {
                (timerLabel as Label).setText(`${minutes}:${seconds}`);
            }
        
            if (duration <= 0) {
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
            }
            duration -= 1;
        }, 1000)


        // Subscribe to relevant events
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(ItemEvent.ITEM_REQUEST);
        this.receiver.subscribe(ItemEvent.ITEM_GROW_UP);
        this.receiver.subscribe(ItemEvent.ITEM_PICKED_UP);
        this.receiver.subscribe(ItemEvent.ITEM_DROPPED);

        // Add a UI for health
        this.addUILayer("health");

        this.receiver.subscribe(PlayerEvent.PLAYER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_KILLED);
        this.receiver.subscribe(BattlerEvent.BATTLER_RESPAWN);
    }

    /**
     * @see Scene.updateScene
     */
    public override updateScene(deltaT: number): void {


        while (this.receiver.hasNextEvent()) {
            this.handleEvent(this.receiver.getNextEvent());
        }



        //esc menu 
        if (Input.isKeyJustPressed("escape")) {       
            this.pause();
            this.togglePauseMenu();
            if(!this.textInput.isHidden()){
                this.CheatInput();
            }
        }

        // prevent player escape from map
        let player = this.battlers.find(b => b instanceof PlayerActor) as PlayerActor;
        let currentPosition = player.position.clone();

        // boundary
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

        this.inventoryHud.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
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

    private CheatInput(): void{
        const textInputLayer = this.getLayer("textInput");
        const isHidden = textInputLayer.isHidden();

        if(!this.paused){
            this.paused = true;
        }
        
        if (isHidden){
            textInputLayer.setHidden(false);
        }
        else{
            textInputLayer.setHidden(true);
        }
        
        
    }
    
    public handleCheatSubmission(cheatCode: string): void {
        console.log("Cheat code processed:", cheatCode);
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case "resumeGame": {
                this.resume();// resume the game
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
                console.log("치트코드 제출");
                const textInputLayer = this.getLayer("textInput");
                const textInputNode = textInputLayer.getItems().find(node => node instanceof TextInput) as TextInput;
                if (textInputNode) {
                    console.log("Entered cheat code:", textInputNode.text);
                    this.handleCheatSubmission(textInputNode.text);
                    textInputNode.text = "";
                }
                break;
            }
            case "growFinish":
                if (this.turret) {
                    console.log("성장 끝, 보통 모션 출력");
                    this.turret.animation.play("IDLE", true);
                }
            break;

            // Battle Events
            case BattlerEvent.BATTLER_KILLED: {
                this.handleBattlerKilled(event);
                break;
            }
            case BattlerEvent.BATTLER_RESPAWN: {
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
                this.handleItemDropped(event);
                break;
            }

            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in event handler`);
            }

        }
    }

    protected handleItemRequest(node: GameNode, inventory: Inventory): void {
        let items: Item[] = new Array<Item>(...this.seeds).filter((item: Item) => {
            // 주울 때 범위 한 칸
            return item.inventory === null && item.position.distanceTo(node.position) <= 20;
        });

        if (items.length > 0) {
            inventory.add(items.reduce(ClosestPositioned(node)));
        }
    }

    protected handleItemGrowUp(event: GameEvent): void {
        let item = event.data.get("item");
        // Change the sprite to tomato
        item.changeSprite("tomato_sprite");
        
        // Change the item into Turret object, and add it to the battlers
        let turret = this.add.animatedSprite(NPCActor, "turretA", "primary");
   
        turret.animation.play("GROW_UP", false, "growFinish");
        console.log("성장 모션");

        turret.position.set(item.position.x, item.position.y);
        turret.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);
        
        turret.battleGroup = 1;
        turret.type = "turret";
        turret.speed = 0;
        turret.health = 10;
        turret.maxHealth = 10;
        turret.navkey = "navmesh";

        // Give the NPCS their healthbars
        let healthbar = new HealthbarHUD(this, turret, "primary", {size: turret.size.clone().scaled(2, 1/2), offset: turret.size.clone().scaled(0, -1/2)});
        this.healthbars.set(turret.id, healthbar);

        // Make the seed invisible
        item.visible = false;

        setTimeout(() => {
            turret.addAI(TurretBehavior, {target: this.battlers[0], range: 1000});
            this.battlers.push(turret);
            this.turret = turret;
        }, 1000);
    }

    protected handleItemPickedUp(event: GameEvent): void {
        console.log("아이템 픽업 진입");
        let item = event.data.get("item");
        let inventory = event.data.get("inventory");
        let node = event.data.get("node");

        // Make the item visible
        item.visible = true;
        // Put the item back to the inventory
        inventory.add(item);
        console.log(inventory);


        let index = inventory.indexOf(item)


        // Remove the turret from the battlers
        let turret = this.battlers.find(b => b.position.distanceTo(item.position) === 0);
        this.battlers = this.battlers.filter(b => b !== turret);

        // Consider turret is dead
        this.emitter.fireEvent(BattlerEvent.BATTLER_KILLED, {id: turret.id});
    }

    protected handleItemDropped(event: GameEvent): void {
        let item = event.data.get("item");
        let now = Date.now();

        if (item.lastDropped && (now - item.lastDropped < 10000)) {
            let remainingTime = (10000 - (now - item.lastDropped)) / 1000; // calculate in second

            let wordTime = 10;
            
            setTimeout(() => {
            const nightBackground = new Rect(new Vec2(180, 180), new Vec2(170 ,25));
            nightBackground.color = new Color(0, 0, 0, 0.4);
            this.enemyCount.addNode(nightBackground);

            let message = this.add.uiElement(UIElementType.LABEL, "enemyCount", {position: new Vec2(180, 180), text: "Need "+ remainingTime +" seconds to planting"});
            (message as Label).setTextColor(Color.WHITE);
            (message as Label).fontSize = 24;
            setTimeout(() => {
                message.destroy();
                nightBackground.color = new Color(0, 0, 0, 0.0);
            }, 400);

        }, wordTime);

            return;
        }

        item.lastDropped = now;
                
        // Get the col and row of the tile that the item is dropped
        let col = item.position.x;
        let row = item.position.y;
        let tile = this.floors.getTilemapPosition(col, row);
        console.log(tile);

        // 위쪽 밭
        if (tile.y >= 2 && tile.y <= 11) {
            // If tile.x is not 0, 1, 5, 6, 10, 11, 15, 16, 20, 21, 25, 26, 30, 31
            if (tile.x % 5 !== 0 && tile.x % 5 !== 1) {
                // Emit an event to make the item grow up
                this.emitter.fireEvent(ItemEvent.ITEM_GROW_UP, {item: item});
            }
        }

        // 아래쪽 밭
        if (tile.y >= 17 && tile.y <= 20) {
            // If tile.x is 1~14 or 18~30
            if (tile.x >= 1 && tile.x <= 14 || tile.x >= 18 && tile.x <= 30) {
                // Emit an event to make the item grow up
                this.emitter.fireEvent(ItemEvent.ITEM_GROW_UP, {item: item});
            }
        }
    }

    /**
     * Handles an NPC being killed by unregistering the NPC from the scenes subsystems
     * @param event an NPC-killed event
     */
    protected handleBattlerKilled(event: GameEvent): void {
        let id: number = event.data.get("id");
        let battler = this.battlers.find(b => b.id === id);

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
        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }

    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        let player = this.add.animatedSprite(PlayerActor, "player", "primary");
        player.position.set(200, 200);
        player.battleGroup = 1;

        player.health = 10;
        player.maxHealth = 10;

        player.inventory.onChange = ItemEvent.INVENTORY_CHANGED
        console.log(this.getLayer("slots").getDepth());
        console.log(this.getLayer("items").getDepth());
        this.inventoryHud = new InventoryHUD(this, player.inventory, "inventorySlot", {
            start: new Vec2(232, 998),
            slotLayer: "slots",
            padding: 8,
            itemLayer: "items",

        });

        // Give the player physics
        player.addPhysics(new AABB(Vec2.ZERO, new Vec2(8, 8)));

        // Give the player a healthbar
        let healthbar = new HealthbarHUD(this, player, "primary", {size: player.size.clone().scaled(2, 1/2), offset: player.size.clone().scaled(0, -1/2)});
        this.healthbars.set(player.id, healthbar);

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

        let home = this.load.getObject("test_location");

        // Initialize the base (home)
        for (let i = 0; i < home.enemies.length; i++) {
            let baseNPC = this.add.animatedSprite(NPCActor, "home", "primary");
            baseNPC.position.set(home.enemies[i][0], home.enemies[i][1]);
            baseNPC.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPCS their healthbars
            let healthbar = new HealthbarHUD(this, baseNPC, "primary", {size: baseNPC.size.clone().scaled(2, 1/2), offset: baseNPC.size.clone().scaled(0, -1/2)});
            this.healthbars.set(baseNPC.id, healthbar);

            baseNPC.type = "base";
            baseNPC.battleGroup = 1
            baseNPC.speed = 0;
            baseNPC.health = 100;
            baseNPC.maxHealth = 100;
            baseNPC.navkey = "navmesh";

            baseNPC.addAI(BaseBehavior);
            
            baseNPC.animation.play("IDLE");

            this.battlers.push(baseNPC);
        }

        let waveTime = 10000;

        setTimeout(() => {
            // Output the screen message in the player's head: "The night has arrived"

            const nightBackground = new Rect(new Vec2(0, 0), new Vec2(1000, 1000));
            nightBackground.color = new Color(0, 0, 0, 0.8);
            this.enemyCount.addNode(nightBackground);

            let message = this.add.uiElement(UIElementType.LABEL, "enemyCount", {position: new Vec2(180, 180), text: "The night has arrived"});
            (message as Label).setTextColor(Color.WHITE);
            (message as Label).fontSize = 30;
            setTimeout(() => {
                message.destroy();
                nightBackground.color = new Color(0, 0, 0, 0.2);
            }, 3000);

            this.initializeMonsters();
        }, waveTime);

        
    }

    protected initializeMonsters(): void {

        let enemy = this.load.getObject("enemy_location");

        // Initialize the blue enemies
        for (let i = 0; i < enemy.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "monsterB", "primary");
            npc.position.set(enemy.enemies[i][0], enemy.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPCS their healthbars
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.type = "monster";
            npc.battleGroup = 2
            npc.speed = 100;
            npc.health = 50;
            npc.maxHealth = 50;
            npc.navkey = "navmesh";

            // Give the NPCs their AI
            npc.addAI(EnemyBehavior, {target: this.battlers[0], range: 1000});

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