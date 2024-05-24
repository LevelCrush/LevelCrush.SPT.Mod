import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import CustomCoreConfig from '../custom_config';

export enum LevelCrushPatchTarget {
    PreAki,
    PostDB,
}

export default interface ILevelCrushPatch {
    patch_name: () => string;
    patch_target: () => LevelCrushPatchTarget;
    patch_run: (config: CustomCoreConfig, container: DependencyContainer, logger: ILogger) => Promise<any>;
}
