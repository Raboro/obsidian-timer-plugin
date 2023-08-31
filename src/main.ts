import { Plugin, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, TimerSettings } from './settings/settings';
import TimerView, { TIMER_VIEW_TYPE } from './views/view';


export default class TimerPlugin extends Plugin {
    settings: TimerSettings;

    
    async onload() {
        await this.loadSettings();
        this.registerView(TIMER_VIEW_TYPE, (leaf) => new TimerView(leaf));
        this.registerEvent(this.app.workspace.on('layout-change',async () => {
            await this.openView();
        }));
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
	}
}