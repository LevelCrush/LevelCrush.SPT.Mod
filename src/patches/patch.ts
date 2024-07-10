import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import CustomCoreConfig from '../custom_config';

export enum LevelCrushPatchTarget {
    PreSptLoadMod,
    PostDB,
    PreSptLoadModAndPostDB,
}

export default interface ILevelCrushPatch {
    patch_name: () => string;
    patch_target: () => LevelCrushPatchTarget;
    patch_run: (container: DependencyContainer, logger: ILogger, patch_target?: LevelCrushPatchTarget) => Promise<any>;
}
