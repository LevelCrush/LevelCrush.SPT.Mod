import { DependencyContainer } from "tsyringe";

// SPT types
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { ConfigTypes } from "@spt-aki/models/enums/ConfigTypes";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { IRagfairConfig } from "@spt-aki/models/spt/config/IRagfairConfig";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";

// New trader settings
import * as baseJson from "../db/base.json";
import { TraderHelper } from "./traderHelpers";
import { FluentAssortConstructor } from "./fluentTraderAssortCreator";
import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";
import { ICustomizationItem } from "@spt-aki/models/eft/common/tables/ICustomizationItem";


// Pants Items
import * as artem_pants_1 from "../db/Clothing/Pants/Artem_Pants1/artem_pants.json";
import * as artem_pants_1_suit from "../db/Clothing/Pants/Artem_Pants1/artem_pants_suit.json";
import * as artem_pants_1_locale from "../db/Clothing/Pants/Artem_Pants1/artem_pants_locale.json";

import * as artem_pants_2 from "../db/Clothing/Pants/Artem_Pants2/artem_pants2.json";
import * as artem_pants_2_suit from "../db/Clothing/Pants/Artem_Pants2/artem_pants2_suit.json";
import * as artem_pants_2_locale from "../db/Clothing/Pants/Artem_Pants2/artem_pants2_locale.json";

import * as artem_pants_3 from "../db/Clothing/Pants/Artem_Pants3/artem_pants3.json";
import * as artem_pants_3_suit from "../db/Clothing/Pants/Artem_Pants3/artem_pants3_suit.json";
import * as artem_pants_3_locale from "../db/Clothing/Pants/Artem_Pants3/artem_pants3_locale.json";

import * as artem_pants_4 from "../db/Clothing/Pants/Artem_Pants4/artem_pants4.json";
import * as artem_pants_4_suit from "../db/Clothing/Pants/Artem_Pants4/artem_pants4_suit.json";
import * as artem_pants_4_locale from "../db/Clothing/Pants/Artem_Pants4/artem_pants4_locale.json";

import * as artem_pants_5 from "../db/Clothing/Pants/Artem_Pants5/artem_pants5.json";
import * as artem_pants_5_suit from "../db/Clothing/Pants/Artem_Pants5/artem_pants5_suit.json";
import * as artem_pants_5_locale from "../db/Clothing/Pants/Artem_Pants5/artem_pants5_locale.json";


// Top Items
import * as test_top from "../db/Clothing/Tops/Test_Shirt/test_top.json";
import * as test_top_suit from "../db/Clothing/Tops/Test_Shirt/test_top_suit.json";
import * as test_top_hands from "../db/Clothing/Tops/Test_Shirt/test_top_hands.json";
import * as test_top_locale from "../db/Clothing/Tops/Test_Shirt/test_top_locale.json";

import * as artem_top1 from "../db/Clothing/Tops/Artem_Shit1/artem_top_1.json";
import * as artem_top1_suit from "../db/Clothing/Tops/Artem_Shit1/test_top1_suit.json";
import * as artem_top1_hands from "../db/Clothing/Tops/Artem_Shit1/artem_top1_hands.json";
import * as artem_top1_locale from "../db/Clothing/Tops/Artem_Shit1/artem_top1_locale.json";

import * as artem_top2 from "../db/Clothing/Tops/Artem_Shit2/artem_top_2.json";
import * as artem_top2_suit from "../db/Clothing/Tops/Artem_Shit2/test_top2_suit.json";
import * as artem_top2_hands from "../db/Clothing/Tops/Artem_Shit2/artem_top2_hands.json";
import * as artem_top2_locale from "../db/Clothing/Tops/Artem_Shit2/artem_top2_locale.json";

import * as artem_top3 from "../db/Clothing/Tops/Artem_Shit3/artem_top_3.json";
import * as artem_top3_suit from "../db/Clothing/Tops/Artem_Shit3/artem_top3_suit.json";
import * as artem_top3_hands from "../db/Clothing/Tops/Artem_Shit3/artem_top3_hands.json";
import * as artem_top3_locale from "../db/Clothing/Tops/Artem_Shit3/artem_top3_locale.json";

import * as artem_top4 from "../db/Clothing/Tops/Artem_Shit4/artem_top_4.json";
import * as artem_top4_suit from "../db/Clothing/Tops/Artem_Shit4/artem_top4_suit.json";
import * as artem_top4_hands from "../db/Clothing/Tops/Artem_Shit4/artem_top4_hands.json";
import * as artem_top4_locale from "../db/Clothing/Tops/Artem_Shit4/artem_top4_locale.json";

import * as artem_top5 from "../db/Clothing/Tops/Artem_Shit5/artem_top_5.json";
import * as artem_top5_suit from "../db/Clothing/Tops/Artem_Shit5/artem_top5_suit.json";
import * as artem_top5_hands from "../db/Clothing/Tops/Artem_Shit5/artem_top5_hands.json";
import * as artem_top5_locale from "../db/Clothing/Tops/Artem_Shit5/artem_top5_locale.json";

