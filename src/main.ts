import { Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings } from './settings/settings';


export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;

    
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