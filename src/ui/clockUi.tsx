import ClockElementSeparatorUi from './clockElementSeparatorUi';
import ClockElementUi from './clockElementUi';
import ClockHeaderTextUi from './clockTextElementUi';

export default function ClockUi() {
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