import { DependencyContainer } from "tsyringe";

export abstract class DatabasePatch {
    public abstract execute(container: DependencyContainer): Promise<void>;
}
