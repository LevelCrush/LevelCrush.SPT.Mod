/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/indent */
import { DependencyContainer } from "tsyringe";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { IPmcData } from "@spt-aki/models/eft/common/IPmcData";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderAssort, ITraderBase } from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig, UpdateTime } from "@spt-aki/models/spt/config/ITraderConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import { ILocaleGlobalBase } from "@spt-aki/models/spt/server/ILocaleBase";
import ImporterUtil from "@spt-aki/utils/ImporterUtil"
import RagfairPriceService from "@spt-aki/services/RagfairPriceService"
import { Traders } from "@spt-aki/models/enums/Traders";
import * as baseJson from "../db/base.json";
import type { StaticRouterModService } from "@spt-aki/services/mod/staticRouter/StaticRouterModService";
import type { DynamicRouterModService } from "@spt-aki/services/mod/dynamicRouter/DynamicRouterModService";
import config from "../config/config.json"
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
let questIds = [];
class Hephaestus implements IPreAkiLoadMod, IPostDBLoadMod {
    mod: string
    logger: ILogger
    static container;
    constructor() {
        this.mod = "Hephaestus";
    }


    // Perform these actions before server fully loads
    public preAkiLoad(container: DependencyContainer): void {

        // 
        this.logger = container.resolve<ILogger>("WinstonLogger");
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);

        const staticRouterModService = container.resolve<StaticRouterModService>("StaticRouterModService");
        const dynamicRouterModService = container.resolve<DynamicRouterModService>("DynamicRouterModService");
        this.logger.debug(`[${this.mod}] Loading... `);
        this.registerProfileImage(preAkiModLoader, imageRouter);
        const UpdateTime =
        {
            "_name": baseJson._id,
            "traderId": baseJson._id,
            "seconds":
            {
                "min": 1600,
                "max": 3600
            }
        }
        traderConfig.updateTime.push(UpdateTime);
        const traderRefreshRecord: UpdateTime = {
            traderId: baseJson._id,
            seconds: { min: 1600, max: 3600 }
        };

        traderConfig.updateTime.push(traderRefreshRecord);
        Traders[baseJson._id] = baseJson._id;
        staticRouterModService.registerStaticRouter(
            "HephaestusUpdateLogin",
            [{
                url: "/launcher/profile/login",
                action: (url: string, info: any, sessionId: string, output: string) => {
                    try {
                        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
                        const tables = databaseServer.getTables();
                        tables.traders[baseJson._id].assort = { ...this.createAssortTable(container, sessionId) };
                    } catch (error) {
                    }
                    return output
                }
            }], "aki"
        );
        staticRouterModService.registerStaticRouter(
            "HephaestusUpdateWeaponSave",
            [{
                url: "/client/builds/weapon/save",
                action: (url: string, info: any, sessionId: string, output: string) => {
                    try {
                        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
                        const tables = databaseServer.getTables();
                        tables.traders[baseJson._id].assort = { ...this.createAssortTable(container, sessionId) };
                    } catch (error) {
                    }
                    return output
                }
            }], "aki"
        );
        staticRouterModService.registerStaticRouter(
            "HephaestusUpdateBuildDelete",
            [{
                url: "/client/builds/delete",
                action: (url: string, info: any, sessionId: string, output: string) => {
                    try {
                        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
                        const tables = databaseServer.getTables();
                        tables.traders[baseJson._id].assort = { ...this.createAssortTable(container, sessionId) };
                    } catch (error) {
                    }
                    return output
                }
            }], "aki"
        );
        dynamicRouterModService.registerDynamicRouter(
            "HephaestusUpdateExplicit",
            [{
                url: "/client/trading/api/getTraderAssort/hephaestus_alxk",
                action: (url: string, info: any, sessionId: string, output: string) => {
                    try {
                        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
                        const tables = databaseServer.getTables();
                        tables.traders[baseJson._id].assort = { ...this.createAssortTable(container, sessionId) };
                    } catch (error) {
                    }
                    return output
                }
            }], "aki"
        );

        // dynamicRouterModService.registerDynamicRouter(
        //     "HephaestusUpdate",
        //     [{
        //         url: "/client/trading/api/getTraderAssort/hephaestus_alxk",
        //         action: (url: string, info: any, sessionId: string, output: string) => {
        //             this.logger.info(JSON.stringify(info));

        //             try {
        //                 const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        //                 const tables = databaseServer.getTables();
        //                 tables.traders[baseJson._id].assort = this.createAssortTable(container, sessionId);
        //             } catch (error) {
        //                 this.logger.error(error.message);
        //             }
        //             return output
        //         }
        //     }], "aki"
        // );


