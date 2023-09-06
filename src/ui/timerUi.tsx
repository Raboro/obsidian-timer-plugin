import { useState, useEffect, useRef } from 'react';
import ClockUi from './clockUi';
import ControlButtonsUi from './controlButtonsUi';
import { Notice } from 'obsidian';
import TimerButtonsUi from './timerButtonsUi';
import Timer from 'src/timer/timer';

interface ITimerUi {
  timerInput: Timer | null;
}

export default function TimerUi({ timerInput }: ITimerUi) {
    const [timer, setTimer] = useState(timerInput ?? new Timer());
    const [timerExpired, setTimerExpired] = useState(false);
    const intervalIdRef = useRef<NodeJS.Timeout | null>(null); 

    const updateTimer = (update: string) => {
        timer.updateTimer(update);
        setTimer(new Timer(timer));
    };

    const startTimer = () => {
        if (timer.isFinished()) return;
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
        intervalIdRef.current = setInterval(() => {
            timer.updateTimer('-1s');
            setTimer(new Timer(timer));
            if (timer.isFinished()) {
                clearInterval(intervalIdRef.current!);
                setTimerExpired(true);
            }
        }, 1000);
    };

    const stopTimer = () => {
        if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };

    const resetTimer = () => {
        clearInterval(intervalIdRef.current!);
        setTimer(new Timer());
        setTimerExpired(false); 
    };

    useEffect(() => {
        if (!timerInput) startTimer();
        return () => clearInterval(intervalIdRef.current!);
    }, [timerInput]);

    useEffect(() => {
        if (timerExpired) new Notice('Timer is finished!!');
    }, [timerExpired]);

    return <>
        <ClockUi timer={timer.access()} />
        <TimerButtonsUi updateTimer={updateTimer} />
        <ControlButtonsUi resetTimer={resetTimer} startTimer={startTimer} stopTimer={stopTimer} />
    </>;
}