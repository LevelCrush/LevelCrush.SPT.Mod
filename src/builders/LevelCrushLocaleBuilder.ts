import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { injectable } from "tsyringe";

export interface LevelCrushLocaleBuilderMap {
    item: ITemplateItem;
    quest: IQuest;
}

export class LocaleItem {
    protected readonly input: ITemplateItem;
    protected data: Record<string, string>;

    public constructor(item: ITemplateItem) {
        this.input = item;
        this.data = {};
    }

    public name(input: string) {
        this.data[this.input._id + " Name"] = input;
        return this;
    }

    public shortName(input: string) {
        this.data[this.input._id + " ShortName"] = input;
        return this;
    }

    public description(input: string) {
        this.data[this.input._id + " Description"] = input;
        return this;
    }

    public auto() {
        this.name(this.input._props.Name || this.input._name);
        this.shortName(this.input._props.ShortName || this.input._name.substring(0, 4));
        this.description(this.input._props.Description || "Lorem Ipsum");
        return this;
    }

    public output() {
        return JSON.parse(JSON.stringify(this.data));
    }

    public output_to_table(tables: IDatabaseTables, lang: string = "en") {
        for (const locale_id in this.data) {
            tables.locales.global[lang][locale_id] = this.data[locale_id];
        }
    }
}

@injectable()
export class LevelCrushLocaleBuilder {
    public start<K extends keyof LevelCrushLocaleBuilderMap, V extends LevelCrushLocaleBuilderMap[K]>(type: K, source: V) {
        //
        switch (type) {
            case "item":
                return new LocaleItem(source as ITemplateItem);
            default:
                return null;
        }
    }
}
