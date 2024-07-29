import { HttpResponseUtil } from "@spt/utils/HttpResponseUtil";
import { LevelCrushHardcoreController } from "../controllers/LevelCrushHardcoreController";
import { inject, injectable } from "tsyringe";
import { ISaveProgressRequestData } from "@spt/models/eft/inRaid/ISaveProgressRequestData";

@injectable()
export class LevelCrushHardcoreCallbacks {
    constructor(
        @inject("HttpResponseUtil") protected httpResponseUtil: HttpResponseUtil,
        @inject("LevelCrushHardcoreController") protected lcHardcoreController: LevelCrushHardcoreController,
    ) {}

    public async raid_profile_save(info: ISaveProgressRequestData, sessionID: string): Promise<void> {
        await this.lcHardcoreController.wipe_if_dead(info, sessionID);
    }

    public async zone_enter(sessionID: string): Promise<string> {
        await this.lcHardcoreController.zone_enter(sessionID);
        return this.httpResponseUtil.noBody({
            success: true,
            response: {
                effects: ["hardcore_zone_enter"],
                sessionID: sessionID,
            },
            errors: [],
        });
    }

    public async zone_exit(sessionID: string): Promise<void> {
        await this.lcHardcoreController.zone_exit(sessionID);
        return this.httpResponseUtil.noBody({
            success: true,
            response: {
                effects: ["hardcore_zone_exit"],
                sessionID: sessionID,
            },
            errors: [],
        });
    }

    public async zone_list(sessionID: string): Promise<void> {
        return this.httpResponseUtil.noBody({
            success: true,
            response: {
                zones: ["bigmap"],
                sessionID: sessionID,
                type: "hardcore",
            },
            errors: [],
        });
    }
}
