import { injectable, inject } from "tsyringe";
import { LevelCrushCoreConfig } from "../configs/LevelCrushCoreConfig";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { HashUtil } from "@spt/utils/HashUtil";
import path from "path";
import { VFS } from "@spt/utils/VFS";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import fs from "node:fs";

@injectable()
export class LevelCrushCacheHelper {
    private readonly modFolder;
    private readonly cacheFolder;

    constructor(
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("VFS") protected vfs: VFS,
        @inject("PrimaryLogger") protected logger: ILogger,
    ) {
        this.modFolder = lcConfig.getModPath();
        this.cacheFolder = path.join(this.modFolder, "cache");
    }

    public async write(key: string, data: Record<string, any>): Promise<void> {
        const target_path = path.join(this.cacheFolder, key + ".json");
        await fs.promises.writeFile(target_path, this.jsonUtil.serialize(data), { encoding: "utf-8" });
    }

    public async read(key: string) {
        const target_path = path.join(this.cacheFolder, key + ".json");
        return await fs.promises.readFile(target_path, { encoding: "utf-8" });
    }
}
