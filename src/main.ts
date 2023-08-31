import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, TimerSettings } from './settings/settings';


export default class TimerPlugin extends Plugin {
    settings: TimerSettings;

    
    async onload() {
        await this.loadSettings();
    }

    onunload() {

    }

    async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}