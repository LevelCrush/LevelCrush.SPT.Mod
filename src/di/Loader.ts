import { DependencyContainer } from "tsyringe";

/**
 * Task are intended to run on a interval
 */
export abstract class Loader {
    /**
     * Execute the loader
     * @param container
     */
    public abstract execute(container: DependencyContainer): Promise<void>;
}
