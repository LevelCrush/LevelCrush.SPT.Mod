import { inject, injectable } from "tsyringe";
import { LocationController } from "@spt/controllers/LocationController";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { HashUtil } from "@spt/utils/HashUtil";
import { RandomUtil } from "@spt/utils/RandomUtil";
import { WeightedRandomHelper } from "@spt/helpers/WeightedRandomHelper";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { LocationGenerator } from "@spt/generators/LocationGenerator";
import { LocalisationService } from "@spt/services/LocalisationService";
import { RaidTimeAdjustmentService } from "@spt/services/RaidTimeAdjustmentService";
import { ItemFilterService } from "@spt/services/ItemFilterService";
import { LootGenerator } from "@spt/generators/LootGenerator";
import { DatabaseService } from "@spt/services/DatabaseService";
import { TimeUtil } from "@spt/utils/TimeUtil";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { ApplicationContext } from "@spt/context/ApplicationContext";
import { ILocationBase } from "@spt/models/eft/common/ILocationBase";
import { IGetLocationRequestData } from "@spt/models/eft/location/IGetLocationRequestData";
import { ContextVariableType } from "@spt/context/ContextVariableType";
import { ILocation } from "@spt/models/eft/common/ILocation";
import { ILocationConfig } from "@spt/models/spt/config/ILocationConfig";
import { IRaidChanges } from "@spt/models/spt/location/IRaidChanges";
import { ILooseLoot, SpawnpointTemplate } from "@spt/models/eft/common/ILooseLoot";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { SaveServer } from "@spt/servers/SaveServer";
import { getLevelCrushProfile } from "../utils";
import { ISptLevelCrushProfile } from "../models/eft/profile/ISptProfile";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";

@injectable()
export class LevelCrushLocationController extends LocationController {
    constructor(
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("WeightedRandomHelper") protected weightedRandomHelper: WeightedRandomHelper,
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("LocationGenerator") protected locationGenerator: LocationGenerator,
        @inject("LocalisationService") protected localisationService: LocalisationService,
        @inject("RaidTimeAdjustmentService") protected raidTimeAdjustmentService: RaidTimeAdjustmentService,
        @inject("ItemFilterService") protected itemFilterService: ItemFilterService,
        @inject("LootGenerator") protected lootGenerator: LootGenerator,
        @inject("DatabaseService") protected databaseService: DatabaseService,
        @inject("TimeUtil") protected timeUtil: TimeUtil,
        @inject("ConfigServer") protected configServer: ConfigServer,
        @inject("ApplicationContext") protected applicationContext: ApplicationContext,
        @inject("PrimaryCloner") protected cloner: ICloner,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("SaveServer") protected saveServer: SaveServer,
    ) {
        super(hashUtil, randomUtil, weightedRandomHelper, logger, locationGenerator, localisationService, raidTimeAdjustmentService, itemFilterService, lootGenerator, databaseService, timeUtil, configServer, applicationContext, cloner);

        this.logger.logWithColor("Custom LevelCrush Location Controller", LogTextColor.BLUE);
    }

    /**
     * Handle client/location/getLocalloot
     * Get a location (map) with generated loot data
     * @param sessionId Player id
     * @param request Map request to generate
     * @returns ILocationBase
     */
    public override get(sessionId: string, request: IGetLocationRequestData): ILocationBase {
        this.logger.debug(`Generating data for: ${request.locationId}, variant: ${request.variantId}`);
        const profile = getLevelCrushProfile(sessionId, this.saveServer);
        const is_hardcore = typeof profile.levelcrush.zones["hardcore"] !== "undefined";
        this.logger.info(`Is this player hardcore: ${profile.characters.pmc.Info.Nickname} = ${is_hardcore}`);
        console.log(`Console: Is this player hardcore: ${profile.characters.pmc.Info.Nickname} = ${is_hardcore}`);
        const name = request.locationId.toLowerCase().replace(" ", "");
        return is_hardcore ? this.generate_hardcore(name, profile) : super.generate(name);
    }

    /**
     * Generate a maps base location and loot specific to hardcore zone rules
     * @param name Map name
     * @param profile ISptLevelCrushProfile
     * @returns ILocationBase
     */
    protected generate_hardcore(name: string, profile: ISptLevelCrushProfile): ILocationBase {
        const location: ILocation = this.databaseService.getLocation(name);
        const locationBaseClone: ILocationBase = this.cloner.clone(location.base);

        this.logger.logWithColor(`Generating loot for ${profile.characters.pmc.Info.Nickname} for map ${name}`, LogTextColor.BLUE);

        // Update datetime property to now
        locationBaseClone.UnixDateTime = this.timeUtil.getTimestamp();

        // Don't generate loot for hideout
        if (name === "hideout") {
            return locationBaseClone;
        }

        // Check for a loot multipler adjustment in app context and apply if one is found
        let locationConfigCopy: ILocationConfig;
        const raidAdjustments = this.applicationContext.getLatestValue(ContextVariableType.RAID_ADJUSTMENTS)?.getValue<IRaidChanges>();

        // in hardcore no matter what we are making adjustments to the raid
        locationConfigCopy = this.cloner.clone(this.locationConfig); // Clone values so they can be used to reset originals later

        if (raidAdjustments) {
            this.raidTimeAdjustmentService.makeAdjustmentsToMap(raidAdjustments, locationBaseClone);
        }

        const staticAmmoDist = this.cloner.clone(location.staticAmmo);

        // filter ammo
        // todo: filter ammo

        // adjust loot multipliers to 10x
        this.locationConfig.looseLootMultiplier[name] = Math.ceil(Math.min(50, this.locationConfig.looseLootMultiplier[name] * 10));
        this.locationConfig.staticLootMultiplier[name] = Math.ceil(Math.min(50, this.locationConfig.staticLootMultiplier[name] * 10));
        this.logger.logWithColor(`Loose Loot Multiplier for: ${name} is ${this.locationConfig.looseLootMultiplier[name]} `, LogTextColor.BLUE);
        this.logger.logWithColor(`Static Loot Multiplier for: ${name} is ${this.locationConfig.staticLootMultiplier[name]} `, LogTextColor.BLUE);

        // Create containers and add loot to them
        const staticLoot = this.locationGenerator.generateStaticContainers(locationBaseClone, staticAmmoDist);
        locationBaseClone.Loot.push(...staticLoot);

        // Add dynamic loot to output loot
        const dynamicLootDistClone: ILooseLoot = this.cloner.clone(location.looseLoot);
        const dynamicSpawnPoints: SpawnpointTemplate[] = this.locationGenerator.generateDynamicLoot(dynamicLootDistClone, staticAmmoDist, name);
        for (const spawnPoint of dynamicSpawnPoints) {
            locationBaseClone.Loot.push(spawnPoint);
        }

        // Done generating, log results
        this.logger.success("Hardcore: " + this.localisationService.getText("location-dynamic_items_spawned_success", dynamicSpawnPoints.length));
        this.logger.success("Hardcore: " + this.localisationService.getText("location-generated_success", name));

        // Reset loot multipliers back to original values
        // in hardcore we ALWAYS are making adjustments, so this ALWAYS has to go back
        this.logger.debug("Resetting loot multipliers back to their original values");
        this.locationConfig.staticLootMultiplier = locationConfigCopy.staticLootMultiplier;
        this.locationConfig.looseLootMultiplier = locationConfigCopy.looseLootMultiplier;

        this.applicationContext.clearValues(ContextVariableType.RAID_ADJUSTMENTS);

        return locationBaseClone;
    }
}
