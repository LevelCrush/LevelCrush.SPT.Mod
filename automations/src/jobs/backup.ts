import Job from '../job';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Setup a profile automation job
 * @returns
 */
export function profiles(): Job {
    const profiles: { path: string; name: string }[] = [];

    const server_folder = path.resolve(process.env['AUTOMATION_SERVER_FOLDER'] || '');
    const backup_folder = path.resolve(process.env['AUTOMATION_BACKUP_FOLDER'] || '');
    const backup_profile_folder = path.join(backup_folder, 'profiles');
    const profile_folder = path.join(server_folder, 'user', 'profiles');
    let backup_profile_folder_target = '';

    /**
     * For the setup task we are just going to scan our profile directory and filter out any unwanted profiles
     */
    const setup = async function () {
        console.info(`Scanning ${profile_folder} for profiles`);
        const dir_scan = await fs.promises.readdir(profile_folder, {
            encoding: 'utf-8',
        });
        console.info(`Found ${dir_scan.length} total profiles to backup`);

        // only backup actual profiles
        console.info(`Scanning entries for actual profiles`);
        for (const entry of dir_scan) {
            const entry_path = path.join(profile_folder, entry);
            const stat = await fs.promises.stat(entry_path);
            if (stat.isFile() && entry_path.toLowerCase().endsWith('.json')) {
                profiles.push({
                    path: entry_path,
                    name: entry,
                });
            }
        }

        // figure out the name for the backup profile folder
        const date = new Date().toISOString();
        const folder_name = date.replaceAll(/[:\.T]/g, '-');
        backup_profile_folder_target = path.join(backup_profile_folder, folder_name);

        console.info(`Creating folder ${backup_profile_folder_target}`);
        await fs.promises.mkdir(backup_profile_folder_target, { recursive: true });
    };

    /**
     * In the run function. We are going to actually iterate through the profiles array and run a file copy operation
     * to the target backup location
     */
    const run = async function () {
        for (const profile of profiles) {
            const destination = path.join(backup_profile_folder_target, profile.name);
            const source = profile.path;

            console.log(`Copying ${source} to ${destination}`);
            await fs.promises.copyFile(source, destination);
        }
    };

    return {
        name: 'Profile Backup',
        setup,
        run,
    };
}
