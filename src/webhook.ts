import { ILogger } from "@spt/models/spt/utils/ILogger";

export interface DiscordWebhookConfig {
    url: string;
    server_name: string;
    output: boolean;
}

export const DiscordWebhookColors = {
    Green: 967445,
    Red: 16711680,
    Yellow: 16769024,
};

export class DiscordWebhook {
    private config: DiscordWebhookConfig;
    private logger: ILogger;

    public constructor(logger: ILogger) {
        this.config = require("../config/discord.json") as DiscordWebhookConfig;
        this.logger = logger;
    }

    public async send(title: string, description: string, color: number) {
        if (this.config.output) {
            this.logger.info(
                `Sending Discord webhook: ${JSON.stringify({
                    title: title,
                    description: description,
                    color: color,
                })}`,
            );
            try {
                await fetch(this.config.url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        content: null,
                        embeds: [
                            {
                                title: title,
                                description: description,
                                color: color,
                                author: {
                                    name: this.config.server_name,
                                },
                            },
                        ],
                        attachments: [],
                    }),
                });
                this.logger.info("Posted discord webhook");
            } catch {
                this.logger.error("Failed to post discord webhook");
            }
        }
    }
}

export default DiscordWebhook;
