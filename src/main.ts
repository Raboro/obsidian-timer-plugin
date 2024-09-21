import { Plugin, type WorkspaceLeaf } from 'obsidian';
import ChooseFavoriteTimerModal from './modals/chooseFavoriteTimerModal';
import TimerModal from './modals/timerModal';
import {
  DEFAULT_SETTINGS,
  type TimerSettings,
  TimerSettingsTab,
} from './settings/settings';
import Timer from './timer/timer';
import TimerView, { TIMER_VIEW_TYPE } from './views/view';

export default class TimerPlugin extends Plugin {
  settings: TimerSettings;
  statusBarItem: HTMLElement;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.statusBarItem = this.addStatusBarItem();
    this.registerView(
      TIMER_VIEW_TYPE,
      (leaf) => new TimerView(leaf, this.settings, this.statusBarItem),
    );
    this.addRibbonIcon(
      'alarm-clock',
      'Open timer',
      async () => await this.openView(),
    );
    this.addCommands();
    this.addSettingTab(new TimerSettingsTab(this.app, this));
  }

  private addCommands(): void {
    this.addCommand({
      id: 'open-timer',
      name: 'Open timer',
      callback: async () => await this.openView(),
    });
    this.addCommand({
      id: 'set-timer-to',
      name: 'Set timer to',
      callback: async () => await this.setTimerTo(),
    });
    this.addCommand({
      id: 'add-favorite-timer',
      name: 'Add favorite timer',
      callback: async () => await this.addFavoriteTimer(),
    });
    this.addCommand({
      id: 'use-one-of-favorite-timers',
      name: 'Use one of favorite timers',
      callback: async () => await this.useOneOfFavoriteTimers(),
    });
    this.addCommand({
      id: 'remove-one-of-favorite-timers',
      name: 'Remove one of favorite timers',
      callback: async () => await this.removeOneOfFavoriteTimers(),
    });
  }

  private async openView(): Promise<void> {
    const leaves: WorkspaceLeaf[] =
      this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
    const leafView = await this.getLeafView();
    if (leaves.length !== 0) {
      this.app.workspace.revealLeaf(leaves[0]);
    } else if (leafView) {
      this.app.workspace.revealLeaf(leafView);
    }
  }

  private async getLeafView(): Promise<WorkspaceLeaf | null> {
    const leaf = this.app.workspace.getRightLeaf(false);
    if (leaf) {
      await leaf.setViewState({ type: TIMER_VIEW_TYPE });
    }
    return leaf;
  }

  private setTimerTo = async () => {
    new TimerModal(
      this.app,
      'Set timer to',
      'Insert new timer in two ways:',
      async (result: string) => {
        await this.reload(Timer.set(result));
      },
    ).open();
  };

  private async reload(timer?: Timer): Promise<void> {
    const leaves: WorkspaceLeaf[] =
      this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
    if (leaves.length === 0) return;
    const view = leaves[0].view as TimerView;
    if (timer) await view.updateTimer(timer);
    else await view.updateSettings(this.settings);
  }

  private addFavoriteTimer = async () => {
    new TimerModal(
      this.app,
      'Add favorite timer',
      'Add another favorite timer in two ways: ',
      async (result: string) => {
        const newFavoriteTimer = Timer.set(result);
        if (
          !this.settings.favoriteTimers.contains(newFavoriteTimer.toString())
        ) {
          this.settings.favoriteTimers.push(newFavoriteTimer.toString());
          await this.saveSettings();
        }
      },
    ).open();
  };

  private useOneOfFavoriteTimers = async () => {
    new ChooseFavoriteTimerModal(
      this.app,
      this.settings.favoriteTimers,
      async (result: string) => {
        await this.reload(Timer.set(result));
      },
    ).open();
  };

  private removeOneOfFavoriteTimers = async () => {
    new ChooseFavoriteTimerModal(
      this.app,
      this.settings.favoriteTimers,
      async (result: string) => {
        this.settings.favoriteTimers.remove(result);
        await this.saveSettings();
      },
    ).open();
  };

  async loadSettings(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    await this.reload();
  }
}
