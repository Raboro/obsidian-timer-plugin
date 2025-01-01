import { useContext } from 'react';
import type { TimerSettings } from 'src/settings/settings';
import type TimerDTO from 'src/timer/timerDTO';
import { TimerSettingsContext } from 'src/views/view';
import ClockElementSeparatorUi from './clockElementSeparatorUi';
import ClockElementUi from './clockElementUi';
import ClockHeaderTextUi from './clockHeaderTextUi';

interface IClockUi {
  timer: TimerDTO;
}

export default function ClockUi({ timer }: Readonly<IClockUi>) {
  const timerSettings = useContext(TimerSettingsContext);

  if (timerSettings.useVerboseTimeFormat) {
    return VerboseTimeFormatUi({ timer }, timerSettings);
  }
  return StandardTimeFormatUi({ timer }, timerSettings);
}

// Standard Time Format (HH:MM:SS)
function StandardTimeFormatUi(
  { timer }: Readonly<IClockUi>,
  timerSettings: TimerSettings,
) {
  const commaGapBuffer = !timerSettings.useCommaSeparationInDefaultTimeFormat
    ? 'clockContainerGap'
    : '';
  return (
    <div className="clockContainerCon">
      {!timerSettings.disableTimerHeader && <ClockHeaderTextUi />}
      <div className={`clockContainer clockElementContainer ${commaGapBuffer}`}>
        <div className="clockUnit">
          <ClockElementUi char={timer.hours.charAt(0)} />
          <ClockElementUi char={timer.hours.charAt(1)} />
        </div>
        {timerSettings.useCommaSeparationInDefaultTimeFormat && (
          <ClockElementSeparatorUi />
        )}
        <div className="clockUnit">
          <ClockElementUi char={timer.minutes.charAt(0)} />
          <ClockElementUi char={timer.minutes.charAt(1)} />
        </div>
        {timerSettings.useCommaSeparationInDefaultTimeFormat && (
          <ClockElementSeparatorUi />
        )}
        <div className="clockUnit">
          <ClockElementUi char={timer.seconds.charAt(0)} />
          <ClockElementUi char={timer.seconds.charAt(1)} />
        </div>
      </div>
    </div>
  );
}

// Verbose Time Format e.g 17h 12m 03s
function VerboseTimeFormatUi(
  { timer }: Readonly<IClockUi>,
  timerSettings: TimerSettings,
) {
  const hours = Number.parseInt(timer.hours);
  const minutes = Number.parseInt(timer.minutes);
  const seconds = Number.parseInt(timer.seconds);

  const hoursString = hours > 0 ? `${hours.toString()}h ` : '';

  const minutesString =
    !timerSettings.verboseTimeFormatRemoveNotSetValues && hours > 0
      ? `${timer.minutes}m `
      : minutes > 0
        ? `${minutes.toString()}m `
        : '';

  const secondsString =
    !timerSettings.verboseTimeFormatRemoveNotSetValues &&
    (hours > 0 || minutes > 0)
      ? `${timer.seconds}s`
      : seconds > 0
        ? `${seconds.toString()}s`
        : '';

  const timeString = `${hoursString}${minutesString}${secondsString}`;

  return (
    <div>
      <h1 className="verboseTimeFormat">
        {timeString === '' ? '0s' : timeString}
      </h1>
    </div>
  );
}
