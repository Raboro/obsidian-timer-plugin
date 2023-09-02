import { App, PluginSettingTab, Setting } from 'obsidian';
import TimerPlugin from 'src/main';

export class TimerButtonsSettings {
    first: string;
    second: string;
    third: string;
    fourth: string;

    constructor(first: string, second: string, third: string, fourth: string) {
            this.first = first;
            this.second = second;
            this.third = third;
            this.fourth = fourth;
    }
}

export interface TimerSettings {
    timerButtonsSettings: TimerButtonsSettings;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    timerButtonsSettings: new TimerButtonsSettings('1s', '1m', '10m', '1h')
}; 

export class TimerSettingsTab extends PluginSettingTab {
    private plugin: TimerPlugin;

    constructor(app: App, plugin: TimerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    
    display() {
        this.containerEl.empty();
        this.timerButtonsSettings();
    }

    private timerButtonsSettings() {
        for (let i = 0; i < 4; i++) {
            this.constructTimerButtonSetting(i);
        } 
    }

    private constructTimerButtonSetting(i: number) {
        return new Setting(this.containerEl)
        .setName(i + ' position')
        .setDesc('Select the timer jump for the ' + i + ' element')
        .addText(text => text
            .setPlaceholder('Enter value')
            .setValue(this.getValue(i))
            .onChange(async value => await this.changeTimerButtonSetting(value, i)));
    }

    private getValue(index: number): string {
        switch (index) {
            case 0:
                return this.plugin.settings.timerButtonsSettings.first;
            case 1:
                return this.plugin.settings.timerButtonsSettings.second;
            case 2:
                return this.plugin.settings.timerButtonsSettings.third;
            case 3:
                return this.plugin.settings.timerButtonsSettings.fourth;
        }
        return '';
    }

    private changeTimerButtonSetting = async (value: string, index: number) => {
        switch (index) {
            case 0:
                this.plugin.settings.timerButtonsSettings.first = value;
                break;
            case 1:
                this.plugin.settings.timerButtonsSettings.second = value;
                break;
            case 2:
                this.plugin.settings.timerButtonsSettings.third = value;
                break;
            case 3:
                this.plugin.settings.timerButtonsSettings.fourth = value;
        }
        await this.plugin.saveSettings();
    };
    
}