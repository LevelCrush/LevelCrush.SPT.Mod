import {DependencyContainer, inject, injectable} from "tsyringe";
import {ScheduledTask} from "../../di/ScheduledTask";
import {LevelCrushCoreConfig} from "../../configs/LevelCrushCoreConfig";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LogTextColor} from "@spt/models/spt/logging/LogTextColor";

@injectable()
export class LevelCrushDailyResetTask extends ScheduledTask {

    constructor(
        @inject('PrimaryLogger') protected logger: ILogger,
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig
    ) {
        super();
    }

    public async execute(container: DependencyContainer): Promise<void> {
        this.logger.logWithColor("Daily reset has occurred. Migrating the world", LogTextColor.YELLOW);
    }

    public frequency(): number | string {
        return '0 0 * * *'; // at midnight trigger  a daily reset
    }

    public async execute_immediate(container: DependencyContainer): Promise<void> {
        this.logger.info("DailyResetTask has been loaded");
    }

}