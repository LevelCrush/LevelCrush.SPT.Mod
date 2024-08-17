import { DependencyContainer, injectable } from "tsyringe";
import { Override } from "../di/Override";
import { BotCallbacks } from "@spt/callbacks/BotCallbacks";

@injectable()
export class LevelCrushLauncherControllerOverride extends Override {
    public async execute(container: DependencyContainer): Promise<void> {
        container.afterResolution("BotCallbacks", (_t, result: BotCallbacks) => {
            const original = result.getBotCap;

            result.getBotCap = (url: string, info: any, sessionID: string) => {
                url = url.replace("_hardcore", ""); // strip hardcore out
                return original(url, info, sessionID);
            };
        });
    }
}
