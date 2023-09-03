import { Plugin, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, TimerSettings, TimerSettingsTab } from './settings/settings';
import TimerView, { TIMER_VIEW_TYPE } from './views/view';


export default class TimerPlugin extends Plugin {
    settings: TimerSettings;

    
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
            callback: () => {console.log('Need to be implemented')} // TODO need to be implemented with Model
        });
    }

    onunload() {

    }

    async openView(): Promise<void> {
        const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
        await this.getView(leaves);
        this.app.workspace.revealLeaf(leaves[0]);
    }

    async getView(leaves: WorkspaceLeaf[]): Promise<TimerView> {
		if (leaves.length == 0) {
			leaves[0] = this.app.workspace.getRightLeaf(false);
			await leaves[0].setViewState({type: TIMER_VIEW_TYPE});
		}
		return leaves[0].view as TimerView;
	}

    async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
        const leaves: WorkspaceLeaf[] = this.app.workspace.getLeavesOfType(TIMER_VIEW_TYPE);
        if (leaves.length == 0) {
            return;
        }
        const view = leaves[0].view as TimerView;
        await view.updateSettings(this.settings.timerButtonsSettings);
	}
}