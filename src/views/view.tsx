import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_SETTINGS, TimerSettings } from 'src/settings/settings';
import Timer from 'src/timer/timer';
import TimerUi from 'src/ui/timerUi';

export const TIMER_VIEW_TYPE = 'Timer';

export const TimerSettingsContext = React.createContext(DEFAULT_SETTINGS);

export default class TimerView extends ItemView {
    private container: HTMLDivElement;
    private root: Root;
    private timerSettings: TimerSettings;
    private timer: Timer;
    private statusBarItem: HTMLElement;
    icon = 'alarm-clock';

    constructor(leaf: WorkspaceLeaf, timerSettings: TimerSettings, statusBarItem: HTMLElement) {
        super(leaf);
        this.timerSettings = timerSettings;
        this.statusBarItem = statusBarItem;
    }

    async updateTimer(timer: Timer): Promise<void> {
        this.timer = timer;
        await this.reload(false);
    }

    private async reload(updatedSettings: boolean): Promise<void> {
        await this.onClose();
        this.root = createRoot(this.container);
        this.renderRoot(updatedSettings);
    }

    async updateSettings(timerSettings: TimerSettings): Promise<void> {
        this.timerSettings = timerSettings;
        await this.reload(true);
    }

    private renderRoot(updatedSettings: boolean): void {
        this.root.render(
            <React.StrictMode>
                <TimerSettingsContext.Provider value={this.timerSettings}>
                    <TimerUi
                        timerInput={this.timer}
                        updatedSettings={updatedSettings}
                        statusBarItem={this.statusBarItem}
                        useOsNotification={this.timerSettings.useOSNotification} />
                </TimerSettingsContext.Provider>
            </React.StrictMode>
        );
    }

    getViewType(): string {
        return TIMER_VIEW_TYPE;
    }

    getDisplayText(): string {
        return TIMER_VIEW_TYPE;
    }

    protected async onOpen(): Promise<void> {
        const { contentEl } = this;
        contentEl.createEl('h1', {text: 'Timer'});  
        this.container = contentEl.createDiv({cls: 'timerContainer'});
        if (!this.root) {
            this.root = createRoot(this.container);
        }
        this.renderRoot(false);
    }

    protected async onClose(): Promise<void> {
        this.root.unmount();
    }
}
