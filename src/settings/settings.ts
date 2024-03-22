import { App, Notice, PluginSettingTab, Setting } from 'obsidian';
import TimerPlugin from 'src/main';

export class TimerButtonsSettings {
    [key: string]: string;

    constructor(public first: string, public second: string, public third: string, public fourth: string) {}
}

export interface TimerSettings {
    timerButtonsSettings: TimerButtonsSettings;
    favoriteTimers: string[];
    stackTimerButtons: boolean;
    useVerboseTimeFormatT: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    timerButtonsSettings: new TimerButtonsSettings('1s', '1m', '10m', '1h'),
    favoriteTimers: [],
    stackTimerButtons: false,
    useVerboseTimeFormatT: false,
};

export class TimerSettingsTab extends PluginSettingTab {
    private plugin: TimerPlugin;

    constructor(app: App, plugin: TimerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
        this.changeTimerButtonSetting = this.changeTimerButtonSetting.bind(this);
    }

    display(): void {
        this.containerEl.empty();
        this.timerButtonsSettings();
        this.stackButtonSettings();
        this.useVerboseTimeFormatSettings();
    }

    private timerButtonsSettings(): void {
        for (let i = 0; i < 4; i++) {
            this.constructTimerButtonSetting(i);
        }
    }

    private constructTimerButtonSetting(i: number): Setting {
        return new Setting(this.containerEl)
            .setName(`${i+1} timer button value`)
            .setDesc(`Set the value which increases / decreases the timer if clicking on the ${i+1} timer button. 
                      The value contains a number followed by seconds(type s) or minutes(type m) or hours(type h) & number 
                      must be greater than 0.`)
            .addText(text => text
                .setPlaceholder('Enter value')
                .setValue(this.getValue(i))
                .onChange(async value => await this.changeTimerButtonSetting(value, i)));
    }

    private getValue(index: number): string {
        const settings = this.plugin.settings.timerButtonsSettings;
        return [settings.first, settings.second, settings.third, settings.fourth][index];
    }

    private async changeTimerButtonSetting(value: string, index: number): Promise<void> {
        if (this.isInvalidValue(value)) {
            new Notice('Invalid value');
            return;
        }
        await this.updateTimerButtonSetting(value, index);
    }

    private isInvalidValue(value: string): boolean {
        if (value.length == 0) return true;
        const invalidLastChar = !['s', 'm', 'h'].contains(value.charAt(value.length-1));
        const invalidPrefix = !/^\d+$/.test(value.slice(0, value.length-1));
        const valueTooLow = parseInt(value.slice(0, value.length-1)) <= 0;
        return invalidLastChar || invalidPrefix || valueTooLow;
    }

    private async updateTimerButtonSetting(value: string, index: number): Promise<void> {
        const properties = ['first', 'second', 'third', 'fourth'];
        this.plugin.settings.timerButtonsSettings[properties[index]] = value;
        await this.plugin.saveSettings();
    }

    private stackButtonSettings(): void {
        new Setting(this.containerEl)
            .setName('Stack timer buttons')
            .setDesc('If enabled, the timer increment buttons will be stacked on top of the timer decrement buttons. If disabled, the timer increment buttons will be placed to the right of the timer decrement buttons.')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.stackTimerButtons)
                .onChange(async value => {
                    this.plugin.settings.stackTimerButtons = value;
                    await this.plugin.saveSettings();
                })
            );
    }

    private useVerboseTimeFormatSettings(): void {
        new Setting(this.containerEl)
            .setName('Use verbose time format')
            .setDesc('If enabled, the timer display will be in the format of "1h 2m 3s" instead of "01:02:03".')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.useVerboseTimeFormatT)
                .onChange(async value => {
                    this.plugin.settings.useVerboseTimeFormatT = value;
                    await this.plugin.saveSettings();
                })
            );
    }
}