import path from 'path';
import Job from '../job';
import * as child_process from 'node:child_process';

export function pull(): Job {
    const server_folder = path.resolve(process.env['AUTOMATION_SERVER_FOLDER'] || '');

    // setup the pull job
    const setup = async function () {};

    // run the pull job
    const run = async function () {
        // stash first just in case
        child_process.spawnSync('git stash', {
            cwd: server_folder,
            shell: true,
        });

        // then pull (which will fetch and merge automatically)
        child_process.spawnSync('git pull', {
            cwd: server_folder,
            shell: true,
        });
    };

    return {
        name: 'Git Pull',
        setup,
        run,
    };
}

export function fetch(): Job {
    const server_folder = path.resolve(process.env['AUTOMATION_SERVER_FOLDER'] || '');

    // setup the pull job
    const setup = async function () {};

    // run the pull job
    const run = async function () {
        const handle = child_process.spawnSync('git fetch', {
            cwd: server_folder,
            shell: true,
        });
    };

    return {
        name: 'Git Fetch',
        setup,
        run,
    };
}
