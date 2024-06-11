/* eslint-disable @typescript-eslint/naming-convention */

import * as fs from "fs";
import * as path from "path";

import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { LogTextColor } from "@spt-aki/models/spt/logging/LogTextColor";

// WTT imports
import { WTTInstanceManager } from "./WTTInstanceManager";

// Boss imports
import { CustomItemService } from "./CustomItemService";

// Custom Trader Assort Items
import { CustomAssortSchemeService } from "./CustomAssortSchemeService";
import { CustomWeaponPresets } from "./CustomWeaponPresets";



class rexsDesertBagle
    implements IPreAkiLoadMod, IPostDBLoadMod {
    private Instance: WTTInstanceManager = new WTTInstanceManager();
    private version: string;
    private modName = "Rex's Dessert Bagle";
    private config;

    //#region CustomBosses
    private customItemService: CustomItemService = new CustomItemService();
    //#endregion

    private customAssortSchemeService: CustomAssortSchemeService = new CustomAssortSchemeService();
    private customWeaponPresets: CustomWeaponPresets = new CustomWeaponPresets();

    debug = false;

    // Anything that needs done on preAKILoad, place here.
    public preAkiLoad(container: DependencyContainer): void {
        // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.Instance.preAkiLoad(container, this.modName);
        this.Instance.debug = this.debug;
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE

        this.getVersionFromJson();
        this.displayCreditBanner();

        // Custom Bosses
        this.customItemService.preAkiLoad(this.Instance);

        this.customAssortSchemeService.preAkiLoad(this.Instance);

        this.customWeaponPresets.preAkiLoad(this.Instance);

    }

    // Anything that needs done on postDBLoad, place here.
    postDBLoad(container: DependencyContainer): void {
        // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.Instance.postDBLoad(container);
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE


        // Bosses
        this.customItemService.postDBLoad();

        this.customAssortSchemeService.postDBLoad();
        this.customWeaponPresets.postDBLoad();
        this.questHelper();
        this.Instance.logger.log(
            `[${this.modName}] Database: Loading complete.`,
            LogTextColor.GREEN
        );
    }

    private questHelper(): void {
        const quest = this.Instance.database.templates.quests;
        for (const id in quest)
            if (quest[id]._id == "596b455186f77457cb50eccb") {
                quest[id].conditions.AvailableForFinish[0].counter.conditions[0].weapon.push("663fe6eb47e8baf835124234");
            }

    }

    private getVersionFromJson(): void {
        const packageJsonPath = path.join(__dirname, "../package.json");

        fs.readFile(packageJsonPath, "utf-8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }

            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }

    private displayCreditBanner(): void {
        this.Instance.logger.log(
            `[${this.modName}] ------------------------------------------------------------------------`,
            LogTextColor.GREEN
        );
        this.Instance.logger.log(
            `[${this.modName}] Pre-Alpha development build`,
            LogTextColor.GREEN
        );
        this.Instance.logger.log(
            `[${this.modName}] Developers: Rexana          Codebase: GroovypenguinX`,
            LogTextColor.GREEN
        );
        this.Instance.logger.log(
            `[${this.modName}] Deeeeeeagle.`,
            LogTextColor.GREEN
        );
        this.Instance.logger.log(
            `[${this.modName}] ------------------------------------------------------------------------`,
            LogTextColor.GREEN
        );
    }
}

module.exports = { mod: new rexsDesertBagle() };
