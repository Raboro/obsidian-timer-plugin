import { PluginSettingTab } from 'obsidian';

export class TimerButtonsSettings {
    constructor(
        readonly first: string,
        readonly second: string,
        readonly third: string,
        readonly fourth: string) {}
}

export interface TimerSettings {
    timerButtonsSettings: TimerButtonsSettings;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    timerButtonsSettings: new TimerButtonsSettings('1s', '1m', '10m', '1h')
}; 

export class TimerSettingsTab extends PluginSettingTab {
    
    display() {

    }
    
}