import { App, ButtonComponent, Modal, Setting } from 'obsidian';

export default class SetTimerModal extends Modal {
    private result: string;
    private onSubmit: (result: string) => Promise<void>;

    constructor(app: App, onSubmit: (result: string) => Promise<void>) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.createEl('h1', { text: 'Set timer to:' });
        this.addSettings(contentEl);
    }

    private addSettings(contentEl: HTMLElement): void {
        new Setting(contentEl)
            .setName(this.createFragment(contentEl))
            .addText(text => text.onChange(value => this.result = value));
        new Setting(contentEl).addButton(button => this.setButton(button));
    }

    private createFragment(contentEl: HTMLElement): DocumentFragment {
        const fragment = new DocumentFragment();
        fragment.appendChild(contentEl.createEl('h4', { text: 'Insert new timer in two ways:' }));
        fragment.appendChild(contentEl.createEl('p', { text: '1. In time notation: HH:MM:SS.' }));
        fragment.appendChild(contentEl.createEl('p', { text: '2. With letters: 00h00m00s.' }));
        return fragment;
    }

    private setButton(button: ButtonComponent): void {
        button
            .setButtonText('Submit')
            .setCta()
            .onClick(() => {
                this.close();
                this.onSubmit(this.result);
            });
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}