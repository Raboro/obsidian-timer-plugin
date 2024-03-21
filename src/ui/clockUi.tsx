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

export function VerboseTimeFormatUi({timer}: IClockUi) {
    const hours = parseInt(timer.hours);
    const minutes = parseInt(timer.minutes);
    const seconds = parseInt(timer.seconds);

    let timeString = '';

    const hoursString = (hours > 0) 
        ? hours.toString() + 'h ' 
        : '';

    const minutesString = (hours > 0) 
        ? timer.minutes + 'm ' 
        : (minutes > 0) 
            ? minutes.toString() + 'm ' 
            : '';

    const secondsString = ((hours > 0 || minutes > 0) 
        ? timer.seconds 
        : seconds.toString()) + 's';

    timeString += hoursString;
    timeString += minutesString
    timeString += secondsString;

    return (
        <div>
            <h1 className="verboseTimeFormat">{timeString}</h1>
        </div>
    );
}