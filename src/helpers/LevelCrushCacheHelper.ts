import { injectable, inject } from "tsyringe";
import { LevelCrushCoreConfig } from "../configs/LevelCrushCoreConfig";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { HashUtil } from "@spt/utils/HashUtil";
import path from "path";
import { VFS } from "@spt/utils/VFS";

@injectable()
export class LevelCrushCacheHelper {
    private readonly modFolder;
    private readonly cacheFolder;

    constructor(
        @inject("LevelCrushCoreConfig") protected lcConfig: LevelCrushCoreConfig,
        @inject("JsonUtil") protected jsonUtil: JsonUtil,
        @inject("HashUtil") protected hashUtil: HashUtil,
        @inject("VFS") protected vfs: VFS,
    ) {
        this.modFolder = lcConfig.getModPath();
        this.cacheFolder = path.join(this.modFolder, "cache");
    }

    public async write(key: string, data: Record<string, any>): Promise<void> {
        await this.vfs.writeFileAsync(path.join(this.cacheFolder, key + ".json"), this.jsonUtil.serialize(data));
    }
}
