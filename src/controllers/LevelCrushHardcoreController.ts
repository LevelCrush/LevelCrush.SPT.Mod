import {inject, injectable} from "tsyringe";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {SaveServer} from "@spt/servers/SaveServer";
import {ISaveProgressRequestData} from "@spt/models/eft/inRaid/ISaveProgressRequestData";
import {getLevelCrushProfile} from "../utils";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";
import {PlayerRaidEndState} from "@spt/models/enums/PlayerRaidEndState";
import {server} from "typescript";
import {ProfileHelper} from "@spt/helpers/ProfileHelper";

@injectable()
export class LevelCrushHardcoreController {
    // We need to make sure we use the constructor and pass the dependencies to the parent class!
    constructor(
        @inject("PrimaryLogger") protected logger: ILogger,
        @inject("SaveServer") protected saveServer: SaveServer,
        @inject("ProfileHelper") protected profileHelper: ProfileHelper,
    ) {
    }

    /**
     * If the pmc is dead / mia. We should wipe them if they are in the hardcore zone
     * @param info
     * @param sessionID
     */
    public async wipe_if_dead(info: ISaveProgressRequestData, sessionID: string): Promise<void> {
        const offraidData = info;
        this.logger.logWithColor(
            `LevelCrush is checking if ${offraidData.profile.Info.Nickname} is in hardcore mode`,
            LogTextColor.CYAN,
        );
        const serverProfile = getLevelCrushProfile(sessionID, this.saveServer);
        const is_dead =
            offraidData.exit !== PlayerRaidEndState.SURVIVED && offraidData.exit !== PlayerRaidEndState.RUNNER;
        const is_hardcore = typeof serverProfile.levelcrush.zones["hardcore"] !== "undefined";

        if (is_hardcore) {
            this.logger.logWithColor(`${offraidData.profile.Info.Nickname} is in hardcore mode`, LogTextColor.YELLOW);
            if (is_dead) {
                this.logger.logWithColor(
                    `${offraidData.profile.Info.Nickname} is dead and is hardcore. Must Wipe`,
                    LogTextColor.CYAN,
                );

                this.logger.info("Match ended. Wiping PMC");

                serverProfile.info.wipe = true;
                this.logger.info("Saving wiped pmc");
                this.saveServer.saveProfile(sessionID);
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
            this.logger.logWithColor(
                `${serverProfile.info.username} has entered the hardcore zone`,
                LogTextColor.YELLOW,
            );
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
