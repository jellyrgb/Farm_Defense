export enum BattlerEvent {
    BATTLER_KILLED = "BATTLER_KILLED",
    BATTLER_RESPAWN = "BATTLER_RESPAWN",
    BATTLER_ATTACK = "BATTLER_ATTACKED",
    BATTLER_DAMAGED = "BATTLE_DAMAGED",
    
    BATTLER_CHANGE = "BATTLER_CHANGE",
    CONSUME = "CONSUME",
    HIT = "HIT",
}

export enum ItemEvent {
    ITEM_REQUEST = "ITEM_REQUEST",
    ITEM_GROW_UP = "ITEM_GROW_UP",
    ITEM_PICKED_UP = "ITEM_PICKED_UP",
    ITEM_DROPPED = "ITEM_DROPPED",

    WEAPON_USED = "WEAPON_USED",
    CONSUMABLE_USED = "CONSUMABLE_USED",
    INVENTORY_CHANGED = "INVENTORY_CHANGED",
}

export enum HudEvent {
    HEALTH_CHANGE = "HEALTH_CHANGE"
}

export enum PlayerEvent {
    PLAYER_KILLED = "PLAYER_KILLED"
}