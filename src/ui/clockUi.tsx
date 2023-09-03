import ClockElementSeparatorUi from './clockElementSeparatorUi';
import ClockElementUi from './clockElementUi';
import ClockHeaderTextUi from './clockTextElementUi';
import { TimerDTO } from 'src/timer';

interface IClockUi {
    timer: TimerDTO;
}

export default function ClockUi({timer}: IClockUi) {
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