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
import { IBotType } from "@spt-aki/models/eft/common/tables/IBotType";

type BotMap = { [bossid: string]: Partial<IBotType> };

class LC_Patch_Bosses implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;
  private modPath: string;

  constructor() {
    this.mod = "LevelCrush-Patch-Bosses"; // Set name of mod so we can log it to console later
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
    const jsonUtil: JsonUtil = container.resolve<JsonUtil>("JsonUtil");

    // Get a reference to the database tables
    const tables = databaseServer.getTables();

    if (tables.templates && tables.templates.quests) {
      const db_path = path.join(this.modPath, "db");
      const files = fs.readdirSync(db_path, {
        encoding: "utf-8",
      });

      // quest to patch
      let global_map = {} as BotMap;

      for (const file of files) {
        let raw = "";
        let bot = {} as Partial<IBotType>;
        // big assumption but for now it works
        const bossid = file.split(".json")[0];
        this.logger.info(
          `LC Boss Patch is trying to load override for ${bossid}`
        );

        try {
          raw = fs.readFileSync(path.join(db_path, file), {
            encoding: "utf-8",
          });
          bot = JSON.parse(raw) as IBotType;
          console.log("Found boss: " + bossid);
          global_map[bossid] = bot;
        } catch {
          this.logger.error("LC Patch Boss cannot parse: " + file);
        }
      }

      this.logger.info(
        "All loaded database bot types\r\n" +
          JSON.stringify(Object.keys(tables.bots.types))
      );

      for (const boss_id in global_map) {
        // make sure quest exist in database for us to modify
        if (typeof tables.bots.types[boss_id] === "undefined") {
          this.logger.warning(`Boss ${boss_id} does not exist in the database`);
          continue;
        }

        this.merge_objs(tables.bots.types[boss_id], global_map[boss_id]);

        this.logger.info(
          `Boss ${boss_id} now looks like this ${JSON.stringify(
            tables.bots.types[boss_id],
            null,
            2
          )}`
        );
      }
    }

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }

  // recursive functiont to merge object properties
  private merge_objs(source: Record<any, any>, new_input: Record<any, any>) {
    for (const prop in source) {
      if (typeof new_input[prop] === "undefined") {
        // we dont have a matching property in our new input. Skip over it
        continue;
      }
      const is_array = Array.isArray(source[prop]);
      const current_v = source[prop];
      const new_v_is_unset = new_input[prop] === "{{unset}}";
      const is_empty_object =
        typeof current_v === "object" &&
        Object.keys(new_input[prop]).length === 0;
      if (new_v_is_unset) {
        // delete
        this.logger.info(`${prop} is deleted`);
        delete source[prop];
      } else if (is_empty_object) {
        // force to an empty object
        source[prop] = {};
      } else if (is_array) {
        // anything else we have to assume its a new value
        // this includes arrays since those inner values may be entirely new
        this.logger.info(`${prop} is array`);
        source[prop] = new_input[prop];
      } else if (typeof current_v === "object") {
        this.logger.info(`${prop} is an object and needs a merge`);
        // we need to merge these objects
        // since the two properties should be the same between the two overrides we can  assume
        // that it exist and is t he same type. if not, weird things will happen
        // probably for the best for things to break since we need them to match up
        this.merge_objs(
          current_v as Record<any, any>,
          new_input[prop] as Record<any, any>
        );
      } else {
        this.logger.info(`${prop} is a regular value can be set normally`);
        // anything else we have to assume its a new value
        // this includes arrays since those inner values may be entirely new
        source[prop] = new_input[prop];
      }
    }
  }
}

module.exports = { mod: new LC_Patch_Bosses() };
