"use strict";

class Mod {
    postDBLoad(container) {
        const Logger = container.resolve("WinstonLogger");
        const db = container.resolve("DatabaseServer").getTables();
        const jsonUtil = container.resolve("JsonUtil");

        let vudu = jsonUtil.clone(db.templates.items["5b3b99475acfc432ff4dcbee"]);
        vudu._props.Prefab.path = "assets/content/items/mods/scopes/scope_30mm_eotech_vudu_1_6x24_overhaul.bundle";
        vudu._props.ModesCount = [7];
        vudu._props.AimSensitivity[0] = [
            0.7,
            0.7,
            0.7,
            0.7,
            0.7,
            0.7,
            0.7
        ];
        vudu._props.Zooms[0] = [
            1,
            1.5,
            2,
            3,
            4,
            5,
            6
        ];

        db.templates.items["5b3b99475acfc432ff4dcbee"] = vudu;
    }
}

module.exports = { mod: new Mod() }