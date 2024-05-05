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

class LC_Load_Recipes implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;
  private modPath: string;

  constructor() {
    this.mod = "LevelCrush-Load-Recipes"; // Set name of mod so we can log it to console later
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
    this.logger.info("Scanning for new recipes");
    const tables = databaseServer.getTables();
    const recipes_to_add = [] as IHideoutProduction[];
    if (tables.hideout && tables.hideout.production) {
      // scan for recipes
      const db_path = path.join(this.modPath, "db");
      const entries = fs.readdirSync(db_path, { encoding: "utf-8" });
      for (const entry of entries) {
        const file_path = path.join(db_path, entry);
        const stat = fs.statSync(file_path);
        if (stat.isFile()) {
          try {
            const raw = fs.readFileSync(file_path, { encoding: "utf-8" });
            const json = JSON.parse(raw) as IHideoutProduction[];
            for (const production of json) {
              recipes_to_add.push(production);
            }
          } catch {
            this.logger.error(`Failed to parse: ${file_path}`);
          }
        }
      }
    }

    this.logger.info(`Going to add ${recipes_to_add.length} total recipes`);

    // concat the base production reecipes with our new ones
    tables.hideout.production =
      tables.hideout.production.concat(recipes_to_add);

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }
}

module.exports = { mod: new LC_Load_Recipes() };
