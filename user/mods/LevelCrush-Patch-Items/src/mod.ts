import { DependencyContainer } from "tsyringe";

// SPT types
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { HashUtil } from "@spt-aki/utils/HashUtil";

import * as fs from "fs";
import path from "path";
import { IQuest } from "@spt-aki/models/eft/common/tables/IQuest";
import {IPostDBLoadModAsync} from "@spt-aki/models/external/IPostDBLoadModAsync";
import {IPreAkiLoadModAsync} from "@spt-aki/models/external/IPreAkiLoadModAsync";
import { IDatabaseTables} from "@spt-aki/models/spt/server/IDatabaseTables";
import {ITemplateItem} from "@spt-aki/models/eft/common/tables/ITemplateItem";

class LC_Patch_Items implements IPreAkiLoadModAsync, IPostDBLoadModAsync {
  private mod: string;
  private logger: ILogger;
  private modPath: string;

  constructor() {
    this.mod = "LevelCrush-Patch-Items"; // Set name of mod so we can log it to console later
  }

  /**
   * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
   * @param container Dependency container
   */
  public async preAkiLoadAsync(container: DependencyContainer): Promise<void> {
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
  public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
    this.logger.debug(`[${this.mod}] postDb Loading... `);

    // Resolve SPT classes we'll use
    const databaseServer: DatabaseServer =
      container.resolve<DatabaseServer>("DatabaseServer");
    const configServer: ConfigServer =
      container.resolve<ConfigServer>("ConfigServer");

    // Get a reference to the database tables
    const tables = databaseServer.getTables();
    // scan
    const files = await fs.promises.readdir(path.join(this.modPath, "db"));
    for(const entry of files) {
      const filepath = path.join(this.modPath, "db", entry);
      this.logger.info(`Found Item Patch at: ${filepath}`);
      const is_json = entry.endsWith(".json");
      if(is_json) {
        this.logger.info(`Scanning Item Patch at: ${filepath}`);
        const contents = await fs.promises.readFile(filepath, { encoding: 'utf-8' });
        const templates = JSON.parse(contents) as Record<string, Partial<ITemplateItem>>[];

        for(const template_id in templates) {
          const template = templates[template_id];
          this.logger.info(`Checkking for item template ${template_id}`);
          if(typeof tables.templates.items[template_id] === 'undefined') {
            // skip
            continue;
          }

          this.logger.info(`Patching item ${template_id}`);
          this.merge_objs(tables.templates.items[template_id], template);
        }

      }
    }


    //  this.logger.info("Force set on the database tables");
    // databaseServer.setTables(tables);

    this.logger.debug(`[${this.mod}] postDb Loaded`);
  }

  // recursive functiont to merge object properties
  private merge_objs(source: Record<any, any>, new_input: Record<any, any>) {
    // use new input as the merge source to make sure new keys are being placed in
    for (const prop in new_input) {
      const is_array = Array.isArray(source[prop]);
      const current_v = source[prop];
      const new_v_is_unset = new_input[prop] === "{{unset}}";
      const is_empty_object =
          typeof current_v === "object" &&
          Object.keys(new_input[prop]).length === 0;
      if (new_v_is_unset && typeof source[prop] !== "undefined") {
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

module.exports = { mod: new LC_Patch_Items() };
