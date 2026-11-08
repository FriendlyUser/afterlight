// The party's mount: Kindle, an Emberhart — a great hart whose antlers carry embers
// of the old Hearthsun. Met in the Whisperwold's Hollow in Act I (story/mount.js);
// after the Sundering it finds Wren in the ash of Lanternfall either way.
//
// Riding (world/FieldScene.js, Ride key): only on open roads and wilds (RIDE_MAPS),
// faster than running, and no random encounters — the Gloam's things scatter from the
// light. Towns, interiors, dungeons and cutscenes put you back on foot; riding carries
// on across route exits. The world map shows Kindle carrying you to your destination.

export const MOUNT = {
  name: 'Kindle',
  kind: 'Emberhart',
  /** Owning flag, and the key item that explains the Ride key. */
  flag: 'mount_kindle',
  item: 'kindle_ember',
  /** Field speed in tiles per second (walking 3.9, running 6.4). */
  speed: 9.5,
};

/** Maps where Kindle can be called: the routes and wilds between places. */
export const RIDE_MAPS = new Set([
  // Act I
  'c2_gale_road', 'c2_wold_outer', 'c2_wold_heart', 'c2_td_fields', 'side_moor', 'side_obs_shore',
  'sunscar_road', 'c4a_dunes', 'c4a_greyspine_pass', 'mirefen_road', 'c4b_drownmere', 'c4b_thornwood', 'c4b_stormfoot',
  // Act II
  'c6_drift', 'c6_shattered_sea', 'c9_boneyard', 'side_ashen_reach',
  // Act III: the open shards the Halcyon sets down on
  'c11_saltglass', 'c11_frosthollow', 'c11_mirefen', 'c11_thornwood', 'c11_skyreach', 'c11_reef', 'c11_scrapfall',
]);

/** @param {import('../state/GameState.js').GameState} st */
export const hasMount = (st) => !!st.flags[MOUNT.flag];

/** Kindle may be ridden on this map. @param {{ id: string, solo?: boolean }} map */
export const rideable = (map) => RIDE_MAPS.has(map.id) && !map.solo;

/** The field look for a leader riding Kindle (render/MountFactory.js paints it). */
export const mountLook = (rider) => ({ id: `mount:${rider.id}`, kind: 'mount', rider });

/** Kindle on its own, standing in the field (an NPC). */
export const HART_LOOK = { id: 'mount:none', kind: 'mount', rider: null };
