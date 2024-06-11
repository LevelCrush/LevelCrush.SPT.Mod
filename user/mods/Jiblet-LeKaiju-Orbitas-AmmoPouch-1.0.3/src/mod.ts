import { DependencyContainer } from "tsyringe";
import { IPostAkiLoadMod } from "@spt-aki/models/external/IPostAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";

import * as config from "../config/config.json";
const logging = config.Logging;

class Mod implements IPostAkiLoadMod, IPostDBLoadMod {
    logger: ILogger
    modName: string
    modVersion: string
    container: DependencyContainer;

    constructor() {
        this.modName = "Jiblet's Ammo Pouch"; // Set name and version of the mod so we can log it to console later
        this.modVersion = "1.0.3";
    }

    public postAkiLoad(container: DependencyContainer): void {
        this.container = container;
    }

    public postDBLoad(container: DependencyContainer): void {
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.log(`[${this.modName} : ${this.modVersion}] : Mod loading`, "green");
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const tables = databaseServer.getTables();
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global) as Record<string, string>[];

        const SMALL_SICC_ID = "5d235bb686f77443f4331278";

        const itemId = "Ammo_Pouch",
            itemCategory = "5795f317245977243854e041",
            itemFleaPrice = config.price,
            itemPrefabPath = "AmmoPouch/patron_6mm_airsoft.bundle",
            itemName = "Ammo Pouch",
            itemShortName = "AmmoPouch",
            itemDescription = "A pouch for ammunition",
            itemTraderPrice = config.price;

        const item = jsonUtil.clone(tables.templates.items[SMALL_SICC_ID]);

        item._id = itemId;
        item._props.Prefab.path = itemPrefabPath;

        //Dooo Eeeet
        item._props.Grids = this.createGrid(container, itemId, config.InternalSize);
        //Set external size of the container:
        item._props.Width = config.ExternalSize.cellH;
        item._props.Height = config.ExternalSize.cellV;

        tables.templates.items[itemId] = item;
        
        // Add locales
        for (const locale of locales) {
            locale[`${itemId} Name`] = itemName;
            locale[`${itemId} ShortName`] = itemShortName;
            locale[`${itemId} Description`] = itemDescription;
        }

        handbook.Items.push(
            {
                "Id": itemId,
                "ParentId": itemCategory,
                "Price": itemFleaPrice
            }
        );

        //Check config and make it an armband too - note this causes clipping issues as its a real object attached to the arm.
        if (config.AllowInArmband) {
            tables.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[14]._props.filters[0].Filter.push(itemId);
        }

        const trader = tables.traders["5ac3b934156ae10c4430e83c"]; //Add to Ragman's inventory

        trader.assort.items.push({
            "_id": itemId,
            "_tpl": itemId,
            "parentId": "hideout",
            "slotId": "hideout",
            "upd":
            {
                "UnlimitedCount": true,
                "StackObjectsCount": 999999
            }
        });
        trader.assort.barter_scheme[itemId] = [
            [
                {
                    "count": itemTraderPrice,
                    "_tpl": "5449016a4bdc2d6f028b456f" // roubles
                }
            ]
        ];
        trader.assort.loyal_level_items[itemId] = config.trader_loyalty_level;

        this.allowIntoSecureContainers(itemId, tables.templates.items);
    }

    allowIntoSecureContainers(itemId, items): void {
        const secureContainers = {
            "kappa": "5c093ca986f7740a1867ab12",
            "gamma": "5857a8bc2459772bad15db29",
            "epsilon": "59db794186f77448bc595262",
            "beta": "5857a8b324597729ab0a0e7d",
            "alpha": "544a11ac4bdc2d470e8b456a",
            "waistPouch": "5732ee6a24597719ae0c0281"
        };


        for (const secureCase in secureContainers) {
            items[secureContainers[secureCase]]
                ._props
                .Grids[0]
                ._props
                .filters[0]
                .Filter
                .push(itemId)
        }
    }

    createGrid(container, itemId, columns) {
        const grids = [];

        for (const [key, val] of Object.entries(columns)) {
            grids.push(this.generateColumn(container, itemId, `column_${key}`, val.cellH, val.cellV));
        }

        return grids;
    }

    generateColumn(container: DependencyContainer, itemId, name, cellH, cellV) {
        const hashUtil = container.resolve<HashUtil>("HashUtil");
        const BULLET = "5485a8684bdc2da71d8b4567";
        const AMMO_BOX = "543be5cb4bdc2deb348b4568";

        return {
            "_name": name,
            "_id": hashUtil.generate(),
            "_parent": itemId,
            "_props": {
                "filters": [
                    {
                        "Filter": [BULLET, AMMO_BOX],
                        "ExcludedFilter": []
                    }
                ],
                "cellsH": cellH,
                "cellsV": cellV,
                "minCount": 0,
                "maxCount": 0,
                "maxWeight": 0,
                "isSortingTable": false
            },
            "_proto": "55d329c24bdc2d892f8b4567"
        };
    }
}

module.exports = { mod: new Mod() }
