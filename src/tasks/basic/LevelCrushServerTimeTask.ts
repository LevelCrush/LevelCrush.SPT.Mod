import {DependencyContainer, inject, injectable} from "tsyringe";
import {ScheduledTask} from "../../di/ScheduledTask";
import {LevelCrushCoreConfig} from "../../configs/LevelCrushCoreConfig";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";

@injectable()
export class LevelCrushServerTimeTask extends ScheduledTask {

    constructor(
        @inject('PrimaryLogger') protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig
    ) {
        super();
    }

    public async execute(container: DependencyContainer): Promise<void> {
        this.logger.logWithColor(new Date().toLocaleString(), LogTextColor.YELLOW);
    }

    public frequency(): number | string {
        return 3600; // every hour output the current server time
    }

    public async execute_immediate(container: DependencyContainer): Promise<void> {
        this.logger.info("Server Time Task has been loaded");
    }

}