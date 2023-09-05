const INVALID_CHARACTERS: string[] = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 
                                      'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z', '|',
                                      ':', ',', ';'];

export default class Timer {
    private static readonly HOUR_MAX: number = 99;
    private static readonly MINUTES_MAX: number = 59;
    private static readonly SECONDS_MAX: number = 59;

    private hours: string;
    private minutes: string;
    private seconds: string;

    constructor(timer?: Timer, splitted?: string[]) {
        if (splitted) this.setValues(splitted);
        else this.initValues(timer);
    }

    private setValues(splitted: string[]): void {
        this.hours = splitted[0];
        this.minutes = splitted[1];
        this.seconds = splitted[2];
    }

    private initValues(timer?: Timer) {
        this.hours = timer?.hours ?? '00';
        this.minutes = timer?.minutes ?? '00';
        this.seconds = timer?.seconds ?? '00';
    }

    static set(result: string): Timer {
        return this.containsChar(result) ? this.setContainsChar(result) : this.setWithoutChar(result);
    }

    private static containsChar(result: string) {
        return (['s', 'm', 'h'].some(char => result.contains(char)));
    }

    private static setContainsChar(result: string): Timer {
        const matches = result.match(/(\d+[smh]?)/g);
        const timer = new Timer();
        matches?.filter(match => this.validUpdate(match)).forEach(match => timer.updateTimer(match));
        return timer;
    }

    private static validUpdate(match: string): boolean {
        const timerUpdate = new TimerUpdate(match, 0);
        return timerUpdate.isValid() && !timerUpdate.isTooBig();
    }

    private static setWithoutChar(result: string): Timer {
        const splitted = result.split(':');
        while (splitted.length < 3) {
            splitted.unshift('00');
        }
        return this.validSplitted(splitted) ? new Timer(undefined, splitted) : new Timer();
    }

    private static validSplitted(splitted: string[]): boolean {
        const oneNoNumber = splitted.filter(split => !this.containsInvalidChar(split)).length < 3;
        return (oneNoNumber) ? false : this.allNotTooBig(splitted);
    }

    private static containsInvalidChar(split: string): boolean {
        return INVALID_CHARACTERS.some(char => {
            return split.contains(char) || split.contains(char.toLowerCase());
        });
    }

    private static allNotTooBig(splitted: string[]) {
        return parseInt(splitted[0]) <= this.HOUR_MAX && parseInt(splitted[1]) <= this.MINUTES_MAX && 
               parseInt(splitted[2]) <= this.SECONDS_MAX;
    }

    updateTimer(update: string): void {
        const timerUpdate: TimerUpdate = new TimerUpdate(update, this.getCurrentAsInt());
        if (timerUpdate.isReset()) this.initValues();
        else if (timerUpdate.isTooBig()) this.setMaxValue();
        else this.update(timerUpdate);
    }

    private getCurrentAsInt(): number {
        return parseInt(this.toString().replace(':', '').replace(':', ''));
    }

    private setMaxValue(): void {
        this.hours = Timer.HOUR_MAX.toString();
        this.minutes = Timer.MINUTES_MAX.toString();
        this.seconds = Timer.SECONDS_MAX.toString();
    }

    private update(timerUpdate: TimerUpdate): void {
        if (timerUpdate.inSeconds()) this.updateSeconds(timerUpdate.getValue());
        else if (timerUpdate.inMinutes()) this.updateMinutes(timerUpdate.getValue());
        else this.updateHour(timerUpdate.getValue());
    }

    private updateSeconds(updatedValue: string): void {
        const mergedValue = this.merge(updatedValue, this.seconds);
        if (this.validNewValue(mergedValue, Timer.SECONDS_MAX)) {
            this.seconds = mergedValue;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            if (this.updateMinutes(this.getUpdateForNext(negative, mergedValue, Timer.SECONDS_MAX))) {
                this.seconds = this.getUpdateForCurrent(negative, mergedValue, Timer.SECONDS_MAX);     
            }
        }
    }

    private merge(first: string, second: string): string {
        const value = (parseInt(first) + parseInt(second)).toString();
        return this.betweenZeroAndTen(value) ? '0'.concat(value): value;
    }

    private validNewValue(mergedValue: string, max: number): boolean {
        return parseInt(mergedValue) <= max && parseInt(mergedValue) >= 0;
    }

    private betweenZeroAndTen(value: string): boolean {
        return parseInt(value) < 10 && parseInt(value) >= 0;
    }

    private getUpdateForNext(negative: boolean, mergedValue: string, max: number): string {
        return negative ? '-1': ((parseInt((parseInt(mergedValue) / max).toString())).toString());
    }

    private getUpdateForCurrent(negative: boolean, mergedValue: string, max: number): string {
        const mod = parseInt(mergedValue) % max;
        const merged = this.merge('00', (mod - (negative ? 0 : 1)).toString());
        if (negative) return (max + 1 + parseInt(merged)).toString(); 
        else return merged;
    }

    private updateMinutes(updatedValue: string): boolean {
        const mergedValue = this.merge(updatedValue, this.minutes);
        if (this.validNewValue(mergedValue, Timer.MINUTES_MAX)) {
            this.minutes = mergedValue;
            return true;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            if (this.updateHour(this.getUpdateForNext(negative, mergedValue, Timer.MINUTES_MAX))) {
                this.minutes = this.getUpdateForCurrent(negative, mergedValue, Timer.MINUTES_MAX);
                return true;
            }     
        }
        return false;
    }

    private updateHour(updateValue: string): boolean {
        const mergedValue = this.merge(updateValue, this.hours);
        if (this.validNewValue(mergedValue, Timer.HOUR_MAX)) {
            this.hours = mergedValue;
            return true;
        }
        return false;
    }

    access(): TimerDTO {
        return new TimerDTO(this.hours, this.minutes, this.seconds);
    }

    toString(): string {
        const format = (value: string) => value.padStart(2, '0');
        return `${format(this.hours)}:${format(this.minutes)}:${format(this.seconds)}`;
    }
}

export class TimerDTO {
    constructor(readonly hours: string, readonly minutes: string, readonly seconds: string) {}
}

class TimerUpdate {
    private timeUnit: string;
    private updateValue: string;
    private current: number;

    constructor(update: string, current: number) {
        this.timeUnit = update.charAt(update.length-1);
        this.updateValue = update.substring(0, update.length-1);
        this.current = current;
    }

    isValid(): boolean {
        const invalidChars: string[] = ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'N', 
										'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Z', '|',
                                        ':', ',', ';'];
        return !invalidChars.some(char => {
            this.updateValue.contains(char) || this.updateValue.contains(char.toLowerCase());
        });
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