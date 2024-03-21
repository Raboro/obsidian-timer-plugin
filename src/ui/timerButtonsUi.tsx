import { useContext } from 'react';
import { TimerButtonsSettingsContext } from 'src/views/view';

interface ITimerButtonsUi {
    updateTimer: (update: string) => void;
}

export default function TimerButtonsUi({ updateTimer }: ITimerButtonsUi) {
    const { first, second, third, fourth } = useContext(TimerButtonsSettingsContext);
    const settings = [first, second, third, fourth];
    const stackTimerButtons = false; 

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