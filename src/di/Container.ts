import { DependencyContainer, Lifecycle } from "tsyringe";
import { LevelCrush } from "../LevelCrush";
import { LevelCrushBuffBuilder } from "../builders/LevelCrushBuffBuilder";
import { LevelCrushItemBuilder } from "../builders/LevelCrushItemBuilder";
import { LevelCrushLocaleBuilder } from "../builders/LevelCrushLocaleBuilder";
import { LevelCrushHardcoreCallbacks } from "../callbacks/LevelCrushHardcoreCallbacks";
import { LevelCrushCoreConfig } from "../configs/LevelCrushCoreConfig";
import { LevelCrushMultiplierConfig } from "../configs/LevelCrushMultiplierConfig";
import { LevelCrushHardcoreController } from "../controllers/LevelCrushHardcoreController";
import { LevelCrushLocationController } from "../controllers/LevelCrushLocationController";
import { LevelCrushQuestController } from "../controllers/LevelCrushQuestController";
import { LevelCrushCacheHelper } from "../helpers/LevelCrushCacheHelper";
import { LevelCrushBossLoader } from "../loaders/LevelCrushBossLoader";
import { LevelCrushItemLoader } from "../loaders/LevelCrushItemLoader";
import { LevelCrushLauncherControllerOverride } from "../overrides/LevelCrushLauncherControllerOverride";
import { LevelCrushSecureContainerPatch } from "../patches/LevelCrushSecureContainerPatch";
import { LevelCrushHardcoreRouter } from "../routers/LevelCrushHardcoreRouter";
import { LevelCrushDailyResetTask } from "../tasks/basic/LevelCrushDailyResetTask";
import { LevelCrushServerTimeTask } from "../tasks/basic/LevelCrushServerTimeTask";
import { LevelCrushPickHardcoreMaps } from "../tasks/interval/LevelCrushPickHardcoreMaps";
import { LevelCrushGenerateCustomItemTpl } from "../tasks/startup/LevelCrushGenerateCustomItemTpl";
import { LevelCrushHardcoreLocationGen } from "../tasks/startup/LevelCrushHardcoreLocationGen";
import { LevelCrushKibaBuff } from "../tasks/startup/LevelCrushKibaBuff";
import { LevelCrushWikiGenerate } from "../tasks/startup/LevelCrushWikiGenerate";

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

        Container.registerLoaders(container);

        Container.registerDatabasePatches(container);

        Container.registerListTypes(container);

        container.register<LevelCrush>("LevelCrush", LevelCrush, { lifecycle: Lifecycle.Singleton });
    }

    private static registerDatabasePatches(container: DependencyContainer): void {
        container.register<LevelCrushSecureContainerPatch>("LevelCrushSecureContainerPatch", LevelCrushSecureContainerPatch, {
            lifecycle: Lifecycle.Singleton,
        });
    }

    private static registerScheduledTask(container: DependencyContainer): void {
        container.register<LevelCrushServerTimeTask>("LevelCrushServerTimeTask", LevelCrushServerTimeTask, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushDailyResetTask>("LevelCrushDailyResetTask", LevelCrushDailyResetTask, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushGenerateCustomItemTpl>("LevelCrushGenerateCustomItemTpl", LevelCrushGenerateCustomItemTpl, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushKibaBuff>("LevelCrushKibaBuff", LevelCrushKibaBuff, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushHardcoreLocationGen>("LevelCrushHardcoreLocationGen", LevelCrushHardcoreLocationGen, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushWikiGenerate>("LevelCrushWikiGenerate", LevelCrushWikiGenerate, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushPickHardcoreMaps>("LevelCrushPickHardcoreMaps", LevelCrushPickHardcoreMaps, {
            lifecycle: Lifecycle.Singleton,
        });
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
            lifecycle: Lifecycle.Singleton,
        });

        /*
        container.register<LevelCrushQuesControllerOverride>("LevelCrushQuesControllerOverride", LevelCrushQuesControllerOverride, {
            lifecycl Lifecycle.Singleton
        }); */
    }

    private static registerServices(_container: DependencyContainer): void {
        // todo
    }

    private static registerHelpers(container: DependencyContainer): void {
        // todo
        container.register<LevelCrushItemBuilder>("LevelCrushItemBuilder", LevelCrushItemBuilder, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushLocaleBuilder>("LevelCrushLocaleBuilder", LevelCrushLocaleBuilder, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushBuffBuilder>("LevelCrushBuffBuilder", LevelCrushBuffBuilder, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushCacheHelper>("LevelCrushCacheHelper", LevelCrushCacheHelper, {
            lifecycle: Lifecycle.Singleton,
        });
    }

    private static registerLoaders(container: DependencyContainer): void {
        container.register<LevelCrushItemLoader>("LevelCrushItemLoader", LevelCrushItemLoader, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushBossLoader>("LevelCrushBossLoader", LevelCrushBossLoader, {
            lifecycle: Lifecycle.Singleton,
        });
    }

    private static registerControllers(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreController>("LevelCrushHardcoreController", {
            useClass: LevelCrushHardcoreController,
        });

        container.register<LevelCrushQuestController>("LevelCrushQuestController", {
            useClass: LevelCrushQuestController,
        });

        container.register<LevelCrushLocationController>("LevelCrushLocationController", {
            useClass: LevelCrushLocationController,
        });

        container.register<LevelCrushQuestController>("QuestController", { useClass: LevelCrushQuestController });
        container.register<LevelCrushLocationController>("LocationController", { useClass: LevelCrushLocationController });
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
        container.registerType("LevelCrushScheduledTasks", "LevelCrushGenerateCustomItemTpl");
        container.registerType("LevelCrushScheduledTasks", "LevelCrushHardcoreLocationGen");
        container.registerType("LevelCrushScheduledTasks", "LevelCrushWikiGenerate");
        container.registerType("LevelCrushScheduledTasks", "LevelCrushPickHardcoreMaps");
        // container.registerType("LevelCrushScheduledTasks", "LevelCrushKibaBuff");

        // overrides
        container.registerType("LevelCrushOverrides", "LevelCrushLauncherControllerOverride");
        // container.registerType("LevelCrushOverrides", "LevelCrushQuesControllerOverride");

        container.registerType("LevelCrushLoaders", "LevelCrushItemLoader");
        container.registerType("LevelCrushLoaders", "LevelCrushBossLoader");

        container.registerType("LevelCrushDatabasePatches", "LevelCrushSecureContainerPatch");
    }
}
