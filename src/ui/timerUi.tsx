import { useState } from 'react';
import ClockUi from './clockUi';
import ControlButtonsUi from './controlButtonsUi';
import TimerButtonsUi from './timerButtonsUi';
import Timer from 'src/timer/timer';

interface ITimerUi {
    timerInput: Timer;
}

export default function TimerUi({ timerInput }: ITimerUi) {
    const [timer, setTimer] = useState(timerInput ?? new Timer());

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