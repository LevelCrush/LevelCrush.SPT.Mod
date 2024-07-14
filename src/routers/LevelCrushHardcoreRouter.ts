import {RouteAction, StaticRouter} from "@spt/di/Router";
import {LevelCrushHardcoreCallbacks} from "../callbacks/LevelCrushHardcoreCallbacks";
import {inject, injectable} from "tsyringe";
import {ISaveProgressRequestData} from "@spt/models/eft/inRaid/ISaveProgressRequestData";

@injectable()
export class LevelCrushHardcoreRouter extends StaticRouter {
    constructor(@inject("LevelCrushHardcoreCallbacks") protected lcHardcoreCallbacks: LevelCrushHardcoreCallbacks) {
        super([
            new RouteAction(
                "/raid/profile/save",
                async (url, info: ISaveProgressRequestData, sessionID, output: string): Promise<string> => {
                    await this.lcHardcoreCallbacks.raid_profile_save(info, sessionID);
                    return output;
                },
            ),
            new RouteAction("/levelcrush/zone/enter/hardcore", async (url, info, sessionID, _output) => {
                return await this.lcHardcoreCallbacks.zone_enter(sessionID);
            }),
            new RouteAction("/levelcrush/zone/exit/hardcore", async (url, info, sessionID, _output) => {
                return await this.lcHardcoreCallbacks.zone_exit(sessionID);
            }),
            new RouteAction("/levelcrush/zone/list/hardcore", async (url, info, sessionID, _output) => {
                return await this.lcHardcoreCallbacks.zone_list(sessionID);
            })
        ]);
    }
}
