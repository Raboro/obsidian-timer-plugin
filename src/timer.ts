export default class Timer {
    private readonly HOUR_MAX: string = '99';
    private readonly MINUTES_MAX: string = '60';
    private readonly SECONDS_MAX: string = '60';

    private hours: string;
    private minuets: string;
    private seconds: string;

    constructor(timer?: Timer) {
        this.hours = timer?.hours ?? '00';
        this.minuets = timer?.minuets ?? '00';
        this.seconds = timer?.seconds ?? '00';
    }

    updateTimer(update: string) {
    }
}