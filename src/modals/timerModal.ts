import { type App, type ButtonComponent, Modal, Setting } from 'obsidian';

export default class TimerModal extends Modal {
  private result: string;
  private title: string;
  private description: string;
  private onSubmit: (result: string) => Promise<void>;

  constructor(
    app: App,
    title: string,
    description: string,
    onSubmit: (result: string) => Promise<void>,
  ) {
    super(app);
    this.title = title;
    this.description = description;
    this.onSubmit = onSubmit;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.createEl('h1', { text: this.title });
    this.addSettings(contentEl);
  }

  addSettings(contentEl: HTMLElement): void {
    new Setting(contentEl)
      .setName(this.createFragment(contentEl))
      .addText((text) => text.onChange((value) => this.updateResult(value)));
    new Setting(contentEl).addButton((button) => this.setButton(button));
  }

  private updateResult(value: string): void {
    this.result = value;
  }

  private createFragment(contentEl: HTMLElement): DocumentFragment {
    const fragment = new DocumentFragment();
    fragment.appendChild(contentEl.createEl('h4', { text: this.description }));
    fragment.appendChild(
      contentEl.createEl('p', { text: '1. In time notation: HH:MM:SS.' }),
    );
    fragment.appendChild(
      contentEl.createEl('p', { text: '2. With letters: 00h00m00s.' }),
    );
    return fragment;
  }

  setButton(button: ButtonComponent): void {
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
