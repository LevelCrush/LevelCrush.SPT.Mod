import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt/models/spt/utils/ILogger';
import { DatabaseServer } from '@spt/servers/DatabaseServer';
import { IDatabaseTables } from '@spt/models/spt/server/IDatabaseTables';

export class ProfilePatch implements ILevelCrushPatch {
    public patch_name(): string {
        return 'ProfilePatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PostDB;
    }

    /**
     * Run whatever our patch needs to do
     * @param lcConfig
     * @param container
     * @param logger
     */
    public async patch_run(container: DependencyContainer, logger: ILogger) {
        // Run patch logic here

        const database = container.resolve<DatabaseServer>('DatabaseServer');
        const tables = database.getTables();

        logger.info('Figuring out unsupported profiles');
        const supported_profiles = ['unheard'];
        const unsupported_profiles = [] as string[];
        for (const profile_type in tables.templates.profiles) {
            if (!supported_profiles.includes(profile_type.toLowerCase())) {
                unsupported_profiles.push(profile_type);
            }
        }

        logger.info('Removing unsupported profiles');
        for (const unsupported of unsupported_profiles) {
            logger.info(`Removing ${unsupported} profile`);
            delete tables.templates.profiles[unsupported];
        }

        return true;
    }
}

export default ProfilePatch;
