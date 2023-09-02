import { useContext } from 'react';
import { TimerButtonsSettingsContext } from 'src/views/view';

export default function TimerButtonsUi() {
    const timerButtonsSettings = useContext(TimerButtonsSettingsContext);
    return <div className="timerButtonsContainer">
        <button>-{timerButtonsSettings.fourth}</button>
        <button>-{timerButtonsSettings.third}</button>
        <button>-{timerButtonsSettings.second}</button>
        <button>-{timerButtonsSettings.first}</button>
        <button>+{timerButtonsSettings.first}</button>
        <button>+{timerButtonsSettings.second}</button>
        <button>+{timerButtonsSettings.third}</button>
        <button>+{timerButtonsSettings.fourth}</button>
    </div>;
}