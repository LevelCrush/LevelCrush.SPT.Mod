/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/naming-convention */
import { DependencyContainer } from "tsyringe";
import { IPostDBLoadMod } from "@spt-aki/models/external/IPostDBLoadMod";
import { CustomItemService } from "@spt-aki/services/mod/CustomItemService";
import { NewItemFromCloneDetails } from "@spt-aki/models/spt/mod/NewItemDetails";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";

import preset_file from "../src/Item_Preset.json";
import global_preset_file from "../src/global_item_preset.json";

class Mod implements IPostDBLoadMod
{
	public postDBLoad(container: DependencyContainer): void 
	{
		
		const customitem = container.resolve<CustomItemService>("CustomItemService");
		const databaseserver = container.resolve<DatabaseServer>("DatabaseServer");
		const db = databaseserver.getTables()
		const globals = db.globals;
		const PK = db.traders["5935c25fb3acc3127c3d8cd9"].assort;
		// WEAPON LISTING AND ATTACHMENT
		const weapon_raffica: NewItemFromCloneDetails ={
			itemTplToClone: "5cadc190ae921500103bb3b6",
			overrideProperties: {
				Weight: 0.576,
				Prefab:{
					path: "assets/weapons/93raffica/weapon_beretta_93r_container.bundle",
					rcid: ""
				},
				weapFireType: ["single", "burst"],
				bFirerate: 1100,
				NoFiremodeOnBoltcatch: true,
				RecolDispersion: 6,
				RecoilCamera: 0.0134,
				RecoilForceBack: 187,
				RecoilForceUp: 246,
				RecoilReturnPathDampingHandRotation: 0.37,
				RecoilDampingHandRotation: 0.71,
				RecoilStableIndexShot: 7,
				CenterOfImpact: 0.043,
				RecoilCenter: 
				{
					x: 0,
					y: -0.462,
					z: -0.021
				},
				RotationCenter: 
				{
					x: 0,
					y: 0,
					z: 0
				},
				RotationCenterNoStock: 
				{
					x: 0,
					y: -0.462,
					z: -0.021
				},
				Slots: 
				[
					{
						"_id": "raffica_mod_receiver",
						"_mergeSlotWithChildren": false,
						"_name": "mod_reciever",
						"_parent": "weapon_93_raffica",
						"_props": {
						  "filters": [
							{
							  "Filter": [
								"mod_reciever_raffica_slide",
								"mod_reciever_raffica_slide_sightless"
							  ],
							  "Shift": 0
							}
						  ]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": true
					},
					{
						"_id": "raffica_mod_magazine",
						"_mergeSlotWithChildren": false,
						"_name": "mod_magazine",
						"_parent": "weapon_93_raffica",
						"_props": {
						  "filters": [
							{
							  "AnimationIndex": -1,
							  "Filter": [
								"5cadc2e0ae9215051e1c21e7"
							  ]
							}
						  ]
						},
						"_proto": "55d30c394bdc2dae468b4577",
						"_required": false
					},
					{
						"_id": "raffica_mod_tactical",
						"_mergeSlotWithChildren": false,
						"_name": "mod_tactical",
						"_parent": "weapon_93_raffica",
						"_props": {
						  "filters": [
							{
							  "Filter": [
								"mod_foregrip_angled_raffica",
								"mod_barrel_ext_robocop"
							  ],
							  "Shift": 0
							}
						  ]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					},
					{
						"_id": "raffica_mod_stock",
						"_mergeSlotWithChildren": false,
						"_name": "mod_stock",
						"_parent": "weapon_93_raffica",
						"_props": {
						  "filters": [
							{
							  "Filter": [
								"mod_stock_metal_raffica"
							  ],
							  "Shift": 0
							}
						  ]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					},
					{
						"_id": "raffica_mod_muzzle",
						"_mergeSlotWithChildren": false,
						"_name": "mod_muzzle",
						"_parent": "weapon_93_raffica",
						"_props": {
						  "filters": [
							{
							  "Filter": [
								"mod_silencer_gemtech_aurora_2"
							  ],
							  "Shift": 0
							}
						  ]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					}
				],
				ExaminedByDefault: false,
				HeatFactorByShot: 3.125
			},
			parentId: "5447b5cf4bdc2d65278b4567",
			newId: "weapon_93_raffica",
			fleaPriceRoubles: 21153,
			handbookPriceRoubles: 25132,
			handbookParentId: "5b5f792486f77447ed5636b3",
			locales: 
			{
				"en":
				{
					name: "Beretta 93 Raffica 9x19 Machine Pistol",
					shortName: "M93R",
					description: "The Beretta 93R is an Italian selective-fire machine pistol, designed and manufactured by Beretta in the late 1970s for police and military use, that is derived from their semi-automatic Beretta 92. The \"R\" stands for Raffica, which is Italian for \"volley\", \"flurry\", or \"burst\". The Beretta 93R is mechanically similar to the Beretta 92. It can be selected to fire either a three round burst or single fire. A selector switch enables the operator to alternate between the two firing modes. The pistol can be fitted with a collapsible angled foregrip at the front end of the trigger guard to provide better stability when firing."
				}
			}
		};
		customitem.createItemFromClone(weapon_raffica);

		const Angled_grip: NewItemFromCloneDetails ={
			itemTplToClone: "57cffb66245977632f391a99",
			overrideProperties: {
			  Weight: 0.034,
			  Prefab: {
				path: "assets/weapons/93raffica/mod_foregrip_angled_beretta_93r.bundle",
				rcid: ""
			  },
			  Ergonomics: 5,
			  ExaminedByDefault: false,
			  Width: 1,
			  Height: 1,
			  Recoil: -47,
			  ConflictingItems: [],
			  UniqueAnimationModID: 1001,
			  IsAnimated: true
			},
			parentId: "55818af64bdc2d5b648b4570",
			newId: "mod_foregrip_angled_raffica",
			fleaPriceRoubles: 8764,
			handbookPriceRoubles: 9112,
			handbookParentId: "5b5f71de86f774093f2ecf13",
			locales:
			{
			  "en": {
				name: "Beretta 93 Raffica Foldable Foregrip",
				shortName: "M93R Foregrip",
				description: "An angled foregrip that can be installed on the Beretta 93R trigger guard end and can be collapsed for easier storing."
			  }
			}
		}
		customitem.createItemFromClone(Angled_grip);

		const raffica_slide: NewItemFromCloneDetails ={
		  itemTplToClone: "5cadc55cae921500103bb3be",
		  overrideProperties: {
			Weight: 0.065,
			Prefab: {
			  path: "assets/weapons/93raffica/mod_receiver_slide_beretta_93r.bundle",
			  rcid: ""
			},
			Ergonomics: 5,
			ExaminedByDefault: false,
			Slots:[]
		  },
		  parentId: "55818a304bdc2db5418b457d",
		  newId: "mod_reciever_raffica_slide",
		  fleaPriceRoubles: 5132,
		  handbookPriceRoubles: 6642,
		  handbookParentId: "5b5f764186f77447ec5d7714",
		  locales:
		  {
			"en": {
			  name: "Beretta 93 Raffica Metal Slide",
			  shortName: "M93R Slide",
			  description: "Standard issue slide fitted for the M93R."
			}
		  }
	  }
	  customitem.createItemFromClone(raffica_slide);

	  const raffica_slide_rbc: NewItemFromCloneDetails ={
		itemTplToClone: "mod_reciever_raffica_slide",
		overrideProperties: {
		  Weight: 0.063,
		  Prefab: {
			path: "assets/weapons/93raffica/mod_receiver_slide_sightless_beretta_93r.bundle",
			rcid: ""
		  },
		  Ergonomics: 6,
		  ExaminedByDefault: false,
		  Slots:[
			{
				"_id": "raffic_rear_sight_mod",
				"_mergeSlotWithChildren": false,
				"_name": "mod_sight_rear",
				"_parent": "mod_reciever_raffica_slide_sightless",
				"_props": {
				  "filters": [
					{
					  "Filter": [
						"mod_rear_sight_rbc_mount"
					  ],
					  "Shift": 0
					}
				  ]
				},
				"_proto": "55d30c4c4bdc2db4468b457e",
				"_required": false
			}
		  ]
		},
		parentId: "55818a304bdc2db5418b457d",
		newId: "mod_reciever_raffica_slide_sightless",
		fleaPriceRoubles: 3512,
		handbookPriceRoubles: 4553,
		handbookParentId: "5b5f764186f77447ec5d7714",
		locales:
		{
		  "en": {
			name: "Beretta 93 Raffica Metal Slide Sightless",
			shortName: "RBC Slide",
			description: "Standard issue slide fitted for M93R. This one has the rear ironsight removed in place for an attachable higher rear sight."
		  }
		}
	  }
	  customitem.createItemFromClone(raffica_slide_rbc);

	  const rbc_sight_riser: NewItemFromCloneDetails ={
		itemTplToClone: "5649b0544bdc2d1b2b8b458a",
		overrideProperties: {
		  Weight: 0.023,
		  Prefab: {
			path: "assets/weapons/93raffica/mod_rear_sight_beretta_93r.bundle",
			rcid: ""
		  },
		  Ergonomics: -2,
		  ExaminedByDefault: false,
		  Slots:[]

		},
		parentId: "55818ac54bdc2d5b648b456e",
		newId: "mod_rear_sight_rbc_mount",
		fleaPriceRoubles: 1152,
		handbookPriceRoubles: 2553,
		handbookParentId: "5b5f746686f77447ec5d7708",
		locales:
		{
		  "en": {
			name: "High Rise Rear Iron Sight",
			shortName: "RBC Sight",
			description: "A high rise rear sight for the modified metal slide."
		  }
		}
	  }
	  customitem.createItemFromClone(rbc_sight_riser);

	  const rbc_ext_barrel: NewItemFromCloneDetails ={
		itemTplToClone: "5649ab884bdc2ded0b8b457f",
		overrideProperties: {
		  Weight: 0.313,
		  Prefab: {
			path: "assets/weapons/93raffica/mod_barrel_ext_beretta_93r.bundle",
			rcid: ""
		  },
		  Ergonomics: -21,
		  ExaminedByDefault: false,
		  Slots:[],
		  BackgroundColor: "violet",
		  Height: 1,
		  Width: 2,
		  ExtraSizeLeft: 1,
		  Recoil: -22,
		  Velocity: 0.7,
		  HeatFactor: 0.32,
		  CoolFactor: 1.25
		},
		parentId: "550aa4bf4bdc2dd6348b456b",
		newId: "mod_barrel_ext_robocop",
		fleaPriceRoubles: 5721,
		handbookPriceRoubles: 7826,
		handbookParentId: "5b5f724186f77447ed5636ad",
		locales:
		{
		  "en": {
			name: "Robocop M93R Special Attachable Barrel Extension",
			shortName: "RBC Muzzle",
			description: "A special attachable extension for the M93R. A working 1-to-1 extension replica from the movie Robocop. It is however, bulky to wield and it has seen much better days."
		  }
		}
	  }
	  customitem.createItemFromClone(rbc_ext_barrel);

	  const gemtech_silencer: NewItemFromCloneDetails ={
		itemTplToClone: "5a32a064c4a28200741e22de",
		overrideProperties: {
		  Weight: 0.0907,
		  Prefab: {
			path: "assets/weapons/93raffica/mod_silencer_gemtech_aurora_2_9mm.bundle",
			rcid: ""
		  },
		  Ergonomics: -8,
		  ExaminedByDefault: false,
		  Slots:[],
		  Height: 1,
		  Width: 1,
		  Recoil: -13,
		  CoolFactor: 0.88,
		  HeatFactor: 2.53,
		  DurabilityBurnModificator: 1.12,
		  Velocity: 0.2,
		  ExtraSizeLeft: 0,
		  Loudness: -34,
		  ConflictingItems: [
			"mod_barrel_ext_robocop"
		  ]
		},
		parentId: "550aa4cd4bdc2dd8348b456c",
		newId: "mod_silencer_gemtech_aurora_2",
		fleaPriceRoubles: 15332,
		handbookPriceRoubles: 20115,
		handbookParentId: "5b5f724186f77447ed5636ad",
		locales:
		{
		  "en": {
			name: "Gemtech Aurora-II 9mm Supressor",
			shortName: "Aurora-II",
			description: "A Micro 9mm supressor that employs an entirely wet environment for maximum suppression in a compact package. The Aurora-II is threaded on both ends, making it compatible with Metric and Standard thread pitches while also being able to be mounted directly to the barrel. The Aurora-II utilizes eight “wipes” that are placed inside the tube and held apart by aluminum spacers."
		  }
		}
	  }
	  customitem.createItemFromClone(gemtech_silencer);

	  const Metal_Stock: NewItemFromCloneDetails ={
			itemTplToClone: "5649b1c04bdc2d16268b457c",
			overrideProperties: {
			  Weight: 0.123,
			  Prefab: {
				path: "assets/weapons/93raffica/mod_stock_metal_fold_beretta_93r.bundle",
				rcid: ""
			  },
			  Ergonomics: -6,
			  ExaminedByDefault: false,
			  Width: 2,
			  ExtraSizeRight: 1,
			  Height: 1,
			  Recoil: -22,
			  Slots: []
			},
			parentId: "55818a594bdc2db9688b456a",
			newId: "mod_stock_metal_raffica",
			fleaPriceRoubles: 7512,
			handbookPriceRoubles: 9412,
			handbookParentId: "5b5f757486f774093e6cb507",
			locales:
			{
			  "en": {
				name: "Beretta 93 Raffica Foldable Metal Stock",
				shortName: "M93R Stock",
				description: "A standard foldable metal stock for Beretta 93R. Reduce large amount of recoil making the gun easier to handle."
			  }
			}
		}
		customitem.createItemFromClone(Metal_Stock);

	  // MASTERY AND TRADER
	  const beretta_master = globals.config.Mastering.find(x => x.Templates[0] === "5cadc190ae921500103bb3b6")
	  const realism_master = globals.config.Mastering.find(x => x.Name === "P226")
		//Realism Load order fuckery
		if (beretta_master != null) 
		{
		  beretta_master.Templates.push("weapon_93_raffica")
		}
		else 
		{
		  realism_master.Templates.push("weapon_93_raffica")
		}

	  for (const itemPreset in global_preset_file.ItemPresets)
	  {
		globals.ItemPresets[itemPreset] = global_preset_file.ItemPresets[itemPreset];
	  }

	  db.locales.global["en"]["65f6ebe432bcdc33bef6bc13"] = "Auto 9";

	  PK.items.push(...preset_file.items);

	  for (const bsc in preset_file.barter_scheme)
	  {
		PK.barter_scheme[bsc] = preset_file.barter_scheme[bsc];
	  }

	  for (const llv in preset_file.loyal_level_items)
	  {
		PK.loyal_level_items[llv] = preset_file.loyal_level_items[llv];
	  }
	  
	  // DEBUG
	  /* db.templates.items["weapon_93_raffica"]._props.AllowFeed = true;
	  db.templates.items["weapon_93_raffica"]._props.AllowJam = false;
	  db.templates.items["weapon_93_raffica"]._props.AllowSlide = false;
	  db.templates.items["weapon_93_raffica"]._props.AllowMisfire = false;
	  db.templates.items["weapon_93_raffica"]._props.BaseMalfunctionChance = 100; */

	  db.templates.quests["59c50c8886f7745fed3193bf"].conditions.AvailableForFinish[0].counter.conditions[0].weaponModsInclusive.push(["mod_silencer_gemtech_aurora_2"])

		//Loadout manipulation
		/* const usec = db.bots.types["usec"];
		const bear = db.bots.types["bear"];

		usec.inventory.equipment.Holster["weapon_93_raffica"] = 4;
		usec.inventory.mods["weapon_93_raffica"] =
		{
			mod_stock: ["mod_stock_metal_raffica"],
			mod_reciever: [
				"mod_reciever_raffica_slide",
				"mod_reciever_raffica_slide_sightless"
			],
			mod_tactical: [
				"mod_foregrip_angled_raffica",
				"mod_barrel_ext_robocop"
			],
			mod_magazine: ["5cadc2e0ae9215051e1c21e7"],
			mod_muzzle: ["mod_silencer_gemtech_aurora_2"],
			patron_in_weapon: [
				"5a800961159bd4315e3a1657",
				"5cc9c20cd7f00c001336c65d",
				"5d2369418abbc306c62e0c80",
				"5b07dd285acfc4001754240d",
				"56def37dd2720bec348b456a",
				"5a7b483fe899ef0016170d15",
				"5a5f1ce64f39f90b401987bc",
				"560d657b4bdc2da74d8b4572",
				"5a7b4900e899ef197b331a2a",
				"5b3a08b25acfc4001754880c",
				"6272370ee4013c5d7e31f418",
				"6272379924e29f06af4d5ecb"
			]
		};
		usec.inventory.mods["mod_reciever_raffica_slide_sightless"] =
		{
			mod_sight_rear: ["mod_rear_sight_rbc_mount"]
		};

		bear.inventory.equipment.Holster["weapon_93_raffica"] = 4;
		bear.inventory.mods["weapon_93_raffica"] =
		{
			mod_stock: ["mod_stock_metal_raffica"],
			mod_reciever: [
				"mod_reciever_raffica_slide",
				"mod_reciever_raffica_slide_sightless"
			],
			mod_tactical: [
				"mod_foregrip_angled_raffica",
				"mod_barrel_ext_robocop"
			],
			mod_magazine: ["5cadc2e0ae9215051e1c21e7"],
			mod_muzzle: ["mod_silencer_gemtech_aurora_2"],
			patron_in_weapon: [
				"5a800961159bd4315e3a1657",
				"5cc9c20cd7f00c001336c65d",
				"5d2369418abbc306c62e0c80",
				"5b07dd285acfc4001754240d",
				"56def37dd2720bec348b456a",
				"5a7b483fe899ef0016170d15",
				"5a5f1ce64f39f90b401987bc",
				"560d657b4bdc2da74d8b4572",
				"5a7b4900e899ef197b331a2a",
				"5b3a08b25acfc4001754880c",
				"6272370ee4013c5d7e31f418",
				"6272379924e29f06af4d5ecb"
			]
		};
		bear.inventory.mods["mod_reciever_raffica_slide_sightless"] =
		{
			mod_sight_rear: ["mod_rear_sight_rbc_mount"]
		} */

		//For next AKi update
		customitem.addCustomWeaponToPMCs("weapon_93_raffica", 5, "Holster");
	}	
}

module.exports = { mod: new Mod() }