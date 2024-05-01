import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { ITraderBase, ITraderAssort } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

export class TraderHelper {
    /**
    * Add profile picture to our trader
    * @param baseJson json file for trader (db/base.json)
    * @param preAkiModLoader mod loader class - used to get the mods file path
    * @param imageRouter image router class - used to register the trader image path so we see their image on trader page
    * @param traderImageName Filename of the trader icon to use
    */
    public registerProfileImage(baseJson: any, modName: string, preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter, traderImageName: string): void {
        // Reference the mod "res" folder
        const imageFilepath = `./${preAkiModLoader.getModPath(modName)}res`;

        // Register a route to point to the profile picture - remember to remove the .jpg from it
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/${traderImageName}`);
    }

    /**
     * Add record to trader config to set the refresh time of trader in seconds (default is 60 minutes)
     * @param traderConfig trader config to add our trader to
     * @param baseJson json file for trader (db/base.json)
     * @param refreshTimeSecondsMin How many seconds between trader stock refresh min time
     * @param refreshTimeSecondsMax How many seconds between trader stock refresh max time
     */
    public setTraderUpdateTime(traderConfig: ITraderConfig, baseJson: any, refreshTimeSecondsMin: number, refreshTimeSecondsMax: number): void {
        // Add refresh time in seconds to config
        const traderRefreshRecord: UpdateTime = {
            traderId: baseJson._id,
            seconds: {
                min: refreshTimeSecondsMin,
                max: refreshTimeSecondsMax
            }
        };

        traderConfig.updateTime.push(traderRefreshRecord);
    }

    /**
     * Add our new trader to the database
     * @param traderDetailsToAdd trader details
     * @param tables database
     * @param jsonUtil json utility class
     */
    // rome-ignore lint/suspicious/noExplicitAny: traderDetailsToAdd comes from base.json, so no type
    public addTraderToDb(traderDetailsToAdd: any, tables: IDatabaseTables, jsonUtil: JsonUtil): void {
        // Add trader to trader table, key is the traders id
        tables.traders[traderDetailsToAdd._id] = {
            assort: this.createAssortTable(), // assorts are the 'offers' trader sells, can be a single item (e.g. carton of milk) or multiple items as a collection (e.g. a gun)
            base: jsonUtil.deserialize(jsonUtil.serialize(traderDetailsToAdd)) as ITraderBase, // Deserialise/serialise creates a copy of the json and allows us to cast it as an ITraderBase
            questassort: {
                started: {},
                success: {},
                fail: {}
            } // questassort is empty as trader has no assorts unlocked by quests
        };
    }

    /**
     * Create basic data for trader + add empty assorts table for trader
     * @param tables SPT db
     * @param jsonUtil SPT JSON utility class
     * @returns ITraderAssort
     */
    private createAssortTable(): ITraderAssort {
        // Create a blank assort object, ready to have items added
        const assortTable: ITraderAssort = {
            nextResupply: 0,
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        }

        return assortTable;
    }

    /**
     * Create a weapon from scratch, ready to be added to trader
     * @returns Item[]
     */


    public createVEST2(): Item[] {
        const VEST2: Item[] = [];

        VEST2.push({
            _id: "vest2Base",
            _tpl: "5e9dacf986f774054d6b89f4"
        });
        VEST2.push({
            _id: "vest2Base4",
            _tpl: "65732de75d3a3129fb05f3dd",
            parentId: "vest2Base",
            slotId: "Soft_armor_front"
        });
        VEST2.push({
            _id: "vest2Base5",
            _tpl: "65732df4d0acf75aea06c87b",
            parentId: "vest2Base",
            slotId: "Soft_armor_back"
        });
        VEST2.push({
            _id: "vest2Base3",
            _tpl: "65732e05d0acf75aea06c87f",
            parentId: "vest2Base",
            slotId: "Soft_armor_left"
        });
        VEST2.push({
            _id: "vest2Base2",
            _tpl: "65732e0f6784ca384b0167ad",
            parentId: "vest2Base",
            slotId: "soft_armor_right"
        });
        VEST2.push({
            _id: "vest2Base9",
            _tpl: "65732e215d3a3129fb05f3e1",
            parentId: "vest2Base",
            slotId: "Collar"
        });
        VEST2.push({
            _id: "vest2Base6",
            _tpl: "65732e30dd8739f6440ef383",
            parentId: "vest2Base",
            slotId: "Groin"
        });
        VEST2.push({
            _id: "vest2Base7",
            _tpl: "65573fa5655447403702a816",
            parentId: "vest2Base",
            slotId: "Front_plate"
        });
        VEST2.push({
            _id: "vest2Base8",
            _tpl: "65573fa5655447403702a816",
            parentId: "vest2Base",
            slotId: "Back_plate"
        });
        return VEST2;
    }

    public createVEST3(): Item[] {
        const VEST3: Item[] = [];

        VEST3.push({
            _id: "vest3Base",
            _tpl: "5c0e655586f774045612eeb2"
        });
        VEST3.push({
            _id: "vest3Base4",
            _tpl: "6570e025615f54368b04fcb0",
            parentId: "vest3Base",
            slotId: "Soft_armor_front"
        });
        VEST3.push({
            _id: "vest3Base5",
            _tpl: "6570e0610b57c03ec90b96ef",
            parentId: "vest3Base",
            slotId: "Soft_armor_back"
        });
        VEST3.push({
            _id: "vest3Base7",
            _tpl: "656fad8c498d1b7e3e071da0",
            parentId: "vest3Base",
            slotId: "Front_plate"
        });
        VEST3.push({
            _id: "vest3Base8",
            _tpl: "656fad8c498d1b7e3e071da0",
            parentId: "vest3Base",
            slotId: "Back_plate"
        });
        return VEST3;
    }

    public createVEST5(): Item[] {
        const VEST5: Item[] = [];

        VEST5.push({
            _id: "vest5Base",
            _tpl: "609e8540d5c319764c2bc2e9"
        });
        VEST5.push({
            _id: "vest5Base4",
            _tpl: "6572e5221b5bc1185508c24f",
            parentId: "vest5Base",
            slotId: "Soft_armor_front"
        });
        VEST5.push({
            _id: "vest5Base5",
            _tpl: "6572e52f73c0eabb700109a0",
            parentId: "vest5Base",
            slotId: "Soft_armor_back"
        });
        VEST5.push({
            _id: "vest5Base22",
            _tpl: "6572e53c73c0eabb700109a4",
            parentId: "vest5Base",
            slotId: "Soft_armor_left"
        });
        VEST5.push({
            _id: "vest5Base2",
            _tpl: "6572e54873c0eabb700109a8",
            parentId: "vest5Base",
            slotId: "soft_armor_right"
        });
        VEST5.push({
            _id: "vest5Base7",
            _tpl: "656f9fa0498d1b7e3e071d98",
            parentId: "vest5Base",
            slotId: "Front_plate"
        });
        VEST5.push({
            _id: "vest5Base8",
            _tpl: "656f9fa0498d1b7e3e071d98",
            parentId: "vest5Base",
            slotId: "Back_plate"
        });
        VEST5.push({
            _id: "vest5Base9",
            _tpl: "64afd81707e2cf40e903a316",
            parentId: "vest5Base",
            slotId: "Right_side_plate"
        });
        VEST5.push({
            _id: "vest5Base10",
            _tpl: "64afd81707e2cf40e903a316",
            parentId: "vest5Base",
            slotId: "Left_side_plate"
        });
        return VEST5;
    }

    public createVEST6(): Item[] {
        const VEST6: Item[] = [];

        VEST6.push({
            _id: "vest6Base",
            _tpl: "5c0e5edb86f77461f55ed1f7"
        });
        VEST6.push({
            _id: "vest6Base4",
            _tpl: "6571dbd388ead79fcf091d71",
            parentId: "vest6Base",
            slotId: "Soft_armor_front"
        });
        VEST6.push({
            _id: "vest6Base5",
            _tpl: "6571dbda88ead79fcf091d75",
            parentId: "vest6Base",
            slotId: "Soft_armor_back"
        });
        VEST6.push({
            _id: "vest6Base22",
            _tpl: "6571dbe07c02ae206002502e",
            parentId: "vest6Base",
            slotId: "Soft_armor_left"
        });
        VEST6.push({
            _id: "vest6Base2",
            _tpl: "6571dbeaee8ec43d520cf89e",
            parentId: "vest6Base",
            slotId: "soft_armor_right"
        });
        VEST6.push({
            _id: "vest6Base7",
            _tpl: "656f57dc27aed95beb08f628",
            parentId: "vest6Base",
            slotId: "Front_plate"
        });
        VEST6.push({
            _id: "vest6Base8",
            _tpl: "656fac30c6baea13cd07e10c",
            parentId: "vest6Base",
            slotId: "Back_plate"
        });
        VEST6.push({
            _id: "vest6Base9",
            _tpl: "6571dbef88ead79fcf091d79",
            parentId: "vest6Base",
            slotId: "Collar"
        });
        return VEST6;
    }

    public createARTEMWEAPON1(): Item[] {
        const ARTEMWEAPON1: Item[] = [];

        ARTEMWEAPON1.push({
            _id: "d3e596510517351628000e6b",
            _tpl: "5447a9cd4bdc2dbd208b4567"
        });
        ARTEMWEAPON1.push({
            _id: "3115d5c88024b503adfddd43",
            _tpl: "5b7be4895acfc400170e2dd5",
            parentId: "5a107d09c7eae093fba11e79",
            slotId: "mod_foregrip"
        });

        ARTEMWEAPON1.push({
            _id: "116dd1217b97766b66fdc4d8",
            _tpl: "6269220d70b6c02e665f2635",
            parentId: "5a107d09c7eae093fba11e79",
            slotId: "mod_mount_002"
        });

        ARTEMWEAPON1.push({
            _id: "077acb3a21d4bc3f5a872164",
            _tpl: "6269220d70b6c02e665f2635",
            parentId: "5a107d09c7eae093fba11e79",
            slotId: "mod_mount_001"
        });

        ARTEMWEAPON1.push({
            _id: "b63feb7f95ec5e865706be42",
            _tpl: "6269220d70b6c02e665f2635",
            parentId: "5a107d09c7eae093fba11e79",
            slotId: "mod_mount_000"
        });

        ARTEMWEAPON1.push({
            _id: "fc01e293f73f4cc63db20a83",
            _tpl: "5c18b90d2e2216152142466b",
            parentId: "5a107d09c7eae093fba11e79",
            slotId: "mod_sight_front"
        });

        ARTEMWEAPON1.push({
            _id: "68dbbb852d45034c74f973af",
            _tpl: "5d1340b3d7ad1a0b52682ed7",
            parentId: "d3e596510517351628000e6b",
            slotId: "mod_magazine"
        });

        ARTEMWEAPON1.push({
            _id: "40e47baa66886f8f1c9a3ea9",
            _tpl: "57af48872459771f0b2ebf11",
            parentId: "d3e596510517351628000e6b",
            slotId: "mod_pistol_grip"
        });

        ARTEMWEAPON1.push({
            _id: "0993f2f016991d89b156c597",
            _tpl: "5c18b9192e2216398b5a8104",
            parentId: "0844074babf4bd94a94bacda",
            slotId: "mod_sight_rear"
        });

        ARTEMWEAPON1.push({
            _id: "394afd7e57d3abdd2ab8c418",
            _tpl: "626667e87379c44d557b7550",
            parentId: "9f2f73a99789e42efd51215e",
            slotId: "mod_muzzle"
        });

        ARTEMWEAPON1.push({
            _id: "1f13c05c459ee15b85fec237",
            _tpl: "5d00ec68d7ad1a04a067e5be",
            parentId: "9f2f73a99789e42efd51215e",
            slotId: "mod_gas_block"
        });

        ARTEMWEAPON1.push({
            _id: "eb210723a926009d5fb028a7",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "116dd1217b97766b66fdc4d8",
            slotId: "mod_tactical"
        });

        ARTEMWEAPON1.push({
            _id: "5a107d09c7eae093fba11e79",
            _tpl: "5c6d5d8b2e221644fc630b39",
            parentId: "0844074babf4bd94a94bacda",
            slotId: "mod_handguard"
        });

        ARTEMWEAPON1.push({
            _id: "27aaeeed06fb8e14c3da3ac5",
            _tpl: "655df24fdf80b12750626d0a",
            parentId: "3115d5c88024b503adfddd43",
            slotId: "mod_foregrip"
        });

        ARTEMWEAPON1.push({
            _id: "72204e2aebc13f4e0e16f48d",
            _tpl: "5ea16d4d5aad6446a939753d",
            parentId: "d3e596510517351628000e6b",
            slotId: "mod_charge"
        });

        ARTEMWEAPON1.push({
            _id: "9f2f73a99789e42efd51215e",
            _tpl: "55d35ee94bdc2d61338b4568",
            parentId: "0844074babf4bd94a94bacda",
            slotId: "mod_barrel"
        });

        ARTEMWEAPON1.push({
            _id: "37b444d0ab9fd405c4614428",
            _tpl: "5d135ecbd7ad1a21c176542e",
            parentId: "b44eeaf9ec313a28d1753407",
            slotId: "mod_stock_000"
        });

        ARTEMWEAPON1.push({
            _id: "0844074babf4bd94a94bacda",
            _tpl: "63f5ed14534b2c3d5479a677",
            parentId: "d3e596510517351628000e6b",
            slotId: "mod_reciever"
        });

        ARTEMWEAPON1.push({
            _id: "dd49325befacada97f21cb13",
            _tpl: "626673016f1edc06f30cf6d5",
            parentId: "394afd7e57d3abdd2ab8c418",
            slotId: "mod_muzzle"
        });

        ARTEMWEAPON1.push({
            _id: "b44eeaf9ec313a28d1753407",
            _tpl: "5c793fb92e221644f31bfb64",
            parentId: "d3e596510517351628000e6b",
            slotId: "mod_stock"
        });

        ARTEMWEAPON1.push({
            _id: "252c6d39c82c21a0bab7b92d",
            _tpl: "5c0a2cec0db834001b7ce47d",
            parentId: "0844074babf4bd94a94bacda",
            slotId: "mod_scope"
        });
        return ARTEMWEAPON1;
    }


    public createARTEMWEAPON2(): Item[] {
        const ARTEMWEAPON2: Item[] = [];

        ARTEMWEAPON2.push({
            _id: "926ca84539a661f3047f83c9",
            _tpl: "59d6088586f774275f37482f",
        });
        ARTEMWEAPON2.push({
            _id: "ccc6b26dda306c2f4ec17b82",
            _tpl: "59d64ec286f774171d1e0a42",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_gas_block"
        });
        
        ARTEMWEAPON2.push({
            _id: "7d8812aa94be47c7e4e4a7b5",
            _tpl: "5648ac824bdc2ded0b8b457d",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_charge"
        });
        
        ARTEMWEAPON2.push({
            _id: "e0c6e7614c8807696f7dcb5a",
            _tpl: "59fafc5086f7740dbe19f6c3",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_magazine"
        });
        
        ARTEMWEAPON2.push({
            _id: "63198f21f898b6a2dcad2ab3",
            _tpl: "651580dc71a4f10aec4b6056",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_pistol_grip"
        });
        
        ARTEMWEAPON2.push({
            _id: "2e3648300d6a18d510c30c2a",
            _tpl: "5d2c76ed48f03532f2136169",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_reciever"
        });
        
        ARTEMWEAPON2.push({
            _id: "df99d55fbff84972df304c72",
            _tpl: "5cc9ad73d7f00c000e2579d4",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_muzzle"
        });
        
        ARTEMWEAPON2.push({
            _id: "46fbd5b4659bb20cd6e27d6f",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "8f61bf8165f1ec1f75e9f073",
            slotId: "mod_tactical_000"
        });
        
        ARTEMWEAPON2.push({
            _id: "f5e272b4e5ac8a584f31c6a7",
            _tpl: "5c1bc5612e221602b5429350",
            parentId: "8f61bf8165f1ec1f75e9f073",
            slotId: "mod_foregrip"
        });
        
        ARTEMWEAPON2.push({
            _id: "8f61bf8165f1ec1f75e9f073",
            _tpl: "5efaf417aeb21837e749c7f2",
            parentId: "ccc6b26dda306c2f4ec17b82",
            slotId: "mod_handguard"
        });
        
        ARTEMWEAPON2.push({
            _id: "4cf821afe1ffc48fd15f949d",
            _tpl: "6087e2a5232e5a31c233d552",
            parentId: "926ca84539a661f3047f83c9",
            slotId: "mod_stock"
        });
        
        ARTEMWEAPON2.push({
            _id: "f931040a9a39aab820389927",
            _tpl: "584924ec24597768f12ae244",
            parentId: "2e3648300d6a18d510c30c2a",
            slotId: "mod_scope"
        });
        return ARTEMWEAPON2;
    }

    
    public createARTEMWEAPON3(): Item[] {
        const ARTEMWEAPON3: Item[] = [];

        ARTEMWEAPON3.push({
            _id: "5ead6c4e4ba9c3bd985111e0",
            _tpl: "5fbcc1d9016cce60e8341ab3",
        });
        ARTEMWEAPON3.push({
            _id: "212d4bb791d3ad91e3ac9416",
            _tpl: "5fbcbd6c187fea44d52eda14",
            parentId: "5ead6c4e4ba9c3bd985111e0",
            slotId: "mod_pistol_grip"
        });
        
        ARTEMWEAPON3.push({
            _id: "c9e324ac0598a59e89b8c64a",
            _tpl: "55d4887d4bdc2d962f8b4570",
            parentId: "5ead6c4e4ba9c3bd985111e0",
            slotId: "mod_magazine"
        });
        
        ARTEMWEAPON3.push({
            _id: "713d9d700688944f0915a4ed",
            _tpl: "5fbcc3e4d6fa9c00c571bb58",
            parentId: "5ead6c4e4ba9c3bd985111e0",
            slotId: "mod_reciever"
        });
        
        ARTEMWEAPON3.push({
            _id: "7622e09132a61e4291d6f56f",
            _tpl: "5fbbfacda56d053a3543f799",
            parentId: "713d9d700688944f0915a4ed",
            slotId: "mod_barrel"
        });
        
        ARTEMWEAPON3.push({
            _id: "cd57926a342914d3fd11861f",
            _tpl: "5fbc22ccf24b94483f726483",
            parentId: "7622e09132a61e4291d6f56f",
            slotId: "mod_muzzle"
        });
        
        ARTEMWEAPON3.push({
            _id: "0e4f8d6b2994c855dbf41f77",
            _tpl: "5fbc210bf24b94483f726481",
            parentId: "7622e09132a61e4291d6f56f",
            slotId: "mod_gas_block"
        });
        
        ARTEMWEAPON3.push({
            _id: "0d9894cc8ff8d59ce5abe655",
            _tpl: "5fc0fa957283c4046c58147e",
            parentId: "713d9d700688944f0915a4ed",
            slotId: "mod_sight_rear"
        });
        
        ARTEMWEAPON3.push({
            _id: "19e873c2e55983444dac1133",
            _tpl: "5fbcc640016cce60e8341acc",
            parentId: "5ead6c4e4ba9c3bd985111e0",
            slotId: "mod_charge"
        });
        
        ARTEMWEAPON3.push({
            _id: "4d6abc77a5adcf392a1c2312",
            _tpl: "59e0bdb186f774156f04ce82",
            parentId: "ddbc3080138b34ecda9e8934",
            slotId: "mod_mount_001"
        });
        
        ARTEMWEAPON3.push({
            _id: "e5c607c0dd9d84cb85b523a8",
            _tpl: "616554fe50224f204c1da2aa",
            parentId: "713d9d700688944f0915a4ed",
            slotId: "mod_scope"
        });
        
        ARTEMWEAPON3.push({
            _id: "01fa7df227f6472d3eac7050",
            _tpl: "58d39b0386f77443380bf13c",
            parentId: "e5c607c0dd9d84cb85b523a8",
            slotId: "mod_scope"
        });
        
        ARTEMWEAPON3.push({
            _id: "5a02bc008474511c7e24edbb",
            _tpl: "5fbcbd02900b1d5091531dd3",
            parentId: "cd57926a342914d3fd11861f",
            slotId: "mod_muzzle_000"
        });
        
        ARTEMWEAPON3.push({
            _id: "4e33d7026c35ea87fbf87760",
            _tpl: "59e0bed186f774156f04ce84",
            parentId: "ddbc3080138b34ecda9e8934",
            slotId: "mod_foregrip"
        });
        
        ARTEMWEAPON3.push({
            _id: "2ea8c7256771db15ad4e03d0",
            _tpl: "5c5db6f82e2216003a0fe914",
            parentId: "5ead6c4e4ba9c3bd985111e0",
            slotId: "mod_stock"
        });
        
        ARTEMWEAPON3.push({
            _id: "89048c91bd14709057ea0f1f",
            _tpl: "588226d124597767ad33f787",
            parentId: "4e33d7026c35ea87fbf87760",
            slotId: "mod_foregrip"
        });
        
        ARTEMWEAPON3.push({
            _id: "7122fe50897a6a7e5ee45062",
            _tpl: "56def37dd2720bec348b456a",
            parentId: "4d6abc77a5adcf392a1c2312",
            slotId: "mod_tactical"
        });
        
        ARTEMWEAPON3.push({
            _id: "ddbc3080138b34ecda9e8934",
            _tpl: "5fbc227aa56d053a3543f79e",
            parentId: "713d9d700688944f0915a4ed",
            slotId: "mod_handguard"
        });
        
        ARTEMWEAPON3.push({
            _id: "af3b842634839c010b5f93b5",
            _tpl: "5b3116595acfc40019476364",
            parentId: "01fa7df227f6472d3eac7050",
            slotId: "mod_scope"
        });
        
        ARTEMWEAPON3.push({
            _id: "a720f52a78157e31fee62281",
            _tpl: "5fbe760793164a5b6278efc8",
            parentId: "cd57926a342914d3fd11861f",
            slotId: "mod_muzzle_001"
        });

        return ARTEMWEAPON3;
    }

    /**
    * Add traders name/location/description to the locale table
    * @param baseJson json file for trader (db/base.json)
    * @param tables database tables
    * @param fullName Complete name of trader
    * @param firstName First name of trader
    * @param nickName Nickname of trader
    * @param location Location of trader (e.g. "Here in the cat shop")
    * @param description Description of trader
    */
    public addTraderToLocales(baseJson: any, tables: IDatabaseTables, fullName: string, firstName: string, nickName: string, location: string, description: string) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = fullName;
            locale[`${baseJson._id} FirstName`] = firstName;
            locale[`${baseJson._id} Nickname`] = nickName;
            locale[`${baseJson._id} Location`] = location;
            locale[`${baseJson._id} Description`] = description;
        }
    }
}