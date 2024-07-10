import {IPreSptLoadModAsync} from "@spt/models/external/IPreSptLoadModAsync";
import {IPostSptLoadModAsync} from "@spt/models/external/IPostSptLoadModAsync";
import {IPostDBLoadModAsync} from "@spt/models/external/IPostDBLoadModAsync";
import {DependencyContainer} from "tsyringe";
import { Container } from './di/Container';
import {LevelCrush} from "./LevelCrush";

class Mod implements  IPreSptLoadModAsync, IPostSptLoadModAsync, IPostDBLoadModAsync{

    public async preSptLoadAsync(container: DependencyContainer): Promise<void> {

        // register all dependency injections via our own Container singleton
        Container.register(container);

        await container.resolve<LevelCrush>("LevelCrush").preSptLoad(container);
    }

    public async postDBLoadAsync(container: DependencyContainer): Promise<void> {
        await container.resolve<LevelCrush>("LevelCrush").postDBLoad(container);
    }

    public async postSptLoadAsync(container: DependencyContainer): Promise<void> {
        await container.resolve<LevelCrush>("LevelCrush").postSptLoad(container);
    }
}

export const mod = new Mod();