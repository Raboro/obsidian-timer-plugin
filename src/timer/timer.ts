import TimerDTO from './timerDTO';
import TimerUpdate from './timerUpdate';

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

  private initValues(timer?: Timer): void {
    this.hours = timer?.hours ?? '00';
    this.minutes = timer?.minutes ?? '00';
    this.seconds = timer?.seconds ?? '00';
  }

  static set(result: string): Timer {
    if (result === undefined) return new Timer();
    return Timer.containsChar(result)
      ? Timer.setContainsChar(result)
      : Timer.setWithoutChar(result);
  }

  private static containsChar(result: string): boolean {
    return ['s', 'm', 'h'].some((char) => result.includes(char));
  }

  private static setContainsChar(result: string): Timer {
    const matches = result.match(/(\d+[smh]?)/g);
    const timer = new Timer();
    // biome-ignore lint: performance issue to use for..of not relevant
    matches
      ?.filter((match) => Timer.validUpdate(match))
      .forEach((match) => timer.updateTimer(match));
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
    return Timer.validSplitted(splitted)
      ? new Timer(undefined, splitted)
      : new Timer();
  }

  private static validSplitted(splitted: string[]): boolean {
    const oneNoNumber =
      splitted.filter((split) => !Timer.containsInvalidChar(split)).length < 3;
    return oneNoNumber ? false : Timer.allNotTooBig(splitted);
  }

  private static containsInvalidChar(split: string): boolean {
    const INVALID_CHARACTERS: string[] = [
      'A',
      'B',
      'C',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Z',
      '|',
      ':',
      ',',
      ';',
    ];
    return INVALID_CHARACTERS.some((char) => {
      return split.includes(char) || split.includes(char.toLowerCase());
    });
  }

  private static allNotTooBig(splitted: string[]): boolean {
    return (
      Number.parseInt(splitted[0]) <= Timer.HOUR_MAX &&
      Number.parseInt(splitted[1]) <= Timer.MINUTES_MAX &&
      Number.parseInt(splitted[2]) <= Timer.SECONDS_MAX
    );
  }

  updateTimer(update: string): void {
    const timerUpdate: TimerUpdate = new TimerUpdate(
      update,
      this.getCurrentAsInt(),
    );
    if (timerUpdate.isReset()) this.initValues();
    else if (timerUpdate.isTooBig()) this.setMaxValue();
    else this.update(timerUpdate);
  }

  private getCurrentAsInt(): number {
    return Number.parseInt(this.toString().replace(':', '').replace(':', ''));
  }

  private setMaxValue(): void {
    this.hours = Timer.HOUR_MAX.toString();
    this.minutes = Timer.MINUTES_MAX.toString();
    this.seconds = Timer.SECONDS_MAX.toString();
  }

  private update(timerUpdate: TimerUpdate): void {
    if (timerUpdate.inSeconds()) this.updateSeconds(timerUpdate.getValue());
    else if (timerUpdate.inMinutes())
      this.updateMinutes(timerUpdate.getValue());
    else this.updateHour(timerUpdate.getValue());
  }

  private updateSeconds(updatedValue: string): void {
    const mergedValue = this.merge(updatedValue, this.seconds);
    if (this.validNewValue(mergedValue, Timer.SECONDS_MAX)) {
      this.seconds = mergedValue;
    } else {
      const negative = Number.parseInt(mergedValue) <= 0;
      if (
        this.updateMinutes(
          this.getUpdateForNext(negative, mergedValue, Timer.SECONDS_MAX),
        )
      ) {
        this.seconds = this.getUpdateForCurrent(
          negative,
          mergedValue,
          Timer.SECONDS_MAX,
        );
      }
    }
  }

  private merge(first: string, second: string): string {
    const value = (Number.parseInt(first) + Number.parseInt(second)).toString();
    return this.betweenZeroAndTen(value) ? '0'.concat(value) : value;
  }

  private validNewValue(mergedValue: string, max: number): boolean {
    return (
      Number.parseInt(mergedValue) <= max && Number.parseInt(mergedValue) >= 0
    );
  }

  private betweenZeroAndTen(value: string): boolean {
    return Number.parseInt(value) < 10 && Number.parseInt(value) >= 0;
  }

  private getUpdateForNext(
    negative: boolean,
    mergedValue: string,
    max: number,
  ): string {
    return negative
      ? '-1'
      : Number.parseInt(
          (Number.parseInt(mergedValue) / max).toString(),
        ).toString();
  }

  private getUpdateForCurrent(
    negative: boolean,
    mergedValue: string,
    max: number,
  ): string {
    const mod = Number.parseInt(mergedValue) % max;
    const merged = this.merge('00', (mod - (negative ? 0 : 1)).toString());
    return negative ? (max + 1 + Number.parseInt(merged)).toString() : merged;
  }

  private updateMinutes(updatedValue: string): boolean {
    const mergedValue = this.merge(updatedValue, this.minutes);
    if (this.validNewValue(mergedValue, Timer.MINUTES_MAX)) {
      this.minutes = mergedValue;
      return true;
    }
    const negative = Number.parseInt(mergedValue) <= 0;
    if (
      this.updateHour(
        this.getUpdateForNext(negative, mergedValue, Timer.MINUTES_MAX),
      )
    ) {
      this.minutes = this.getUpdateForCurrent(
        negative,
        mergedValue,
        Timer.MINUTES_MAX,
      );
      return true;
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

  isFinished(): boolean {
    return (
      this.hours === '00' && this.minutes === '00' && this.seconds === '00'
    );
  }

  access(): TimerDTO {
    return new TimerDTO(this.hours, this.minutes, this.seconds);
  }

  toString(): string {
    const format = (value: string) => value.padStart(2, '0');
    return `${format(this.hours)}:${format(this.minutes)}:${format(this.seconds)}`;
  }
}
