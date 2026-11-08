// MenuSystem: entry points for every menu screen.

import { MainMenu } from './menu/MainMenu.js';
import { CrestScreen, SupportScreen } from './menu/CrestScreen.js';
import { ArtsScreen } from './menu/ArtsScreen.js';
import { EquipScreen } from './menu/EquipScreen.js';
import { ItemsScreen, StatusScreen, FormationScreen, SettingsScreen, BestiaryScreen, JournalScreen, GuideScreen } from './menu/screens.js';
import { SaveScreen } from './menu/SaveScreen.js';
import { ShopScreen } from './menu/ShopScreen.js';

const SCREENS = {
  items: ItemsScreen,
  crests: CrestScreen,
  arts: ArtsScreen,
  supports: SupportScreen,
  equip: EquipScreen,
  status: StatusScreen,
  formation: FormationScreen,
  settings: SettingsScreen,
  bestiary: BestiaryScreen,
  journal: JournalScreen,
  guide: GuideScreen,
};

export class MenuSystem {
  constructor(game) { this.game = game; }

  screen(id, ...args) { return new SCREENS[id](this, ...args); }

  async openMain(field) {
    this.game.audio?.sfx('confirm');
    field?.pause?.();
    await new MainMenu(this, field).open();
    field?.resumeHud?.();
  }

  openShop(shopId) { return new ShopScreen(this, shopId).open(); }
  openSave() { return new SaveScreen(this, 'save').open(); }
  openLoad() { return new SaveScreen(this, 'load').open(); }
}