        this.logger.debug(`[${this.mod}] Loaded`);
    }

    public postDBLoad(container: DependencyContainer): void {
        this.logger.debug(`[${this.mod}] Delayed Loading... `);
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer")
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter")
        const traderConfig: ITraderConfig = configServer.getConfig(ConfigTypes.TRADER)
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const tables = databaseServer.getTables();
        const locales = Object.values(tables.locales.global) as Record<string, string>[];

        let base = jsonUtil.deserialize(jsonUtil.serialize(baseJson)) as ITraderBase;
        base.repair = {
            "availability": true,
            "currency": config.currency || "569668774bdc2da2298b4568",
            "currency_coefficient": 1,
            "excluded_category": [],
            "excluded_id_list": [],
            "price_rate": 0,
            "quality": "0"
        }
        base.loyaltyLevels = [
            {
                "minLevel": 1,
                "minSalesSum": 0,
                "minStanding": 0,
                "buy_price_coef": 50,
                "repair_price_coef": 300,
                "insurance_price_coef": 10,
                "exchange_price_coef": 0,
                "heal_price_coef": 0
            }];
        tables.traders[baseJson._id] = {
            assort: {
                items: [],
                barter_scheme: {},
                loyal_level_items: {}
            },
            base,
            questassort: { started: {}, success: {}, fail: {} }
        };
        const importer = container.resolve("ImporterUtil");
        let profiles = importer.loadRecursive('user/profiles/');


        for (const locale of locales) {
            locale[`${baseJson._id} FullName`] = baseJson.name;
            locale[`${baseJson._id} FirstName`] = "Hephaestus";
            locale[`${baseJson._id} Nickname`] = baseJson.nickname;
            locale[`${baseJson._id} Location`] = baseJson.location;
            locale[`${baseJson._id} Description`] = "You share the reseller license of your creations to Hephaestus and in return you get a hefty discount.";
        }
        this.logger.debug(`[${this.mod}] Delayed Loaded`);

        //EDW KSEKINAEI TO LOADOUT SAVE
        // this.generateQuests(container, null);

    }
    private resetQuests(container: DependencyContainer, sessionId: string) {
        let profile = container.resolve("ProfileHelper").getFullProfile(sessionId);
        const saveServer = container.resolve("SaveServer");
        let pmc = profile.characters.pmc;
        if (!pmc || !pmc.Quests) {
            // avoid crash on first game start (fresh profile)
            pmc.Quests = [];
        }
        pmc.Quests.filter(
            (q) => (q.status > 0)
        ).forEach((repeatedQuest) => {
            const originalId = questIds.find(qid => qid == repeatedQuest.qid);
            if (originalId) {
                pmc.Quests = pmc.Quests.map((q) => {
                    if (q.qid === originalId) {
                        return { ...repeatedQuest, qid: originalId };
                    }
                    return q;
                });
            }
        });
        pmc.BackendCounters = Object.keys(pmc.BackendCounters).reduce((acc, key) => {
            if (!questIds.some(qid => qid == pmc.BackendCounters[key].qid)) {
                acc[key] = pmc.BackendCounters[key];
            }
            return acc;
        }, {})
        if (pmc.ConditionCounters) {
            pmc.ConditionCounters.Counters =
                pmc.ConditionCounters?.Counters.filter((counter) => {
                    if (questIds.some(qid => qid == counter.qid)) {
                        return false;
                    }
                    return true;
                }) ?? [];
        }
        pmc.Quests = pmc.Quests.filter(q => !questIds.some(qid => qid == q.qid))

        // const questHelper = container.resolve("QuestHelper");
        // let pmcData = container.resolve("ProfileHelper").getPmcProfile(sessionId);
        // questIds.forEach((qid) => {
        //     questHelper.resetQuestState(pmcData, 1, qid)

        // })
        saveServer.saveProfile(sessionId)
    }


    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void {
        // Reference the mod "res" folder
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}res`;
        // Register a route to point to the profile picture
        imageRouter.addRoute(baseJson.avatar.replace(".jpg", ""), `${imageFilepath}/Hephaestus.jpg`);
    }

    private getPresets(container: DependencyContainer, assortTable, currency, profiles) {
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        let pool = [];
        for (let p in (profiles || [])) {

            if (!profiles[p]?.userbuilds) continue;
            for (let wb of profiles[p].userbuilds.weaponBuilds) {
                let preItems = wb.Items;
                let id = preItems[0]._id;
                let tpl = preItems[0]._tpl;
                if (pool.includes(id)) {
                    continue;
                }
                pool.push(id)
                preItems[0] = {
                    "_id": id,
                    "_tpl": tpl,
                    "parentId": "hideout",
                    "slotId": "hideout",
                    "BackgroundColor": "yellow",
                    "upd": {
                        "UnlimitedCount": true,
                        "StackObjectsCount": 2000
                    },
                    "preWeapon": true,
                };
                let preItemsObj = jsonUtil.clone(preItems);
                for (let preItemObj of preItemsObj) {
                    assortTable.items.push(preItemObj);
                }
                let config;
                try {
                    config = require(`../config/config.json`);
                } catch (e) {
                }
                let price = (config || {}).cost || 712
                try {
                    price = ragfairPriceService.getDynamicOfferPriceForOffer(preItems, currency);
                } catch (error) {

                }
                if (config?.discount) {
                    config.discount = parseFloat(config.discount)
                    price = price * (1 - ((config.discount || 100) / 100))
                }
                let offerRequire = [
                    {
                        "count": price,
                        "_tpl": currency
                    }
                ];
                assortTable.barter_scheme[id] = [offerRequire];
                assortTable.loyal_level_items[id] = 1;
            }
        };
        return assortTable;

    }

    private getPresetBuilds(container: DependencyContainer, currency, profiles) {
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
        const ragfairPriceService = container.resolve<RagfairPriceService>("RagfairPriceService");
        let master = [];
        for (let p in (profiles || [])) {
            if (!profiles[p].userbuilds) continue;
            for (let wbk in profiles[p].userbuilds.equipmentBuilds) {
                let pool = [];
                let wb = profiles[p].userbuilds.equipmentBuilds[wbk];
                let preItems = wb.items || [];
                let masterId = wb.root;
                let excludes = ["Scabbard", "SecuredContainer", "CustomPocket", "ArmBand",]
                preItems = preItems.filter((item) => !excludes.includes(item.slotId) && !excludes.includes(item._tpl));
                try {
                    let j = 0;
                    for (let i = 0; i <= preItems.length; i++) {
                        const item = preItems[i] || {};
                        if (item.parentId == masterId) {
                            let reward = {
                                target: item._id,
                                type: "Item",
                                id: item._id,
                                index: j,
                                findInRaid: true,
                                value: 1,
                                items: []
                            }
                            reward.items.push({
                                "_id": item._id,
                                "_tpl": item._tpl,
                                value: 1,
                                "upd": {
                                    "StackObjectsCount": 1
                                }
                            });
                            preItems.filter(pr => (pr || {}).parentId == item._id).forEach(pr => {
                                reward.items.push({
                                    "_id": pr._id,
                                    "_tpl": pr._tpl,
                                    slotId: pr.slotId,
                                    parentId: pr.parentId,
                                    value: 1,
                                    "upd": pr.upd,
                                    location: pr.location
                                });
                                try {
                                    preItems.filter(prr => prr.parentId == pr._id).forEach(prr => {
                                        reward.items.push({
                                            "_id": prr._id,
                                            "_tpl": prr._tpl,
                                            slotId: prr.slotId,
                                            parentId: prr.parentId,
                                            value: 1,
                                            "upd": prr.upd,
                                            location: prr.location
                                        });
                                        preItems.filter(prrr => prrr.parentId == prr._id).forEach(prrr => {
                                            reward.items.push({
                                                "_id": prrr._id,
                                                "_tpl": prrr._tpl,
                                                slotId: prrr.slotId,
                                                parentId: prrr.parentId,
                                                value: 1,
                                                "upd": prrr.upd,
                                                location: prrr.location
                                            });
                                            preItems.filter(prrrr => prrrr.parentId == prrr._id).forEach(prrrr => {
                                                reward.items.push({
                                                    "_id": prrrr._id,
                                                    "_tpl": prrrr._tpl,
                                                    slotId: prrrr.slotId,
                                                    parentId: prrrr.parentId,
                                                    value: 1,
                                                    "upd": prrrr.upd,
                                                    location: prrrr.location
                                                });
                                            })
                                        })

                                    })
                                } catch (error) {
                                }

                            })
                            pool.push(reward);
                            j++;
                        }
                    }
                } catch (error) {
                    this.logger.error(error.message);
                }
                let config;
                try {
                    config = require(`../config/config.json`);
                } catch (e) {
                }
                let price = (config || {}).cost || 712
                // try {
                //     price = ragfairPriceService.getDynamicOfferPriceForOffer(preItems, currency);
                // } catch (error) {
                //     this.logger.error(error);
                // }
                if (config?.discount) {
                    config.discount = parseFloat(config.discount)
                    price = price * (1 - ((config.discount || 100) / 100))
                }

                master.push({
                    id: 'heph_' + wb.name
                    rewards: pool,
                    cost: 1234,
                    currency: currency,
                    name: wb.name
                })

            }
        };
        return master;

    }


    private createAssortTable(container, sessionId): ITraderAssort {
        const importer = container.resolve("ImporterUtil");
        // Assort table
        let assortTable: ITraderAssort = {
            items: [],
            barter_scheme: {},
            loyal_level_items: {}
        }
        // const currency = "5449016a4bdc2d6f028b456f";//ROUBLES
        let profiles = {};
        if (sessionId) {
            let t = container.resolve("ProfileHelper").getFullProfile(sessionId)
            profiles = { [sessionId]: t };
        } else {
            profiles = importer.loadRecursive('user/profiles/');
        }
        try {
            assortTable = this.getPresets(container, assortTable, config.currency || "569668774bdc2da2298b4568", profiles);
        } catch (error) {
            // console.error(error);
        }
        return assortTable;
    }
}

module.exports = { mod: new Hephaestus() }