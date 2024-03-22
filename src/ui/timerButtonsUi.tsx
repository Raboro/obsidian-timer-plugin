import { useContext } from 'react';
import { TimerSettingsContext } from 'src/views/view';

interface ITimerButtonsUi {
    updateTimer: (update: string) => void;
}

export default function TimerButtonsUi({ updateTimer }: Readonly<ITimerButtonsUi>) {
    const timerSettings = useContext(TimerSettingsContext);
    const { first, second, third, fourth } = timerSettings.timerButtonsSettings;
    const settings = [first, second, third, fourth];
    const stackTimerButtons = timerSettings.stackTimerButtons;

    if (stackTimerButtons) {
        return (
            <div className='timerButtonsContainer' style={{ display: 'flex', flexDirection: 'column'}}>
                <div>{settings.reverse().map(v => <button key={`+${v}`} onClick={() => updateTimer(`+${v}`)} style={{ margin: '5px', width: '50px' }}>+{v}</button>)}</div>
                <div>{settings.map(v => <button key={`-${v}`} onClick={() => updateTimer(`-${v}`)} style={{ margin: '5px', width: '50px' }}>-{v}</button>)}</div>
            </div>
        );
    } else {
        return <div className='timerButtonsContainer'>
            {settings.reverse().map(v => <button key={`-${v}`} onClick={() => updateTimer(`-${v}`)}>-{v}</button>)}
            {settings.reverse().map(v => <button key={`+${v}`} onClick={() => updateTimer(`+${v}`)}>+{v}</button>)}
        </div>;
    }
}