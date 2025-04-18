import { inject, injectable } from "tsyringe";
import path from "node:path";
import { ILevelCrushCoreConfig } from "../models/config/ILevelCrushCoreConfig";
import { PreSptModLoader } from "@spt/loaders/PreSptModLoader";
import { VFS } from "@spt/utils/VFS";
import { JsonUtil } from "@spt/utils/JsonUtil";

import fs from "node:fs";

import packageJson from "../../package.json";

@injectable()
export class LevelCrushCoreConfig {
    protected modAuthor: string;
    protected modName: string;
    protected modPath: string;
    protected modVersion: string;
    protected config: ILevelCrushCoreConfig;
    protected modIsDev: boolean;

    constructor(
        @inject("PreSptModLoader") protected preSptModLoader: PreSptModLoader,
        @inject("VFS") protected vfs: VFS,
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
    ) {
        this.modAuthor = packageJson.author.replace(/\W/g, "").toLowerCase();
        this.modName = packageJson.name.replace(/\W/g, "").toLowerCase();
        this.modVersion = packageJson.version;
        this.modPath = this.preSptModLoader.getModPath(packageJson.name);

        this.config = this.jsonUtil.deserialize(this.vfs.readFile(path.join(this.modPath, "config", "core.json")), "core.json");
        this.modIsDev = fs.existsSync(path.join(this.modPath, "config", ".dev"));
    }

    public getConfig(): ILevelCrushCoreConfig {
        return this.config;
    }

    public getServerName(): string {
        return this.config.serverName;
    }

    public getModVersion(): string {
        return this.modVersion;
    }

    public isDev(): boolean {
        return this.modIsDev;
    }

    public getModFolderName(): string {
        return `LevelCrush`;
    }

    public getModPath(): string {
        return this.modPath;
    }
}
