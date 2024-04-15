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
import Seed from "../GameSystems/ItemSystem/Items/seed";
import { ClosestPositioned } from "../GameSystems/Searching/Reducers";
import BasicTargetable from "../GameSystems/Targeting/BasicTargetable";
import Position from "../GameSystems/Targeting/Position";
import AstarStrategy from "../Pathfinding/AstarStrategy";
import Scene from "./Scene";
import Layer from "../../Wolfie2D/Scene/Layer";
import { UIElementType } from "../../Wolfie2D/Nodes/UIElements/UIElementTypes";
import Input from "../../Wolfie2D/Input/Input";
import MainMenu from "./MainMenu";

const BattlerGroups = {
    RED: 1,
    BLUE: 2
} as const;

export default class MainScene extends Scene {

    /** GameSystems in the HW4 Scene */
    private inventoryHud: InventoryHUD;

    /** All the battlers in the HW4Scene (including the player) */
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

        // Load in the enemy sprites
        this.load.spritesheet("monsterA", "fd_assets/spritesheets/monsterA.json");
        this.load.spritesheet("monsterB", "fd_assets/spritesheets/monsterB.json");
        this.load.spritesheet("monsterC", "fd_assets/spritesheets/monsterC.json");

        // Load the tilemap
        this.load.tilemap("level", "fd_assets/tilemaps/level1.json");

        // Load the enemy locations
        this.load.object("enemy_location", "fd_assets/data/enemies/enemy_location.json");

        // Load the seed locations
        this.load.object("seeds", "fd_assets/data/items/seeds.json");

