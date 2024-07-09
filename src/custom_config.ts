import { ICoreConfig } from '@spt-aki/models/spt/config/ICoreConfig';

export interface CustomCoreConfig extends ICoreConfig {
    dev: boolean;
    home_submessage: string;
    global_loose_loot_multiplier?: number;
    global_static_loot_multiplier?: number;
    modPath: string;
}

export default CustomCoreConfig;
