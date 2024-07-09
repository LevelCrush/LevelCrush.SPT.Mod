import ILevelCrushPatch, { LevelCrushPatchTarget } from './patch';
import CustomCoreConfig from '../custom_config';
import { DependencyContainer } from 'tsyringe';
import { ILogger } from '@spt-aki/models/spt/utils/ILogger';
import { StaticRouterModService } from '@spt-aki/services/mod/staticRouter/StaticRouterModService';
import { SaveServer } from '@spt-aki/servers/SaveServer';
import { getLevelCrushProfile } from '../utils';
import { ISaveProgressRequestData } from '@spt-aki/models/eft/inRaid/ISaveProgressRequestData';
import { LogTextColor } from '@spt-aki/models/spt/logging/LogTextColor';
import { ProfileHelper } from '@spt-aki/helpers/ProfileHelper';
import { PlayerRaidEndState } from '@spt-aki/models/enums/PlayerRaidEndState';
import { QuestHelper } from '@spt-aki/helpers/QuestHelper';

export class HardcoreZonePatch implements ILevelCrushPatch {
    private saveServer: SaveServer;

    public patch_name(): string {
        return 'HardcoreZonePatch';
    }

    public patch_target(): LevelCrushPatchTarget {
        return LevelCrushPatchTarget.PreAki;
    }

    public wipe_pmc(url, info, sessionID, output) {
        const serverProfile = getLevelCrushProfile(sessionID, this.saveServer);
        this.saveServer.saveProfile(sessionID);
        if (typeof output !== 'undefined') {
            return output;
        } else {
            return JSON.stringify({
                success: true,
                errors: [],
                response: {
                    wiped: true,
                    sessionID: sessionID,
                },
            });
        }
    }

    public async patch_run(lcConfig: CustomCoreConfig, container: DependencyContainer, logger: ILogger): Promise<void> {
        // using DI for controller doesnt seem to be working
        // logger.info('Registering HardcoreZoneController');
        // container.register<HardcoreZoneController>('HardcoreZoneController', HardcoreZoneController);
        // logger.info('Registering InraidController to HardcoreZoneController');
        //  container.register<HardcoreZoneController>('InraidController', { useClass: HardcoreZoneController });
        // also just setup a route and make it happen

        const staticRouterModService: StaticRouterModService =
            container.resolve<StaticRouterModService>('StaticRouterModService');

        const saveServer = container.resolve<SaveServer>('SaveServer');
        const profileHelper = container.resolve<ProfileHelper>('ProfileHelper');
        const questHelper = container.resolve<QuestHelper>('QuestHelper');

        staticRouterModService.registerStaticRouter(
            'levelcrush-hardcore-zone-match-end',
            [
                {
                    url: '/raid/profile/save',
                    action: (url, info: ISaveProgressRequestData, sessionID, output) => {
                        const offraidData = info;
                        logger.logWithColor(
                            `LevelCrush is checking if ${offraidData.profile.Info.Nickname} is in hardcore mode`,
                            LogTextColor.CYAN,
                        );
                        const serverProfile = getLevelCrushProfile(sessionID, saveServer);
                        const is_dead =
                            offraidData.exit !== PlayerRaidEndState.SURVIVED &&
                            offraidData.exit !== PlayerRaidEndState.RUNNER;
                        //const is_hardcore = this.profileHelper.getFullProfile(sessionID).info.edition.toLowerCase() == 'hardcore';
                        const pmc_data = profileHelper.getPmcProfile(sessionID);
                        const is_hardcore = typeof serverProfile.levelcrush.zones['hardcore'] !== 'undefined';

                        if (is_hardcore) {
                            logger.logWithColor(
                                `${offraidData.profile.Info.Nickname} is in hardcore mode`,
                                LogTextColor.YELLOW,
                            );
                            if (is_dead) {
                                logger.logWithColor(
                                    `${offraidData.profile.Info.Nickname} is dead and is hardcore. Must Wipe`,
                                    LogTextColor.CYAN,
                                );

                                logger.info('Match ended. Wiping PMC');

                                serverProfile.info.wipe = true;
                                serverProfile.levelcrush.attempts++;
                                logger.info(`${sessionID}: ${serverProfile.levelcrush.attempts}`);
                                logger.info('Saving wiped pmc');
                                saveServer.saveProfile(sessionID);
                            }
                        }

                        return output;
                    },
                },
            ],
            'aki',
        );

        staticRouterModService.registerStaticRouter(
            'levelcrush-hardcore-zone-add',
            [
                {
                    url: '/levelcrush/zone/add/hardcore',
                    action: (url, info, sessionID, output) => {
                        const serverProfile = getLevelCrushProfile(sessionID, saveServer);
                        if (typeof serverProfile.levelcrush.zones['hardcore'] === 'undefined') {
                            logger.logWithColor(
                                `${serverProfile.info.username} has entered the hardcore zone`,
                                LogTextColor.YELLOW,
                            );
                            serverProfile.levelcrush.zones['hardcore'] = Date.now() / 1000;
                        }
                        saveServer.saveProfile(sessionID);

                        return JSON.stringify({
                            success: true,
                            errors: [],
                            response: {
                                sessionID: sessionID,
                                zones: [],
                            },
                        });
                    },
                },
            ],
            'levelcrush-zone',
        );

        staticRouterModService.registerStaticRouter(
            'levelcrush-hardcore-zone-remove',
            [
                {
                    url: '/levelcrush/zone/remove/hardcore',
                    action: (url, info, sessionID, output) => {
                        const serverProfile = getLevelCrushProfile(sessionID, saveServer);
                        if (typeof serverProfile.levelcrush.zones['hardcore'] !== 'undefined') {
                            logger.logWithColor(
                                `${serverProfile.info.username} has left the hardcore zone`,
                                LogTextColor.YELLOW,
                            );
                            delete serverProfile.levelcrush.zones['hardcore'];
                        }
                        saveServer.saveProfile(sessionID);

                        return JSON.stringify({
                            success: true,
                            errors: [],
                            response: {
                                sessionID: sessionID,
                                zones: [],
                            },
                        });
                    },
                },
            ],
            'levelcrush-zone',
        );
    }
}

export default HardcoreZonePatch;
