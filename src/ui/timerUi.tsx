import { useState } from 'react';
import ClockUi from './clockUi';
import ControlButtonsUi from './controlButtonsUi';
import TimerButtonsUi from './timerButtonsUi';
import Timer from 'src/timer';

export default function TimerUi() {
    const [timer, setTimer] = useState(new Timer());

    const updateTimer = (update: string) => {
        const updatedTimer = new Timer(timer);
        updatedTimer.updateTimer(update); 
        setTimer(updatedTimer); 
    };

    const resetTimer = () => setTimer(new Timer());

    return <>
        <ClockUi timer={timer.access()}/>
        <TimerButtonsUi updateTimer={updateTimer} />
        <ControlButtonsUi resetTimer={resetTimer} />
    </>;
}