import { IDatabaseTables } from "@spt-aki/models/spt/server/IDatabaseTables";

export interface ItemMap {
  [item_id: string]: IDatabaseTables["templates"]["prices"][0];
}

export type BlackSmithTraderMap = {
  1: ItemMap;
  2: ItemMap;
  3: ItemMap;
  4: ItemMap;
};

// handles scanning database tables
export class Scanner {
  //scan the database hideout table and create a set  of level maps
  public required_items_for_crafts(
    items: IDatabaseTables["templates"]["items"],
    prices: IDatabaseTables["templates"]["prices"],
    hideout: IDatabaseTables["hideout"]
  ) {
    let global_item_tracker = {} as {
      [key: string]: boolean;
    };

    let levels: BlackSmithTraderMap = {
      1: {},
      2: {},
      3: {},
      4: {},
    };

    // areas we are targeting in our scanner
    // 10 = Workbench
    // 7 = Medstation
    const allowed_areas = [10, 7];

    // scan production recipes
    for (const recipe of hideout.production) {
      if (!allowed_areas.includes(recipe.areaType)) {
        // skip and move on
        continue;
      }

      // scan for requirements s
      let craft_required_level = 0;
      const recipe_items = {};
      let is_quest_locked = false;

      // scan recipe requirements
      for (const requirement of recipe.requirements) {
        if (requirement.type === "QuestComplete") {
          is_quest_locked = true;
        }

        if (requirement.type === "Area" && requirement.requiredLevel) {
          craft_required_level = requirement.requiredLevel;
        }

        if (requirement.type === "Item" && requirement.templateId) {
          recipe_items[requirement.templateId] = requirement;
        }
      }

      // put it all together now
      for (const item_id in recipe_items) {
        if (typeof global_item_tracker[item_id] !== "undefined") {
          // already tracked. ignore
          continue;
        }

        const recipe = recipe_items[item_id];
        const has_price = typeof prices[item_id] !== "undefined" ? true : false;
        const target_price = has_price ? prices[item_id] : 999999;
        if (is_quest_locked) {
          levels["4"][item_id] = target_price;
        } else {
          levels[craft_required_level + ""][item_id] = target_price;
        }
        global_item_tracker[item_id] = true;
      }
    }

    return levels;
  }
}

export default Scanner;