import * as artem_top6 from "../db/Clothing/Tops/Artem_Shit6/artem_top_6.json";
import * as artem_top6_suit from "../db/Clothing/Tops/Artem_Shit6/artem_top6_suit.json";
import * as artem_top6_hands from "../db/Clothing/Tops/Artem_Shit6/artem_top6_hands.json";
import * as artem_top6_locale from "../db/Clothing/Tops/Artem_Shit6/artem_top6_locale.json";

import * as artem_top7 from "../db/Clothing/Tops/Artem_Shit7/artem_top_7.json";
import * as artem_top7_suit from "../db/Clothing/Tops/Artem_Shit7/artem_top7_suit.json";
import * as artem_top7_hands from "../db/Clothing/Tops/Artem_Shit7/artem_top7_hands.json";
import * as artem_top7_locale from "../db/Clothing/Tops/Artem_Shit7/artem_top7_locale.json";

import * as artem_top8 from "../db/Clothing/Tops/Artem_Shit8/artem_top_8.json";
import * as artem_top8_suit from "../db/Clothing/Tops/Artem_Shit8/artem_top8_suit.json";
import * as artem_top8_hands from "../db/Clothing/Tops/Artem_Shit8/artem_top8_hands.json";
import * as artem_top8_locale from "../db/Clothing/Tops/Artem_Shit8/artem_top8_locale.json";

const tradersuits = require("../db/Clothing/suits.json");


class ArtemTrader implements IPreAkiLoadMod, IPostDBLoadMod
{
    private mod: string
    private logger: ILogger
    private traderHelper: TraderHelper
    private fluentTraderAssortHeper: FluentAssortConstructor

    constructor() {
        this.mod = "AAAArtemTrader"; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void
    {
        // Get a logger
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        // Get SPT code/data we need later
        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
        const configServer = container.resolve<ConfigServer>("ConfigServer");
        const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(ConfigTypes.TRADER);
        const ragfairConfig = configServer.getConfig<IRagfairConfig>(ConfigTypes.RAGFAIR);

        // Create helper class and use it to register our traders image/icon + set its stock refresh time
        this.traderHelper = new TraderHelper();
        this.fluentTraderAssortHeper = new FluentAssortConstructor(hashUtil, this.logger);
        this.traderHelper.registerProfileImage(baseJson, this.mod, preAkiModLoader, imageRouter, "Artem.jpg");
        this.traderHelper.setTraderUpdateTime(traderConfig, baseJson, 3600, 4000);

        // Add trader to trader enum
        Traders[baseJson._id] = baseJson._id;

        // Add trader to flea market
        ragfairConfig.traders[baseJson._id] = true;

        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    
    /**
     * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
     * @param container Dependency container
     */
    public postDBLoad(container: DependencyContainer): void
    {
        this.logger.debug(`[${this.mod}] postDb Loading... `);

        // Resolve SPT classes we'll use
        const databaseServer: DatabaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        const configServer: ConfigServer = container.resolve<ConfigServer>("ConfigServer");
        const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

        // Get a reference to the database tables
        const tables = databaseServer.getTables();

        // Add new trader to the trader dictionary in DatabaseServer - has no assorts (items) yet
        this.traderHelper.addTraderToDb(baseJson, tables, jsonUtil);


        // Adds Artem Pants1 Clothing
        tables.templates.customization[artem_pants_1._id] = artem_pants_1 as ICustomizationItem
        tables.templates.customization[artem_pants_1_suit._id] = artem_pants_1_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_1_suit._id, artem_pants_1_locale.Name, artem_pants_1_locale.ShortName, artem_pants_1_locale.Description);

        // Adds Artem Pants2 Clothing
        tables.templates.customization[artem_pants_2._id] = artem_pants_2 as ICustomizationItem
        tables.templates.customization[artem_pants_2_suit._id] = artem_pants_2_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_2_suit._id, artem_pants_2_locale.Name, artem_pants_2_locale.ShortName, artem_pants_2_locale.Description);

        // Adds Artem Pants3 Clothing
        tables.templates.customization[artem_pants_3._id] = artem_pants_3 as ICustomizationItem
        tables.templates.customization[artem_pants_3_suit._id] = artem_pants_3_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_3_suit._id, artem_pants_3_locale.Name, artem_pants_3_locale.ShortName, artem_pants_3_locale.Description);

