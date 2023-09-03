export default class Timer {
    private readonly HOUR_MAX: number = 99;
    private readonly MINUTES_MAX: number = 59;
    private readonly SECONDS_MAX: number = 59;

    private hours: string;
    private minutes: string;
    private seconds: string;

    constructor(timer?: Timer) {
        this.initValues(timer);
    }

    private initValues(timer?: Timer) {
        this.hours = timer?.hours ?? '00';
        this.minutes = timer?.minutes ?? '00';
        this.seconds = timer?.seconds ?? '00';
    }

    updateTimer(update: string): void {
        const timeUnit = update.charAt(update.length-1);
        const updateValue = update.substring(0, update.length-1);

        if (this.isReset(timeUnit, updateValue)) this.initValues();
        else if (this.isTooBig(timeUnit, updateValue)) this.setMaxValue();
        else this.update(timeUnit, updateValue);
    }

    private isReset(timeUnit: string, updateValue: string): boolean {
        return updateValue.contains('-') && this.updateIsBigger(timeUnit, updateValue);
    }

    private updateIsBigger(timeUnit: string, updateValue: string): boolean {
        return (this.getUpdateAsInt(timeUnit, updateValue) - this.getCurrentAsInt()) >= 0;
    }

    private getUpdateAsInt(timeUnit: string, updateValue: string): number {
        return parseInt(updateValue.replace('-', '') + '0'.repeat(this.determineShift(timeUnit) ?? 0));
    }

    private getCurrentAsInt(): number {
        return parseInt(this.toString().replace(':', '').replace(':', ''));
    }

    private isTooBig(timeUnit: string, updateValue: string): boolean {
        const prefix = updateValue.contains('-') ? -1 : 1;
        return (prefix * this.getUpdateAsInt(timeUnit, updateValue) + this.getCurrentAsInt() - 995959) >= 0;
    }

    private setMaxValue(): void {
        this.hours = this.HOUR_MAX.toString();
        this.minutes = this.MINUTES_MAX.toString();
        this.seconds = this.SECONDS_MAX.toString();
    }

    private determineShift(timeUnit: string): number | undefined {
        return { 's': 0, 'm': 2, 'h': 4 }[timeUnit];
    }

    private update(timeUnit: string, updateValue: string): void {
        if (timeUnit == 's') this.updateSeconds(updateValue);
        else if (timeUnit == 'm') this.updateMinutes(updateValue);
        else this.updateHour(updateValue);
    }

    private updateSeconds(updatedValue: string): void {
        const mergedValue = this.merge(updatedValue, this.seconds);
        if (this.validNewValue(mergedValue, this.SECONDS_MAX)) {
            this.seconds = mergedValue;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            if (this.updateMinutes(this.getUpdateForNext(negative, mergedValue, this.SECONDS_MAX))) {
                this.seconds = this.getUpdateForCurrent(negative, mergedValue, this.SECONDS_MAX);     
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
        if (this.validNewValue(mergedValue, this.MINUTES_MAX)) {
            this.minutes = mergedValue;
            return true;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            if (this.updateHour(this.getUpdateForNext(negative, mergedValue, this.MINUTES_MAX))) {
                this.minutes = this.getUpdateForCurrent(negative, mergedValue, this.MINUTES_MAX);
                return true;
            }     
        }
        return false;
    }

    private updateHour(updateValue: string): boolean {
        const mergedValue = this.merge(updateValue, this.hours);
        if (this.validNewValue(mergedValue, this.HOUR_MAX)) {
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
