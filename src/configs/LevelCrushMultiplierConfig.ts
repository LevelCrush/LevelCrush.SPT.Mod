import { inject, injectable } from 'tsyringe';
import { VFS } from '@spt/utils/VFS';
import { JsonUtil } from '@spt/utils/JsonUtil';
import { ILevelCrushMultiplierConfig } from '../models/levelcrush/ILevelCrushMultiplierConfig';
import { LevelCrushCoreConfig } from './LevelCrushCoreConfig';
import path from 'node:path';

@injectable()
export class LevelCrushMultiplierConfig {
    protected config: ILevelCrushMultiplierConfig;

    constructor(
        @inject('LevelCrushCoreConfig') protected lcConfig: LevelCrushCoreConfig,
        @inject('VFS') protected vfs: VFS,
        @inject('JsonUtil') protected jsonUtil: JsonUtil,
    ) {
        this.config = this.jsonUtil.deserialize(
            this.vfs.readFile(path.join(lcConfig.getModPath(), 'config', 'multipliers.json')),
            'multipliers.json',
        );
    }

    public getConfig(): ILevelCrushMultiplierConfig {
        return this.config;
    }

    public getCrafting(): ILevelCrushMultiplierConfig['crafting'] {
        return this.config.crafting;
    }

    public getLoot() {
        return this.config.loot;
    }
}
