import { IBuff } from "@spt/models/eft/common/IGlobals";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { injectable } from "tsyringe";

export class Buff {
    protected readonly id: string;
    protected data: IBuff[];
    public constructor(name: string) {
        this.id = name;
        this.data = [];
    }

    public add(buff: IBuff) {
        this.data.push(buff);
        return this;
    }

    public output(): IBuff[] {
        return JSON.parse(JSON.stringify(this.data)) as IBuff[];
    }

    public output_to_tables(tables: IDatabaseTables) {
        (tables.globals.config.Health.Effects.Stimulator.Buffs as unknown as Record<string, IBuff[]>)[this.id] = this.output();
    }
}

@injectable()
export class LevelCrushBuffBuilder {
    public start(buff_name: string) {
        return new Buff(buff_name);
    }
}
