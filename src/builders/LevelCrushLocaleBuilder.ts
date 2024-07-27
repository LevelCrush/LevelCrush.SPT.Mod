import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { injectable } from "tsyringe";

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

export interface LevelCrushLocaleBuilderMap {
    item: ITemplateItem;
    quest: IQuest;
}

export interface LevelCrushLocaleBuilderLocaleMap {
    item: LocaleItem;
    quest: LocaleQuest;
}

//export type LocaleQuestKey = keyof Pick<IQuest, "name" | "note" | "description" | "startedMessageText" | "acceptPlayerMessage" | "failMessageText" | "changeQuestMessageText" | "successMessageText" | "declinePlayerMessage" | "completePlayerMessage">;

export enum LocaleQuestKey {
    Name = "name",
    Note = "note",
    Description = "description",
    Started = "startedMessageText",
    Accepted = "acceptPlayerMessage",
    Failed = "failMessageText",
    ChangeQuest = "changeQuestMessageText",
    Success = "successMessageText",
    Declined = "declinePlayerMessage",
    Completed = "completePlayerMessage",
}

export class LocaleQuest {
    protected readonly input: IQuest;
    protected data: Record<LocaleQuestKey, string>;

    public constructor(quest: IQuest) {
        this.input = quest;
        this.data = {
            acceptPlayerMessage: "",
            failMessageText: "",
            startedMessageText: "",
            successMessageText: "",
            changeQuestMessageText: "",
            declinePlayerMessage: "",
            completePlayerMessage: "",
            name: "",
            note: "",
            description: "",
        };
    }

    public set(locale: LocaleQuestKey, val: string) {
        this.data[locale as string] = val;
        return this;
    }

    public output() {
        const n_out: Record<string, string> = {};
        for (const k in this.data) {
            n_out[`${this.input._id} ${k}`] = this.data[k];
        }
        return JSON.parse(JSON.stringify(n_out));
    }

    public output_to_table(tables: IDatabaseTables, lang: string = "en") {
        const n_out = this.output();
        for (const locale_id in n_out) {
            tables.locales.global[lang][locale_id] = this.data[locale_id];
        }
    }
}

@injectable()
export class LevelCrushLocaleBuilder {
    public start<K extends keyof LevelCrushLocaleBuilderMap, V extends LevelCrushLocaleBuilderMap[K], O extends LevelCrushLocaleBuilderLocaleMap[K]>(type: K, source: V): O {
        //
        switch (type) {
            case "item":
                return new LocaleItem(source as ITemplateItem) as O;
            case "quest":
                return new LocaleQuest(source as IQuest) as O;
            default:
                return null;
        }
    }
}
