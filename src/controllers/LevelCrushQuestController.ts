import {inject, injectable} from "tsyringe";
import {QuestController} from "@spt/controllers/QuestController";
import {LocalisationService} from "@spt/services/LocalisationService";
import {LocaleService} from "@spt/services/LocaleService";
import {PlayerService} from "@spt/services/PlayerService";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {TimeUtil} from "@spt/utils/TimeUtil";
import {HttpResponseUtil} from "@spt/utils/HttpResponseUtil";
import {EventOutputHolder} from "@spt/routers/EventOutputHolder";
import {DatabaseService} from "@spt/services/DatabaseService";
import {ItemHelper} from "@spt/helpers/ItemHelper";
import {DialogueHelper} from "@spt/helpers/DialogueHelper";
import {MailSendService} from "@spt/services/MailSendService";
import {ProfileHelper} from "@spt/helpers/ProfileHelper";
import {TraderHelper} from "@spt/helpers/TraderHelper";
import {QuestHelper} from "@spt/helpers/QuestHelper";
import {QuestConditionHelper} from "@spt/helpers/QuestConditionHelper";
import {ConfigServer} from "@spt/servers/ConfigServer";
import {ICloner} from "@spt/utils/cloners/ICloner";
import {IItemEventRouterResponse} from "@spt/models/eft/itemEvent/IItemEventRouterResponse";
import {IPmcData} from "@spt/models/eft/common/IPmcData";
import {ICompleteQuestRequestData} from "@spt/models/eft/quests/ICompleteQuestRequestData";
import DiscordWebhook, {DiscordWebhookColors} from "../webhook";

@injectable()
export class LevelCrushQuestController extends QuestController {
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("EventOutputHolder") protected eventOutputHolder: EventOutputHolder,
        @inject("DatabaseService") protected databaseService: DatabaseService,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
        @inject("DialogueHelper") protected dialogueHelper: DialogueHelper,
        @inject("MailSendService") protected mailSendService: MailSendService,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("TraderHelper") protected traderHelper: TraderHelper,
        @inject("QuestHelper") protected questHelper: QuestHelper,
        @inject("QuestConditionHelper") protected questConditionHelper: QuestConditionHelper,
        @inject("PlayerService") protected playerService: PlayerService,
        @inject("LocaleService") protected localeService: LocaleService,
        @inject("LocalisationService") protected localisationService: LocalisationService,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("PrimaryCloner") protected cloner: ICloner,
    ) {
        super(logger, timeUtil, httpResponseUtil, eventOutputHolder, databaseService, itemHelper,
            dialogueHelper, mailSendService, profileHelper, traderHelper, questHelper, questConditionHelper, playerService, localeService, localisationService, configServer, cloner);
    }

    /**
     * Handle QuestComplete event
     * Update completed quest in profile
     * Add newly unlocked quests to profile
     * Also recalculate their level due to exp rewards
     * @param pmcData Player profile
     * @param body Completed quest request
     * @param sessionID Session id
     * @returns ItemEvent client response
     */
    public override completeQuest(
        pmcData: IPmcData,
        body: ICompleteQuestRequestData,
        sessionID: string,
    ): IItemEventRouterResponse {

        // just run the original quest controller logic
        const resp = super.completeQuest(pmcData, body, sessionID);

        const quest = this.questHelper.getQuestFromDb(body.qid, pmcData);
        if (quest) {
            const announce = new DiscordWebhook(this.logger);
            announce.send("Quest Completed", `${pmcData.Info.Nickname} has completed ${quest.QuestName}`, DiscordWebhookColors.Green);
        } else {
            this.logger.info(`Quest: '${body.qid} has not been found on pmc or in the database`);
        }


        return resp;

    }

}