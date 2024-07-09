import { InraidController } from '@spt-aki/controllers/InraidController';
import { inject, injectable } from 'tsyringe';
import { ITraderConfig } from '@spt-aki/models/spt/config/ITraderConfig';
import { IAirdropConfig } from '@spt-aki/models/spt/config/IAirdropConfig';
import { IBTRConfig } from '@spt-aki/models/spt/config/IBTRConfig';
import { IInRaidConfig } from '@spt-aki/models/spt/config/IInRaidConfig';
import { ConfigTypes } from '@spt-aki/models/enums/ConfigTypes';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { SaveServer } from '@spt-aki/servers/SaveServer';
import { JsonUtil } from '@spt-aki/utils/JsonUtil';
import { TimeUtil } from '@spt-aki/utils/TimeUtil';
import { DatabaseServer } from '@spt-aki/servers/DatabaseServer';
import { PmcChatResponseService } from '@spt-aki/services/PmcChatResponseService';
import { MatchBotDetailsCacheService } from '@spt-aki/services/MatchBotDetailsCacheService';
import { QuestHelper } from '@spt-aki/helpers/QuestHelper';
import { ItemHelper } from '@spt-aki/helpers/ItemHelper';
import { ProfileHelper } from '@spt-aki/helpers/ProfileHelper';
import { PlayerScavGenerator } from '@spt-aki/generators/PlayerScavGenerator';
import { HealthHelper } from '@spt-aki/helpers/HealthHelper';
import { TraderHelper } from '@spt-aki/helpers/TraderHelper';
import { TraderServicesService } from '@spt-aki/services/TraderServicesService';
import { InsuranceService } from '@spt-aki/services/InsuranceService';
import { InRaidHelper } from '@spt-aki/helpers/InRaidHelper';
import { ApplicationContext } from '@spt-aki/context/ApplicationContext';
import { ConfigServer } from '@spt-aki/servers/ConfigServer';
import { MailSendService } from '@spt-aki/services/MailSendService';
import { RandomUtil } from '@spt-aki/utils/RandomUtil';
import { ISaveProgressRequestData } from '@spt-aki/models/eft/inRaid/ISaveProgressRequestData';
import { LogTextColor } from '@spt-aki/models/spt/logging/LogTextColor';
import { QuestStatus } from '@spt-aki/models/enums/QuestStatus';
import IQuest from '../models/eft/common/tables/IQuest';
import { ILocationConfig } from '@spt-aki/models/spt/config/ILocationConfig';
import { IRagfairConfig } from '@spt-aki/models/spt/config/IRagfairConfig';
import { IHideoutConfig } from '@spt-aki/models/spt/config/IHideoutConfig';
import { InventoryHelper } from '@spt-aki/helpers/InventoryHelper';
import { VFS } from '@spt-aki/utils/VFS';
import { config } from 'winston';
import { configs } from '@typescript-eslint/eslint-plugin';

@injectable()
export class HardcoreZoneController extends InraidController {
    protected airdropConfig: IAirdropConfig;
    protected btrConfig: IBTRConfig;
    protected inRaidConfig: IInRaidConfig;
    protected traderConfig: ITraderConfig;
    protected locationConfig: ILocationConfig;
    protected ragfairConfig: IRagfairConfig;
    protected hideoutConfig: IHideoutConfig;

