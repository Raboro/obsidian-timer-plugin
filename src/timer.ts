export default class Timer {
    private readonly HOUR_MAX: number = 99;
    private readonly MINUTES_MAX: number = 59;
    private readonly SECONDS_MAX: number = 59;

    private hours: string;
    private minuets: string;
    private seconds: string;

    constructor(timer?: Timer) {
        this.initValues(timer);
    }

    private initValues(timer?: Timer) {
        this.hours = timer?.hours ?? '00';
        this.minuets = timer?.minuets ?? '00';
        this.seconds = timer?.seconds ?? '00';
    }

    updateTimer(update: string): void {
        const timeUnit = update.charAt(update.length-1);
        const updateValue = update.substring(0, update.length-1);

        if (updateValue.contains('-') && this.updateIsBigger(timeUnit, updateValue)) {
            this.initValues();
            return;
        }

        if (timeUnit == 's') this.updateSeconds(updateValue);
        else if (timeUnit == 'm') this.updateMinutes(updateValue);
        else this.updateHour(updateValue);
    }

    private updateIsBigger(timeUnit: string, updateValue: string): boolean {
        const update = updateValue.replace('-', '') + '0'.repeat(this.determineShift(timeUnit) ?? 0);
        const current = this.toString().replace(':', '').replace(':', '');
        return (parseInt(update) - parseInt(current)) >= 0;
    }

    private determineShift(timeUnit: string): number | undefined {
        return { 's': 0, 'm': 2, 'h': 4 }[timeUnit];
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
        const mergedValue = this.merge(updatedValue, this.minuets);
        if (this.validNewValue(mergedValue, this.MINUTES_MAX)) {
            this.minuets = mergedValue;
            return true;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            if (this.updateHour(this.getUpdateForNext(negative, mergedValue, this.MINUTES_MAX))) {
                this.minuets = this.getUpdateForCurrent(negative, mergedValue, this.MINUTES_MAX);
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

    toString(): string {
        const format = (value: string) => value.padStart(2, '0');
        return `${format(this.hours)}:${format(this.minuets)}:${format(this.seconds)}`;
    }
}