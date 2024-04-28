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
import {
  IInertia,
  IRestrictionsInRaid,
} from "@spt-aki/models/eft/common/IGlobals";
import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";

import * as fs from "fs";
import * as path from "path";
import { Config } from "@spt-aki/models/spt/server/ISettingsBase";

class LevelCrushLoot implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;
  private modPath: string;
  private container: DependencyContainer;
  private databaseServer: DatabaseServer;

  private folder_paths = {
    location: "location.json",
  };

  private is_updating: boolean;
  constructor() {
    this.mod = "LevelCrush-Loot"; // Set name of mod so we can log it to console later
    this.modPath = "";
    this.is_updating = false;
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

    this.modPath = preAkiModLoader.getModPath(this.mod);

    this.logger.debug(`[${this.mod}] preAki Loaded`);
  }

  // post db load
  public postDBLoad(container: DependencyContainer): void {
    this.logger.debug(`[${this.mod}] postDb Loading... `);

    // Resolve SPT classes we'll use
    this.container = container;
    this.databaseServer =
      this.container.resolve<DatabaseServer>("DatabaseServer");
    const configServer: ConfigServer =
      this.container.resolve<ConfigServer>("ConfigServer");

    // Get a reference to the database tables
    const tables = configServer.getConfig(ConfigTypes.LOCATION);

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }

  public get_path(folder: string, file: string) {
    return path.join(this.modPath, folder, file);
  }

  // setup folders
  public setup_folders() {}
}

module.exports = { mod: new LevelCrushLoot() };
