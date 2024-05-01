/* eslint-disable @typescript-eslint/naming-convention */

export interface ConfigItem 
{
    [itemId: string]: {
        itemTplToClone: string;
        overrideProperties: {
            Prefab: {
                path: string;
                rcid: string;
            };
        };
        parentId: string;
        fleaPriceRoubles: number;
        handbookPriceRoubles: number;
        handbookParentId: string;
        locales: {
            [locale: string]: {
                name: string;
                shortName: string;
                description: string;
            };
        };
        clearClonedProps: boolean;
        addtoInventorySlots: string[];
        addtoModSlots: boolean;
        modSlot; string;
        ModdableItemWhitelist: string;
        ModdableItemBlacklist: string;
        addtoTraders: boolean;
        traderId: string;
        traderItems: {
            unlimitedCount: boolean;
            stackObjectsCount: number;
        }[];
        barterScheme: {
            count: number;
            _tpl: string;
        }[];
        loyallevelitems: number;
        addtoBots: boolean;
        addtostaticlootcontainer: boolean;
        StaticLootContainer: string;
        Probability: number;
    };
}
  
    
export const traderIDs: { [key: string]: string } = {
    "MECHANIC": "5a7c2eca46aef81a7ca2145d",
    "SKIER": "58330581ace78e27b8b10cee",
    "PEACEKEEPER": "5935c25fb3acc3127c3d8cd9",
    "THERAPIST": "54cb57776803fa99248b456e",
    "PRAPOR": "54cb50c76803fa8b248b4571",
    "JAEGAR": "5c0647fdd443bc2504c2d371",
    "RAGMAN": "5ac3b934156ae10c4430e83c"
};
    
export const currencyIDs: { [key: string]: string } = {
    "ROUBLES": "5449016a4bdc2d6f028b456f",
    "EUROS": "569668774bdc2da2298b4568",
    "DOLLARS": "5696686a4bdc2da3298b456a"
};
    

export const allBotTypes: { [key: string]: string } = {
    "ARENAFIGHTER": "arenafighter",
    "ARENAFIGHTEREVENT": "arenafighterevent",
    "ASSAULT": "assault",
    "BEAR": "bear",
    "RESHALA": "bossbully",
    "GLUHAR": "bossgluhar",
    "KILLA": "bosskilla",
    "KNIGHT": "bossknight",
    "SHTURMAN": "bosskojaniy",
    "SANITAR": "bosssanitar",
    "TAGILLA": "bosstagilla",
    "ZRYACHIY": "bosszryachiy",
    "CRAZYASSAULTEVENT": "crazyassaultevent",
    "CURSEDASSAULT": "cursedassault",
    "EXUSEC": "exusec",
    "FOLLOWERBIGPIPE": "followerbigpipe",
    "FOLLOWERBIRDEYE": "followerbirdeye",
    "FOLLOWERRESHALA": "followerbully",
    "FOLLOWERGLUHARASSAULT": "followergluharassault",
    "FOLLOWERGLUHARSCOUT": "followergluharscout",
    "FOLLOWERGLUHARSECURITY": "followergluharsecurity",
    "FOLLOWERGLUHAR SNIPE": "followergluharsnipe",
    "FOLLOWERSHTURMAN": "followerkojaniy",
    "FOLLOWERSANITAR": "followersanitar",
    "FOLLOWERTAGILLA": "followertagilla",
    "FOLLOWERZRYACHIY": "followerzryachiy",
    "GIFTER": "gifter",
    "MARKSMAN": "marksman",
    "PMC": "pmcbot",
    "CULTISTPRIEST": "sectantpriest",
    "CULTISTWARRIOR": "sectantwarrior",
    "USEC": "usec"
};

export const inventorySlots: { [key: string]: string } = {
    "FirstPrimaryWeapon" : "55d729c64bdc2d89028b4570",
    "SecondPrimaryWeapon" : "55d729d14bdc2d86028b456e",
    "Holster" : "55d729d84bdc2de3098b456b",
    "Scabbard" : "55d729e34bdc2d1b198b456d",
    "FaceCover" : "55d729e84bdc2d8a028b4569",
    "Headwear" : "55d729ef4bdc2d3a168b456c",
    "TacticalVest" : "55d729f74bdc2d87028b456e",
    "SecuredContainer" : "55d72a054bdc2d88028b456e",
    "Backpack" : "55d72a104bdc2d89028b4571",
    "ArmorVest" : "55d72a194bdc2d86028b456f",
    "Pockets" : "55d72a274bdc2de3098b456c",
    "Earpiece" : "5665b7164bdc2d144c8b4570",
    "Dogtag" : "59f0be1e86f77453be490939",
    "Eyewear" : "5a0ad9313f1241000e072755",
    "ArmBand" : "5b3f583786f77411d552fb2b"
}

  
  