import { inject, injectable } from "tsyringe";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { SaveServer } from "@spt/servers/SaveServer";
import { ISaveProgressRequestData } from "@spt/models/eft/inRaid/ISaveProgressRequestData";
import { getLevelCrushProfile } from "../utils";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { PlayerRaidEndState } from "@spt/models/enums/PlayerRaidEndState";
import { ProfileHelper } from "@spt/helpers/ProfileHelper";
import DiscordWebhook, { DiscordWebhookColors } from "../webhook";
import { ItemHelper } from "@spt/helpers/ItemHelper";

@injectable()
export class LevelCrushHardcoreController {
    protected readonly ALLOWED_CONTAINERS: string[];
    private readonly OMNICRON_CONTAINER_ID: string;

    // We need to make sure we use the constructor and pass the dependencies to the parent class!
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("SaveServer") protected saveServer: SaveServer,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
        @inject("ItemHelper") protected itemHelper: ItemHelper,
    ) {
        this.OMNICRON_CONTAINER_ID = "OMNICRON_MONGO_ID_GOES_HERE";

        this.ALLOWED_CONTAINERS = [
            "59db794186f77448bc595262", // epsilon,
            "665ee77ccf2d642e98220bca", // gamma, the unheare edition
            "5857a8bc2459772bad15db29", // gamma, EOD edition
            "5c093ca986f7740a1867ab12", // kappa container
            "664a55d84a90fc2c8a6305c9", // theta container
            this.OMNICRON_CONTAINER_ID, // omnicron
        ];
    }

    /**
     * If the pmc is dead / mia. We should wipe them if they are in the hardcore zone
     * @param info
     * @param sessionID
     */
    public async wipe_if_dead(info: ISaveProgressRequestData, sessionID: string): Promise<void> {
        const offraidData = info;
        this.logger.logWithColor(`LevelCrush is checking if ${offraidData.profile.Info.Nickname} is in hardcore mode`, LogTextColor.CYAN);
        const serverProfile = getLevelCrushProfile(sessionID, this.saveServer);
        const is_dead = offraidData.exit !== PlayerRaidEndState.SURVIVED && offraidData.exit !== PlayerRaidEndState.RUNNER;

        const is_hardcore = typeof serverProfile.levelcrush.zones["hardcore"] !== "undefined";
        if (is_hardcore && !info.isPlayerScav) {
            this.logger.logWithColor(`${offraidData.profile.Info.Nickname} is in hardcore mode`, LogTextColor.YELLOW);

            if (is_dead) {
                this.logger.logWithColor(`${offraidData.profile.Info.Nickname} is dead and is hardcore. Must Wipe if no secure container`, LogTextColor.CYAN);

                const items = serverProfile.characters.pmc.Inventory.items;
                const secureContainer = items.find((x) => x.slotId === "SecuredContainer");
                const hasSecureContainer = secureContainer && this.ALLOWED_CONTAINERS.includes(secureContainer._tpl);
                const isOmnicron = hasSecureContainer && secureContainer._tpl === this.OMNICRON_CONTAINER_ID;

                if (isOmnicron) {
                    this.logger.logWithColor(`${offraidData.profile.Info.Nickname} has omnicron. Wiping in hardcore not possible`, LogTextColor.CYAN);
                } else if (hasSecureContainer) {
                    this.logger.logWithColor(`${offraidData.profile.Info.Nickname} did have a valid secure container. Removing it and preventing a wipe`, LogTextColor.CYAN);
                    const secureContainerItems = this.itemHelper.findAndReturnChildrenByItems(items, secureContainer._id);
                    serverProfile.characters.pmc.Inventory.items = items.filter((x) => !secureContainerItems.includes(x._id));
                    this.saveServer.saveProfile(sessionID);
                } else {
                    this.logger.info("Match ended. Wiping PMC");

                    serverProfile.info.wipe = true;
                    this.logger.info("Saving wiped pmc");

                    const announce = new DiscordWebhook(this.logger);
                    await Promise.allSettled([
                        announce.send(`${serverProfile.characters.pmc.Info.Nickname} has wiped`, "GG. Get fucked", DiscordWebhookColors.Red),
                        new Promise((resolve) => {
                            this.saveServer.saveProfile(sessionID);
                            resolve(true);
                        }),
                    ]);
                }
            }
        }
    }

    /**
     * Have the character linked to the session enter the hardcore zone
     * @param sessionID
     */
    public async zone_enter(sessionID: string): Promise<void> {
        const serverProfile = getLevelCrushProfile(sessionID, this.saveServer);
        if (typeof serverProfile.levelcrush.zones["hardcore"] === "undefined") {
            this.logger.logWithColor(`${serverProfile.info.username} has entered the hardcore zone`, LogTextColor.YELLOW);
            serverProfile.levelcrush.zones["hardcore"] = Date.now() / 1000;
        }
        this.saveServer.saveProfile(sessionID);
    }

    /**
     * Have the character linked to the session leave the hardcore zone
     * @param sessionID
     */
    public async zone_exit(sessionID: string): Promise<void> {
        const serverProfile = getLevelCrushProfile(sessionID, this.saveServer);
        if (typeof serverProfile.levelcrush.zones["hardcore"] !== "undefined") {
            this.logger.logWithColor(`${serverProfile.info.username} has left the hardcore zone`, LogTextColor.YELLOW);
            delete serverProfile.levelcrush.zones["hardcore"];
        }
        this.saveServer.saveProfile(sessionID);
    }
}
