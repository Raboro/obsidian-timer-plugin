export default class Timer {
    private readonly HOUR_MAX: number = 99;
    private readonly MINUTES_MAX: number = 59;
    private readonly SECONDS_MAX: number = 59;

    private hours: string;
    private minuets: string;
    private seconds: string;

    constructor(timer?: Timer) {
        this.hours = timer?.hours ?? '00';
        this.minuets = timer?.minuets ?? '00';
        this.seconds = timer?.seconds ?? '00';
    }

    updateTimer(update: string) {
        const timeUnit = update.charAt(update.length-1);
        const updateValue = update.substring(0, update.length-1);

        if (timeUnit == 's') this.updateSeconds(updateValue);
        else if (timeUnit == 'm') this.updateMinutes(updateValue);
        else this.updateHour(updateValue);
    }

    private updateSeconds(updatedValue: string) {
        const mergedValue = this.merge(updatedValue, this.seconds);
        if (this.validNewValue(mergedValue, this.SECONDS_MAX)) {
            this.seconds = mergedValue;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            this.updateMinutes(this.getUpdateForNext(negative, mergedValue, this.SECONDS_MAX));
            if (negative) {
                this.seconds = (this.SECONDS_MAX+1+parseInt(this.merge('00', (parseInt(mergedValue) % this.SECONDS_MAX).toString()))).toString()
            } else {
                this.seconds = this.merge('00', ((parseInt(mergedValue) % this.SECONDS_MAX)-1).toString())
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

    private betweenZeroAndTen(value: string) {
        return parseInt(value) < 10 && parseInt(value) >= 0;
    }

    private getUpdateForNext(negative: boolean, mergedValue: string, max: number) {
        return negative ? '-1': ((parseInt((parseInt(mergedValue) / max).toString())).toString());
    }

    private updateMinutes(updatedValue: string) {
        const mergedValue = this.merge(updatedValue, this.minuets);
        if (this.validNewValue(mergedValue, this.MINUTES_MAX)) {
            this.minuets = mergedValue;
        } else {
            const negative = parseInt(mergedValue) <= 0;
            this.updateHour(this.getUpdateForNext(negative, mergedValue, this.MINUTES_MAX));
            if (negative) {
                this.minuets = (this.MINUTES_MAX+1+parseInt(this.merge('00', (parseInt(mergedValue) % this.MINUTES_MAX).toString()))).toString();
            } else {
                this.minuets = this.merge('00', ((parseInt(mergedValue) % this.MINUTES_MAX)-1).toString());
            }
        }
    }

    private updateHour(updateValue: string) {
        const mergedValue = this.merge(updateValue, this.hours);
        if (this.validNewValue(mergedValue, this.HOUR_MAX)) {
            this.hours = mergedValue;
        }
    }
}