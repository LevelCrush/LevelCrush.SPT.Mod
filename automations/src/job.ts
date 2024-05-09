/** Basic Job interface for automations */
export interface Job {
    name: string;
    setup: () => Promise<void>;
    run: () => Promise<void>;
}

export default Job;
