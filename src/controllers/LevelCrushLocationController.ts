import { ApplicationContext } from "@spt/context/ApplicationContext";
import { ContextVariableType } from "@spt/context/ContextVariableType";
import { LocationController } from "@spt/controllers/LocationController";
import { LocationGenerator } from "@spt/generators/LocationGenerator";
import { LootGenerator } from "@spt/generators/LootGenerator";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import { WeightedRandomHelper } from "@spt/helpers/WeightedRandomHelper";
import { ILocation } from "@spt/models/eft/common/ILocation";
import { ILocationBase } from "@spt/models/eft/common/ILocationBase";
import { ILooseLoot, SpawnpointTemplate } from "@spt/models/eft/common/ILooseLoot";
import { IGetLocationRequestData } from "@spt/models/eft/location/IGetLocationRequestData";
import { ILocationConfig } from "@spt/models/spt/config/ILocationConfig";
import { IRaidChanges } from "@spt/models/spt/location/IRaidChanges";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ConfigServer } from "@spt/servers/ConfigServer";
import { SaveServer } from "@spt/servers/SaveServer";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ItemFilterService } from "@spt/services/ItemFilterService";
import { LocalisationService } from "@spt/services/LocalisationService";
import { RaidTimeAdjustmentService } from "@spt/services/RaidTimeAdjustmentService";
import { HashUtil } from "@spt/utils/HashUtil";
import { RandomUtil } from "@spt/utils/RandomUtil";
import { TimeUtil } from "@spt/utils/TimeUtil";
import { ICloner } from "@spt/utils/cloners/ICloner";
import { inject, injectable } from "tsyringe";
import { ISptLevelCrushProfile } from "../models/eft/profile/ISptProfile";
import { getLevelCrushProfile } from "../utils";

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
        const location_id = name;
        const location: ILocation = this.databaseService.getLocation(location_id);

        if (typeof location["levelcrush"] !== "undefined") {
            this.logger.info(`${location_id} | ${JSON.stringify(location["levelcrush"], null, 4)}`);
        }

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
        const normal_map_varient = name.replace("_hardcore", "");
        this.locationConfig.looseLootMultiplier[name] = Math.ceil(Math.min(50, this.locationConfig.looseLootMultiplier[normal_map_varient] * 10));
        this.locationConfig.staticLootMultiplier[name] = Math.ceil(Math.min(50, this.locationConfig.staticLootMultiplier[normal_map_varient] * 10));
        this.logger.logWithColor(`Loose Loot Multiplier for: ${name} is ${this.locationConfig.looseLootMultiplier[normal_map_varient]} `, LogTextColor.BLUE);
        this.logger.logWithColor(`Static Loot Multiplier for: ${name} is ${this.locationConfig.staticLootMultiplier[normal_map_varient]} `, LogTextColor.BLUE);

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
