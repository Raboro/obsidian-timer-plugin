import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_SETTINGS, TimerButtonsSettings } from 'src/settings/settings';
import Timer from 'src/timer/timer';
import TimerUi from 'src/ui/timerUi';

export const TIMER_VIEW_TYPE = 'Timer';

export const TimerButtonsSettingsContext= React.createContext(DEFAULT_SETTINGS.timerButtonsSettings);

export default class TimerView extends ItemView {
    private container: HTMLDivElement;
    private root: Root;
    private timerButtonsSettings: TimerButtonsSettings;
    private timer: Timer;
    icon = 'alarm-clock';

    constructor(leaf: WorkspaceLeaf, timerButtonsSettings: TimerButtonsSettings) {
        super(leaf);
        this.timerButtonsSettings = timerButtonsSettings;
    }

    async updateTimer(timer: Timer): Promise<void> {
        this.timer = timer;
        await this.reload(false);
    }

    private async reload(updatedSettings: boolean) {
        await this.onClose();
        this.root = createRoot(this.container);
        this.renderRoot(updatedSettings);
    }

    async updateSettings(timerButtonsSettings: TimerButtonsSettings) {
        this.timerButtonsSettings = timerButtonsSettings;
        await this.reload(true);
    }

    private renderRoot(updatedSettings: boolean) {
        this.root.render(
            <React.StrictMode>
                <TimerButtonsSettingsContext.Provider value={this.timerButtonsSettings}>
                    <TimerUi timerInput={this.timer} updatedSettings={updatedSettings}/>
                </TimerButtonsSettingsContext.Provider>
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