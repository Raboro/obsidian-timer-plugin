import { App, FuzzySuggestModal } from "obsidian"

export default class ChooseFavoriteTimerModal extends FuzzySuggestModal<string> {
    private timers: string[];
    private onSubmit: (timer: string) => Promise<void>;

    constructor(app: App, timers: string[], onSubmit: (result: string) => Promise<void>) {
        super(app);
        this.timers = timers;
        this.onSubmit = onSubmit;
    }

    getItems(): string[] {
        return this.timers;
    }

    getItemText(item: string): string {
        return item;
    }

    onChooseItem(item: string, evt: MouseEvent | KeyboardEvent): void {
        this.onSubmit(item);
    }
   
}