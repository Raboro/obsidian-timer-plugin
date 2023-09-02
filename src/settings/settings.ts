import { App, PluginSettingTab, Setting } from 'obsidian';
import TimerPlugin from 'src/main';

export class TimerButtonsSettings {
    [key: string]: string

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
        this.changeTimerButtonSetting = this.changeTimerButtonSetting.bind(this);
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
            .setName(`${i} position`)
            .setDesc(`Select the timer jump for the ${i} element`)
            .addText(text => text
                .setPlaceholder('Enter value')
                .setValue(this.getValue(i))
                .onChange(async value => await this.changeTimerButtonSetting(value, i)));
    }

    private getValue(index: number): string {
        const settings = this.plugin.settings.timerButtonsSettings;
        return [settings.first, settings.second, settings.third, settings.fourth][index];
    }

    private async changeTimerButtonSetting(value: string, index: number) {
        const properties = ['first', 'second', 'third', 'fourth'];
        this.plugin.settings.timerButtonsSettings[properties[index]] = value;
        await this.plugin.saveSettings();
    }
}