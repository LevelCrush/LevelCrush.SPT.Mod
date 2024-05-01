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
		const MC = db.traders["5a7c2eca46aef81a7ca2145d"].assort;
		const PK = db.traders["5935c25fb3acc3127c3d8cd9"].assort;
		const THRP = db.traders["54cb57776803fa99248b456e"].assort;
		const PRP = db.traders["54cb50c76803fa8b248b4571"].assort;
		const JGR = db.traders["5c0647fdd443bc2504c2d371"].assort;
		const SKR = db.traders["58330581ace78e27b8b10cee"].assort;
		const RGMN = db.traders["5ac3b934156ae10c4430e83c"].assort;
		//---WEAPON LISTING AND ATTACHMENT---
		const Piccatiny_Mount: NewItemFromCloneDetails ={
			itemTplToClone: "591ee00d86f774592f7b841e",
			overrideProperties: {
				Weight: 0.036,
				ExaminedByDefault: false,
				RaidModdable: false,
				Width: 2,
				Prefab: {
					path: "assets/weapons/striker12/mod_mount_piccatiny_rail_striker_12.bundle",
					rcid: ""
				},
				Slots: [
					{
						"_id": "picatinny_mod_scope",
						"_mergeSlotWithChildren": false,
						"_name": "mod_scope",
						"_parent": "mod_mount_piccatiny_rail_striker12",
						"_props": {
							"filters": [
								{
									"Filter": 
									[
										"57ac965c24597706be5f975c",
										"57aca93d2459771f2c7e26db",
										"544a3f024bdc2d1d388b4568",
										"544a3a774bdc2d3a388b4567",
										"5d2dc3e548f035404a1a4798",
										"57adff4f24597737f373b6e6",
										"5c0517910db83400232ffee5",
										"591c4efa86f7741030027726",
										"570fd79bd2720bc7458b4583",
										"570fd6c2d2720bc6458b457f",
										"558022b54bdc2dac148b458d",
										"5c07dd120db834001c39092d",
										"5c0a2cec0db834001b7ce47d",
										"58491f3324597764bc48fa02",
										"584924ec24597768f12ae244",
										"5b30b0dc5acfc400153b7124",
										"6165ac8c290d254f5e6b2f6c",
										"60a23797a37c940de7062d02",
										"5d2da1e948f035477b1ce2ba",
										"5c0505e00db834001b735073",
										"609a63b6e2ff132951242d09",
										"584984812459776a704a82a6",
										"59f9d81586f7744c7506ee62",
										"570fd721d2720bc5458b4596",
										"57ae0171245977343c27bfcf",
										"5d1b5e94d7ad1a2b865a96b0",
										"609bab8b455afd752b2e6138",
										"58d39d3d86f77445bb794ae7",
										"616554fe50224f204c1da2aa",
										"5c7d55f52e221644f31bff6a",
										"616584766ef05c2ce828ef57",
										"5b3b6dc75acfc47a8773fb1e",
										"615d8d878004cc50514c3233",
										"577d128124597739d65d0e56",
										"5c064c400db834001d23f468",
										"58d2664f86f7747fec5834f6",
										"5c1cdd302e221602b3137250",
										"61714b2467085e45ef140b2c",
										"5b31163c5acfc400153b71cb",
										"5a33b652c4a28232996e407c",
										"5a33b2c9c4a282000c5a9511",
										"59db7eed86f77461f8380365",
										"5a1ead28fcdbcb001912fa9f",
										"626bb8532c923541184624b4",
										"63fc449f5bd61c6cf3784a88",
										"6477772ea8a38bb2050ed4db",
										"6478641c19d732620e045e17",
										"64785e7c19d732620e045e15"
									],
									"Shift": 0
								}
							]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					},
					{
						"_id": "picatinny_rear_sight",
						"_mergeSlotWithChildren": false,
						"_name": "mod_sight_rear",
						"_parent": "mod_mount_piccatiny_rail_striker12",
						"_props": {
							"filters": [
								{
									"Filter": 
									[
										"mod_rear_sight_striker_12",									
										"5bb20e49d4351e3bac1212de",
										"5ba26b17d4351e00367f9bdd",
										"5dfa3d7ac41b2312ea33362a",
										"5c1780312e221602b66cc189",
										"5fb6564947ce63734e3fa1da",
										"5bc09a18d4351e003562b68e",
										"5c18b9192e2216398b5a8104",
										"5fc0fa957283c4046c58147e",
										"5894a81786f77427140b8347",
										"55d5f46a4bdc2d1b198b4567",
										"5ae30bad5acfc400185c2dc4"
										
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
			parentId: "55818b224bdc2dde698b456f",
			newId: "mod_mount_piccatiny_rail_striker12",
			handbookParentId: "5b5f755f86f77447ec5d770e",
			handbookPriceRoubles: 6775,
			fleaPriceRoubles: 9881,
			locales: {
				"en": {
					name: "StrikeRail Picatinny Mount",
                    shortName: "SR-Picatinny Mount",
                    description: "A specialized accessory crafted specifically for the Armsel Striker shotgun, offering a wide range of optic customization options. This mount attaches securely to the shotgun's receiver, providing a standardized Picatinny rail interface. "
				}
			}
		}
		customitem.createItemFromClone(Piccatiny_Mount);

		const striker_12: NewItemFromCloneDetails = {
			itemTplToClone: "5a7828548dc32e5a9c28b516",
			overrideProperties: {
				Prefab: {
					path: "assets/weapons/striker12/weapon_striker_12_container.bundle",
					rcid: ""
				},
				aimingSensitivity: 0.54,
				Width: 3,
				Height: 2,
				AllowFeed: false,
				AllowJam: false,
				AllowMisfire: false,
				AllowSlide: false,
				AimPlane: 0.05,
				CenterOfImpact: 0.11,
				shotgunDispersion: 1,
				ShotgunDispersion: 1,
				SingleFireRate: 500,
				bFirerate: 500,
				Velocity: 3.2,
				DeviationMax: 8,
				Ergonomics: 67,
				isChamberLoad: true,
				TacticalReloadFixation: 95,
				TacticalReloadStiffnes: 
				{
					x: 0.85,
					y: 0.80,
					z: 0.95
				},
				ExaminedByDefault: false,
				ExamineExperience: 18,
				HeatFactorGun: 0.76,
				IronSightRange: 50,
				LootExperience: 25,
				RecoilAngle: 87,
				RecoilCenter: 
				{
					x: 0.007,
					y: -0.26,
					z: -0.068
				},
				RecoilForceUp: 520,
				RecoilForceBack: 320,
				RecoilCamera: 0.0087,
				RecoilDampingHandRotation: 0.76,
				RecoilReturnSpeedHandRotation: 4.75,
                RecoilReturnPathDampingHandRotation: 0.47,
				RecoilStableIndexShot: 6,
				RecoilPosZMult: 1,
				PostRecoilHorizontalRangeHandRotation:
				{
					x: -2,
					y: 0,
					z: 0
				},
				PostRecoilVerticalRangeHandRotation:
				{
					x: -2,
					y: 1,
					z: 0
				},
				RotationCenter:
				{
					x: 0,
					y: -0,
					z: -0
				},
				RotationCenterNoStock: 
				{
					x: 0.007,
					y: -0.26,
					z: -0.068
				},
				Slots: [
					{
						"_id": "weapon_striker_12_magazine",
						"_mergeSlotWithChildren": false,
						"_name": "mod_magazine",
						"_parent": "weapon_striker_12",
						"_props": {
						"filters": [
							{
								"AnimationIndex": 0,
								"Filter": [
									"mod_magazine_striker_12"
								]
							}
						]
						},
						"_proto": "55d30c394bdc2dae468b4577",
						"_required": true
					},
					{
						"_id": "weapon_striker_12_stock",
						"_mergeSlotWithChildren": false,
						"_name": "mod_stock",
						"_parent": "weapon_striker_12",
						"_props": {
							"filters": [
							{
								"Filter": [
								"mod_stock_foldable_striker_12"
								],
								"Shift": 0
							}
							]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					},
					{
						"_id": "weapon_striker_12_mount",
						"_mergeSlotWithChildren": false,
						"_name": "mod_mount",
						"_parent": "weapon_striker_12",
						"_props": {
							"filters": [
							{
								"Filter": [
								"mod_mount_piccatiny_rail_striker12"
								],
								"Shift": 0
							}
							]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					},
					{
						"_id": "weapon_striker_12_front_sight",
						"_mergeSlotWithChildren": false,
						"_name": "mod_sight_front",
						"_parent": "weapon_striker_12",
						"_props": {
							"filters": [
							{
								"Filter": [
								"mod_front_sight_striker_12"
								],
								"Shift": 0
							}
							]
						},
						"_proto": "55d30c4c4bdc2db4468b457e",
						"_required": false
					}
				],
				Weight: 4.2,
				ammoCaliber: "Caliber12g",
				defAmmo: "560d5e524bdc2d25448b4571",
				defMagType: "mod_magazine_striker_12",
				durabSpawnMax: 100,
				durabSpawnMin: 35,
				weapFireType: ["single"]
			},
			parentId: "5447b6094bdc2dc3278b4567",
			newId: "weapon_striker_12",
			handbookParentId: "5b5f794b86f77409407a7f92",
			handbookPriceRoubles: 23665,
			fleaPriceRoubles: 28775,
			locales: {
				"en": {
					name: "Armsel Striker 12 Gauge Cylinder Shotgun",
                    shortName: "Striker 12",
                    description: "Armsel Striker, also known by its nickname the \"Street Swiper\", was developed Hilton R. Walker, a Zimbabwean (formerly Rhodesian) citizen, in 1981. The shotgun is designed for riot control and combat while featuring a revolving cylinder mechanism. His shotgun became a success and was exported to various parts of the world, despite some drawbacks. The rotary cylinder was bulky, had a long reload time, and the basic action was not without certain flaws."
				}
			}
		}
		customitem.createItemFromClone(striker_12);

		const armsel_mag: NewItemFromCloneDetails= {
			itemTplToClone: "5a7882dcc5856700177af662",
			overrideProperties: {
				Cartridges: [
					{
						"_id": "5a7882dcc5856700177af663",
						"_max_count": 11,
						"_name": "cartridges",
						"_parent": "mod_magazine_striker_12",
						"_props": {
							"filters": [
							{
								"Filter": [
								"560d5e524bdc2d25448b4571",
								"5d6e6772a4b936088465b17c",
								"5d6e67fba4b9361bc73bc779",
								"5d6e6806a4b936088465b17e",
								"5d6e68dea4b9361bcc29e659",
								"5d6e6911a4b9361bd5780d52",
								"5c0d591486f7744c505b416f",
								"58820d1224597753c90aeb13",
								"5d6e68c4a4b9361b93413f79",
								"5d6e68a8a4b9360b6c0d54e2",
								"5d6e68e6a4b9361c140bcfe0",
								"5d6e6869a4b9361c140bcfde",
								"5d6e68b3a4b9361bca7e50b5",
								"5d6e6891a4b9361bd473feea",
								"5d6e689ca4b9361bc8618956",
								"5d6e68d1a4b93622fe60e845",
								"64b8ee384b75259c590fa89b"
								]
							}
							]
						},
						"_proto": "5748538b2459770af276a261"
					}
				],
				ExaminedByDefault: false,
				Ergonomics: -8,
				Weight: 0.01,
				ExamineExperience: 12,
				Prefab:
				{
					path: "assets/weapons/striker12/mod_magazine_striker_12.bundle",
					rcid: ""
				}

			},
			parentId: "5448bc234bdc2d3c308b4569",
			newId: "mod_magazine_striker_12",
			handbookParentId: "5b5f754a86f774094242f19b",
			handbookPriceRoubles: 2584,
			fleaPriceRoubles: 3112,
			locales: {
				"en": {
					name: "Armsel Striker 12-Round Cylinder Magazine",
                    shortName: "12-CM",
                    description: "A big and bulky internal revolving cylinder for the Armsel Striker. It can support up to 12 rounds (1 in chamber + 11 in magazine). It will take a while to reload such thing given the mechanism for it."
				}
			}
		}
		customitem.createItemFromClone(armsel_mag);

		const striker_stock: NewItemFromCloneDetails= {
			itemTplToClone: "56083cba4bdc2de22e8b456f",
			overrideProperties: {
				Ergonomics: -10,
				Weight: 0.33,
				Width: 2,
				Height: 1,
				ExtraSizeRight: 1,
				Recoil: -54,
				ExamineExperience: 12,
				Prefab:
				{
					path: "assets/weapons/striker12/mod_stock_foldable_striker_12.bundle",
					rcid: ""
				},
				ExaminedByDefault: false

			},
			parentId: "55818a594bdc2db9688b456a",
			newId: "mod_stock_foldable_striker_12",
			handbookParentId: "5b5f757486f774093e6cb507",
			handbookPriceRoubles: 2874,
			fleaPriceRoubles: 3100,
			locales: {
				"en": {
					name: "Armsel Striker Metal Stock",
                    shortName: "Striker Stock",
                    description: "A strong and robust metal stock fitted for the Armsel Striker. Provides good recoil control and stabilization, it can be a bit clunky with how long it is."
				}
			}
		}
		customitem.createItemFromClone(striker_stock);

		const armsel_clamp_sight: NewItemFromCloneDetails= {
			itemTplToClone: "5bc09a30d4351e00367fb7c8",
			overrideProperties: {
				Ergonomics: -2,
				Weight: 0.024,
				Width: 1,
				ConflictingItems: [
					"570fd6c2d2720bc6458b457f",
					"570fd79bd2720bc7458b4583",
					"591c4efa86f7741030027726",
					"57ac965c24597706be5f975c",
					"57aca93d2459771f2c7e26db",
					"59db7e1086f77448be30ddf3",
					"5b30b0dc5acfc400153b7124",
					"5b3b6dc75acfc47a8773fb1e",
					"5c0505e00db834001b735073",
					"5c0517910db83400232ffee5",
					"5c064c400db834001d23f468",
					"5c07dd120db834001c39092d",
					"5c0a2cec0db834001b7ce47d",
					"5d1b5e94d7ad1a2b865a96b0",
					"609a63b6e2ff132951242d09",
					"63fc449f5bd61c6cf3784a88"
				],
				Height: 1,
				Prefab:
				{
					path: "assets/weapons/striker12/mod_front_sight_striker_12.bundle",
					rcid: ""
				},
				ExaminedByDefault: false

			},
			parentId: "55818ac54bdc2d5b648b456e",
			newId: "mod_front_sight_striker_12",
			handbookParentId: "5b5f73ec86f774093e6cb4fd",
			handbookPriceRoubles: 885,
			fleaPriceRoubles: 910,
			locales: {
				"en": {
					name: "Armsel Striker Front Sight Clamp",
                    shortName: "Striker Clamp",
                    description: "Front sight that can be clamped on the barrel where the receiver meet."
				}
			}
		}
		customitem.createItemFromClone(armsel_clamp_sight);

		const armsel_rear_sight: NewItemFromCloneDetails= {
			itemTplToClone: "5894a81786f77427140b8347",
			overrideProperties: {
				Ergonomics: -1,
				Weight: 0.018,
				Width: 1,
				Height: 1,
				ConflictingItems: [
					"59db7e1086f77448be30ddf3",
					"5d1b5e94d7ad1a2b865a96b0"
				],
				Prefab:
				{
					path: "assets/weapons/striker12/mod_rear_sight_striker_12.bundle",
					rcid: ""
				},
				ExaminedByDefault: false

			},
			parentId: "55818ac54bdc2d5b648b456e",
			newId: "mod_rear_sight_striker_12",
			handbookParentId: "5b5f73ec86f774093e6cb4fd",
			handbookPriceRoubles: 885,
			fleaPriceRoubles: 910,
			locales: {
				"en": {
					name: "Armsel Striker Rear Sight",
                    shortName: "Striker Rear",
                    description: "Rear sight for the Armsel Striker, requires picatinny rail to be mounted."
				}
			}
		}
		customitem.createItemFromClone(armsel_rear_sight);

		//---MASTERY AND TRADER---
		
		//Global Weapon Preset
		for (const itemPreset in global_preset_file.ItemPresets)
		{
        globals.ItemPresets[itemPreset] = global_preset_file.ItemPresets[itemPreset];
		}

		//Trader Assort
		MC.items.push(...preset_file.items);

		for (const bsc in preset_file.barter_scheme)
		{
			MC.barter_scheme[bsc] = preset_file.barter_scheme[bsc];
		}

		for (const llv in preset_file.loyal_level_items)
		{
			MC.loyal_level_items[llv] = preset_file.loyal_level_items[llv];
		}
		//---For Other tidbits of manipulation---
		db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[0]._props.filters[0].Filter.push("weapon_striker_12");
		db.templates.items["55d7217a4bdc2d86028b456d"]._props.Slots[1]._props.filters[0].Filter.push("weapon_striker_12");		
		/* const usec = db.bots.types["usec"];
		const bear = db.bots.types["bear"];

		usec.inventory.equipment.FirstPrimaryWeapon["weapon_striker_12"] = 5;
		usec.inventory.mods["weapon_striker_12"] =
		{
			mod_stock: ["mod_stock_foldable_striker_12"],
			mod_mount: ["mod_mount_piccatiny_rail_striker12"],
			mod_sight_front: ["mod_front_sight_striker_12"],
			mod_magazine: ["mod_magazine_striker_12"],
			patron_in_weapon: [
				"560d5e524bdc2d25448b4571",
				"5d6e6772a4b936088465b17c",
				"5d6e67fba4b9361bc73bc779",
				"5d6e6806a4b936088465b17e",
				"5d6e68dea4b9361bcc29e659",
				"5d6e6911a4b9361bd5780d52",
				"5c0d591486f7744c505b416f",
				"58820d1224597753c90aeb13",
				"5d6e68c4a4b9361b93413f79",
				"5d6e68a8a4b9360b6c0d54e2",
				"5d6e68e6a4b9361c140bcfe0",
				"5d6e6869a4b9361c140bcfde",
				"5d6e68b3a4b9361bca7e50b5",
				"5d6e6891a4b9361bd473feea",
				"5d6e689ca4b9361bc8618956",
				"5d6e68d1a4b93622fe60e845"
			]
		};
		usec.inventory.mods["mod_mount_piccatiny_rail_striker12"] = 
		{
			mod_scope: [
				"57ac965c24597706be5f975c",
				"57aca93d2459771f2c7e26db",
				"544a3f024bdc2d1d388b4568",
				"544a3a774bdc2d3a388b4567",
				"5d2dc3e548f035404a1a4798",
				"57adff4f24597737f373b6e6",
				"5c0517910db83400232ffee5",
				"591c4efa86f7741030027726",
				"570fd79bd2720bc7458b4583",
				"570fd6c2d2720bc6458b457f",
				"558022b54bdc2dac148b458d",
				"5c07dd120db834001c39092d",
				"5c0a2cec0db834001b7ce47d",
				"58491f3324597764bc48fa02",
				"584924ec24597768f12ae244",
				"5b30b0dc5acfc400153b7124",
				"6165ac8c290d254f5e6b2f6c",
				"60a23797a37c940de7062d02",
				"5d2da1e948f035477b1ce2ba",
				"5c0505e00db834001b735073",
				"609a63b6e2ff132951242d09",
				"584984812459776a704a82a6",
				"59f9d81586f7744c7506ee62",
				"570fd721d2720bc5458b4596",
				"57ae0171245977343c27bfcf",
				"5d1b5e94d7ad1a2b865a96b0",
				"609bab8b455afd752b2e6138",
				"58d39d3d86f77445bb794ae7",
				"616554fe50224f204c1da2aa",
				"5c7d55f52e221644f31bff6a",
				"616584766ef05c2ce828ef57",
				"5b3b6dc75acfc47a8773fb1e",
				"615d8d878004cc50514c3233",
				"577d128124597739d65d0e56",
				"5c064c400db834001d23f468",
				"58d2664f86f7747fec5834f6",
				"5c1cdd302e221602b3137250",
				"61714b2467085e45ef140b2c",
				"5b31163c5acfc400153b71cb",
				"5a33b652c4a28232996e407c",
				"5a33b2c9c4a282000c5a9511",
				"59db7eed86f77461f8380365",
				"5a1ead28fcdbcb001912fa9f",
				"626bb8532c923541184624b4",
				"63fc449f5bd61c6cf3784a88",
				"6477772ea8a38bb2050ed4db",
				"6478641c19d732620e045e17",
				"64785e7c19d732620e045e15"
			],
			mod_sight_rear: [	
				"mod_rear_sight_striker_12",									
				"5bb20e49d4351e3bac1212de",
				"5ba26b17d4351e00367f9bdd",
				"5dfa3d7ac41b2312ea33362a",
				"5c1780312e221602b66cc189",
				"5fb6564947ce63734e3fa1da",
				"5bc09a18d4351e003562b68e",
				"5c18b9192e2216398b5a8104",
				"5fc0fa957283c4046c58147e",
				"5894a81786f77427140b8347",
				"55d5f46a4bdc2d1b198b4567",
				"5ae30bad5acfc400185c2dc4"
			]
		};
		usec.inventory.mods["mod_magazine_striker_12"] = 
		{
			cartridges: [
				"560d5e524bdc2d25448b4571",
				"5d6e6772a4b936088465b17c",
				"5d6e67fba4b9361bc73bc779",
				"5d6e6806a4b936088465b17e",
				"5d6e68dea4b9361bcc29e659",
				"5d6e6911a4b9361bd5780d52",
				"5c0d591486f7744c505b416f",
				"58820d1224597753c90aeb13",
				"5d6e68c4a4b9361b93413f79",
				"5d6e68a8a4b9360b6c0d54e2",
				"5d6e68e6a4b9361c140bcfe0",
				"5d6e6869a4b9361c140bcfde",
				"5d6e68b3a4b9361bca7e50b5",
				"5d6e6891a4b9361bd473feea",
				"5d6e689ca4b9361bc8618956",
				"5d6e68d1a4b93622fe60e845"
			]
		};

		bear.inventory.equipment.FirstPrimaryWeapon["weapon_striker_12"] = 5;
		bear.inventory.mods["weapon_striker_12"] =
		{
			mod_stock: ["mod_stock_foldable_striker_12"],
			mod_mount: ["mod_mount_piccatiny_rail_striker12"],
			mod_sight_front: ["mod_front_sight_striker_12"],
			mod_magazine: ["mod_magazine_striker_12"],
			patron_in_weapon: [
				"560d5e524bdc2d25448b4571",
				"5d6e6772a4b936088465b17c",
				"5d6e67fba4b9361bc73bc779",
				"5d6e6806a4b936088465b17e",
				"5d6e68dea4b9361bcc29e659",
				"5d6e6911a4b9361bd5780d52",
				"5c0d591486f7744c505b416f",
				"58820d1224597753c90aeb13",
				"5d6e68c4a4b9361b93413f79",
				"5d6e68a8a4b9360b6c0d54e2",
				"5d6e68e6a4b9361c140bcfe0",
				"5d6e6869a4b9361c140bcfde",
				"5d6e68b3a4b9361bca7e50b5",
				"5d6e6891a4b9361bd473feea",
				"5d6e689ca4b9361bc8618956",
				"5d6e68d1a4b93622fe60e845"
			]
		};
		bear.inventory.mods["mod_mount_piccatiny_rail_striker12"] = 
		{
			mod_scope: [
				"57ac965c24597706be5f975c",
				"57aca93d2459771f2c7e26db",
				"544a3f024bdc2d1d388b4568",
				"544a3a774bdc2d3a388b4567",
				"5d2dc3e548f035404a1a4798",
				"57adff4f24597737f373b6e6",
				"5c0517910db83400232ffee5",
				"591c4efa86f7741030027726",
				"570fd79bd2720bc7458b4583",
				"570fd6c2d2720bc6458b457f",
				"558022b54bdc2dac148b458d",
				"5c07dd120db834001c39092d",
				"5c0a2cec0db834001b7ce47d",
				"58491f3324597764bc48fa02",
				"584924ec24597768f12ae244",
				"5b30b0dc5acfc400153b7124",
				"6165ac8c290d254f5e6b2f6c",
				"60a23797a37c940de7062d02",
				"5d2da1e948f035477b1ce2ba",
				"5c0505e00db834001b735073",
				"609a63b6e2ff132951242d09",
				"584984812459776a704a82a6",
				"59f9d81586f7744c7506ee62",
				"570fd721d2720bc5458b4596",
				"57ae0171245977343c27bfcf",
				"5d1b5e94d7ad1a2b865a96b0",
				"609bab8b455afd752b2e6138",
				"58d39d3d86f77445bb794ae7",
				"616554fe50224f204c1da2aa",
				"5c7d55f52e221644f31bff6a",
				"616584766ef05c2ce828ef57",
				"5b3b6dc75acfc47a8773fb1e",
				"615d8d878004cc50514c3233",
				"577d128124597739d65d0e56",
				"5c064c400db834001d23f468",
				"58d2664f86f7747fec5834f6",
				"5c1cdd302e221602b3137250",
				"61714b2467085e45ef140b2c",
				"5b31163c5acfc400153b71cb",
				"5a33b652c4a28232996e407c",
				"5a33b2c9c4a282000c5a9511",
				"59db7eed86f77461f8380365",
				"5a1ead28fcdbcb001912fa9f",
				"626bb8532c923541184624b4",
				"63fc449f5bd61c6cf3784a88",
				"6477772ea8a38bb2050ed4db",
				"6478641c19d732620e045e17",
				"64785e7c19d732620e045e15"
			],
			mod_sight_rear: [	
				"mod_rear_sight_striker_12",									
				"5bb20e49d4351e3bac1212de",
				"5ba26b17d4351e00367f9bdd",
				"5dfa3d7ac41b2312ea33362a",
				"5c1780312e221602b66cc189",
				"5fb6564947ce63734e3fa1da",
				"5bc09a18d4351e003562b68e",
				"5c18b9192e2216398b5a8104",
				"5fc0fa957283c4046c58147e",
				"5894a81786f77427140b8347",
				"55d5f46a4bdc2d1b198b4567",
				"5ae30bad5acfc400185c2dc4"
			]
		};
		bear.inventory.mods["mod_magazine_striker_12"] = 
		{
			cartridges: [
				"560d5e524bdc2d25448b4571",
				"5d6e6772a4b936088465b17c",
				"5d6e67fba4b9361bc73bc779",
				"5d6e6806a4b936088465b17e",
				"5d6e68dea4b9361bcc29e659",
				"5d6e6911a4b9361bd5780d52",
				"5c0d591486f7744c505b416f",
				"58820d1224597753c90aeb13",
				"5d6e68c4a4b9361b93413f79",
				"5d6e68a8a4b9360b6c0d54e2",
				"5d6e68e6a4b9361c140bcfe0",
				"5d6e6869a4b9361c140bcfde",
				"5d6e68b3a4b9361bca7e50b5",
				"5d6e6891a4b9361bd473feea",
				"5d6e689ca4b9361bc8618956",
				"5d6e68d1a4b93622fe60e845"
			]
		}; */

		//For next AKi update
		customitem.addCustomWeaponToPMCs("weapon_striker_12", 6, "FirstPrimaryWeapon");
	}
}

module.exports = { mod: new Mod() }