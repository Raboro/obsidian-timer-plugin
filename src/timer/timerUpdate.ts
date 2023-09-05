export default class TimerUpdate {
    private timeUnit: string;
    private updateValue: string;
    private current: number;

    constructor(update: string, current: number) {
        this.timeUnit = update.charAt(update.length-1);
        this.updateValue = update.substring(0, update.length-1);
        this.current = current;
    }

    isValid(): boolean {
        const INVALID_CHARACTERS: string[] = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 
                                      'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z', '|',
                                      ':', ',', ';'];
        const noInvalidChars = !INVALID_CHARACTERS.some(char => {
            this.updateValue.contains(char) || this.updateValue.contains(char.toLowerCase());
        })
        return noInvalidChars && ['h', 'm', 's'].some(unit => unit === this.timeUnit);
    }

    isReset(): boolean {
        return this.updateValue.contains('-') && this.updateIsBigger();
    }

    private updateIsBigger(): boolean {
        return (this.getUpdateAsInt() - this.current) >= 0;
    }

    private getUpdateAsInt(): number {
        return parseInt(this.updateValue.replace('-', '') + '0'.repeat(this.determineShift() ?? 0));
    }

    private determineShift(): number | undefined {
        return { 's': 0, 'm': 2, 'h': 4 }[this.timeUnit];
    }

    isTooBig(): boolean {
        const prefix = this.updateValue.contains('-') ? -1 : 1;
        return (prefix * this.getUpdateAsInt() + this.current - 995959) >= 0;
    }

    inSeconds(): boolean {
        return this.timeUnit.contains('s');
    }

    inMinutes(): boolean {
        return this.timeUnit.contains('m');
    }

    getValue(): string {
        return this.updateValue;
    }
}