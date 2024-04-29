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

class LC_QOL_Inertia implements IPreAkiLoadMod, IPostDBLoadMod {
  private mod: string;
  private logger: ILogger;
  private modPath: string;
  private container: DependencyContainer;
  private databaseServer: DatabaseServer;

  private is_processing: boolean;
  constructor() {
    this.mod = "LevelCrush-QOL-Inertia"; // Set name of mod so we can log it to console later
    this.modPath = "";
    this.is_processing = false;
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
    const jsonUtil: JsonUtil = this.container.resolve<JsonUtil>("JsonUtil");

    // Get a reference to the database tables
    const tables = this.databaseServer.getTables();

    // make sure factory and config folers are setup
    // technically doing this sync is very bad, but this only occurs at server startup
    // we can get away with it in this case
    fs.mkdirSync(path.join(this.modPath, "/factory"), { recursive: true });
    fs.mkdirSync(path.join(this.modPath, "/config"), { recursive: true });

    if (tables.globals) {
      this.logger.debug("Making sure to backup current databased inertia");
      const inertia = tables.globals.config.Inertia;

      // store current db inertia in factory
      this.saveFactoryIntertia(inertia);

      // overwrite inertia with the one from our config
      const file_exists = fs.existsSync(
        path.join(this.modPath, "/factory/default.json")
      );
      if (!file_exists) {
        this.saveConfigInertia("default", inertia);
      }

      this.logger.debug("Adjusting inertia");

      // again , sync io is normally bad. but this happens on server start so its okay
      const new_inertia = JSON.parse(
        fs.readFileSync(path.join(this.modPath, "/config/default.json"), {
          encoding: "utf-8",
        })
      ) as Partial<IInertia>;

      // overwrite our database inertia with the new inertia we are loading from our configuration
      this.overwriteInertia(new_inertia, false);

      this.logger.debug("Done Removing inertia");

      this.logger.debug("Setting up watcher for Inertia changes");
      this.watchInertiaChanges("default");

      this.logger.debug("Setting up monitor");
      this.interval_monitor_inertia();
    }

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }

  // console output current intertia
  public interval_monitor_inertia() {
    this.logger.info("Setting up interval for inertia monitor");
    // use setTimeout instead of setInterval to prevent overstacking on timers related to this task
    setTimeout(() => {
      console.log("Console Check");
      this.logger.info("Current inertial changes");
      this.logger.info(
        JSON.stringify(this.databaseServer.getTables().globals.config.Inertia)
      );
      this.interval_monitor_inertia();
    }, 60 * 1000); /// every 300 seconds output inertia
  }

  /// savethe passed inertia as a factory (default)
  public saveFactoryIntertia(
    inertia: IDatabaseTables["globals"]["config"]["Inertia"]
  ) {
    const serialized = JSON.stringify(inertia);
    const writer = fs.writeFile(
      path.join(this.modPath, "/factory/default.json"),
      serialized,
      (err) => {
        if (err) {
          this.logger.error(
            "Could not save inertia due to error:" + err.message
          );
        }
      }
    );
  }

  /// save the configured inertia to the config file
  public saveConfigInertia(
    name: string,
    inertia: IDatabaseTables["globals"]["config"]["Inertia"]
  ) {
    console.log(this.modPath, "/config/" + name + ".json");
    const serialized = JSON.stringify(inertia, null, 2);
    const writer = fs.writeFile(
      path.join(this.modPath, "/config/" + name + ".json"),
      serialized,
      (err) => {
        if (err) {
          this.logger.error(
            "Could not save inertia due to error:" + err.message
          );
        }
      }
    );
  }

  /// take our source inertia (which does not need to have all properties defined)
  /// and transfer it over to the current live in memory inertia configuration
  public overwriteInertia(source: Partial<IInertia>, forceSet = true) {
    console.log("Merging ", source, "into the current inertia configuration");

    // deep copy inertia, easiest and fastest solution
    const tables = this.databaseServer.getTables();
    const inertia = tables.globals.config.Inertia;
    const inertia_cpy = JSON.parse(JSON.stringify(inertia)) as IInertia;
    const merged = { ...inertia_cpy, ...source };
    console.log("Merged", merged);
    tables.globals.config.Inertia = merged;

    if (forceSet) {
      this.databaseServer.setTables(tables);
      this.is_processing = false;
    }
  }

  /// watch a specific config for inertia changes and apply
  public watchInertiaChanges(config: string) {
    this.is_processing = false;
    fs.watch(
      path.join(this.modPath, "/config/" + config + ".json"),
      {
        persistent: true,
        encoding: "utf-8",
      },
      (ev, filename) => {
        // fill
        if (this.is_processing) {
          console.log("Already processing inertia changes...skipping");
          return;
        }
        if (ev === "change") {
          this.is_processing = true;
          this.logger.info(
            "Detected a change to inertia. Applying in real time"
          );

          fs.readFile(
            path.join(this.modPath, "/config/" + config + ".json"),
            {
              encoding: "utf-8",
            },
            (err, data) => {
              const deserialized = JSON.parse(data);
              console.log(deserialized);
              const tables = this.databaseServer.getTables();
              this.overwriteInertia(deserialized);
            }
          );
        }
      }
    );
  }
}

module.exports = { mod: new LC_QOL_Inertia() };
