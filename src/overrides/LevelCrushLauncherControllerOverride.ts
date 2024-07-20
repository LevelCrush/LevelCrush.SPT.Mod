/**
 * Based off the SIT implementation where it takes a account password.
 * Users will not be able to login using the normal SPT launcher
 * https://github.com/stayintarkov/SIT.Aki-Server-Mod/blob/master/src/Overrides/LauncherControllerOverride.ts
 */
import {Override} from "../di/Override";
import {DependencyContainer, inject, injectable} from "tsyringe";
import {LauncherController} from "@spt/controllers/LauncherController";
import {ILoginRequestData} from "@spt/models/eft/launcher/ILoginRequestData";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {ILevelCrushCoreConfig} from "../models/levelcrush/ILevelCrushCoreConfig";
import {VFS} from "@spt/utils/VFS";
import {SaveServer} from "@spt/servers/SaveServer";

@injectable()
export class LevelCrushLauncherControllerOverride extends Override {

    constructor(
        @inject('PrimaryLogger') protected logger: ILogger,
        @inject('LevelCrushCoreConfig') protected config: ILevelCrushCoreConfig,
        @inject('VFS') protected vfs: VFS,
        @inject('SaveServer') protected saveServer: SaveServer,
    ) {
        super();
    }

    public login(info: ILoginRequestData) {
        this.logger.info(`Attempting to login ${info.username}`);
        const profiles = this.saveServer.getProfiles();
        for (const sessionID in profiles) {
            const account = profiles[sessionID];
            if (account.info.username === info.username && account.info.password === info.password) {
                this.logger.info(`Match found for ${info.username} is session ${sessionID}`);
                return sessionID;
            } else if (account.info.username === info.username && account.info.password !== info.password) {
                this.logger.info(`No session found that matches ${info.username}`);
                return "INVALID_PASSWORD";
            }
        }
        this.logger.info(`No match found for ${info.username}. Maybe bad password?`);
        return "";
    }

    public find(sessionID: string): any {
        const profiles = this.saveServer.getProfiles();
        return typeof (profiles[sessionID]) !== "undefined" ? profiles[sessionID].info : {};
    }

    public async execute(container: DependencyContainer) {
        container.afterResolution("LauncherController", (_t, result: LauncherController) => {

            result.login = (info: any) => {
                return this.login(info);
            }

            result.find = (sessionId: any) => {
                return this.find(sessionId);
            }

        }, {frequency: "Always"})
    }
}