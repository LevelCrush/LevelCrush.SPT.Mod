import {SaveServer} from "@spt/servers/SaveServer";
import {ISptLevelCrushProfile, ISptProfile} from "./models/eft/profile/ISptProfile";

export function merge_objs(source: Record<string, any>, new_input: Record<string, any>) {
    // use new input as the merge source to make sure new keys are being placed in
    for (const prop in new_input) {
        const is_array = Array.isArray(source[prop]);
        const current_v = source[prop];
        const new_v_is_unset = new_input[prop] === "{{unset}}";
        const is_empty_object = typeof current_v === "object" && Object.keys(new_input[prop]).length === 0;
        if (new_v_is_unset && typeof source[prop] !== "undefined") {
            // delete
            //this.logger.info(`${prop} is deleted`);
            delete source[prop];
        } else if (is_empty_object) {
            // force to an empty object
            source[prop] = {};
        } else if (is_array) {
            // anything else we have to assume its a new value
            // this includes arrays since those inner values may be entirely new
            //  this.logger.info(`${prop} is array`);
            source[prop] = new_input[prop];
        } else if (typeof current_v === "object") {
            // this.logger.info(`${prop} is an object and needs a merge`);
            // we need to merge these objects
            // since the two properties should be the same between the two overrides we can  assume
            // that it exist and is the same type. if not, weird things will happen
            // probably for the best for things to break since we need them to match up
            merge_objs(current_v as Record<string, any>, new_input[prop] as Record<string, any>);
        } else {
            // this.logger.info(`${prop} is a regular value can be set normally`);
            // anything else we have to assume its a new value
            // this includes arrays since those inner values may be entirely new
            source[prop] = new_input[prop];
        }
    }
}

export function getLevelCrushProfile(sessionID: string, save_server: SaveServer): ISptLevelCrushProfile {
    const serverProfile = save_server.getProfile(sessionID) as ISptProfile;
    // initialize levelcrush fields if neccessary to default
    if (typeof serverProfile["levelcrush"] === "undefined") {
        serverProfile["levelcrush"] = {
            attempts: 0,
            zones: {},
            discord: "",
        };
    }
    return serverProfile as ISptLevelCrushProfile;
}
