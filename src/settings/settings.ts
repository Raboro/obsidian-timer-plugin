import { type App, Notice, PluginSettingTab, Setting } from 'obsidian';
import type TimerPlugin from 'src/main';

export class TimerButtonsSettings {
  [key: string]: string;

  constructor(
    public first: string,
    public second: string,
    public third: string,
    public fourth: string,
  ) {}
}

export interface TimerSettings {
  timerButtonsSettings: TimerButtonsSettings;
  favoriteTimers: string[];
  stackTimerButtons: boolean;
  useVerboseTimeFormat: boolean;
  verboseTimeFormatRemoveNotSetValues: boolean;
  useOSNotification: boolean;
  useCommaSeparationInDefaultTimeFormat: boolean;
  disableTimerHeader: boolean;
}

export const DEFAULT_SETTINGS: TimerSettings = {
  timerButtonsSettings: new TimerButtonsSettings('1s', '1m', '10m', '1h'),
  favoriteTimers: [],
  stackTimerButtons: false,
  useVerboseTimeFormat: false,
  verboseTimeFormatRemoveNotSetValues: false,
  useOSNotification: false,
  useCommaSeparationInDefaultTimeFormat: true,
  disableTimerHeader: false,
};

export class TimerSettingsTab extends PluginSettingTab {
  private readonly plugin: TimerPlugin;

  constructor(app: App, plugin: TimerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.changeTimerButtonSetting = this.changeTimerButtonSetting.bind(this);
  }

  override display(): void {
    this.containerEl.empty();
    this.timerButtonsSettings();
    this.stackButtonSettings();
    this.useVerboseTimeFormatSettings();
    this.verboseTimeFormatRemoveNotSetValues();
    this.useOSNotificationSettings();
    this.useCommaSeparationInDefaultTimeFormat();
    this.disableTimerHeader();
  }

  private timerButtonsSettings(): void {
    for (let i = 0; i < 4; i++) {
      this.constructTimerButtonSetting(i);
    }
  }

  private constructTimerButtonSetting(i: number): Setting {
    return new Setting(this.containerEl)
      .setName(`${i + 1} timer button value`)
      .setDesc(`Set the value which increases / decreases the timer if clicking on the ${i + 1} timer button. 
                      The value contains a number followed by seconds(type s) or minutes(type m) or hours(type h) & number 
                      must be greater than 0.`)
      .addText((text) =>
        text
          .setPlaceholder('Enter value')
          .setValue(this.getValue(i))
          .onChange(
            async (value) => await this.changeTimerButtonSetting(value, i),
          ),
      );
  }

  private getValue(index: number): string {
    const settings = this.plugin.settings.timerButtonsSettings;
    return [settings.first, settings.second, settings.third, settings.fourth][
      index
    ];
  }

  private async changeTimerButtonSetting(
    value: string,
    index: number,
  ): Promise<void> {
    if (this.isInvalidValue(value)) {
      new Notice('Invalid value');
      return;
    }
    await this.updateTimerButtonSetting(value, index);
  }

  private isInvalidValue(value: string): boolean {
    if (value.length === 0) return true;
    const invalidLastChar = !['s', 'm', 'h'].contains(
      value.charAt(value.length - 1),
    );
    const invalidPrefix = !/^\d+$/.test(value.slice(0, value.length - 1));
    const valueTooLow = Number.parseInt(value.slice(0, value.length - 1)) <= 0;
    return invalidLastChar || invalidPrefix || valueTooLow;
  }

  private async updateTimerButtonSetting(
    value: string,
    index: number,
  ): Promise<void> {
    const properties = ['first', 'second', 'third', 'fourth'];
    this.plugin.settings.timerButtonsSettings[properties[index]] = value;
    await this.plugin.saveSettings();
  }

  private stackButtonSettings(): void {
    new Setting(this.containerEl)
      .setName('Stack timer buttons')
      .setDesc(
        'If enabled, the timer increment buttons will be stacked on top of the timer decrement buttons. If disabled, the timer increment buttons will be placed to the right of the timer decrement buttons.',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.stackTimerButtons)
          .onChange(async (value) => {
            this.plugin.settings.stackTimerButtons = value;
            await this.plugin.saveSettings();
          }),
      );
  }

  private useVerboseTimeFormatSettings(): void {
    new Setting(this.containerEl)
      .setName('Use verbose time format')
      .setDesc(
        'If enabled, the timer display will be in the format of "1h 2m 3s" instead of "01:02:03".',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useVerboseTimeFormat)
          .onChange(async (value) => {
            this.plugin.settings.useVerboseTimeFormat = value;
            await this.plugin.saveSettings();
          }),
      );
  }

  private verboseTimeFormatRemoveNotSetValues(): void {
    new Setting(this.containerEl)
      .setName('Remove not set values in verbose time format')
      .setDesc(
        "If enabled and verbose enabled, 00 values are not shown. If disabled and for example +1m is clicked, also '00s' is shown.",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.verboseTimeFormatRemoveNotSetValues)
          .onChange(async (value) => {
            this.plugin.settings.verboseTimeFormatRemoveNotSetValues = value;
            await this.plugin.saveSettings();
          }),
      );
  }

  private useOSNotificationSettings(): void {
    new Setting(this.containerEl)
      .setName('Use OS notification')
      .setDesc(
        'If enabled, the timer notification will be an OS-level notification rather than an Obsidian notice, and will remain active until dismissed.',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useOSNotification)
          .onChange(async (value) => {
            this.plugin.settings.useOSNotification = value;
            this.plugin.saveSettings();
            if (value) {
              if (!('Notification' in window)) {
                new Notice(
                  'This browser does not support desktop notifications.',
                );
                this.plugin.settings.useOSNotification = false;
                this.plugin.saveSettings();
                return;
              }
              if (Notification.permission !== 'granted') {
                Notification.requestPermission().then((permission) => {
                  if (permission !== 'granted') {
                    new Notice(
                      'You need to grant permission to receive notifications.',
                    );
                    this.plugin.settings.useOSNotification = false;
                    this.plugin.saveSettings();
                    return;
                  }
                });
              }
            }
          }),
      );
  }

  private useCommaSeparationInDefaultTimeFormat(): void {
    new Setting(this.containerEl)
      .setName('Use comma separation in default time format')
      .setDesc(
        'If enabled, the default time format displayed in Timer View contains commas to separate hours, minutes and seconds.',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useCommaSeparationInDefaultTimeFormat)
          .onChange(async (value) => {
            this.plugin.settings.useCommaSeparationInDefaultTimeFormat = value;
            await this.plugin.saveSettings();
          }),
      );
  }

  private disableTimerHeader(): void {
    new Setting(this.containerEl)
      .setName('Disable header of Timer')
      .setDesc('If enabled, the header of the default time format is disabled.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.disableTimerHeader)
          .onChange(async (value) => {
            this.plugin.settings.disableTimerHeader = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
