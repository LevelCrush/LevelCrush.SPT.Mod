/* Saw Fika setup like this and I thought it was a good idea */
import { DependencyContainer, Lifecycle } from 'tsyringe';
import { LevelCrush } from '../LevelCrush';
import { LevelCrushHardcoreRouter } from '../routers/LevelCrushHardcoreRouter';
import { LevelCrushHardcoreCallbacks } from '../callbacks/LevelCrushHardcoreCallbacks';
import { LevelCrushHardcoreController } from '../controllers/LevelCrushHardcoreController';
import LevelCrushCoreConfig from '../configs/LevelCrushCoreConfig';
import { LevelCrushMultiplierConfig } from '../configs/LevelCrushMultiplierConfig';

export class Container {
    public static register(container: DependencyContainer): void {
        Container.registerUtils(container);

        Container.registerOverrides(container);

        Container.registerServices(container);

        Container.registerHelpers(container);

        Container.registerControllers(container);

        Container.registerCallbacks(container);

        Container.registerRouters(container);

        Container.registerListTypes(container);

        container.register<LevelCrush>('LevelCrush', LevelCrush, { lifecycle: Lifecycle.Singleton });
    }

    private static registerUtils(container: DependencyContainer): void {
        container.register<LevelCrushCoreConfig>('LevelCrushCoreConfig', LevelCrushCoreConfig, {
            lifecycle: Lifecycle.Singleton,
        });

        container.register<LevelCrushMultiplierConfig>('LevelCrushMultipliersConfig', LevelCrushMultiplierConfig, {
            lifecycle: Lifecycle.Singleton,
        });
    }

    private static registerOverrides(container: DependencyContainer): void {
        // todo
    }

    private static registerServices(container: DependencyContainer): void {
        // todo
    }

    private static registerHelpers(container: DependencyContainer): void {
        // todo
    }

    private static registerControllers(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreController>('LevelCrushHardcoreController', {
            useClass: LevelCrushHardcoreController,
        });
    }

    private static registerCallbacks(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreCallbacks>('LevelCrushHardcoreCallbacks', {
            useClass: LevelCrushHardcoreCallbacks,
        });
    }

    private static registerRouters(container: DependencyContainer): void {
        container.register<LevelCrushHardcoreRouter>('LevelCrushHardcoreRouter', {
            useClass: LevelCrushHardcoreRouter,
        });
    }

    private static registerListTypes(container: DependencyContainer): void {
        // todo

        container.registerType('StaticRoutes', 'LevelCrushHardcoreRouter');
    }
}

export default Container;
