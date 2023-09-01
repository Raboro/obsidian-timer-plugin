import ClockElementSeparatorUi from "./clockElementSeparatorUi";
import ClockElementUi from "./clockElementUi";
import ClockTextElementUi from "./clockTextElementUi";

export default function ClockUi() {
    return <div className="clockContainer">
        <div className="clockTextElementContainer">
            <ClockTextElementUi text="Hours" />
            <ClockTextElementUi text="Minutes" />
            <ClockTextElementUi text="Seconds" />
        </div>
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