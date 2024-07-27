import { IQuest, IQuestCondition, IQuestConditionCounter, IQuestConditionCounterCondition } from "@spt/models/eft/common/tables/IQuest";
import { QuestStatus } from "@spt/models/enums/QuestStatus";
import { QuestTypeEnum } from "@spt/models/enums/QuestTypeEnum";
import { Traders } from "@spt/models/enums/Traders";
import { injectable } from "tsyringe";
import { LocaleItem, LocaleQuest, LocaleQuestKey } from "./LevelCrushLocaleBuilder";
import { ELocationName } from "@spt/models/enums/ELocationName";
import { ItemTpl } from "@spt/models/enums/ItemTpl";
import { CustomTrader } from "../models/enums/CustomTrader";
import { CustomItemTpl } from "../models/enums/CustomItemTpl";
import { QuestConditionType } from "../models/enums/QuestConditionType";
import { QuestSide } from "../models/enums/QuestSide";
import { QuestConditionCompareMethod } from "../models/enums/QuestConditionCompareMethod";

export class QuestConditionCounterCondition {
    public readonly id: string;
    public readonly counter: QuestConditionCounter;
    private data: IQuestConditionCounterCondition;

    public constructor(id: string, counter: QuestConditionCounter) {
        this.id = id;
        this.counter = counter;
        this.data = {
            id: this.id,
            dynamicLocale: false,
        };
    }

    public output(): IQuestConditionCounterCondition {
        return JSON.parse(JSON.stringify(this.data));
    }
}

export class QuestConditionCounter {
    private _id: string;
    private _condition_id: string;
    private _quest_id: string;
    private _data: IQuestConditionCounter;

    public constructor() {
        //this.id = counter_id;
        //this.condition_id = condition_id;
        this._data = {
            id: "",
            conditions: [],
        };
    }

    public id(input: string) {
        this._id = input;
        this._data["id"] = this._id;
        return this;
    }

    public condition(input: string) {
        this._condition_id = input;
        return this;
    }

    public quest(input: string) {
        this._quest_id = input;
        return this;
    }

    public output() {
        return JSON.parse(JSON.stringify(this._data)) as IQuestConditionCounter;
    }
}

export class QuestCondition {
    private _id: string;
    private _quest_id: string;
    private _data: IQuestCondition;

    public constructor() {
        // defaults
        this._data = {
            id: "'",
            dynamicLocale: false,
            completeInSeconds: 0,
            globalQuestCounterId: "",
            parentId: "",
            isEncoded: false,
            visibilityConditions: [],
            target: [],
            index: 0,
        };
    }

    public id(input: string) {
        this._id = input;
        this._data["id"] = input;
        return this;
    }

    public quest(input: string) {
        this._quest_id = input;
        this._data["id"] = input;
        return this;
    }

    public type(input: QuestConditionType) {
        this._data["conditionType"] = input as string;
        return this;
    }

    public counter(input: QuestConditionCounter) {
        this._data["counter"] = input.condition(this._id).output();
        return this;
    }

    /**
     * Compare to a certain value
     * @param method
     * @param value
     * @returns
     */
    public compare(method: QuestConditionCompareMethod, value: number | string) {
        this._data["compareMethod"] = method as string;
        this._data["value"] = value;
        return this;
    }

    /**
     * This condition must be completed in one session (one raid)
     * @returns
     */
    public one_session() {
        this._data["oneSessionOnly"] = true;
        return this;
    }

    /**
     * Ensures that whatever is found or handed over for an item has found in raid status
     * @returns
     */
    public found_in_raid() {
        this._data["onlyFoundInRaid"] = true;
        return this;
    }

    /**
     * Unknown what isEncoded does at this moment
     * @returns
     */
    public encoded() {
        this._data["isEncoded"] = true;
        return this;
    }

    /**
     * If the counter is completed. Dont reset it. Even if we die
     * @returns
     */
    public dont_reset_if_counter_completed() {
        this._data["doNotResetIfCounterCompleted"] = true;
        return this;
    }

    /**
     * Sets a minimum dog tag level if handing over items that match a dogtags tpl
     * @param input The minimum level for a dog tag
     * @returns
     */
    public dogtag_level(input: number) {
        this._data["dogtagLevel"] = Math.min(100, Math.max(1, Math.ceil(input)));
        return this;
    }

    public durability(min = 0, max = 100) {
        this._data["minDurability"] = Math.min(100, Math.max(0, Math.ceil(min)));
        this._data["maxDurability"] = Math.min(100, Math.max(0, Math.ceil(max)));
        return this;
    }

    /**
     * Sets the minimum required field for a condition that is HandoverItem
     * @param tpls The target ids for this condition
     * @param amount The amount we need to handover
     */
    public as_handover_item(tpls: Array<ItemTpl | CustomItemTpl>, amount: number) {
        this._data["conditionType"] = QuestConditionType.HandoverItem as string;
        this._data["target"] = tpls;
        this._data["value"] = amount;

        this.durability();

        this.as_handover_item([CustomItemTpl.Omnicron, ItemTpl.AMMOBOX_127X55_PS12A_10RND], 1);
        return this;
    }

