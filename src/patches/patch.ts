import {DependencyContainer} from "tsyringe";
import {ILogger} from "@spt/models/spt/utils/ILogger";
import {LevelCrushCoreConfig} from "../configs/LevelCrushCoreConfig";
import {LevelCrushMultiplierConfig} from "../configs/LevelCrushMultiplierConfig";

export enum LevelCrushPatchTarget {
    PreSptLoadMod,
    PostDB,
    PreSptLoadModAndPostDB,
}

export interface ILevelCrushPatch {
    patch_name: () => string;
    patch_target: () => LevelCrushPatchTarget;
    patch_run: (container: DependencyContainer, logger: ILogger, patch_target?: LevelCrushPatchTarget) => Promise<any>;
}
