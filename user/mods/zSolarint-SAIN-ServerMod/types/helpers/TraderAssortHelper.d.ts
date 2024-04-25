import { RagfairAssortGenerator } from "@spt-aki/generators/RagfairAssortGenerator";
import { RagfairOfferGenerator } from "@spt-aki/generators/RagfairOfferGenerator";
import { AssortHelper } from "@spt-aki/helpers/AssortHelper";
import { PaymentHelper } from "@spt-aki/helpers/PaymentHelper";
import { ProfileHelper } from "@spt-aki/helpers/ProfileHelper";
import { TraderHelper } from "@spt-aki/helpers/TraderHelper";
import { Item } from "@spt-aki/models/eft/common/tables/IItem";
import {
  ITrader,
  ITraderAssort,
} from "@spt-aki/models/eft/common/tables/ITrader";
import { ITraderConfig } from "@spt-aki/models/spt/config/ITraderConfig";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ConfigServer } from "@spt-aki/servers/ConfigServer";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { FenceService } from "@spt-aki/services/FenceService";
import { LocalisationService } from "@spt-aki/services/LocalisationService";
import { TraderAssortService } from "@spt-aki/services/TraderAssortService";
import { TraderPurchasePersisterService } from "@spt-aki/services/TraderPurchasePersisterService";
import { JsonUtil } from "@spt-aki/utils/JsonUtil";
import { MathUtil } from "@spt-aki/utils/MathUtil";
import { TimeUtil } from "@spt-aki/utils/TimeUtil";
export declare class TraderAssortHelper {
  protected logger: ILogger;
  protected jsonUtil: JsonUtil;
  protected mathUtil: MathUtil;
  protected timeUtil: TimeUtil;
  protected databaseServer: DatabaseServer;
  protected profileHelper: ProfileHelper;
  protected assortHelper: AssortHelper;
  protected paymentHelper: PaymentHelper;
  protected ragfairAssortGenerator: RagfairAssortGenerator;
  protected ragfairOfferGenerator: RagfairOfferGenerator;
  protected traderAssortService: TraderAssortService;
  protected localisationService: LocalisationService;
  protected traderPurchasePersisterService: TraderPurchasePersisterService;
  protected traderHelper: TraderHelper;
  protected fenceService: FenceService;
  protected configServer: ConfigServer;
  protected traderConfig: ITraderConfig;
  protected mergedQuestAssorts: Record<string, Record<string, string>>;
  protected createdMergedQuestAssorts: boolean;
  constructor(
    logger: ILogger,
    jsonUtil: JsonUtil,
    mathUtil: MathUtil,
    timeUtil: TimeUtil,
    databaseServer: DatabaseServer,
    profileHelper: ProfileHelper,
    assortHelper: AssortHelper,
    paymentHelper: PaymentHelper,
    ragfairAssortGenerator: RagfairAssortGenerator,
    ragfairOfferGenerator: RagfairOfferGenerator,
    traderAssortService: TraderAssortService,
    localisationService: LocalisationService,
    traderPurchasePersisterService: TraderPurchasePersisterService,
    traderHelper: TraderHelper,
    fenceService: FenceService,
    configServer: ConfigServer
  );
  /**
   * Get a traders assorts
   * Can be used for returning ragfair / fence assorts
   * Filter out assorts not unlocked due to level OR quest completion
   * @param sessionId session id
   * @param traderId traders id
   * @returns a traders' assorts
   */
  getAssort(sessionId: string, traderId: string, flea?: boolean): ITraderAssort;
  /**
   * Create a dict of all assort id = quest id mappings used to work out what items should be shown to player based on the quests they've started/completed/failed
   */
  protected hydrateMergedQuestAssorts(): void;
  /**
   * Reset a traders assorts and move nextResupply value to future
   * Flag trader as needing a flea offer reset to be picked up by flea update() function
   * @param trader trader details to alter
   */
  resetExpiredTrader(trader: ITrader): void;
  /**
   * Does the supplied trader need its assorts refreshed
   * @param traderID Trader to check
   * @returns true they need refreshing
   */
  traderAssortsHaveExpired(traderID: string): boolean;
  /**
   * Iterate over all assorts barter_scheme values, find barters selling for money and multiply by multipler in config
   * @param traderAssort Assorts to multiple price of
   */
  protected multiplyItemPricesByConfigMultiplier(
    traderAssort: ITraderAssort
  ): void;
  /**
   * Get an array of pristine trader items prior to any alteration by player (as they were on server start)
   * @param traderId trader id
   * @returns array of Items
   */
  protected getPristineTraderAssorts(traderId: string): Item[];
  /**
   * Returns generated ragfair offers in a trader assort format
   * @returns Trader assort object
   */
  protected getRagfairDataAsTraderAssort(): ITraderAssort;
}
