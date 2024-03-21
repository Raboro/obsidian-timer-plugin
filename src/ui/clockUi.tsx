import ClockElementSeparatorUi from './clockElementSeparatorUi';
import ClockElementUi from './clockElementUi';
import ClockHeaderTextUi from './clockHeaderTextUi';
import TimerDTO from 'src/timer/timerDTO';
import { TimerSettingsContext } from 'src/views/view';
import { useContext } from 'react';

interface IClockUi {
    timer: TimerDTO;
}

export default function ClockUi({timer}: IClockUi) {
    const timerSettings = useContext(TimerSettingsContext);

    if (timerSettings.useVerboseTimeFormatT) {
        return VerboseTimeFormatUi({timer});
    } else {
        return StandardTimeFormatUi({timer});
    }
}

// Standard Time Format (HH:MM:SS)
export function StandardTimeFormatUi({timer}: IClockUi) {
    return <div className="clockContainer">
        <ClockHeaderTextUi />
        <div className="clockElementContainer">
            <ClockElementUi char={timer.hours.charAt(0)} />
            <ClockElementUi char={timer.hours.charAt(1)} />
            <ClockElementSeparatorUi />
            <ClockElementUi char={timer.minutes.charAt(0)} />
            <ClockElementUi char={timer.minutes.charAt(1)} />
            <ClockElementSeparatorUi />
            <ClockElementUi char={timer.seconds.charAt(0)} />
            <ClockElementUi char={timer.seconds.charAt(1)} />
        </div>
    </div>;
}

// Verbose Time Format (Hh Mm Ss)
export function VerboseTimeFormatUi({timer}: IClockUi) {
    return <div><h1 className="verboseTimeFormatC">{timer.hours}h {timer.minutes}m {timer.seconds}s</h1></div>
}