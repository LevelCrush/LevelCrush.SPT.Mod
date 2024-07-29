import { DependencyContainer } from "tsyringe";

/**
 * A loader is intendended to run PostDB load exclusively
 * Adding new items/traders/quest should happen with a loader
 */
export abstract class Loader {
    /**
     * Execute the loader
     * @param container
     */
    public abstract execute(container: DependencyContainer): Promise<void>;
}