    // We need to make sure we use the constructor and pass the dependencies to the parent class!
    constructor(
        @inject('WinstonLogger') protected logger: ILogger,
        @inject('SaveServer') protected saveServer: SaveServer,
        @inject('JsonUtil') protected jsonUtil: JsonUtil,
        @inject('TimeUtil') protected timeUtil: TimeUtil,
        @inject('DatabaseServer') protected databaseServer: DatabaseServer,
        @inject('PmcChatResponseService') protected pmcChatResponseService: PmcChatResponseService,
        @inject('MatchBotDetailsCacheService') protected matchBotDetailsCacheService: MatchBotDetailsCacheService,
        @inject('QuestHelper') protected questHelper: QuestHelper,
        @inject('ItemHelper') protected itemHelper: ItemHelper,
        @inject('ProfileHelper') protected profileHelper: ProfileHelper,
        @inject('PlayerScavGenerator') protected playerScavGenerator: PlayerScavGenerator,
        @inject('HealthHelper') protected healthHelper: HealthHelper,
        @inject('TraderHelper') protected traderHelper: TraderHelper,
        @inject('TraderServicesService') protected traderServicesService: TraderServicesService,
        @inject('InsuranceService') protected insuranceService: InsuranceService,
        @inject('InRaidHelper') protected inRaidHelper: InRaidHelper,
        @inject('ApplicationContext') protected applicationContext: ApplicationContext,
        @inject('ConfigServer') protected configServer: ConfigServer,
        @inject('MailSendService') protected mailSendService: MailSendService,
        @inject('RandomUtil') protected randomUtil: RandomUtil,
    ) {
        super(
            logger,
            saveServer,
            jsonUtil,
            timeUtil,
            databaseServer,
            pmcChatResponseService,
            matchBotDetailsCacheService,
            questHelper,
            itemHelper,
            profileHelper,
            playerScavGenerator,
            healthHelper,
            traderHelper,
            traderServicesService,
            insuranceService,
            inRaidHelper,
            applicationContext,
            configServer,
            mailSendService,
            randomUtil,
        );
        this.airdropConfig = this.configServer.getConfig(ConfigTypes.AIRDROP);
        this.btrConfig = this.configServer.getConfig(ConfigTypes.BTR);
        this.inRaidConfig = this.configServer.getConfig(ConfigTypes.IN_RAID);
        this.traderConfig = this.configServer.getConfig(ConfigTypes.TRADER);
        this.locationConfig = this.configServer.getConfig(ConfigTypes.LOCATION);
        this.ragfairConfig = this.configServer.getConfig(ConfigTypes.RAGFAIR);
        this.hideoutConfig = this.configServer.getConfig(ConfigTypes.HIDEOUT);
    }

    public override savePostRaidProgress(offraidData: ISaveProgressRequestData, sessionID: string): void {
        const is_dead = this.isPlayerDead(offraidData.exit);
        //const is_hardcore = this.profileHelper.getFullProfile(sessionID).info.edition.toLowerCase() == 'hardcore';
        const pmc_data = this.profileHelper.getPmcProfile(sessionID);
        const is_hardcore = ((dead: boolean) => {
            let result = false;
            if (dead) {
                // only scan if we are dead
                for (const quest of offraidData.profile.Quests) {
                    if (quest.status === QuestStatus.Fail) {
                        const quest_id = quest.qid;
                        const quest_data = this.questHelper.getQuestFromDb(quest_id, pmc_data) as IQuest;
                        if (quest_data.levelcrush && quest_data.levelcrush.hardcore) {
                            result = true;
                            break;
                        }
                    }
                }
            }
            return result;
        })(is_dead);

        if (is_hardcore) {
            this.logger.logWithColor(`${offraidData.profile.Info.Nickname} is in hardcore mode`, LogTextColor.YELLOW);
            if (is_dead) {
                this.logger.logWithColor(
                    `${offraidData.profile.Info.Nickname} is dead and is hardcore. Must Wipe`,
                    LogTextColor.CYAN,
                );
            }
        }

        if (!this.inRaidConfig.save.loot) {
            return;
        }

        if (offraidData.isPlayerScav) {
            this.savePlayerScavProgress(sessionID, offraidData);
        } else {
            if (is_hardcore && is_dead) {
                this.logger.logWithColor(`Wiping ${offraidData.profile.Info.Nickname}`, LogTextColor.CYAN);
                this.wipePMC(sessionID, offraidData);
            } else {
                this.savePmcProgress(sessionID, offraidData);
            }
        }
    }

    public wipePMC(sessionID: string, postRaidRequest: ISaveProgressRequestData): void {
        const serverProfile = this.saveServer.getProfile(sessionID);
        serverProfile.info.wipe = true;
        this.saveServer.saveProfile(sessionID);
    }
}