    /**
     * Sets up the condition so its considered a level comparison
     * @param target_level
     * @param method
     */
    public as_compare_level(target_level: number, method: QuestConditionCompareMethod) {
        this._data["conditionType"] = QuestConditionType.Level;
        this._data["value"] = Math.min(100, Math.max(0, Math.ceil(target_level)));
        this._data["compareMethod"] = method as string;
        return this;
    }

    public as_quest(quest_id: string, quest_status: QuestStatus = QuestStatus.Success) {
        this._data["conditionType"] = QuestConditionType.Quest;
        this._data["target"] = quest_id;
        this._data["status"] = [quest_status];
        this._data["availableAfter"] = 0; // we don't time gate our users. Let the builder explicility set this

        return this;
    }

    public as_counter(counter: QuestConditionCounter) {
        this._data["conditionType"] = QuestConditionType.CounterCreator;
        this._data["completeInSeconds"] = 0;
        this._data["doNotResetIfCounterCompleted"] = false;
        this._data["oneSessionOnly"] = false;
        this._data["counter"] = counter.condition(this._id).quest(this._quest_id).output();
        return this;
    }

    /**
     * For properties not wrapped. Use this to directly set the fields
     * @param key The field within the quest object
     * @param v The value that you want to set
     * @returns self
     */
    public direct<K extends keyof IQuestCondition, V extends IQuestCondition[K]>(key: K, v: V) {
        this._data[key] = v;
        return this;
    }

    public output(): IQuestCondition {
        return JSON.parse(JSON.stringify(this._data));
    }
}

export class Quest {
    private readonly _id: string;
    private data: IQuest;
    private locales: LocaleQuest;

    public constructor(mongo_id: string) {
        this._id = mongo_id;

        this.data = this.defaults(this._id);

        // always start off with locale id's being populated being auto populated
        this.locale_id_auto();
        this.locales = new LocaleQuest(this.data);
    }

    private defaults(id: string): IQuest {
        return {
            _id: id,
            QuestName: `${id} Quest`,
            canShowNotificationsInGame: true,
            conditions: {
                AvailableForStart: [],
                AvailableForFinish: [],
                Fail: [],
                Started: [],
                Success: [],
            },
            description: "",
            failMessageText: "",
            name: "",
            note: "",
            traderId: Traders.FENCE,
            type: QuestTypeEnum.MULTI,
            location: "any",
            image: `/files/quest/icon/${id}.jpg`,
            instantComplete: false,
            isKey: false,
            restartable: false,
            questStatus: QuestStatus.Locked,
            secretQuest: false,
            startedMessageText: "",
            successMessageText: "",
            acceptPlayerMessage: "",
            declinePlayerMessage: "",
            completePlayerMessage: "",
            templateId: "",
            rewards: {
                AvailableForFinish: [],
                AvailableForStart: [],
                Started: [],
                Success: [],
                Fail: [],
                FailRestartable: [],
                Expired: [],
            },
            side: "Pmc",
            status: "",
            KeyQuest: false,
            changeQuestMessageText: "",
            sptStatus: QuestStatus.Locked,
        };
    }

    private locale_id_auto() {
        this.locale_id(LocaleQuestKey.Accepted);
        this.locale_id(LocaleQuestKey.ChangeQuest);
        this.locale_id(LocaleQuestKey.Completed);
        this.locale_id(LocaleQuestKey.Declined);
        this.locale_id(LocaleQuestKey.Failed);
        this.locale_id(LocaleQuestKey.Started);
        this.locale_id(LocaleQuestKey.Success);
        this.locale_id(LocaleQuestKey.Name);
        this.locale_id(LocaleQuestKey.Note);
        this.locale_id(LocaleQuestKey.Description);
    }

    public name(input: string) {
        this.locales.set(LocaleQuestKey.Name, input);
        return this;
    }

    public note(input: string) {
        this.locales.set(LocaleQuestKey.Note, input);
        return this;
    }

    public description(input: string) {
        this.locales.set(LocaleQuestKey.Description, input);
        return this;
    }

    public side(input: QuestSide) {
        this.data["side"] = input as string;
        return this;
    }

    public location(input: ELocationName) {
        this.data["location"] = input as string;
        return this;
    }

    public trader(input: Traders | CustomTrader) {
        this.data["traderId"] = input as string;
        return this;
    }

    public condition_finsh(input: QuestCondition) {
        this.data["conditions"].AvailableForFinish.push(input.quest(this._id).output());
        return this;
    }

    public message_accept(input: string) {
        this.locales.set(LocaleQuestKey.Accepted, input);
        return this;
    }

    public message_started(input: string) {
        this.locales.set(LocaleQuestKey.Started, input);
        return;
    }

    public message_change(input: string) {
        this.locales.set(LocaleQuestKey.ChangeQuest, input);
        return this;
    }

    public message_completed(input: string) {
        this.locales.set(LocaleQuestKey.Completed, input);
        return this;
    }

    public message_success(input: string) {
        this.locales.set(LocaleQuestKey.Success, input);
        return this;
    }

    public message_failed(input: string) {
        this.locales.set(LocaleQuestKey.Failed, input);
        return this;
    }

    private locale_id(locale: LocaleQuestKey, val = "") {
        this.data[locale] = val || `${this._id} ${locale}`;
    }
}

@injectable()
export class LevelCrushQuestBuilder {
    public static start(mongo_id: string) {
        return new Quest(mongo_id);
    }
}
