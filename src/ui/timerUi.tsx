import ClockUi from './clockUi';
import ControlButtonsUi from './controlButtonsUi';
import TimerButtonsUi from './timerButtonsUi';

export default function TimerUi() {
    return <>
        <ClockUi />
        <TimerButtonsUi />
        <ControlButtonsUi />
    </>;
}