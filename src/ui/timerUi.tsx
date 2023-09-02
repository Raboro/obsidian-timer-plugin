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

    return <>
        <ClockUi timer={timer}/>
        <TimerButtonsUi updateTimer={updateTimer}/>
        <ControlButtonsUi />
    </>;
}