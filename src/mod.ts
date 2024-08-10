import { DependencyContainer } from "tsyringe";
import { IPreSptLoadModAsync } from "@spt/models/external/IPreSptLoadModAsync";
import { IPostSptLoadModAsync } from "@spt/models/external/IPostSptLoadModAsync";
import { IPostDBLoadModAsync } from "@spt/models/external/IPostDBLoadModAsync";
import { Container } from "./di/Container";
import { LevelCrush } from "./LevelCrush";

class Mod implements IPreSptLoadModAsync, IPostSptLoadModAsync, IPostDBLoadModAsync {
    public async preSptLoadAsync(container: DependencyContainer): Promise<void> {
        // register all dependency injections via our own Container singleton
        Container.register(container);

        console.log("Done registering DI");

        await container.resolve<LevelCrush>("LevelCrush").preSptLoad(container);
    }

    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        await container.resolve<LevelCrush>("LevelCrush").postDBLoad(container);
    }

    public async postSptLoadAsync(container: DependencyContainer): Promise<void> {
        // make sure this is absolutely last. This is hella jank. But it works for now.
        (async () => {
            await new Promise((resolve) => {
                setTimeout(async () => {
                    await container.resolve<LevelCrush>("LevelCrush").postSptLoad(container);
                    resolve(true);
                }, 1000);
            });
        })();
    }
}

export const mod = new Mod();
