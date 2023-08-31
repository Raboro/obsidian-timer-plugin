import { PluginSettingTab } from 'obsidian';

export interface TimerSettings {
    example: string;
}

export const DEFAULT_SETTINGS: TimerSettings = {
    example: ''
}; 

export class TimerSettingsTab extends PluginSettingTab {
    
    display() {

    }
    
}