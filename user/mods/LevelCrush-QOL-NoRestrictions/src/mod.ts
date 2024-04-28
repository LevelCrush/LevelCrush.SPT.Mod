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

import { Money } from "@spt-aki/models/enums/Money";
import { Traders } from "@spt-aki/models/enums/Traders";
import { HashUtil } from "@spt-aki/utils/HashUtil";
import { IRestrictionsInRaid } from "@spt-aki/models/eft/common/IGlobals";

class BlacksmithTrader implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;

  constructor() {
    this.mod = "LevelCrush-QOL-NoRestrictions"; // Set name of mod so we can log it to console later
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
    const traderConfig: ITraderConfig = configServer.getConfig<ITraderConfig>(
      ConfigTypes.TRADER
    );
    const ragfairConfig = configServer.getConfig<IRagfairConfig>(
      ConfigTypes.RAGFAIR
    );

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
    const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

    // Get a reference to the database tables
    const tables = databaseServer.getTables();

    if (tables.globals) {
      this.logger.debug("Lifting Restrictions on all items");
      for (const restriction of tables.globals.config.RestrictionsInRaid) {
        restriction["MaxInLobby"] = 999999;
        restriction["MaxInRaid"] = 999999;
      }
      this.logger.debug("Done Lifting Restrictions on all items");
    }

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }
}

module.exports = { mod: new BlacksmithTrader() };
