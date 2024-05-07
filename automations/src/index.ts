import dotenv from 'dotenv';
import { ParseArgsConfig, parseArgs } from 'node:util';
import * as backup from './jobs/backup';
import * as server from './jobs/server';
import * as git from './jobs/git';

// allow environment variables to load from a .env
dotenv.config();

async function main() {
    console.log('Starting');
    const options = {
        job: {
            type: 'string',
            default: 'backup:profiles',
        },
    } as ParseArgsConfig['options'];

    // destructure on the left, the result we get on the right
    const { values, positionals } = parseArgs({ options, allowPositionals: true });

    if (positionals.length === 0) {
        console.log('No job specified. Please specify job');
        process.exit();
    }

    let job = undefined;
    switch (positionals[0].trim().toLowerCase()) {
        case 'backup:profiles':
            job = backup.profiles();
            break;
        case 'server:update':
            job = server.update();
            break;
        case 'git:pull':
            job = git.pull();
            break;
        default:
            console.warn(`No known command ${positionals[0]}`);
            break;
    }

    if (job !== undefined) {
        console.log(`Running job ${job.name}`);
        await job.setup();
        await job.run();
    }
}

main()
    .then(() => console.log('Completed'))
    .catch((err) => console.log('An Error Has Occurred', err));
