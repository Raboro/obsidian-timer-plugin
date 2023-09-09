import { useContext } from 'react';
import { TimerButtonsSettingsContext } from 'src/views/view';

interface ITimerButtonsUi {
    updateTimer: (update: string) => void;
}

export default function TimerButtonsUi({ updateTimer }: ITimerButtonsUi) {
    const { first, second, third, fourth } = useContext(TimerButtonsSettingsContext);
    const settings = [first, second, third, fourth];

    return <div className='timerButtonsContainer'>
        {settings.reverse().map(v => <button key={`-${v}`} onClick={() => updateTimer(`-${v}`)}>-{v}</button>)}
        {settings.reverse().map(v => <button key={`+${v}`} onClick={() => updateTimer(`+${v}`)}>+{v}</button>)}
    </div>;
}