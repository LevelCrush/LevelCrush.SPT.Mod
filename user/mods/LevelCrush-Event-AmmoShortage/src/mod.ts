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
import { HashUtil } from "@spt-aki/utils/HashUtil";

import * as fs from "fs";
import path from "path";
import { IQuest } from "@spt-aki/models/eft/common/tables/IQuest";
import { IHideoutProduction } from "@spt-aki/models/eft/hideout/IHideoutProduction";
import { ITemplateItem } from "@spt-aki/models/eft/common/tables/ITemplateItem";

class LC_Event_Ammo implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;
  private modPath: string;

  constructor() {
    this.mod = "LevelCrush-Event-Ammo"; // Set name of mod so we can log it to console later
  }

  /**
   * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
   * @param container Dependency container
   */
  public preAkiLoad(container: DependencyContainer): void {
    // Get a logger
    this.logger = container.resolve<ILogger>("WinstonLogger");
    this.logger.debug(`[${this.mod}] preAki Loading... `);

    // Get SPT code/data we need later
    const preAkiModLoader: PreAkiModLoader =
      container.resolve<PreAkiModLoader>("PreAkiModLoader");
    const imageRouter: ImageRouter =
      container.resolve<ImageRouter>("ImageRouter");
    const hashUtil: HashUtil = container.resolve<HashUtil>("HashUtil");
    const configServer = container.resolve<ConfigServer>("ConfigServer");

    this.modPath = preAkiModLoader.getModPath(this.mod);

    this.logger.debug(`[${this.mod}] preAki Loaded`);
  }

  /**
   * Majority of trader-related work occurs after the aki database has been loaded but prior to SPT code being run
   * @param container Dependency container
   */
  public postDBLoad(container: DependencyContainer): void {
    this.logger.debug(`[${this.mod}] postDb Loading... `);

    // Resolve SPT classes we'll use
    const databaseServer: DatabaseServer =
      container.resolve<DatabaseServer>("DatabaseServer");
    const configServer: ConfigServer =
      container.resolve<ConfigServer>("ConfigServer");

    // Get a reference to the database tables
    const tables = databaseServer.getTables();

    // these traders are not affected by the ammo shortage event
    const excluded_traders = [
      "LevelCrushBlacksmith", // level crush blacksmith
      "638f541a29ffd1183d187f57", // Lightkeeper
      "579dc571d53a0658a154fbec", // fence
      "ragfair", // flea market
      "656f0f98d80a697f855d34b1", // BTR driver
    ];

    const MAX_PEN = 20;

    for (const trader_id in tables.traders) {
      if (excluded_traders.includes(trader_id)) {
        this.logger.info(`Skipping ammo removal for ${trader_id}`);
        continue;
      }

      this.logger.info(
        `Removing ammo for purcahse from ${tables.traders[trader_id].base.nickname} (${trader_id})`
      );

      // deep copy the trader items
      const items_keep = [];
      const items_to_remove = {} as { [tpl: string]: ITemplateItem };
      // now scan what is currently there
      for (const item of tables.traders[trader_id].assort.items) {
        const template = tables.templates.items[item._tpl];
        if (template._props.PenetrationPower > MAX_PEN) {
          items_to_remove[item._tpl] = template;
        } else {
          items_keep.push(item);
        }
      }

      // now set the trader to allow
      tables.traders[trader_id].assort.items = items_keep;

      this.logger.info(`Done for ${tables.traders[trader_id].base.nickname}`);
    }

    // databaseServer.setTables(tables);

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }
}

module.exports = { mod: new LC_Event_Ammo() };
