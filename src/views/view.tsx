import { ItemView } from 'obsidian';
import { Root } from 'react-dom/client';

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
        this.container = contentEl.createDiv();
    }

    protected async onClose(): Promise<void> {
        if (this.root) {
            this.root.unmount();
        }
    }

}