        // Adds Artem Pants4 Clothing
        tables.templates.customization[artem_pants_4._id] = artem_pants_4 as ICustomizationItem
        tables.templates.customization[artem_pants_4_suit._id] = artem_pants_4_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_4_suit._id, artem_pants_4_locale.Name, artem_pants_4_locale.ShortName, artem_pants_4_locale.Description);

        // Adds Artem Pants5 Clothing
        tables.templates.customization[artem_pants_5._id] = artem_pants_5 as ICustomizationItem
        tables.templates.customization[artem_pants_5_suit._id] = artem_pants_5_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_pants_5_suit._id, artem_pants_5_locale.Name, artem_pants_5_locale.ShortName, artem_pants_5_locale.Description);

        // Adds test shirt Clothing
        tables.templates.customization[test_top._id] = test_top as ICustomizationItem
        tables.templates.customization[test_top_hands._id] = test_top_hands as ICustomizationItem
        tables.templates.customization[test_top_suit._id] = test_top_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, test_top_suit._id, test_top_locale.Name, test_top_locale.ShortName, test_top_locale.Description);

        // Adds artem shirt1 Clothing
        tables.templates.customization[artem_top1._id] = artem_top1 as ICustomizationItem
        tables.templates.customization[artem_top1_hands._id] = artem_top1_hands as ICustomizationItem
        tables.templates.customization[artem_top1_suit._id] = artem_top1_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top1_suit._id, artem_top1_locale.Name, artem_top1_locale.ShortName, artem_top1_locale.Description);

        // Adds artem shirt2 Clothing
        tables.templates.customization[artem_top2._id] = artem_top2 as ICustomizationItem
        tables.templates.customization[artem_top2_hands._id] = artem_top2_hands as ICustomizationItem
        tables.templates.customization[artem_top2_suit._id] = artem_top2_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top2_suit._id, artem_top2_locale.Name, artem_top2_locale.ShortName, artem_top2_locale.Description);

        // Adds artem shirt3 Clothing
        tables.templates.customization[artem_top3._id] = artem_top3 as ICustomizationItem
        tables.templates.customization[artem_top3_hands._id] = artem_top3_hands as ICustomizationItem
        tables.templates.customization[artem_top3_suit._id] = artem_top3_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top3_suit._id, artem_top3_locale.Name, artem_top3_locale.ShortName, artem_top3_locale.Description);

        // Adds artem shirt4 Clothing
        tables.templates.customization[artem_top4._id] = artem_top4 as ICustomizationItem
        tables.templates.customization[artem_top4_hands._id] = artem_top4_hands as ICustomizationItem
        tables.templates.customization[artem_top4_suit._id] = artem_top4_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top4_suit._id, artem_top4_locale.Name, artem_top4_locale.ShortName, artem_top4_locale.Description);

        // Adds artem shirt5 Clothing
        tables.templates.customization[artem_top5._id] = artem_top5 as ICustomizationItem
        tables.templates.customization[artem_top5_hands._id] = artem_top5_hands as ICustomizationItem
        tables.templates.customization[artem_top5_suit._id] = artem_top5_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top5_suit._id, artem_top5_locale.Name, artem_top5_locale.ShortName, artem_top5_locale.Description);

        // Adds artem shirt6 Clothing
        tables.templates.customization[artem_top6._id] = artem_top6 as ICustomizationItem
        tables.templates.customization[artem_top6_hands._id] = artem_top6_hands as ICustomizationItem
        tables.templates.customization[artem_top6_suit._id] = artem_top6_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top6_suit._id, artem_top6_locale.Name, artem_top6_locale.ShortName, artem_top6_locale.Description);

        // Adds artem shirt7 Clothing
        tables.templates.customization[artem_top7._id] = artem_top7 as ICustomizationItem
        tables.templates.customization[artem_top7_hands._id] = artem_top7_hands as ICustomizationItem
        tables.templates.customization[artem_top7_suit._id] = artem_top7_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top7_suit._id, artem_top7_locale.Name, artem_top7_locale.ShortName, artem_top7_locale.Description);

        // Adds artem shirt8 Clothing
        tables.templates.customization[artem_top8._id] = artem_top8 as ICustomizationItem
        tables.templates.customization[artem_top8_hands._id] = artem_top8_hands as ICustomizationItem
        tables.templates.customization[artem_top8_suit._id] = artem_top8_suit as ICustomizationItem
        this.addClothingItemToLocales(tables, artem_top8_suit._id, artem_top8_locale.Name, artem_top8_locale.ShortName, artem_top8_locale.Description);

        tables.traders["ArtemTrader"].suits = tradersuits;


        const IGOLNIK545 = "5c0d5e4486f77478390952fe"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(IGOLNIK545)
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(160)
                                    .addMoneyCost(Money.ROUBLES, 1120)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);
                                    
        const GASWELDERGOGGLES = "61c18d83b00456371a66814b"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(GASWELDERGOGGLES)
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 19020)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("544fb45d4bdc2dee738b4568") // Salewa
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 35765)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("55d4887d4bdc2d962f8b4570") // 5.56x45 Colt AR-15 STANAG 30-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 4765)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("6571bde39837cc51b800c212") // facecover skull half mask
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 3412)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e81f423763d9f754677bf2e") // .45acp Match FMJ
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 135)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("55d480c04bdc2d1d4e8b456a") // AK-74 5.45x39 6L23 30-round magazine
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 2062)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("55d614004bdc2d86028b4568") // SureFire SOCOM556-MONSTER 5.56x45 sound suppressor
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 45321)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("626673016f1edc06f30cf6d5") // KAC QDC 5.56x45 sound suppressor
                                    .addStackCount(42)
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 92501)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e208b9842457a4a7a33d074") // AK Hexagon DTKP MK.2 7.62x39 sound suppressor
                                    .addStackCount(12)
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 58239)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("572b7fa524597762b747ce82") // Day pack backpack
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(8)
                                    .addMoneyCost(Money.ROUBLES, 1734)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e9dcf5986f7746c417435b3") // Day pack backpack
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 14230)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("545cdae64bdc2d39198b4568") // Tri-zip
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 50359)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5645bcc04bdc2d363b8b4572") // Comtac2
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 28920)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5aa2ba71e5b5b000137b758f") // MSA Super headphones
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 43627)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e4d34ca86f774264f758330") // Walker's Razor Digital headset
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 31625)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5b432b965acfc47a8774094e") // GSSh-01 active headset
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 17193)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5f60cd6cf2bcbb675b00dac6") // Walkers XCEL headphones
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 90155)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("603409c80ca681766b6a0fb2") // NPP KlASS Condor glasses
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 12030)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59e7715586f7742ee5789605") // RESPIRATOR
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 4302)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c0d668f86f7747ccb7f13b2") // 9x39mm SPP gs
                                    .addStackCount(2391)
                                    .addBuyRestriction(170)
                                    .addMoneyCost(Money.ROUBLES, 752)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("56dff4ecd2720b5f5a8b4568") // 5.45 T
                                    .addStackCount(2391)
                                    .addBuyRestriction(120)
                                    .addMoneyCost(Money.ROUBLES, 39)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("56dff3afd2720bba668b4567") // 5.45 Ps
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 39)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5656d7c34bdc2d9d198b4587") // 7.62 PS
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 142)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59e0d99486f7744a32234762") // 7.62 BP
                                    .addStackCount(2391)
                                    .addBuyRestriction(180)
                                    .addMoneyCost(Money.ROUBLES, 642)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5fc275cf85fd526b824a571a") // .338 Lapua Magnum FMJ
                                    .addStackCount(2391)
                                    .addBuyRestriction(60)
                                    .addMoneyCost(Money.ROUBLES, 1662)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5a26ac0ec4a28200741e1e18") // 9x21mm BT gzh
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(140)
                                    .addMoneyCost(Money.ROUBLES, 942)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("64b7af434b75259c590fa893") // 7.62 PP
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 442)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("6193d338de3cdf1d2614a6fc") // .45acp 12 round mag
                                    .addStackCount(59)
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 1700)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("55802d5f4bdc2dac148b458e") // M4 MAGPUL PMAG 30 GEN M3 BLACK
                                    .addStackCount(99)
                                    .addBuyRestriction(15)
                                    .addMoneyCost(Money.ROUBLES, 11500)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5d1340b3d7ad1a0b52682ed7") // M4 MAGPUL PMAG 30 GEN M3 BLACK FDE
                                    .addStackCount(99)
                                    .addBuyRestriction(15)
                                    .addMoneyCost(Money.ROUBLES, 11500)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5aaa4194e5b5b055d06310a5") // AK MAGPUL PMAG 30 GEN M3
                                    .addStackCount(72)
                                    .addBuyRestriction(15)
                                    .addMoneyCost(Money.ROUBLES, 11000)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c0558060db834001b735271") // GPNVG18
                                    .addStackCount(6)
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 124260)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c066e3a0db834001b7353f0") // N-15 NVG
                                    .addStackCount(15)
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 43215)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c0696830db834001d23f5da") // PNV-10
                                    .addStackCount(21)
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 32962)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5b3b6e495acfc4330140bd88") // Armasight Vulcan MG 3.5x
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 29102)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e9db13186f7742f845ee9d3") // LBT-1961A ChestRig
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 73829)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("60098ad7c2240c0fe85c570a") // AFAK
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 59829)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5710c24ad2720bc3458b45a3") // F-1 Grenade
                                    .addStackCount(182)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 8562)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("58d3db5386f77426186285a0") // M67 Grenade
                                    .addStackCount(206)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 10292)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("54527a984bdc2d4e668b4567") // M885
                                    .addStackCount(129)
                                    .addBuyRestriction(160)
                                    .addMoneyCost(Money.ROUBLES, 285)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59e690b686f7746c9f75e848") // M955
                                    .addStackCount(1206)
                                    .addBuyRestriction(160)
                                    .addMoneyCost(Money.ROUBLES, 955)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59e6920f86f77411d82aa167") // 556x45 FMJ
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 95)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5cc86840d7f00c002412c56c") // 5.7X28 R37X
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(120)
                                    .addMoneyCost(Money.ROUBLES, 172)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5cc80f38e4a949001152b560") // 5.7x28mm SS190
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(200)
                                    .addMoneyCost(Money.ROUBLES, 532)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5d6e6911a4b9361bd5780d52") // 12/70 flechette
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(100)
                                    .addMoneyCost(Money.ROUBLES, 330)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c925fa22e221601da359b7b") // 9x19 AP.6.3
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(280)
                                    .addMoneyCost(Money.ROUBLES, 429)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("56dff2ced2720bb4668b4567") // 5.45x45 PP
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(240)
                                    .addMoneyCost(Money.ROUBLES, 172)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("56dff026d2720bb8668b4567") // 5.45x45 BS
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(130)
                                    .addMoneyCost(Money.ROUBLES, 672)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("59e6906286f7746c9f75e847") // 5.56x45 M865A1
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(190)
                                    .addMoneyCost(Money.ROUBLES, 172)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("54527ac44bdc2d36668b4567") // 5.56x45 M855A1
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(150)
                                    .addMoneyCost(Money.ROUBLES, 681)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("56d59d3ad2720bdb418b4577") // 9x19mm pst gzh
                                    .addUnlimitedStackCount()
                                    .addMoneyCost(Money.ROUBLES, 65)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5ba26835d4351e0035628ff5") // 4.6x30mm AP SX
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(120)
                                    .addMoneyCost(Money.ROUBLES, 1581)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("64b6979341772715af0f9c39") // 4.6x30mm JSP SX
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(200)
                                    .addMoneyCost(Money.ROUBLES, 326)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5efb0da7a29a85116f6ea05f") // 9x19mm PBP gzh
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(70)
                                    .addMoneyCost(Money.ROUBLES, 581)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5a6086ea4f39f99cd479502f") // 7.62x51mm M61
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(140)
                                    .addMoneyCost(Money.ROUBLES, 1572)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5fd20ff893a8961fc660a954") // .300 Blackout AP
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(160)
                                    .addMoneyCost(Money.ROUBLES, 801)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("64b8725c4b75259c590fa899") // .300 Blackout CBJ
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(200)
                                    .addMoneyCost(Money.ROUBLES, 599)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5fbe3ffdf8b6a877a729ea82") // .300 Blackout BCP FMJ
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(240)
                                    .addMoneyCost(Money.ROUBLES, 296)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5a608bf24f39f98ffc77720e") // 7.62x51mm M62 Tracer
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(140)
                                    .addMoneyCost(Money.ROUBLES, 528)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e023e53d4353e3302577c4c") // 7.62x51mm BCP FMJ
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(240)
                                    .addMoneyCost(Money.ROUBLES, 212)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c94bbff86f7747ee735c08f") // Labs keycard access
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 152385)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("618bb76513f5097c8d5aa2d5") // Gropa T20
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 39239)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c7fb51d2e2216001219ce11") // 5.56 Surefire SF3P
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 6239)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("6171407e50224f204c1da3c5") // Recknagel Era-Tac 30mm ring scope mount
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 8100)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5b3cbc235acfc4001863ac44") // Armasight Vulcan MG scope eyecup
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 464)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("617fd91e5539a84ec44ce155") // RGN Hand grenade
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(8)
                                    .addMoneyCost(Money.ROUBLES, 25200)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("618a431df1eb8e24b8741deb") // RGO Hand grenade
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(8)
                                    .addMoneyCost(Money.ROUBLES, 25200)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("626667e87379c44d557b7550") // RGO Hand grenade
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 7142)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5648a69d4bdc2ded0b8b457b") // BlackRock chest rig
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 32239)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59d6272486f77466146386ff") // AK MAGPUL 7.62 30MAG
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 12523)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59c1383d86f774290a37e0ca") // 5.56x45 Magpul PMAG D-60 STANAG 60-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 58163)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("544a37c44bdc2d25388b4567") // 5.56x45 SureFire MAG5-60 STANAG 60-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 52163)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59fafc9386f774067d462453") // AK US PALM FDE 7.62 30MAG
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 15675)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("56d59948d2720bb7418b4582") // P226 9x19mm 15 round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 7675)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("59fafc5086f7740dbe19f6c3") // AK US PALM BLACK 7.62 30MAG
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 15675)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5b099ac65acfc400186331e1") // SA-58/FAL 7.62x51 20-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 10475)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5b057b4f5acfc4771e1bd3e9") // Stark SE-5 Express Forward foregrip
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 18475)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("655df24fdf80b12750626d0a") // Stark SE-5 Express Forward foregrip (FDE)
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 18475)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c1bc5612e221602b5429350") // Zenit RK-1 tactical foregrip
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 12475)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c1cd46f2e22164bef5cfedb") // Zenit RK-1 tactical foregrip on B-25U mount
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 38741)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5c1bc7752e221602b1779b34") // Zenit RK-6
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 4741)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5aafbde786f774389d0cbc0f") // Ammunition Case
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 173582)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5e8488fa988a8701445df1e4") // Ammunition Case
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(35)
                                    .addMoneyCost(Money.ROUBLES, 12582)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("590c657e86f77412b013051d") // Grizzly
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 32625)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5df25b6c0b92095fd441e4cf") // ORSIS T-5000M 7.62x51 5-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 2221)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("618168dc8004cc50514c34fc") //FN SCAR-H 7.62x51 20-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 21071)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5d3eb5eca4b9363b1f22f8e4") //FN Five-seven Mk2 20-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 3243)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("6183d53f1cb55961fa0fdcda") //FN SCAR-H 7.62x51 20-round magazine (FDE)
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 21071)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5a351711c4a282000b1521a4") // HK MP5 9x19 X Products X-5 50-round drum magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 26325)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5926c3b286f774640d189b6b") // HK MP5 9x19 30-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(15)
                                    .addMoneyCost(Money.ROUBLES, 2625)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5888988e24597752fe43a6fa") // DVL-10 7.62x51 10-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(10)
                                    .addMoneyCost(Money.ROUBLES, 5625)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("57838f9f2459774a150289a0") // VSS 9x39 6L25 20-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 8625)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5a7ad2e851dfba0016153692") // Glock 9x19 "Big Stick" 33-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(16)
                                    .addMoneyCost(Money.ROUBLES, 6425)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5a718da68dc32e000d46d264") // Glock 9x19 Magpul PMAG GL9 21-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(16)
                                    .addMoneyCost(Money.ROUBLES, 4125)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5ba2657ed4351e0035628ff2") // HK MP7 4.6x30 30-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(7)
                                    .addMoneyCost(Money.ROUBLES, 8453)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5ba26586d4351e44f824b340") // HK MP7 4.6x30 40-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 13223)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("55d482194bdc2d1d4e8b456b") // AK-74 5.45| 60 round mag
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 26239)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createSingleAssortItem("5df8a4d786f77412672a1e3b") // 6Sh118 raid backpack
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 108202)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5c0695860db834001b735461") // PNV-10T Adapter
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(20)
                                    .addMoneyCost(Money.ROUBLES, 2100)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5a16b8a9fcdbcb00165aa6ca") // Norotos Titanium Advanced Tactical Mount
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(10)
                                    .addMoneyCost(Money.ROUBLES, 15523)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5751a25924597722c463c472") // Army Bandage
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(12)
                                    .addMoneyCost(Money.ROUBLES, 1993)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5a0abb6e1526d8000a025282") // Army Bandage
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 693)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5af0454c86f7746bf20992e8") // Army Bandage
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 10993)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("58491f3324597764bc48fa02") // EOTech XPS3-0
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 24563)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("558022b54bdc2dac148b458d") // EOTech EXPS-3 (TAN)
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 24563)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5cfe8010d7ad1a59283b14c6") // AK 7.62x39 X Products X-47 50-round drum magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(4)
                                    .addMoneyCost(Money.ROUBLES, 30932)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
                                    
        this.fluentTraderAssortHeper.createSingleAssortItem("5fc23426900b1d5091531e15") // Mk-18 .338 LM 10-round magazine
                                    .addUnlimitedStackCount()
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 10122)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        const Tac50 = "5b2388675acfc4771e1be0be"; //tac30
        this.fluentTraderAssortHeper.createSingleAssortItem(Tac50)
                                    .addStackCount(121)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 61528)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
                                    
        const ColdBalaclava = "5ab8f39486f7745cd93a1cca"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(ColdBalaclava)
                                    .addStackCount(640)
                                    .addBuyRestriction(8)
                                    .addMoneyCost(Money.ROUBLES, 3500)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        const GhostBalaclava = "5ab8f4ff86f77431c60d91ba"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(GhostBalaclava)
                                    .addStackCount(640)
                                    .addBuyRestriction(8)
                                    .addMoneyCost(Money.ROUBLES, 6345)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        const PlagueMask = "5e54f79686f7744022011103"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(PlagueMask)
                                    .addStackCount(200)
                                    .addBuyRestriction(10)
                                    .addMoneyCost(Money.ROUBLES, 46300)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        // BARTER TRADE
        const VITAMINS_ID = "62a0a043cf4a99369e2624a5"
        const GRIZZLY = "590c657e86f77412b013051d";
        const MEDS_ID2 = "5d1b3a5d86f774252167ba22";
        this.fluentTraderAssortHeper.createSingleAssortItem(GRIZZLY)
                                    .addStackCount(100)
                                    .addBarterCost(MEDS_ID2, 4)
                                    .addBarterCost(VITAMINS_ID, 2)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        const MEDS_ID = "5d1b3a5d86f774252167ba22"
        const PlagueMask2 = "5e54f79686f7744022011103"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(PlagueMask2)
                                    .addStackCount(200)
                                    .addBuyRestriction(10)
                                    .addBarterCost(MEDS_ID, 4)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        const HalfFaceMask = "572b7fa524597762b747ce82"
        const SpookySkull = "635267ab3c89e2112001f826"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(SpookySkull)
                                    .addStackCount(16)
                                    .addBuyRestriction(10)
                                    .addBarterCost(HalfFaceMask, 3)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        const HorseFigurine = "573478bc24597738002c6175"                            
        const TerragroupArmband = "619bdef8c9546643a67df6f6"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(TerragroupArmband)
                                    .addStackCount(640)
                                    .addBuyRestriction(1)
                                    .addBarterCost(HorseFigurine, 2)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);                            
                           
        const Sewingkit = "61bf83814088ec1a363d7097"                            
        const RipstopFabric = "5e2af4a786f7746d3f3c3400"; 
        const INJECTCASE = "619cbf7d23893217ec30b689";
        const leathermantool = "544fb5454bdc2df8738b456a";
        const Surv12 = "5d02797c86f774203f38e30a";
        this.fluentTraderAssortHeper.createSingleAssortItem(INJECTCASE)
                                    .addStackCount(391)
                                    .addBuyRestriction(1)
                                    .addBarterCost(Sewingkit, 3)
                                    .addBarterCost(leathermantool, 2)
                                    .addBarterCost(RipstopFabric, 1)
                                    .addBarterCost(Surv12, 1)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
                                                                
        const OXBLEACH = "59e3556c86f7741776641ac2"                            
        const DocCase = "590c60fc86f77412b13fddcf"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(DocCase)
                                    .addStackCount(640)
                                    .addBuyRestriction(1)
                                    .addBarterCost(OXBLEACH, 3)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        const PCB1 = "590a3b0486f7743954552bdb"                            
        const BundleWires = "5c06779c86f77426e00dd782";
        const GPNVG18 = "5c0558060db834001b735271";
        const packscrews = "59e35ef086f7741777737012";
        this.fluentTraderAssortHeper.createSingleAssortItem(GPNVG18)
                                    .addStackCount(41)
                                    .addBuyRestriction(1)
                                    .addBarterCost(PCB1, 2)
                                    .addBarterCost(BundleWires, 4)
                                    .addBarterCost(packscrews, 3)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
                                                                
        const SCREWS = "59e35ef086f7741777737012"                           
        const AK30Round545 = "55d480c04bdc2d1d4e8b456a"; 
        const AK60Round545 = "55d482194bdc2d1d4e8b456b"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(AK60Round545)
                                    .addStackCount(640)
                                    .addBuyRestriction(3)
                                    .addBarterCost(SCREWS, 2)
                                    .addBarterCost(AK30Round545, 1)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);                            

        const GPCOIN2 = "5d235b4d86f7742e017bc88a"
        const CultKnife = "5fc64ea372b0dd78d51159dc"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(CultKnife)
                                    .addStackCount(200)
                                    .addBuyRestriction(10)
                                    .addBarterCost(GPCOIN2, 4)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        const GUNPOWDERK = "590c5a7286f7747884343aea"
        const SHATTERED_MASK = "5b432b2f5acfc4771e1c6622"; 
        this.fluentTraderAssortHeper.createSingleAssortItem(SHATTERED_MASK)
                                    .addStackCount(250)
                                    .addBuyRestriction(2)
                                    .addBarterCost(GUNPOWDERK, 1)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
                                    this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5e03511086f7744ccb1fb6cf"]._items) // sr25
                                    .addStackCount(21)
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 95504)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);                
        //adds Glock17
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5a88acfb86f77457fd2c0d8f"]._items)
                                    .addStackCount(740)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 16432)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        //adds Five seven loyalty 2
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5d51290186f77419093e7c24"]._items)
                                    .addStackCount(2580)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 19432)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        //adds USP.45
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["619d267f36b5be1f3236f9ba"]._items)
                                    .addStackCount(640)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 12432)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        //adds MK47
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["60b7d76e2a3c79100f1979de"]._items)
                                    .addStackCount(281)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 134520)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        //adds SCAR-H
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["6193e4fae693542ea37d11c6"]._items)
                                    .addStackCount(281)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 128530)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        //adds MK18 Mjorn
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5fd25119dd870108a754a163"]._items)
                                    .addStackCount(19)
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 296558)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);

        //adds UMP45
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5fd2517dbdd50d684f73a474"]._items)
                                    .addStackCount(271)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 26842)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        //adds ASVAL
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5841482e2459775a050cdda9"]._items)
                                    .addStackCount(16)
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 104253)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);
        //adds T5000
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5e0354f786f77425b53eb6c5"]._items)
                                    .addStackCount(3)
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 71239)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);
        //adds DVL 
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["58dffc5d86f77407c744a847"]._items)
                                    .addStackCount(4)
                                    .addBuyRestriction(1)
                                    .addMoneyCost(Money.ROUBLES, 79830)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);
        //adds MCX Spear 
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5fd251a31189a17bcc172662"]._items)
                                    .addStackCount(186)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 47490)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
        //adds RFB
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5f676b779ab5ec19f028eaf3"]._items)
                                    .addStackCount(482)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 33490)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        //adds MPX 
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["58dffd4586f77408a27629b2"]._items)
                                    .addStackCount(24)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 74823)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        //adds AK12
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["64c1510bda0f6d156000cc17"]._items)
                                    .addStackCount(54)
                                    .addBuyRestriction(3)
                                    .addMoneyCost(Money.ROUBLES, 49523)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        //adds MP7
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5bd056fa86f7743aba7658cd"]._items)
                                    .addStackCount(74)
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 26523)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        //adds HK416
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5c0d1e9386f77440120288b7"]._items)
                                    .addStackCount(41)
                                    .addBuyRestriction(7)
                                    .addMoneyCost(Money.ROUBLES, 46523)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
        //adds PKP
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["64cf7b2d033b747d625b7666"]._items)
                                    .addStackCount(41)
                                    .addBuyRestriction(7)
                                    .addMoneyCost(Money.ROUBLES, 69121)
                                    .addLoyaltyLevel(4)
                                    .export(tables.traders[baseJson._id]);
        //adds SR-2M
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["63986a38608a960125446db5"]._items)
                                    .addStackCount(31)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 35593)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);
        //adds ak47
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5841474424597759ba49be91"]._items)
                                    .addStackCount(31)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 32712)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        //adds aks with scope
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["618aae5a4dc2d41d5c30264b"]._items)
                                    .addStackCount(31)
                                    .addBuyRestriction(2)
                                    .addMoneyCost(Money.ROUBLES, 74112)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        //adds m4
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5af08cf886f774223c269184"]._items)
                                    .addStackCount(31)
                                    .addBuyRestriction(6)
                                    .addMoneyCost(Money.ROUBLES, 52712)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        //adds Beretta m9a3
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["5d3f0bc986f7743cb332abdc"]._items)
                                    .addStackCount(31)
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 12712)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);
        //adds SIG P226R
        this.fluentTraderAssortHeper.createComplexAssortItem(tables.globals.ItemPresets["584149242459775a7726350a"]._items)
                                    .addStackCount(31)
                                    .addBuyRestriction(5)
                                    .addMoneyCost(Money.ROUBLES, 11009)
                                    .addLoyaltyLevel(1)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createVEST2()) // FORT Defender-2 body armor
                                    .addStackCount(12)
                                    .addMoneyCost(Money.ROUBLES, 205223)
                                    .addBuyRestriction(2)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createVEST3()) // HighCom Trooper TFO body armor (multicam)
                                    .addStackCount(75)
                                    .addMoneyCost(Money.ROUBLES, 116523)
                                    .addBuyRestriction(4)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createVEST5()) // NFM THOR Concealable Reinforced Vest body armor
                                    .addStackCount(34)
                                    .addMoneyCost(Money.ROUBLES, 105795)
                                    .addBuyRestriction(8)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createVEST6()) // BNTI Zhuk-3 body armor (Press)
                                    .addStackCount(85)
                                    .addMoneyCost(Money.ROUBLES, 97745)
                                    .addBuyRestriction(3)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createARTEMWEAPON1()) // Custom Preset ARTEM WEAPON 1 | M4A1 | Loyalty 3
                                    .addStackCount(85)
                                    .addMoneyCost(Money.ROUBLES, 312655)
                                    .addBuyRestriction(1)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createARTEMWEAPON2()) // Custom Preset ARTEM WEAPON 2 | AKM | Loyalty 2
                                    .addStackCount(435)
                                    .addMoneyCost(Money.ROUBLES, 178593)
                                    .addBuyRestriction(2)
                                    .addLoyaltyLevel(2)
                                    .export(tables.traders[baseJson._id]);

        this.fluentTraderAssortHeper.createComplexAssortItem(this.traderHelper.createARTEMWEAPON3()) // Custom Preset ARTEM WEAPON 3 | MCX | Loyalty 3
                                    .addStackCount(938)
                                    .addMoneyCost(Money.ROUBLES, 159653)
                                    .addBuyRestriction(2)
                                    .addLoyaltyLevel(3)
                                    .export(tables.traders[baseJson._id]);
        
        // Add trader to locale file, ensures trader text shows properly on screen
        // WARNING: adds the same text to ALL locales (e.g. chinese/french/english)
        this.traderHelper.addTraderToLocales(baseJson, tables, baseJson.name, "Artem", baseJson.nickname, baseJson.location, "[REDACTED]");

        this.logger.debug(`[${this.mod}] postDb Loaded`);
    }

    private addClothingItemToLocales(tables: IDatabaseTables, ClothingTpl: string, name: string, shortName: string, Description: string) {
        // For each language, add locale for the new trader
        const locales = Object.values(tables.locales.global) as Record<string, string>[];
        for (const locale of locales) {
            locale[`${ClothingTpl} Name`] = name;
            locale[`${ClothingTpl} ShortName`] = shortName;
            locale[`${ClothingTpl} Description`] = Description;
        }
    }

}

module.exports = { mod: new ArtemTrader() }