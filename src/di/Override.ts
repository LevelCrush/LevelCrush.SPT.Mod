import { DependencyContainer } from "tsyringe";

/**
 * Really liked how Fika did this so I am copying the style
 * Overrides are always run in the PreSptLoad load step
 * Good for manipulating configurations  / overriding container resolutions
 */

export abstract class Override {
    public abstract execute(container: DependencyContainer): Promise<void>;
}
