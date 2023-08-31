import { PluginSettingTab } from 'obsidian';

export interface MyPluginSettings {
    // insert settings
    example: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
    example: ''
}; 

export class MyPluginSettingsTab extends PluginSettingTab {
    
    display() {

    }
    
}