import ClockElementSeparatorUi from './clockElementSeparatorUi';
import ClockElementUi from './clockElementUi';
import ClockHeaderTextUi from './clockHeaderTextUi';
import TimerDTO from 'src/timer/timerDTO';

interface IClockUi {
    timer: TimerDTO;
}

export default function ClockUi({timer}: IClockUi) {
    return StandardTimeFormatUi({timer});
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