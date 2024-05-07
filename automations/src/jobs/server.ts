import Job from '../job';
import * as backup from './backup';
import * as git from './git';
import * as ps from 'ps-node';
import * as child_process from 'node:child_process';
import * as fs from 'fs';
import path from 'path';

/**
 * Stop the server process
 */
export function stop() {
    const setup = async function () {};
    const run = async function () {
        console.log("Scanning for running Aki.Server.exe's ");
        const programs = await new Promise((resolve: (value: ps.Program[]) => void) =>
            ps.lookup(
                {
                    command: 'Aki.Server.exe',
                },
                (err, programs) => {
                    if (err) {
                        console.log('An error occurred while looking up process information', err);
                        resolve([]);
                    } else {
                        resolve(programs);
                    }
                },
            ),
        );

        if (programs.length === 0) {
            console.log('No Aki.server.exe could be found');
        } else {
            for (const program of programs) {
                console.log('Attempting to kill program: ', program.command, program.arguments, program.pid);
                await new Promise((resolve: (value: void) => void) =>
                    ps.kill(program.pid, (err) => {
                        if (err) {
                            console.log('An error occurred while trying to kill a process', err);
                            resolve();
                        } else {
                            resolve();
                        }
                    }),
                );
            }
        }
    };

    return {
        name: 'Server Stop',
        run,
        setup,
    };
}

export function start(): Job {
    const setup = async function () {};
    const run = async function () {
        const cwd = path.resolve(process.env['AUTOMATION_SERVER_FOLDER'] || '');
        console.log(`Starting server in: ${cwd}`);
        const child = child_process.spawn('./Aki.Server.exe', {
            cwd: cwd,
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore'],
        });

        child.unref();
    };

    return {
        name: 'Server Start',
        run,
        setup,
    };
}

/**
 * Clears the cache files used by the servers expliclty
 * @returns
 */
export function clear_cache(): Job {
    const setup = async function () {};
    const run = async function () {
        console.log('Clearing Server cache');
        const server_folder = path.resolve(process.env['AUTOMATION_SERVER_FOLDER'] || '');
        const cache_folder = path.join(server_folder, 'user', 'cache');
        const entries = await fs.promises.readdir(cache_folder, { encoding: 'utf-8' });
        for (const entry of entries) {
            const filepath = path.join(cache_folder, entry);
            const stat = await fs.promises.stat(filepath);
            if (stat.isFile()) {
                console.log(`Removing ${filepath}`);
                await fs.promises.unlink(filepath);
            }
        }
    };

    return {
        name: 'Server Cache Clear',
        setup,
        run,
    };
}

export function update(): Job {
    const setup = async function () {
        const stop_job = stop();
        await stop_job.setup();
        await stop_job.run();

        const backup_job = backup.profiles();
        await backup_job.setup();
        await backup_job.run();

        const cache_clear_job = clear_cache();
        await cache_clear_job.setup();
        await cache_clear_job.run();

        const pull_job = git.pull();
        await pull_job.setup();
        await pull_job.run();

        const server_start = start();
        await server_start.setup();
        await server_start.run();
    };

    const run = async function run() {};

    return {
        name: 'Server Update',
        setup,
        run,
    };
}
