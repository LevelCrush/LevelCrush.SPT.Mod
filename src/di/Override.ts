import {DependencyContainer} from "tsyringe";

/**
 * Really liked how Fika did this so I am copying the style
 */


export abstract class Override {

    public abstract execute(container: DependencyContainer): Promise<void>;
}