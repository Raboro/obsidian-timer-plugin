import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import { DEFAULT_SETTINGS, TimerButtonsSettings } from 'src/settings/settings';
import TimerUi from 'src/ui/timerUi';

export const TIMER_VIEW_TYPE = 'Timer';

export const TimerButtonsSettingsContext= React.createContext(DEFAULT_SETTINGS.timerButtonsSettings);

export default class TimerView extends ItemView {
    private container: HTMLDivElement;
    private root: Root;
    private timerButtonsSettings: TimerButtonsSettings;
    icon = 'alarm-clock';

    constructor(leaf: WorkspaceLeaf, timerButtonsSettings: TimerButtonsSettings) {
        super(leaf);
        this.timerButtonsSettings = timerButtonsSettings;
    }

    async updateSettings(timerButtonsSettings: TimerButtonsSettings) {
        this.timerButtonsSettings = timerButtonsSettings;
        await this.onClose();
        this.root = createRoot(this.container);
        this.renderRoot();
    }

    private renderRoot() {
        this.root.render(
            <React.StrictMode>
                <TimerButtonsSettingsContext.Provider value={this.timerButtonsSettings}>
                    <TimerUi />
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
        this.container = contentEl.createDiv({cls: 'clockContainer'});
        if (!this.root) {
            this.root = createRoot(this.container);
        }
        this.renderRoot();
    }

    protected async onClose(): Promise<void> {
        this.root.unmount();
    }

}