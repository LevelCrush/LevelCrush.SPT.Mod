import { ICoreConfig } from '@spt-aki/models/spt/config/ICoreConfig';

export interface CustomCoreConfig extends ICoreConfig {
    dev: boolean;
    home_submessage: string;
}

export default CustomCoreConfig;
