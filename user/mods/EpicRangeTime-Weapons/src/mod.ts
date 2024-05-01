import * as fs from "fs";
import * as path from "path";
import { container } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ConfigItem, traderIDs, currencyIDs, allBotTypes, inventorySlots } from "./references/configstuff";
import { ItemMap } from "./references/items";
import { ItemBaseClassMap } from "./references/itemBaseClasses";
import { ItemHandbookCategoryMap } from "./references/itemHandbookCategories";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

class Mod implements IPostDBLoadMod
{
    private configs: ConfigItem;
    public logger: ILogger;

    constructor() 
    {
        this.configs = this.loadCombinedConfig();
    }
    
    

    public postDBLoad(): void 
    {
        const customItem = container.resolve<CustomItemService>("CustomItemService");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const jsonUtil: { clone: (data: any) => any } = container.resolve("JsonUtil");
        const tables = databaseServer.getTables();

        let numItemsAdded = 0;

        for (const itemId in this.configs) 
        {
            const itemConfig = this.configs[itemId];

            const { exampleCloneItem, finalItemTplToClone } = this.createExampleCloneItem(itemConfig, itemId);

            //console.log(`Item ID: ${itemId}`);
            //console.log(`Prefab Path: ${exampleCloneItem.overrideProperties?.Prefab.path}`);

            customItem.createItemFromClone(exampleCloneItem);

            this.processStaticLootContainers(itemConfig, itemId);
            this.processModSlots(itemConfig, [finalItemTplToClone], itemId); // Wrap finalItemTplToClone in an array
            this.processInventorySlots(itemConfig, itemId, tables); // Pass itemId and inventorySlots in the correct order            
            this.processMasterySections(itemConfig, itemId, tables);
            this.processWeaponPresets(itemConfig, itemId, tables);
            this.processBotInventories(itemConfig, finalItemTplToClone, itemId, tables);
            this.processTraders(itemConfig, tables, itemId);
            //this.modifyQuests(tables, jsonUtil);
            numItemsAdded++;
        }
        if (numItemsAdded > 0)
        {
            //console.log(`Loaded ${numItemsAdded} custom items.`);
        }
        else
        {
            //console.log("No custom items loaded.");
        }
        const database = tables.templates.items;
        for (let file in database) {
            let fileData = database[file];
			if (fileData._id === "5447a9cd4bdc2dbd208b4567") {
                fileData._props.Slots[2]._props.filters[0].Filter.push("5bb20d53d4351e4502010a69");
                console.log("Added HK416A5 Upper Receiver to M4A1 Successfully");
            }
            if (fileData._id === "5bb2475ed4351e00853264e3") {
                fileData._props.Slots[2]._props.filters[0].Filter.push("5c0e2f26d174af02a9625114",
                "55d355e64bdc2d962f8b4569",
                "5d4405aaa4b9361e6a4e6bd3",
                "5c07a8770db8340023300450",
                "59bfe68886f7746004266202",
                "63f5ed14534b2c3d5479a677");
                console.log("Added M4A1 Upper Receivers to HK416A5 Successfully");
            }
            if (fileData._id === "65266fd43341ed9aa903dd56") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("59d64fc686f774171b243fe2",
                "5a0d716f1526d8000d26b1e2",
                "5f633f68f5750b524b45f112",
                "5c878ebb2e2216001219d48a",
                "59e61eb386f77440d64f5daf",
                "59e8a00d86f7742ad93b569c",
                "5a9ea27ca2750c00137fa672",
                "5cc9ad73d7f00c000e2579d4",
                "5c7951452e221644f31bfd5c",
                "615d8e9867085e45ef1409c6",
                "5a0abb6e1526d8000a025282",
                "59bffc1f86f77435b128b872",
                "593d489686f7745c6255d58a",
                "5a0d63621526d8dba31fe3bf",
                "5a9fbacda2750c00141e080f",
                "64942bfc6ee699f6890dff95");
                console.log("Added AKM Muzzle Devices to RPD 350mm Barrel Successfully");
            }
            if (fileData._id === "6513eff1e06849f06c0957d4") {
                fileData._props.Slots[1]._props.filters[0].Filter.push("59d64fc686f774171b243fe2",
                "5a0d716f1526d8000d26b1e2",
                "5f633f68f5750b524b45f112",
                "5c878ebb2e2216001219d48a",
                "59e61eb386f77440d64f5daf",
                "59e8a00d86f7742ad93b569c",
                "5a9ea27ca2750c00137fa672",
                "5cc9ad73d7f00c000e2579d4",
                "5c7951452e221644f31bfd5c",
                "615d8e9867085e45ef1409c6",
                "5a0abb6e1526d8000a025282",
                "59bffc1f86f77435b128b872",
                "593d489686f7745c6255d58a",
                "5a0d63621526d8dba31fe3bf",
                "5a9fbacda2750c00141e080f",
                "64942bfc6ee699f6890dff95");
                console.log("Added AKM Muzzle Devices to RPD 520mm Barrel Successfully");
            }
            if (fileData._id === "5c7e5f112e221600106f4ede") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("40c62378fa93a829532ecc5e",
                "6d9f22a75064ebb92b3ece1c");
                console.log("Added M4-2000 Suppressors to AAC 51T 5.56x45 flash hider Successfully");
            }
            if (fileData._id === "5fbbfabed5cb881a7363194e") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("9930f05d4e38813e5ef5ff90");
                console.log("Added 300 blackout 3 prong to MCX 171mm barrel Successfully");
            }
            if (fileData._id === "5fbbfacda56d053a3543f799") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("9930f05d4e38813e5ef5ff90");
                console.log("Added 300 blackout 3 prong to MCX 229mm barrel Successfully");
            }
            if (fileData._id === "8f13f88e0c490b2f28dcf023") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("7f35c72194fb98852c83a2da");
                console.log("Added 556 3 prong to MCX 171mm 556 barrel Successfully");
            }
            if (fileData._id === "2905579cfacf2a9ddaa2a922") {
                fileData._props.Slots[0]._props.filters[0].Filter.push("7f35c72194fb98852c83a2da");
                console.log("Added 556 3 prong to MCX 229mm 556 barrel Successfully");
            }
            if (fileData._id === "5c0548ae0db834001966a3c2") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("5fbe3ffdf8b6a877a729ea82",
                "5fd20ff893a8961fc660a954",
                "619636be6db0f2477964e710",
                "6196364158ef8c428c287d9f",
                "6196365d58ef8c428c287da1",
                "64b8725c4b75259c590fa899");
                console.log("Added .300blk rounds to Circle 10 AK101/2 mag Successfully");
            }
            if (fileData._id === "5ac66c5d5acfc4001718d314") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("5fbe3ffdf8b6a877a729ea82",
                "5fd20ff893a8961fc660a954",
                "619636be6db0f2477964e710",
                "6196364158ef8c428c287d9f",
                "6196365d58ef8c428c287da1",
                "64b8725c4b75259c590fa899");
                console.log("Added .300blk rounds to 6L29 AK101/2 mag Successfully");
            }
            if (fileData._id === "5d25a6538abbc306c62e630d") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
            }
            if (fileData._id === "5d25a4a98abbc30b917421a4") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
            }
            if (fileData._id === "5d25a7b88abbc3054f3e60bc") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
            }
            if (fileData._id === "5ce69cbad7f00c00b61c5098") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
            }
            if (fileData._id === "5d25a6a48abbc306c62e6310") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
            }
            if (fileData._id === "5d25af8f8abbc3055079fec5") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
            }
            if (fileData._id === "5cf12a15d7f00c05464b293f") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");;
            }
            if (fileData._id === "5bfeaa0f0db834001b734927") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");;
            }
            if (fileData._id === "5bfea7ad0db834001c38f1ee") {
                fileData._props.Cartridges[0]._props.filters[0].Filter.push("6529243824cbe3c74a05e5c1",
                "6529302b8c26af6326029fb7");
                console.log("Added 6.8x51 rounds to M700 mags Successfully");
            }
        }
    }  

    /**
     * Creates an example clone item with the provided item configuration and item ID.
     *
     * @param {any} itemConfig - The configuration of the item to clone.
     * @param {string} itemId - The ID of the item.
     * @return {{ exampleCloneItem: NewItemFromCloneDetails, finalItemTplToClone: string }} The created example clone item and the final item template to clone.
     */
    private createExampleCloneItem(itemConfig: any, itemId: string): { exampleCloneItem: NewItemFromCloneDetails, finalItemTplToClone: string } 
    {
        const itemTplToCloneFromMap = ItemMap[itemConfig.itemTplToClone] || itemConfig.itemTplToClone;
        const finalItemTplToClone = itemTplToCloneFromMap;
    
        const parentIdFromMap = ItemBaseClassMap[itemConfig.parentId] || itemConfig.parentId;
        const finalParentId = parentIdFromMap;
    
        const handbookParentIdFromMap = ItemHandbookCategoryMap[itemConfig.handbookParentId] || itemConfig.handbookParentId;
        const finalHandbookParentId = handbookParentIdFromMap;
    
        const itemPrefabPath = `customItems/${itemId}.bundle`;
    
        const exampleCloneItem: NewItemFromCloneDetails = {
            itemTplToClone: finalItemTplToClone,
            overrideProperties: itemConfig.overrideProperties ? {
                ...itemConfig.overrideProperties,
                Prefab: {
                    path: itemConfig.overrideProperties.Prefab?.path || itemPrefabPath,
                    rcid: ""
                }
            } : undefined,
            parentId: finalParentId,
            newId: itemId,
            fleaPriceRoubles: itemConfig.fleaPriceRoubles,
            handbookPriceRoubles: itemConfig.handbookPriceRoubles,
            handbookParentId: finalHandbookParentId,
            locales: itemConfig.locales
        };
    
        if (itemConfig.clearClonedProps) 
        {
            exampleCloneItem.overrideProperties = itemConfig.overrideProperties ? [itemConfig.overrideProperties] : undefined;
        }
        //console.log(`Creating example clone item for item with ID: ${itemId}`);
    
        return { exampleCloneItem, finalItemTplToClone };
    }

    /**
 * Adds an item to a static loot container with a given probability.
 *
 * @param {string} containerID - The ID of the loot container.
 * @param {string} itemToAdd - The item to add to the loot container.
 * @param {number} probability - The probability of the item being added.
 * @return {void} This function does not return anything.
 */
    private addToStaticLoot(containerID: string, itemToAdd: string, probability: number): void 
    {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = db.getTables();
        const lootContainer = tables.loot.staticLoot[containerID];

        if (!lootContainer) 
        {
            //console.error(`Error: Invalid loot container ID: ${containerID}`);
            return;
        }

        const lootDistribution = lootContainer.itemDistribution;
        const templateFromMap = ItemMap[itemToAdd];
        const finalTemplate = templateFromMap || itemToAdd;

        const newLoot = [
            {
                tpl: finalTemplate,
                relativeProbability: probability
            }
        ];

        lootDistribution.push(...newLoot);
        lootContainer.itemDistribution = lootDistribution;
    }
    
    /**
     * Processes the static loot containers for a given item.
     *
     * @param {any} itemConfig - The configuration object for the item.
     * @param {string} itemId - The ID of the item.
     * @return {void} This function does not return a value.
     */
    private processStaticLootContainers(itemConfig: any, itemId: string): void 
    {
        if (itemConfig.addtoStaticLootContainers) 
        {
            //console.log("Processing static loot containers for item:", itemId);
            if (Array.isArray(itemConfig.StaticLootContainers)) 
            {
                //console.log("Adding item to multiple static loot containers:");
                itemConfig.StaticLootContainers.forEach(container => 
                {
                    const staticLootContainer = ItemMap[container.ContainerName] || container.ContainerName;
                    this.addToStaticLoot(staticLootContainer, itemId, container.Probability);
                    //console.log(` - Added to container '${staticLootContainer}' with probability ${container.Probability}`);
                });
            }
            else 
            {
                const staticLootContainer = ItemMap[itemConfig.StaticLootContainers] || itemConfig.StaticLootContainers;
                this.addToStaticLoot(staticLootContainer, itemId, itemConfig.Probability);
                //console.log(`Added to container '${staticLootContainer}' with probability ${itemConfig.Probability}`);
            }
        }
        else 
        {
            //console.log("Item not added to static loot containers.");
        }
    }
    
    /**
 * Processes the mod slots of an item.
 *
 * @param {any} itemConfig - The configuration of the item.
 * @param {string[]} finalItemTplToClone - The final item template to clone.
 * @param {string} itemId - The ID of the item.
 * @returns {void} 
 */
    private processModSlots(itemConfig: any, finalItemTplToClone: string[], itemId: string): void 
    {
        const db = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = db.getTables();

        const moddableItemWhitelistIds = Array.isArray(itemConfig.ModdableItemWhitelist)
            ? itemConfig.ModdableItemWhitelist.map(shortname => ItemMap[shortname])
            : itemConfig.ModdableItemWhitelist
                ? [ItemMap[itemConfig.ModdableItemWhitelist]]
                : [];

        const moddableItemBlacklistIds = Array.isArray(itemConfig.ModdableItemBlacklist)
            ? itemConfig.ModdableItemBlacklist.map(shortname => ItemMap[shortname])
            : itemConfig.ModdableItemBlacklist
                ? [ItemMap[itemConfig.ModdableItemBlacklist]]
                : [];

        const modSlots = Array.isArray(itemConfig.modSlot)
            ? itemConfig.modSlot
            : itemConfig.modSlot
                ? [itemConfig.modSlot]
                : [];

        const lowercaseModSlots = modSlots.map(modSlotName => modSlotName.toLowerCase());

        if (itemConfig.addtoModSlots) 
        {
            console.log("Processing mod slots for item:", itemId);
            for (const parentItemId in tables.templates.items) 
            {
                const parentItem = tables.templates.items[parentItemId];

                if (!parentItem._props.Slots) 
                {
                    continue;
                }

                const isBlacklisted = moddableItemBlacklistIds.includes(parentItemId);
                const isWhitelisted = moddableItemWhitelistIds.includes(parentItemId);

                if (isBlacklisted) 
                {
                    continue;
                }

                let addToModSlots = false;

                if (isWhitelisted && itemConfig.modSlot) 
                {
                    addToModSlots = true;
                }
                else if (!isBlacklisted && itemConfig.modSlot) 
                {
                    for (const modSlot of parentItem._props.Slots) 
                    {
                        if (
                            modSlot._props.filters &&
                        modSlot._props.filters[0].Filter.some(filterItem => finalItemTplToClone.includes(filterItem))
                        ) 
                        {
                            if (lowercaseModSlots.includes(modSlot._name.toLowerCase())) 
                            {
                                addToModSlots = true;
                                break;
                            }
                        }
                    }
                }

                if (addToModSlots) 
                {
                    for (const modSlot of parentItem._props.Slots) 
                    {
                        if (lowercaseModSlots.includes(modSlot._name.toLowerCase())) 
                        {
                            if (!modSlot._props.filters) 
                            {
                                modSlot._props.filters = [{
                                    "AnimationIndex": 0,
                                    "Filter": []
                                }];
                            }
                            if (!modSlot._props.filters[0].Filter.includes(itemId)) 
                            {
                                modSlot._props.filters[0].Filter.push(itemId);
                                console.log(`Successfully added item ${itemId} to the filter of mod slot ${modSlot._name} for parent item ${parentItemId}`);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
 * Processes the inventory slots for a given item.
 *
 * @param {any} itemConfig - The configuration object for the item.
 * @param {string} itemId - The ID of the item.
 * @param {any} defaultInventorySlots - The default inventory slots.
 * @return {void} This function does not return a value.
 */
    private processInventorySlots(itemConfig: any, itemId: string, tables: any): void 
    {
        if (itemConfig.addtoInventorySlots) 
        {
            //console.log("Processing inventory slots for item:", itemId);
            const defaultInventorySlots = tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots;
    
            const allowedSlots = Array.isArray(itemConfig.addtoInventorySlots) ? itemConfig.addtoInventorySlots : [itemConfig.addtoInventorySlots];

            // Iterate over the slots and push the item into the filters per the config
            for (const slot of defaultInventorySlots) 
            {
                const slotName = inventorySlots[slot._name];
                const slotId = Object.keys(inventorySlots).find(key => inventorySlots[key] === slot._name);

                if (allowedSlots.includes(slot._name) || allowedSlots.includes(slotName) || allowedSlots.includes(slotId)) 
                {
                    if (!slot._props.filters[0].Filter.includes(itemId)) 
                    {
                        slot._props.filters[0].Filter.push(itemId);
                        //console.log(`Successfully added item ${itemId} to the filter of slot ${slot._name}`);
                    }
                }
            }
        }
    }

    /**
 * Processes the mastery sections for an item.
 *
 * @param {any} itemConfig - The configuration object for the item.
 * @param {string} itemId - The ID of the item.
 * @param {any} tables - The tables object containing global configuration.
 * @return {void} This function does not return a value.
 */
    private processMasterySections(itemConfig: any, itemId: string, tables: any): void 
    {
        if (itemConfig.masteries) 
        {
            //console.log("Processing mastery sections for item:", itemId);
            const masterySections = Array.isArray(itemConfig.masterySections) ? itemConfig.masterySections : [itemConfig.masterySections];

            for (const mastery of masterySections) 
            {
                const existingMastery = tables.globals.config.Mastering.find(existing => existing.Name === mastery.Name);
                if (existingMastery) 
                {
                    existingMastery.Templates.push(...mastery.Templates);
                    //console.log(` - Adding to existing mastery section for item: ${itemId}`);
                }
                else 
                {
                    tables.globals.config.Mastering.push(mastery);
                    //console.log(` - Adding new mastery section for item: ${itemId}`);
                }
            }
        }
    }
    

    /**
     * Processes weapon presets based on the provided item configuration and tables.
     *
     * @param {any} itemConfig - The item configuration.
     * @param {any} tables - The tables.
     * @return {void} This function does not return anything.
     */
    private processWeaponPresets(itemConfig: any, itemId: string, tables: any): void 
    {
        const { addweaponpreset, weaponpresets } = itemConfig;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { ItemPresets } = tables.globals;
    
        if (addweaponpreset) 
        {
            //console.log("Processing weapon presets for item:", itemId);
            if (Array.isArray(weaponpresets)) 
            {
                weaponpresets.forEach(preset => 
                {
                    ItemPresets[preset._id] = preset;
                    //console.log(` - Adding weapon preset for item: ${preset._id}`);
                });
            }
            else 
            {
                ItemPresets[weaponpresets._id] = weaponpresets;
                //console.log(` - Adding weapon preset for item: ${weaponpresets._id}`);
            }
        }
    }
    

    /**
 * Processes traders based on the item configuration.
 *
 * @param {any} itemConfig - The configuration of the item.
 * @param {any} tables - The tables containing the traders.
 * @param {string} itemId - The ID of the item.
 * @return {void} This function does not return a value.
 */
    private processTraders(itemConfig: any, tables: any, itemId: string): void 
    {

        if (!itemConfig.addtoTraders) 
        {
            return;
        }

        const { traderId, traderItems, barterScheme } = itemConfig;

        const traderIdFromMap = traderIDs[traderId];
        const finalTraderId = traderIdFromMap || traderId;
        const trader = tables.traders[finalTraderId];

        if (!trader) 
        {
            return;
        }
        //console.log("Processing traders for item:", itemId);
        for (const item of traderItems) 
        {
            
            const newItem = {
                "_id": itemId,
                "_tpl": itemId,
                "parentId": "hideout",
                "slotId": "hideout",
                "upd": {
                    "UnlimitedCount": item.unlimitedCount,
                    "StackObjectsCount": item.stackObjectsCount
                }
            };

            trader.assort.items.push(newItem);
            //console.log(`Successfully added item ${itemId} to the trader ${traderId}`);
        }

        trader.assort.barter_scheme[itemId] = [];

        for (const scheme of barterScheme) 
        {
            //console.log("Processing trader barter scheme for item:", itemId);
            const count = scheme.count;
            const tpl = currencyIDs[scheme._tpl] || ItemMap[scheme._tpl];

            if (!tpl) 
            {
                throw new Error(`Invalid _tpl value in barterScheme for item: ${itemId}`);
            }

            trader.assort.barter_scheme[itemId].push([
                {
                    "count": count,
                    "_tpl": tpl
                }
            ]);
            //console.log(`Successfully added item ${itemId} to the barter scheme of trader ${traderId}`);
        }

        trader.assort.loyal_level_items[itemId] = itemConfig.loyallevelitems;
    }

    /**
     * Modify the quests in the given tables using the provided JSON utility.
     *
     * @param {any} tables - the tables containing the quests
     * @param {any} jsonUtil - the JSON utility for cloning objects
     * @return {void} 
     */
    private modifyQuests(tables: any, jsonUtil: any): void 
    {
        const armoredVests = [
            ["punisher_slick", "punisher_slick_AE", "punisher_slick_2"]
        ];
        const armoredGear = [
            ["punisher_helmet", "punisher_mask"]
        ];
    
        const survivalistPathQuest = tables.templates.quests["5d25aed386f77442734d25d2"];
        if (survivalistPathQuest) 
        {
            const survivalistPathGear = survivalistPathQuest.conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive;
    
            survivalistPathQuest.conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive = [
                ...jsonUtil.clone(survivalistPathGear),
                ...armoredVests
            ];
        }
    
        const swiftOneQuest = tables.templates.quests["60e729cf5698ee7b05057439"];
        if (swiftOneQuest) 
        {
            const swiftOneGear = swiftOneQuest.conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive;
    
            swiftOneQuest.conditions.AvailableForFinish[0]._props.counter.conditions[1]._props.equipmentExclusive = [
                ...jsonUtil.clone(swiftOneGear),
                ...armoredVests,
                ...armoredGear
            ];
        }
    }
    
    /**
     * Processes the bot inventories based on the given item configuration.
     *
     * @param {any} itemConfig - The item configuration.
     * @param {string} finalItemTplToClone - The final item template to clone.
     * @param {string} itemId - The item ID.
     * @param {any} tables - The tables object.
     * @return {void} This function does not return anything.
     */
    private processBotInventories(itemConfig: any, finalItemTplToClone: string, itemId: string, tables: any): void 
    {
        if (itemConfig.addtoBots) 
        {
            //console.log("Processing traders for item:", itemId);
            for (const botId in tables.bots.types) 
            {
                const botType = allBotTypes[botId];
                if (botType) 
                {
                    for (const lootSlot in tables.bots.types[botId].inventory.items) 
                    {
                        const items = tables.bots.types[botId].inventory.items;
                        if (items[lootSlot].includes(finalItemTplToClone)) 
                        {
                            //console.log(` - Adding item to bot inventory for bot type: ${botType}`);
                            items.Backpack.push(itemId);
                            items.TacticalVest.push(itemId);
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Loads and combines multiple configuration files into a single ConfigItem object.
     *
     * @return {ConfigItem} The combined configuration object.
     */
    private loadCombinedConfig(): ConfigItem 
    {
        const configFiles = fs.readdirSync(path.join(__dirname, "../../EpicRangeTime-Weapons/db/Items"))
    
        const combinedConfig: ConfigItem = {};
    
        configFiles.forEach(file => 
        {
            const configPath = path.join(__dirname, "../../EpicRangeTime-Weapons/db/Items", file);
            const configFileContents = fs.readFileSync(configPath, "utf-8");
            const config = JSON.parse(configFileContents) as ConfigItem;
    
            Object.assign(combinedConfig, config);
        });
    
        return combinedConfig;
    }
    
}

module.exports = { mod: new Mod };