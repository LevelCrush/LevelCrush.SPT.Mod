import { ItemHelper } from "@spt/helpers/ItemHelper";
import { ITemplateItem, ItemType, Props } from "@spt/models/eft/common/tables/ITemplateItem";
import { injectable, inject } from "tsyringe";

export class Item {
    private readonly tpl: string;
    private data: Record<string, any>;

    public constructor(tpl: string, data: Record<string, any> = null) {
        this.tpl = tpl;
        this.data = typeof data === "object" ? data : {};
        this.data["_id"] = this.tpl;
    }

    public name(input: string) {
        this.data["_name"] = input;
        return this;
    }

    public parent(input: string | Item) {
        this.data["_parent"] = typeof input === "string" ? input : (input as Item).tpl;
        return this;
    }

    public type(input: ItemType) {
        this.data["_type"] = input as string;
        return this;
    }

    public prop<K extends keyof Props, V extends Props[K]>(key: K, val: V) {
        if (typeof this.data["_props"] === "undefined") {
            this.data["_props"] = {};
        }
        this.data["_props"][key] = val;
        return this;
    }

    public output(): ITemplateItem {
        // guarentee that we have a unique copy being returned in this function
        return JSON.parse(JSON.stringify(this.data)) as ITemplateItem;
    }
}

@injectable()
export class LevelCrushItemBuilder {
    constructor(@inject("ItemHelper") protected itemHelper: ItemHelper) {}

    /**
     * Start building a fresh item
     * Tool to generate mongo  id: https://observablehq.com/@hugodf/mongodb-objectid-generator
     * @param tpl
     * @returns Item
     */
    public start(tpl: string): Item {
        return new Item(tpl);
    }

    /**
     * Clone using a base item and then modify as needed
     * https://observablehq.com/@hugodf/mongodb-objectid-generator
     * @param base_tpl Where do we want to clone from
     * @param new_tpl What our new mongo id will be
     */
    public clone(base_tpl: string, new_tpl: string): Item {
        const base = JSON.parse(JSON.stringify(this.itemHelper.getItem(base_tpl)[1])) as any;
        return new Item(new_tpl, base);
    }
}
