import { ItemView } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import TimerUi from 'src/ui/timerUi';

export const TIMER_VIEW_TYPE = 'Timer';

export default class TimerView extends ItemView {
    private container: HTMLDivElement;
    private root: Root;
    icon = 'alarm-clock';

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
        this.root.render(
            <React.StrictMode>
                <TimerUi />
            </React.StrictMode>
        );
    }

    protected async onClose(): Promise<void> {
        this.root.unmount();
    }

}