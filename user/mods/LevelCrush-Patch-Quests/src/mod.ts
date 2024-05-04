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

type QuestMap = { [quest_id: string]: Partial<IQuest> };

class LC_Patch_Quests implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;
  private modPath: string;

  constructor() {
    this.mod = "LevelCrush-Patch-Quests"; // Set name of mod so we can log it to console later
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
      const db_path = path.join(this.modPath, "db", "quests");
      const files = fs.readdirSync(db_path, {
        encoding: "utf-8",
      });

      // quest to patch
      let global_quest_map = {} as QuestMap;

      for (const file of files) {
        let raw = "";
        let quest_map = {} as QuestMap;

        try {
          raw = fs.readFileSync(path.join(db_path, file), {
            encoding: "utf-8",
          });
          quest_map = JSON.parse(raw) as QuestMap;
          console.log("Found quest map: ", quest_map);
          global_quest_map = { ...global_quest_map, ...quest_map };
        } catch {
          this.logger.error("LC Patch Quest cannot parse: " + file);
        }
      }
      console.log("Outputting Quest map to override");
      console.log(global_quest_map);

      for (const quest_id in global_quest_map) {
        // make sure quest exist in database for us to modify
        if (typeof tables.templates.quests[quest_id] === "undefined") {
          this.logger.warning(
            `Quest ${quest_id} does not exist in the database`
          );
          continue;
        }

        this.logger.info(
          `Trying to merge ${quest_id} ${JSON.stringify(
            global_quest_map[quest_id],
            null,
            2
          )} into ${tables.templates.quests[quest_id].QuestName}`
        );

        this.merge_objs(
          tables.templates.quests[quest_id],
          global_quest_map[quest_id]
        );

        this.logger.info(
          `Patched ${quest_id} is now ${JSON.stringify(
            tables.templates.quests[quest_id],
            null,
            2
          )}`
        );
      }
    }

    //  this.logger.info("Force set on the database tables");
    // databaseServer.setTables(tables);

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }

  // recursive functiont to merge object properties
  private merge_objs(target: Record<any, any>, new_input: Record<any, any>) {
    for (const prop in target) {
      if (typeof new_input[prop] === "undefined") {
        // we dont have a matching property in our new input. Skip over it
        this.logger.info(`No override prop for: ${prop}`);
        continue;
      }
      const current_v = target[prop];
      const is_array = Array.isArray(current_v);
      if (is_array) {
        // anything else we have to assume its a new value
        // this includes arrays since those inner values may be entirely new
        this.logger.info(`Overriding ${prop} as an array`);
        target[prop] = new_input[prop];
      } else if (typeof current_v === "object") {
        // we need to merge these objects
        // since the two properties should be the same between the two overrides we can  assume
        // that it exist and is t he same type. if not, weird things will happen
        // probably for the best for things to break since we need them to match up
        this.logger.info(`Overriding ${prop} as an object`);
        this.merge_objs(
          target[prop] as Record<any, any>,
          new_input[prop] as Record<any, any>
        );
      } else {
        // anything else we have to assume its a new value
        // this includes arrays since those inner values may be entirely new
        this.logger.info(`Overriding ${prop} as a normal value`);
        target[prop] = new_input[prop];
      }
    }
  }
}

module.exports = { mod: new LC_Patch_Quests() };
