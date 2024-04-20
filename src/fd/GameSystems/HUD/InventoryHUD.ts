import Sprite from "../../../Wolfie2D/Nodes/Sprites/Sprite";
import Label from "../../../Wolfie2D/Nodes/UIElements/Label";
import Rect from "../../../Wolfie2D/Nodes/Graphics/Rect";

import { UIElementType } from "../../../Wolfie2D/Nodes/UIElements/UIElementTypes";

import Receiver from "../../../Wolfie2D/Events/Receiver";
import GameEvent from "../../../Wolfie2D/Events/GameEvent";

import Vec2 from "../../../Wolfie2D/DataTypes/Vec2";
import Color from "../../../Wolfie2D/Utils/Color";
import Scene from "../../../Wolfie2D/Scene/Scene";
import Updateable from "../../../Wolfie2D/DataTypes/Interfaces/Updateable";
import Item from "../ItemSystem/Item";
import Inventory from "../ItemSystem/Inventory";


interface HUDOptions {
    start: Vec2;
    padding: number;
    slotLayer: string,
    itemLayer: string
}

/**
 * Manages the player inventory that is displayed in the UI. Fun fact, I actually managed to port this
 * class from my old CSE-380 project from last semester.
 * @author PeteyLumpkins
 */
export default class InventoryHUD implements Updateable {

    /* The scene */
    private scene: Scene;

    /* The inventory */
    private inventory: Inventory

    /* Event handling stuff */
    private receiver: Receiver;

    /* Options for settign the size, padding, and starting position of the UI slots */
    private size: number;
    private start: Vec2;
    private padding: number;

    /* Inventory UI Layers */
    private slotSprite: string;
    private itemLayer: string;
    private slotLayer: string;

    /* UI Components for the inventory */
    private itemSlots: Array<Sprite>;
    private itemSlotNums: Array<Label>;
    private itemBackground: Array<Rect>;



    public constructor(scene: Scene, inventory: Inventory, slotSprite: string, options: HUDOptions) {


        this.scene = scene;
        this.inventory = inventory;
        this.slotSprite = slotSprite;

        // Set the size and padding for the item slots
        this.size = this.inventory.capacity;
        this.padding = options.padding;
        this.start = options.start;
        // Init the layers for the items
        this.slotLayer = options.slotLayer;
        this.itemLayer = options.itemLayer;
        

        // Set up the scales for scaling to the viewport
        let scale = scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        // Load the item slot sprites
        this.itemSlots = new Array<Sprite>();
        for (let i = 0; i < this.size; i += 1) {
            this.itemSlots[i] = this.scene.add.sprite(this.slotSprite, this.slotLayer);
            this.itemSlots[i].scale = this.itemSlots[i].scale.mult(new Vec2(1, 1));
        }

        // Set the positions of the item slot sprites
        let width = this.itemSlots[0].size.x ;
        let height = this.itemSlots[0].size.y * this.itemSlots[0].scale.y;
        //for (let i = 0; i < this.size; i += 1) {
        //    this.itemSlots[i].position.set(this.start.x - 205 + i*(width + this.padding * 3),
        //                                    this.start.y + height/2 + 8).div(scalar);
        //}

        
        // Set the slot numbers in the user interface
        this.itemSlotNums = new Array<Label>();
        this.itemBackground = new Array<Rect>();

        for (let i = 0; i < this.size; i += 1) {

            this.itemBackground[i] = new Rect(new Vec2(this.start.x - 205 + i*(width + this.padding * 4.8),
            this.start.y + height/2 - 10).div(scalar), new Vec2(17 ,17));
            this.itemBackground[i].color = new Color(0, 0, 0, 0.1);
            this.itemBackground[i].borderColor = new Color(153, 255, 255, 255);
            this.itemBackground[i].borderWidth = 4;
            this.scene.getLayer(this.slotLayer).addNode(this.itemBackground[i]);
    

            this.itemSlotNums[i] = <Label>this.scene.add.uiElement(UIElementType.LABEL, this.slotLayer, {position: new Vec2(this.start.x - 205 + i*(width + this.padding * 4.8),
                 this.start.y + height/2 + 8).div(scalar), text: `${i + 1}`});
            this.itemSlotNums[i].fontSize = 13;
            this.itemSlotNums[i].font = "pixel";
            this.itemSlotNums[i].textColor = Color.BLACK;
        }



    }

 
    
    public update(deltaT: number): void {
        const viewport = this.scene.getViewport();
        const baseX = viewport.getOrigin().x + 10;  // 화면 왼쪽 여백
        const baseY = viewport.getOrigin().y + viewport.getHalfSize().y * 2 - 10;  // 화면 하단에서 10픽셀 위
        let width = this.itemSlots[0].size.x ;
        let height = this.itemSlots[0].size.y * this.itemSlots[0].scale.y;
        let scale = this.scene.getViewScale();
        let scalar = new Vec2(scale, scale);

        const items = Array.from(this.inventory.items()); // 아이템 배열로 변환
    
        let index = 0;
        for (let sprite of this.itemSlots) {
            sprite.position.set(baseX + index * (sprite.size.x + this.padding - 6), baseY);

            // 아이템의 위치도 업데이트 (해당 슬롯에 아이템이 있다면)
            if (index < items.length) {  // 배열의 길이를 사용
                const item = items[index];
                //item.getSprite().setLayer(this.scene.getLayer(this.itemLayer));  // 아이템 스프라이트의 레이어 변경
                item.getSprite().position.copy(sprite.position);  // 위치 업데이트
                item.getSprite().visible = true;  // 가시성 설정
            }          
            
            this.itemSlots[index].position.set(1000, 1000);
            
            index++;

        }
    }

}