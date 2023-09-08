import { Plugin, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, TimerSettings, TimerSettingsTab } from './settings/settings';
import TimerView, { TIMER_VIEW_TYPE } from './views/view';
import SetTimerModal from './modals/setTimerModal';
import Timer from './timer/timer';
import AddFavoriteTimerModal from './modals/addFavoriteTimerModal';
import ChooseFavoriteTimerModal from './modals/chooseFavoriteTimerModal';

export default class TimerPlugin extends Plugin {
    settings: TimerSettings;
    timer: Timer;
    
    async onload() {
        await this.loadSettings();
        this.registerView(TIMER_VIEW_TYPE, (leaf) => new TimerView(leaf, this.settings.timerButtonsSettings));
        this.addRibbonIcon('alarm-clock', 'Open Timer', async () => await this.openView());
        this.addCommands();
        this.addSettingTab(new TimerSettingsTab(this.app, this));
    }

    private addCommands() {
        this.addCommand({
            id: 'open-timer',
            name: 'Open Timer',
            callback: async () => await this.openView()
        });
        this.addCommand({
            id: 'set-timer-to',
            name: 'Set Timer To',
            callback: async () => await this.setTimerTo()
        });
        this.addCommand({
            id: 'add-favorite-timer',
            name: 'Add Favorite Timer',
            callback: async () => await this.addFavoriteTimer()
        });
        this.addCommand({
            id: 'use-one-of-favorite-timers',
            name: 'Use One Of Favorite Timers',
            callback: async () => await this.useOneOfFavoriteTimers()
        });
        this.addCommand({
            id: 'remove-one-of-favorite-timers',
            name: 'Remove One Of Favorite Timers',
            callback: async () => await this.removeOneOfFavoriteTimers()
        });
    }

    onunload() {

    }

    private async openView(): Promise<void> {
        const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
        await this.getView(leaves);
        this.app.workspace.revealLeaf(leaves[0]);
    }

    private async getView(leaves: WorkspaceLeaf[]): Promise<TimerView> {
		if (leaves.length == 0) {
			leaves[0] = this.app.workspace.getRightLeaf(false);
			await leaves[0].setViewState({type: TIMER_VIEW_TYPE});
		}
		return leaves[0].view as TimerView;
	}

    private setTimerTo = async () => {
        new SetTimerModal(this.app, async (result: string) => {
            this.timer = Timer.set(result);
            this.reload(false);
        }).open();
    };    

    private async reload(updatedSettings: boolean): Promise<void> {
        const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
        if (leaves.length == 0) return;
        const view = (leaves[0].view as TimerView);
        if (updatedSettings) await view.updateSettings(this.settings.timerButtonsSettings);
        else await view.updateTimer(this.timer);
    }

    private addFavoriteTimer = async () => {
        new AddFavoriteTimerModal(this.app, async (result: string) => {
            const newFavoriteTimer = Timer.set(result);
            if (!this.settings.favoriteTimers.contains(newFavoriteTimer.toString())) {
                this.settings.favoriteTimers.push(newFavoriteTimer.toString());
                this.saveSettings();
            }
        }).open();
    }

    private useOneOfFavoriteTimers = async () => {
        new ChooseFavoriteTimerModal(this.app, this.settings.favoriteTimers, async (timer: string) => {
            this.timer = Timer.set(timer);
            this.reload(false);
        }).open();
    }

    private removeOneOfFavoriteTimers = async () => {
        new ChooseFavoriteTimerModal(this.app, this.settings.favoriteTimers, async (timer: string) => {
            this.settings.favoriteTimers.remove(timer);
            this.saveSettings();
        }).open();
    }

    async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
        this.reload(true);
	}
}