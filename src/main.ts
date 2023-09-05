import { Plugin, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, TimerSettings, TimerSettingsTab } from './settings/settings';
import TimerView, { TIMER_VIEW_TYPE } from './views/view';
import SetTimerModal from './modals/setTimerModal';
import Timer from './timer/timer';

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
            this.reload();
        }).open();
    };    

    private async reload(): Promise<void> {
        const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
        if (leaves.length != 0) await (leaves[0].view as TimerView).updateTimer(this.timer);
    }

    async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
        this.reload();
	}
}