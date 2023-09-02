import ClockElementSeparatorUi from './clockElementSeparatorUi';
import ClockElementUi from './clockElementUi';
import ClockHeaderTextUi from './clockTextElementUi';
import Timer from 'src/timer';

interface IClockUi {
    timer: Timer;
}

export default function ClockUi({timer}: IClockUi) {
    return <div className="clockContainer">
        <ClockHeaderTextUi />
        <div className="clockElementContainer">
            <ClockElementUi />
            <ClockElementUi />
            <ClockElementSeparatorUi />
            <ClockElementUi />
            <ClockElementUi />
            <ClockElementSeparatorUi />
            <ClockElementUi />
            <ClockElementUi />
        </div>
    </div>;
}