        // Load the seed sprites
        this.load.image("seed", "fd_assets/sprites/seed.png");
        this.load.image("inventorySlot", "fd_assets/sprites/inventory.png");
        this.load.image("tomato_sprite", "fd_assets/sprites/tomato_sprite.png");
    }
    /**
     * @see Scene.startScene
     */
    public override startScene() {
        const center = this.viewport.getCenter();

        this.pauseMenu = this.addUILayer("pauseMenu");
        this.pauseMenu.setHidden(true);

        const resume = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(center.x, center.y + 250), text: "Resume"});
        resume.size.set(200, 100);
        resume.backgroundColor = Color.TRANSPARENT;
        resume.onClickEventId = "resumeGame";
        
        // Main Menu Button
        const mainMenuButton = this.add.uiElement(UIElementType.BUTTON, "pauseMenu", {position: new Vec2(center.x, center.y + 50), text: "Main Menu"});
        mainMenuButton.size.set(200, 100);
        mainMenuButton.backgroundColor = Color.TRANSPARENT;
        mainMenuButton.onClickEventId = "backToMainMenu";
    
        this.receiver.subscribe("resumeGame");
        this.receiver.subscribe("backToMainMenu");

        // Add in the tilemap
        let tilemapLayers = this.add.tilemap("level");

        // Get the wall layer
        this.walls = <OrthogonalTilemap>tilemapLayers[1].getItems()[0];

        // Set the viewport bounds to the tilemap
        let tilemapSize: Vec2 = this.walls.size;

        this.viewport.setBounds(0, 0, tilemapSize.x, tilemapSize.y);
        this.viewport.setZoomLevel(3);

        this.initLayers();
        
        // Create the player
        this.initializePlayer();
        this.initializeItems();

        //this.initializeNavmesh();

        // Create the NPCS
        this.initializeNPCs();

        // Subscribe to relevant events
        this.receiver.subscribe("enemyDied");
        this.receiver.subscribe(ItemEvent.ITEM_REQUEST);
        this.receiver.subscribe(ItemEvent.ITEM_GROW_UP);
        this.receiver.subscribe(ItemEvent.ITEM_PICKED_UP);
        this.receiver.subscribe(ItemEvent.ITEM_DROPPED);
        this.receiver.subscribe(ItemEvent.ITEM_USED);

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
        if (Input.isKeyJustPressed("escape")) {       
            this.togglePauseMenu();
        }
        this.inventoryHud.update(deltaT);
        this.healthbars.forEach(healthbar => healthbar.update(deltaT));
    }

    private togglePauseMenu(): void {
        const isHidden = this.getLayer("pauseMenu").isHidden();
        this.getLayer("pauseMenu").setHidden(!isHidden);
    
        if (!isHidden) {
            this.getLayer("pauseMenu").setPaused(true);
        } else {
            this.getLayer("pauseMenu").setPaused(false);
        }
    }

    /**
     * Handle events from the rest of the game
     * @param event a game event
     */
    public handleEvent(event: GameEvent): void {
        switch (event.type) {
            case BattlerEvent.BATTLER_KILLED: {
                this.handleBattlerKilled(event);
                break;
            }
            case "resumeGame":
                this.togglePauseMenu(); // resume the game
                break;
            case "backToMainMenu":
                this.sceneManager.changeToScene(MainMenu); // go to main menu
                break;
            case BattlerEvent.BATTLER_RESPAWN: {
                break;
            }
            case ItemEvent.ITEM_REQUEST: {
                this.handleItemRequest(event.data.get("node"), event.data.get("inventory"));
                break;
            }
            case ItemEvent.ITEM_GROW_UP: {
                let item = event.data.get("item");
                // Change the sprite to tomato
                item.changeSprite("tomato_sprite");
                break;
            }
            case ItemEvent.ITEM_PICKED_UP: {
                
            }
            case ItemEvent.ITEM_DROPPED: {
                
            }
            case ItemEvent.ITEM_USED: {
                
            }
            default: {
                throw new Error(`Unhandled event type "${event.type}" caught in HW4Scene event handler`);
            }

        }
    }

    protected handleItemRequest(node: GameNode, inventory: Inventory): void {
        let items: Item[] = new Array<Item>(...this.seeds).filter((item: Item) => {
            return item.inventory === null && item.position.distanceTo(node.position) <= 100;
        });

        if (items.length > 0) {
            inventory.add(items.reduce(ClosestPositioned(node)));
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
        this.addUILayer("slots");
        this.addUILayer("items");
        this.getLayer("slots").setDepth(1);
        this.getLayer("items").setDepth(2);
    }

    /**
     * Initializes the player in the scene
     */
    protected initializePlayer(): void {
        let player = this.add.animatedSprite(PlayerActor, "player", "primary");
        player.position.set(200, 200);
        player.battleGroup = 2;

        player.health = 10;
        player.maxHealth = 10;

        player.inventory.onChange = ItemEvent.INVENTORY_CHANGED
        this.inventoryHud = new InventoryHUD(this, player.inventory, "inventorySlot", {
            start: new Vec2(232, 24),
            slotLayer: "slots",
            padding: 8,
            itemLayer: "items"
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

        // Get the object data for the blue enemies
        let enemy = this.load.getObject("enemy_location");

        // Initialize the blue enemies
        for (let i = 0; i < enemy.enemies.length; i++) {
            let npc = this.add.animatedSprite(NPCActor, "monsterB", "primary");
            npc.position.set(enemy.enemies[i][0], enemy.enemies[i][1]);
            npc.addPhysics(new AABB(Vec2.ZERO, new Vec2(7, 7)), null, false);

            // Give the NPCS their healthbars
            let healthbar = new HealthbarHUD(this, npc, "primary", {size: npc.size.clone().scaled(2, 1/2), offset: npc.size.clone().scaled(0, -1/2)});
            this.healthbars.set(npc.id, healthbar);

            npc.battleGroup = 2
            npc.speed = 10;
            npc.health = 10;
            npc.maxHealth = 10;
            npc.navkey = "navmesh";

            // Give the NPCs their AI
            // npc.addAI(EnemyBehavior, {target: this.battlers[0], range: 100});

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
    /**
     * Initializes the navmesh graph used by the NPCs in the HW4Scene. This method is a little buggy, and
     * and it skips over some of the positions on the tilemap. If you can fix my navmesh generation algorithm,
     * go for it.
     * 
     * - Peter
     */
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
        //navmesh.setStrategy("direct"); // change to astar

        // Add this navmesh to the navigation manager
        //this.navManager.addNavigableEntity("navmesh", navmesh);
    }

    public getBattlers(): Battler[] { return this.battlers; }

    public getWalls(): OrthogonalTilemap { return this.walls; }

    public getHealthpacks(): Seed[] { return this.seeds; }

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