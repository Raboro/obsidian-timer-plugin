import { App, ButtonComponent, Modal, Setting } from "obsidian";

export default class SetTimerModal extends Modal {
    private result: string;
    private onSubmit: (result: string) => void;

    constructor(app: App, onSubmit: (result: string) => void) {
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
            .setName('New time')
            .addText(text => text.onChange(value => this.result = value));
        new Setting(contentEl).addButton(button => this.setButton(button))
    }

    private setButton(button: ButtonComponent) {
        button
            .setButtonText('Submit')
            .setCta()
            .onClick(() => {
                this.close();
                this.onSubmit(this.result);
            })
    }

    onClose(): void {
        const { contentEl } = this;
        contentEl.empty();
    }
}