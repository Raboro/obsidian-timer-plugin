import { useState } from 'react';

interface IControlButtonsUi {
    resetTimer: () => void;
    startTimer: () => void;
    stopTimer: () => void;
    switchControlButtons: boolean
}

export default function ControlButtonsUi({ resetTimer, startTimer, stopTimer, 
                                            switchControlButtons }: IControlButtonsUi) {
    const [startDisplay, setStartDisplay] = useState(true);
    const [resetDisplay, setResetDisplay] = useState(true);
    const [cancelDisplay, setCancelDisplay] = useState(false);
    const [pauseDisplay, setPauseDisplay] = useState(false);
    const [pauseName, setPauseName] = useState('Pause');

    const allSwitch = () => startDisplay && resetDisplay && !cancelDisplay && !pauseDisplay && pauseName == 'Pause';

    if (switchControlButtons && !allSwitch()) {
        setStartDisplay(true);
        setResetDisplay(true);
        setCancelDisplay(false);
        setPauseDisplay(false);
        setPauseName('Pause');
    }

    const switchDisplay = () => {
        setStartDisplay((prevDisplay) => !prevDisplay);
        setResetDisplay((prevDisplay) => !prevDisplay);
        setCancelDisplay((prevDisplay) => !prevDisplay);
        setPauseDisplay((prevDisplay) => !prevDisplay);
    };

    const start = () => {
        switchDisplay();
        setPauseName('Pause');
        startTimer();
    };

    const cancel = () => {
        switchDisplay();
        stopTimer();
    };

    const pause = () => {
        if (pauseName == 'Pause') stopTimer();
        else startTimer();
        setPauseName((name) => (name === 'Pause' ? 'Resume' : 'Pause'));
    };

    return <div className="controlButtonsContainer">
        {startDisplay  && <button onClick={start}>Start</button>}
        {resetDisplay  && <button onClick={resetTimer}>Reset</button>}
        {cancelDisplay && <button onClick={cancel}>Cancel</button>}
        {pauseDisplay  && <button onClick={pause}>{pauseName}</button>}
    </div>;
}