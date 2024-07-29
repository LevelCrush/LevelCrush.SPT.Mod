import { DependencyContainer } from "tsyringe";

/**
 * Task are intended to run on a interval or on startup
 * These task EXCLUSIVELY run in the PostSptLoad step. Good for making final adjustments after all mods have loaded
 */
export abstract class ScheduledTask {
    /**
     * If a number is returned, run it every X milliseconds
     * If a string is returned, feed it into a cron scheduler
     */
    public abstract frequency(): number | string;

    /**
     * Logic that needs to run as soon as soon as this task gets loaded into the system
     * @param container
     */
    public abstract execute_immediate(container: DependencyContainer): Promise<void>;

    /**
     * Execute the scheduled task based on the frequency provided
     * @param container
     */
    public abstract execute(container: DependencyContainer): Promise<void>;
}
