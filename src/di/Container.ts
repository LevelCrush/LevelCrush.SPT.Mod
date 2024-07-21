import {DependencyContainer, Lifecycle} from "tsyringe";
import {LevelCrush} from "../LevelCrush";
import {LevelCrushHardcoreRouter} from "../routers/LevelCrushHardcoreRouter";
import {LevelCrushHardcoreCallbacks} from "../callbacks/LevelCrushHardcoreCallbacks";
import {LevelCrushHardcoreController} from "../controllers/LevelCrushHardcoreController";
import {LevelCrushCoreConfig} from "../configs/LevelCrushCoreConfig";
import {LevelCrushMultiplierConfig} from "../configs/LevelCrushMultiplierConfig";
import {LevelCrushServerTimeTask} from "../tasks/basic/LevelCrushServerTimeTask";
import {LevelCrushDailyResetTask} from "../tasks/basic/LevelCrushDailyResetTask";
import {LevelCrushLauncherControllerOverride} from "../overrides/LevelCrushLauncherControllerOverride";
import {LevelCrushQuestController} from "../controllers/LevelCrushQuestController";

/* Saw Fika setup like this and I thought it was a good idea */
export class Container {
    public static register(container: DependencyContainer): void {
        Container.registerUtils(container);

        Container.registerOverrides(container);

        Container.registerServices(container);

        Container.registerHelpers(container);

        Container.registerControllers(container);

        Container.registerCallbacks(container);

        Container.registerRouters(container);

        Container.registerScheduledTask(container);

        Container.registerListTypes(container);

        container.register<LevelCrush>("LevelCrush", LevelCrush, {lifecycle: Lifecycle.Singleton});
    }

    private static registerScheduledTask(container: DependencyContainer): void {
        container.register<LevelCrushServerTimeTask>("LevelCrushServerTimeTask", LevelCrushServerTimeTask, {lifecycle: Lifecycle.Singleton});
        container.register<LevelCrushDailyResetTask>("LevelCrushDailyResetTask", LevelCrushDailyResetTask, {lifecycle: Lifecycle.Singleton});
    }

    private static registerUtils(container: DependencyContainer): void {
        container.register<LevelCrushCoreConfig>("LevelCrushCoreConfig", LevelCrushCoreConfig, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushMultiplierConfig>("LevelCrushMultiplierConfig", LevelCrushMultiplierConfig, {
            lifecycle: Lifecycle.Singleton,
        });

        console.log("Done registering utils and configs");
    }

    private static registerOverrides(container: DependencyContainer): void {
        container.register<LevelCrushLauncherControllerOverride>("LevelCrushLauncherControllerOverride", LevelCrushLauncherControllerOverride, {
            lifecycle: Lifecycle.Singleton
        });

        /*
        container.register<LevelCrushQuesControllerOverride>("LevelCrushQuesControllerOverride", LevelCrushQuesControllerOverride, {
            lifecycle: Lifecycle.Singleton
        }); */
    }

    private static registerServices(container: DependencyContainer): void {
        // todo
    }

    private static registerHelpers(container: DependencyContainer): void {
        // todo
    }

    private static registerControllers(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreController>("LevelCrushHardcoreController", {
            useClass: LevelCrushHardcoreController,
        });
        container.register<LevelCrushQuestController>("LevelCrushQuestController", {
            useClass: LevelCrushQuestController
        });
        container.register<LevelCrushQuestController>("QuestController", {useClass: LevelCrushQuestController});
    }

    private static registerCallbacks(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreCallbacks>("LevelCrushHardcoreCallbacks", {
            useClass: LevelCrushHardcoreCallbacks,
        });
    }

    private static registerRouters(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreRouter>("LevelCrushHardcoreRouter", {
            useClass: LevelCrushHardcoreRouter,
        });
    }

    private static registerListTypes(container: DependencyContainer): void {

        // routes
        container.registerType("StaticRoutes", "LevelCrushHardcoreRouter");


        // scheduled task
        container.registerType("LevelCrushScheduledTasks", "LevelCrushServerTimeTask");
        container.registerType("LevelCrushScheduledTasks", "LevelCrushDailyResetTask");

        // overrides
        container.registerType("LevelCrushOverrides", "LevelCrushLauncherControllerOverride");
        // container.registerType("LevelCrushOverrides", "LevelCrushQuesControllerOverride");
    }
}
