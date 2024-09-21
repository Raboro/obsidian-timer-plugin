export default class TimerUpdate {
  private readonly timeUnit: string;
  private readonly updateValue: string;
  private readonly current: number;

  constructor(update: string, current: number) {
    this.timeUnit = update.charAt(update.length - 1);
    this.updateValue = update.substring(0, update.length - 1);
    this.current = current;
  }

  isValid(): boolean {
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
    const noInvalidChars = !INVALID_CHARACTERS.some((char) => {
      this.updateValue.includes(char) ||
        this.updateValue.includes(char.toLowerCase());
    });
    return (
      noInvalidChars && ['h', 'm', 's'].some((unit) => unit === this.timeUnit)
    );
  }

  isReset(): boolean {
    return this.updateValue.includes('-') && this.updateIsBigger();
  }

  private updateIsBigger(): boolean {
    return this.getUpdateAsInt() - this.current >= 0;
  }

  private getUpdateAsInt(): number {
    return Number.parseInt(
      this.updateValue.replace('-', '') +
        '0'.repeat(this.determineShift() ?? 0),
    );
  }

  private determineShift(): number | undefined {
    return { s: 0, m: 2, h: 4 }[this.timeUnit];
  }

  isTooBig(): boolean {
    const prefix = this.updateValue.includes('-') ? -1 : 1;
    return prefix * this.getUpdateAsInt() + this.current - 995959 >= 0;
  }

  inSeconds(): boolean {
    return this.timeUnit.includes('s');
  }

  inMinutes(): boolean {
    return this.timeUnit.includes('m');
  }

  getValue(): string {
    return this.updateValue;
  }
}
